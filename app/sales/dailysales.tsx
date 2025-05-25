import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  Plus,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const DailySales = () => {
  const router = useRouter();
  const [salesData, setSalesData] = useState([
    {
      id: "1",
      date: "2025-01-12",
      time: "11:34 PM",
      totalSales: 248.75,
      transactionCount: 12,
      status: "completed",
    },
    {
      id: "2",
      date: "2025-01-11",
      time: "10:45 PM",
      totalSales: 195.5,
      transactionCount: 8,
      status: "completed",
    },
    {
      id: "3",
      date: "2025-01-10",
      time: "11:15 PM",
      totalSales: 312.25,
      transactionCount: 15,
      status: "completed",
    },
    {
      id: "4",
      date: "2025-01-09",
      time: "9:30 PM",
      totalSales: 175.0,
      transactionCount: 6,
      status: "completed",
    },
    {
      id: "5",
      date: "2025-01-08",
      time: "10:20 PM",
      totalSales: 285.8,
      transactionCount: 11,
      status: "completed",
    },
  ]);

  interface SaleItem {
    id: string;
    date: string;
    time: string;
    totalSales: number;
    transactionCount: number;
    status: string;
  }

  const formatCurrency = (amount: number): string => {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const formatTime = (timeString: string): string => {
    return timeString;
  };

  const salesStats = useMemo(() => {
    const totalSales = salesData.reduce(
      (sum, item) => sum + item.totalSales,
      0
    );
    const totalTransactions = salesData.reduce(
      (sum, item) => sum + item.transactionCount,
      0
    );
    const averageSale =
      totalTransactions > 0 ? totalSales / totalTransactions : 0;
    const highestSale = Math.max(...salesData.map((item) => item.totalSales));

    return {
      totalSales,
      totalTransactions,
      averageSale,
      highestSale,
    };
  }, [salesData]);

  const handleSalePress = (item: SaleItem) => {
    Alert.alert(
      "Sale Details",
      `Date: ${formatDate(item.date)}\nTime: ${item.time}\nTransactions: ${
        item.transactionCount
      }\nTotal: ${formatCurrency(item.totalSales)}`,
      [{ text: "OK" }]
    );
  };

  const renderSalesItem = ({ item }: { item: SaleItem }) => (
    <View className="bg-white rounded-lg shadow-md mb-4 p-4">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <Calendar size={16} color="#266BE9" />
            <Text className="text-lg font-bold text-gray-900 ml-2">
              {formatDate(item.date)}
            </Text>
          </View>
        
          <View className="flex-row items-center">
            <View className="bg-green-50 px-3 py-1 rounded-full border border-green-300">
              <Text className="text-xs font-semibold text-green-600">
                {item.transactionCount} transactions
              </Text>
            </View>
          </View>
        </View>

        <View className="items-end">
          <View className="flex-row items-center mb-1">
            <DollarSign size={16} color="#D97706" />
            <Text className="text-xs text-orange-600 font-medium ml-1">
              Total Sales
            </Text>
          </View>
          <Text className="text-2xl font-bold text-orange-600">
            {formatCurrency(item.totalSales)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <View className="bg-orange-100 rounded-full p-6 mb-4">
        <DollarSign size={48} color="#D97706" />
      </View>
      <Text className="text-xl font-semibold text-gray-900 mb-2">
        No Sales Data
      </Text>
      <Text className="text-gray-600 text-center px-8 mb-6">
        Your daily sales will appear here once you start recording transactions.
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <StatusBar barStyle="light-content" backgroundColor="#D97706" />

      {/* Header */}
      <View className="bg-[#D97706] px-5 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.push("/Menu/settings")}
            className="flex-row items-center py-2 px-2 -ml-2"
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="white" />
            <Text className="text-white text-base ml-1 font-semibold">
              Back
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-row items-center">
          <View className="flex flex-row">
            <Text className="text-white font-bold text-lg">DAILY</Text>
            <Text className="text-white font-bold text-lg bg-black px-2">
              SALES
            </Text>
          </View>
        </View>
        <Text className="text-gray-200 text-sm mt-1">
          Premium coffee delivered fresh
        </Text>
      </View>

      {/* Content */}
      <FlatList
        data={salesData}
        renderItem={renderSalesItem}
        keyExtractor={(item) => item.id}
        // ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 100,
          flexGrow: salesData.length === 0 ? 1 : 0,
        }}
        showsVerticalScrollIndicator={false}
        bounces={true}
      />
    </SafeAreaView>
  );
};

export default DailySales;
