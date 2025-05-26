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
} from "react-native";
import { ShoppingCart, Star, Trash2, ArrowLeft, Plus, Minus } from "lucide-react-native";
import { useRouter } from "expo-router";

interface CartItem {
  id: string; // Changed from number to string to match your Firestore document IDs
  name: string;
  description: string;
  price: number;
  rating: number;
  quantity: number;
  category: string; // Added missing category property

}

interface CartViewProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  router: any;
  uid?: string; // Add uid as an optional prop
}

export default function CartView({ cart, setCart, setShowCart, router, uid }: CartViewProps) {
  const [paymentAmount, setPaymentAmount] = useState("");


  
  const updateQuantity = (id: string, increment: boolean) => { // Changed id type to string
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

  const removeFromCart = (id: string) => { // Changed id type to string
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    const totalPrice = getTotalPrice();
    const enteredAmount = parseFloat(paymentAmount);


  

    if (isNaN(enteredAmount)) {
      Alert.alert("Invalid Amount", "Please enter a valid payment amount.");
      return;
    }

    if (enteredAmount < totalPrice) {
      Alert.alert(
        "Insufficient Payment",
        `The total is $${totalPrice.toFixed(
          2
        )}. Please enter an amount equal to or greater than the total.`
      );
      return;
    }

    Alert.alert(
      "Payment Successful",
      `Change: $${(enteredAmount - totalPrice).toFixed(
        2
      )}\nThank you for your purchase!`,
      [
        {
          text: "OK",
          onPress: () => {
            setCart([]);
            setShowCart(false);
            setPaymentAmount("");
            // You could pass the uid to the receipt page as well
            router.push({
              pathname: "/receipt",
              params: { uid: uid }
            });
          },
        },
      ]
    );
  };

  useEffect(() => {
    console.log("Cart:", cart);
    console.log("UID:", uid);
}, [cart, uid]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF7ED" }}>
      <StatusBar barStyle="light-content" backgroundColor="#D97706" />

      <TouchableOpacity
        onPress={() => setShowCart(false)}
        className="flex flex-row items-center py-3 px-2"
      >
        <ArrowLeft size={20} />
        <Text className=" text-base font-medium ml-2">Back</Text>
      </TouchableOpacity>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold mt-6 mb-4 text-gray-800">
          Your Cart ({cart.length})
        </Text>

        {/* Display user ID for debugging (you can remove this in production) */}
        {uid && (
          <Text className="text-sm text-gray-600 mb-2">
            User ID: {uid}
          </Text>
        )}

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
                <View className="flex flex-row items-center gap-2 justify-between">
                  {/* Left side - Product info */}
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800 mb-1">
                      {item.name}
                    </Text>
                    <Text className="text-gray-500 text-sm mb-2">
                      {item.description}
                    </Text>

                    {/* Best Selling badge */}
                    <View className="bg-black flex w-24 rounded-full px-3 py-1 items-center">
                      <View className="flex flex-row items-center">
                        <Star fill="#FFC918" size={12} />
                        <Text className="text-white text-xs ml-1 font-medium">
                          Best Selling
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Right side - Price and controls */}
                  <View className="flex flex-col items-end ml-4">
                    <Text className="text-lg font-bold text-[#D97706] mb-3">
                      Price: ₱ {(item.price * item.quantity).toFixed(2)}
                    </Text>

                    {/* Quantity controls */}
                    <View className="flex flex-row items-center">
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, false)}
                        className="w-8 h-8 bg-gray-200 rounded-md items-center justify-center "
                      >
                        <Minus color="#374151" size={14} />
                      </TouchableOpacity>

                      <Text className="mx-1 text-base font-semibold text-gray-800 min-w-[20px] text-center ">
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, true)}
                        className="w-8 h-8 bg-gray-200 rounded-sm items-center justify-center mr-2"
                      >
                        <Plus size={14} />
                      </TouchableOpacity>
                    </View>

                    {/* Delete button */}
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.id)}
                      className="mt-2"
                    >
                      <Trash2 color="#ED1A1A" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <View className="bg-white rounded-lg p-4 mt-4 mb-6 shadow-md">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-lg font-bold text-gray-800">
                  Total:
                </Text>
                <Text className="text-lg font-bold text-[#D97706] mx-2">
                  ${getTotalPrice().toFixed(1)}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 24, marginBottom: 32 }}>
              <Text className="text-base font-semibold mb-2 text-gray-800">
                Enter Payment Amount
              </Text>
              <TextInput
                value={paymentAmount}
                onChangeText={setPaymentAmount}
                placeholder="$0.0"
                keyboardType="numeric"
                className="bg-white rounded-lg py-3 px-4 mb-4 text-base border border-gray-200 shadow-sm"
              />

              <TouchableOpacity
                onPress={handleCheckout}
                style={{
                  backgroundColor: "#D97706",
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                >
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