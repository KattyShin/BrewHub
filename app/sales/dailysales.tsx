import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
const DailySales = () => {
    const router = useRouter();
  const [salesData, setSalesData] = useState([
    {
      id: '1',
      date: '1-12-25',
      time: '11:34 PM',
      totalSales: 48.00,
    },
    {
      id: '2',
      date: '1-12-25',
      time: '11:34 PM',
      totalSales: 48.00,
    },
    {
      id: '3',
      date: '1-12-25',
      time: '11:34 PM',
      totalSales: 48.00,
    },
  ]);

interface SaleItem {
    id: string;
    date: string;
    time: string;
    totalSales: number;
}

const formatCurrency = (amount: number): string => {
    return `₱ ${amount.toFixed(2)}`;
};

  const getTotalSales = () => {
    return salesData.reduce((total, item) => total + item.totalSales, 0);
  };

  const renderSalesItem = ({ item }: { item: SaleItem }) => (
    <TouchableOpacity 
      className="bg-white rounded-xl p-4 mb-3 shadow-md border-l-4 border-[#D97706] active:scale-95"
      activeOpacity={0.8}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 mb-1">
            {item.date}
          </Text>
          <Text className="text-sm text-gray-600">
            {item.time}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-sm text-gray-600 font-medium mb-1">
            Total Sales:
          </Text>
          <Text className="text-xl font-bold text-green-600">
            {formatCurrency(item.totalSales)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#fef7ed]">

          {/* Back Button */}
          <TouchableOpacity
          onPress={() => router.push("/Menu/settings")}
          className="flex-row items-center mb-6 py-2 px-2"
        >
          <ChevronLeft size={20} color="#000" />
          <Text className="text-black text-base ml-2 font-semibold">Back</Text>
        </TouchableOpacity>

      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View className="bg-white border-b border-gray-200 shadow-sm">
        <View className="px-5 py-4">
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            Daily Sales
          </Text>
          <Text className="text-base text-gray-600 font-medium">
            Total: {formatCurrency(getTotalSales())}
          </Text>
        </View>
      </View>

      {/* Sales List */}
      <FlatList
        data={salesData}
        renderItem={renderSalesItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

    </SafeAreaView>
  );
};

export default DailySales;