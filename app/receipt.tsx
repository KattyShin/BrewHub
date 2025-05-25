import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const Receipt = () => {
    const router = useRouter();
    return (
        <View className="flex-1 bg-[#FBEFE4] w-full justify-center items-center px-4">
            <View className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <Text className="text-center font-extrabold text-xl text-[#D97706] mb-4">
                    BREWHUB
                </Text>
                <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-600 text-sm">OR-12346</Text>
                    <Text className="text-gray-600 text-sm">1-12-2025 12:01 PM</Text>
                </View>
                <View className="border-b border-gray-300 mb-4" />
                {[...Array(3)].map((_, index) => (
                    <View key={index} className="mb-4">
                        <Text className="font-semibold text-base">Cappuccino</Text>
                        <Text className="text-gray-500 text-xs mb-1">with chocolate</Text>
                        <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-700">x1</Text>
                            <Text className="text-sm text-gray-700">₱ 48.00</Text>
                        </View>
                    </View>
                ))}
                <View className="border-b border-gray-300 mb-4" />
                <View className="flex-row justify-between mb-2">
                    <Text className="font-medium text-gray-700">Total Payment</Text>
                    <Text className="font-medium text-gray-700">₱ 160.00</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                    <Text className="font-medium text-gray-700">Cash</Text>
                    <Text className="font-medium text-gray-700">₱ 200.00</Text>
                </View>
                <View className="flex-row justify-between mb-4">
                    <Text className="font-medium text-gray-700">Change</Text>
                    <Text className="font-medium text-gray-700">₱ 40.00</Text>
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
