import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "~/firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { format } from "date-fns";

interface OrderItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface ReceiptData {
  orderId: string;
  orderDate: Date;
  items: OrderItem[];
  total: number;
  cash: number;
  change: number;
}

const Receipt = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        if (!orderId) return;

        // 1. Get the order document
        const orderDoc = await getDoc(doc(db, "order", orderId as string));
        if (!orderDoc.exists()) {
          throw new Error("Order not found");
        }

        const orderData = orderDoc.data();

        // 2. Get the payment transaction
        const paymentQuery = query(
          collection(db, "payment_transaction"),
          where("order", "==", doc(db, "order", orderId as string))
        );
        const paymentSnapshot = await getDocs(paymentQuery);

        if (paymentSnapshot.empty) {
          throw new Error("Payment not found");
        }

        const paymentData = paymentSnapshot.docs[0].data();

        // 3. Get order items
        const itemsQuery = query(
          collection(db, "order_item"),
          where("order", "==", doc(db, "order", orderId as string))
        );
        const itemsSnapshot = await getDocs(itemsQuery);

        const itemsPromises = itemsSnapshot.docs.map(async (itemDoc) => {
            const itemData = itemDoc.data();
          
            // ✅ No need to wrap again in doc()
            const productDoc = await getDoc(itemData.products);
          
            const productData = productDoc.exists()
              ? (productDoc.data() as { name?: string; description?: string; price?: number })
              : {};
          
            return {
              id: itemDoc.id,
              name: productData?.name || "Unknown Product",
              description: productData?.description || "",
              price: productData?.price || 0,
              quantity: itemData.order_item_qty || 1,
            };
          });
          
        const items = await Promise.all(itemsPromises);

        // 4. Format the receipt data
        setReceiptData({
          orderId: orderDoc.id,
          orderDate: orderData.order_date?.toDate() || new Date(),
          items,
          total: orderData.total || 0,
          cash: paymentData.amount || 0,
          change: paymentData.change || 0,
        });
      } catch (error) {
        console.error("Error fetching receipt data:", error);
        Alert.alert("Error", "Failed to load receipt data");
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptData();
  }, [orderId]);

  if (loading) {
    return (
      <View className="flex-1 bg-[#FBEFE4] justify-center items-center">
        <ActivityIndicator size="large" color="#D97706" />
      </View>
    );
  }

  if (!receiptData) {
    return (
      <View className="flex-1 bg-[#FBEFE4] justify-center items-center px-4">
        <Text className="text-lg text-gray-700">No receipt data available</Text>
        <TouchableOpacity
          className="bg-[#D97706] p-4 rounded mt-6 w-full max-w-md items-center"
          onPress={() => router.push("/Menu/order")}
        >
          <Text className="text-white font-bold text-base">Back to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FBEFE4] w-full justify-center items-center px-4">
      <View className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <Text className="text-center font-extrabold text-xl text-[#D97706] mb-4">
          BREWHUB
        </Text>
        <View className="flex-row justify-between mb-4">
          <Text className="text-gray-600 text-sm">
            OR-{receiptData.orderId.substring(0, 8).toUpperCase()}
          </Text>
          <Text className="text-gray-600 text-sm">
            {format(receiptData.orderDate, "MM-dd-yyyy hh:mm a")}
          </Text>
        </View>
        <View className="border-b border-gray-300 mb-4" />

        {receiptData.items.map((item) => (
          <View key={item.id} className="mb-4">
            <Text className="font-semibold text-base">{item.name}</Text>
            {item.description && (
              <Text className="text-gray-500 text-xs mb-1">
                {item.description}
              </Text>
            )}
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-700">x{item.quantity}</Text>
              <Text className="text-sm text-gray-700">
                ₱ {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}

        <View className="border-b border-gray-300 mb-4" />
        <View className="flex-row justify-between mb-2">
          <Text className="font-medium text-gray-700">Total Payment</Text>
          <Text className="font-medium text-gray-700">
            ₱ {receiptData.total.toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="font-medium text-gray-700">Cash</Text>
          <Text className="font-medium text-gray-700">
            ₱ {receiptData.cash.toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between mb-4">
          <Text className="font-medium text-gray-700">Change</Text>
          <Text className="font-medium text-gray-700">
            ₱ {receiptData.change.toFixed(2)}
          </Text>
        </View>
        <Text className="text-center font-bold text-lg text-[#D97706]">
          THANK YOU!
        </Text>
      </View>
      <TouchableOpacity
        className="bg-[#D97706] p-4 rounded mt-6 w-full max-w-md items-center"
        onPress={() => router.push("/Menu/order")}
      >
        <Text className="text-white font-bold text-base">Done</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Receipt;
