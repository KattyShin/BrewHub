import "~/global.css";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function CartOrders() {
  const [cash, setCash] = useState("");
  const [totalPayment, setTotalPayment] = useState(48.0); // Example total payment
  const router = useRouter();

  const calculateChange = () => {
    const cashAmount = parseFloat(cash) || 0;
    return cashAmount - totalPayment;
  };

  const handlePay = () => {
    const change = calculateChange();
    if (change < 0) {
      Alert.alert("Error", "Insufficient cash provided.");
    } else {
      Alert.alert("Success", "Payment completed!");
      setCash("");
    }
  };

  const handleCancel = () => {
    setCash("");
    router.push("/Menu/order");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#fef7ed]"
    >
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="flex justify text-xl font-bold py-5">Orders</Text>

        {/* Cart Items */}
        <View className="mb-4">
          {[1, 2, 3].map((item, index) => {
            const [quantity, setQuantity] = useState(1);
            const pricePerItem = 48.0; // Example price per item
            const totalPrice = quantity * pricePerItem;

            const incrementQty = () => setQuantity(quantity + 1);
            const decrementQty = () => {
              if (quantity > 1) setQuantity(quantity - 1);
            };

            return (
              <View
                key={index}
                className="flex-row justify-between items-center bg-white rounded-lg p-4 mb-4 shadow-md"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View>
                  <Text className="text-lg font-bold">Cappuccino</Text>
                  <Text className="text-sm text-gray-500">with chocolate</Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-sm text-gray-500 mr-2">⭐ 4.7</Text>
                  </View>
                </View>
                <View className="flex items-center">
                  <Text className="text-lg font-bold text-[#D97706] mx-2">
                    ₱ {totalPrice.toFixed(2)}
                  </Text>

                  <View className="flex-row items-center space-x-2">
                    <TouchableOpacity
                      onPress={decrementQty}
                      className="bg-black rounded-full w-8 h-8 items-center justify-center"
                    >
                      <Text className="text-white text-lg">-</Text>
                    </TouchableOpacity>
                    <Text className="text-lg text-gray-700 px-2">{quantity}</Text>
                    <TouchableOpacity
                      onPress={incrementQty}
                      className="bg-black rounded-full w-8 h-8 items-center justify-center"
                    >
                      <Text className="text-white text-lg">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Total Payment */}
        <Text className="text-lg font-bold text-right mb-4">
          Total Payment: ₱ {totalPayment.toFixed(2)}
        </Text>

        {/* Enter Cash */}
        <Text className="text-base mb-2 font-semibold">Enter Cash:</Text>
        <TextInput
          value={cash}
          onChangeText={setCash}
          placeholder="Enter cash amount"
          keyboardType="numeric"
          className="bg-gray-200 py-3 px-4 rounded-lg mb-4 text-base"
        />

        {/* Change */}
        <Text className="text-lg font-bold text-right mb-6">
          Change: ₱ {calculateChange().toFixed(2)}
        </Text>
      </ScrollView>

      {/* Footer Buttons */}
      <View className="absolute bottom-0 left-0 right-0  p-4 flex-row justify-between">
        <TouchableOpacity
          onPress={handlePay}
          className="flex-1 bg-[#D97706] py-4 rounded-lg mr-2 items-center"
        >
          <Text className="text-white text-base font-semibold">Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancel}
          className="flex-1 bg-black py-4 rounded-lg ml-2 items-center"
        >
          <Text className="text-white text-base font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
