import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Pressable,
  Image,
} from "react-native";
import {
  ShoppingCart,
  Star,
  Trash2,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "./stores/authstore";
import { db } from "~/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  where,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { writeBatch, increment } from "firebase/firestore";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  imagePath: string; // Added imagePath to the interface
}

interface CartViewProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  router: any;
}

export default function CartView({
  cart,
  setCart,
  setShowCart,
  router,
}: CartViewProps) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const user = useAuthStore((state) => state.user);

  const updateQuantity = (id: string, increment: boolean) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQuantity = increment
            ? item.quantity + 1
            : Math.max(item.quantity - 1, 1);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    const totalPrice = getTotalPrice();
    const enteredAmount = parseFloat(paymentAmount);

    if (isNaN(enteredAmount)) {
      Alert.alert("Invalid Amount", "Please enter a valid payment amount.");
      return;
    }

    if (enteredAmount < totalPrice) {
      Alert.alert(
        "Insufficient Payment",
        `The total is ₱${totalPrice.toFixed(
          2
        )}. Please enter an amount equal to or greater than the total.`
      );
      return;
    }

    try {
      // 1. Create the customer
      const customerRef = await addDoc(collection(db, "customers"), {
        createdAt: serverTimestamp(),
      });

      // 2. Create the order
      const orderRef = await addDoc(collection(db, "order"), {
        customerRef: doc(db, "customers", customerRef.id),
        userRef: user?.uid ? doc(db, "users", user.uid) : null,
        order_date: serverTimestamp(),
        total: totalPrice,
      });

      // 3. Create order items and update product sold counts
      const orderItemsCollection = collection(db, "order_item");
      const batch = writeBatch(db);
      
      const itemPromises = cart.map((item) => {
        const orderItemRef = doc(orderItemsCollection);
        batch.set(orderItemRef, {
          order: doc(db, "order", orderRef.id),
          products: doc(db, "products", item.id),
          order_item_qty: item.quantity,
        });
        
        const productRef = doc(db, "products", item.id);
        batch.update(productRef, {
          item_sold: increment(item.quantity)
        });
        
        return orderItemRef;
      });

      await batch.commit();

      // 4. Create payment transaction
      const paymentTransactionDoc = await addDoc(
        collection(db, "payment_transaction"),
        {
          order: doc(db, "order", orderRef.id),
          amount: enteredAmount,
          change: enteredAmount - totalPrice,
          payment_date: serverTimestamp(),
          total_paid: totalPrice,
        }
      );

      // 5. Get previous general total sales
      let newGeneralTotalSales = totalPrice;

      const salesReportQuery = query(
        collection(db, "sales_report"),
        where("userRef", "==", user?.uid ? doc(db, "users", user.uid) : null),
        orderBy("sales_date", "desc"),
        limit(1)
      );
      const salesReportSnapshot = await getDocs(salesReportQuery);

      if (!salesReportSnapshot.empty) {
        const lastReport = salesReportSnapshot.docs[0].data();
        const previousTotal = lastReport.general_tot_sales || 0;
        newGeneralTotalSales = previousTotal + totalPrice;
      }

      // 6. Create sales report
      await addDoc(collection(db, "sales_report"), {
        userRef: user?.uid ? doc(db, "users", user.uid) : null,
        payment_transactionRef: doc(
          db,
          "payment_transaction",
          paymentTransactionDoc.id
        ),
        daily_tot_sales: totalPrice,
        general_tot_sales: newGeneralTotalSales,
        sales_date: serverTimestamp(),
      });

      Alert.alert(
        "Payment Successful",
        `Change: ₱${(enteredAmount - totalPrice).toFixed(
          2
        )}\nThank you for your purchase!`,
        [
          {
            text: "OK",
            onPress: () => {
              setCart([]);
              setShowCart(false);
              setPaymentAmount("");
              router.push({
                pathname: "/receipt",
                params: {
                  orderId: orderRef.id,
                },
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Checkout error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF7ED" }}>
      <StatusBar barStyle="light-content" backgroundColor="#D97706" />

      <TouchableOpacity
        onPress={() => setShowCart(false)}
        className="flex flex-row items-center py-3 px-2"
      >
        <ArrowLeft size={20} />
        <Text className="text-base font-medium ml-2">Back</Text>
      </TouchableOpacity>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold mt-6 mb-4 text-gray-800">
          Your Cart ({cart.length})
        </Text>

        {cart.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 64 }}>
            <ShoppingCart color="#9CA3AF" size={48} />
            <Text className="text-gray-600 text-lg mt-4">
              Your cart is empty
            </Text>
          </View>
        ) : (
          <>
            {cart.map((item) => (
              <View
                key={item.id}
                className="bg-white rounded-lg p-4 mb-3 shadow-sm"
              >
                <View className="flex flex-row items-start gap-3">
                  {/* Product Image */}
                  {item.imagePath ? (
                    <Image
                      source={{ uri: item.imagePath }}
                      className="w-16 h-16 rounded-md"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-16 h-16 bg-gray-100 rounded-md items-center justify-center">
                      <ShoppingCart size={24} color="#9CA3AF" />
                    </View>
                  )}

                  {/* Product Info and Controls */}
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                          {item.name}
                        </Text>
                        <Text className="text-gray-500 text-sm mb-2">
                          {item.description}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => removeFromCart(item.id)}
                        className="ml-2"
                      >
                        <Trash2 color="#ED1A1A" size={18} />
                      </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-between items-center mt-2">
                      <Text className="text-lg font-bold text-[#D97706]">
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </Text>

                      {/* Quantity controls */}
                      <View className="flex-row items-center">
                        <TouchableOpacity
                          onPress={() => updateQuantity(item.id, false)}
                          className="w-8 h-8 bg-gray-200 rounded-md items-center justify-center"
                        >
                          <Minus color="#374151" size={14} />
                        </TouchableOpacity>

                        <Text className="mx-3 text-base font-semibold text-gray-800">
                          {item.quantity}
                        </Text>

                        <TouchableOpacity
                          onPress={() => updateQuantity(item.id, true)}
                          className="w-8 h-8 bg-gray-200 rounded-sm items-center justify-center"
                        >
                          <Plus size={14} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            <View className="bg-white rounded-lg p-4 mt-4 mb-6 shadow-md">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-lg font-bold text-gray-800">Total:</Text>
                <Text className="text-lg font-bold text-[#D97706]">
                  ₱{getTotalPrice().toFixed(2)}
                </Text>
              </View>
            </View>

            <View className="mt-4 mb-8">
              <Text className="text-base font-semibold mb-2 text-gray-800">
                Enter Payment Amount
              </Text>
              <TextInput
                value={paymentAmount}
                onChangeText={setPaymentAmount}
                placeholder="₱0.00"
                keyboardType="numeric"
                className="bg-white rounded-lg py-3 px-4 mb-4 text-base border border-gray-200 shadow-sm"
              />

              <TouchableOpacity
                onPress={handleCheckout}
                className="bg-[#D97706] rounded-lg py-4 items-center"
              >
                <Text className="text-white text-base font-semibold">
                  Complete Payment
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}