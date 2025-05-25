import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Receipt = () => {
    return (
        <View className="flex-1 bg-[#FBEFE4] justify-center items-center">
            <View className="bg-white w-[90%] p-5 rounded-lg shadow-md">
                <Text className="text-center font-bold text-lg mb-2">BREWHUB</Text>
                <View className="flex-row justify-between mb-2">
                    <Text>OR-12346</Text>
                    <Text>1-12-2025 12:01 PM</Text>
                </View>
                <View className="border-b border-black my-2" />
                <View className="mb-2">
                    <Text className="font-bold">Cappuccino</Text>
                    <Text className="text-gray-500 text-xs">with chocolate</Text>
                    <View className="flex-row justify-between">
                        <Text className="text-sm">x1</Text>
                        <Text className="text-sm">₱ 48.00</Text>
                    </View>
                </View>
                <View className="mb-2">
                    <Text className="font-bold">Cappuccino</Text>
                    <Text className="text-gray-500 text-xs">with chocolate</Text>
                    <View className="flex-row justify-between">
                        <Text className="text-sm">x1</Text>
                        <Text className="text-sm">₱ 48.00</Text>
                    </View>
                </View>
                <View className="mb-2">
                    <Text className="font-bold">Cappuccino</Text>
                    <Text className="text-gray-500 text-xs">with chocolate</Text>
                    <View className="flex-row justify-between">
                        <Text className="text-sm">x1</Text>
                        <Text className="text-sm">₱ 48.00</Text>
                    </View>
                </View>
                <View className="border-b border-black my-2" />
                <View className="flex-row justify-between mb-1">
                    <Text>Total Payment</Text>
                    <Text>₱ 160.00</Text>
                </View>
                <View className="flex-row justify-between mb-1">
                    <Text>Cash</Text>
                    <Text>₱ 200.00</Text>
                </View>
                <View className="flex-row justify-between mb-1">
                    <Text>Change</Text>
                    <Text>₱ 40.00</Text>
                </View>
                <Text className="text-center mt-2 font-bold">THANK YOU!</Text>
            </View>
            <TouchableOpacity className="bg-[#D97D0D] p-4 rounded mt-5 w-[90%] items-center">
                <Text className="text-white font-bold">Done</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Receipt;
