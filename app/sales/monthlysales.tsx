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

const MonthlySales = () => {
  const router = useRouter();
  const [salesData, setSalesData] = useState([
    {
      id: "1",
      month: "2025-01",
      monthName: "January 2025",
      totalSales: 7542.75,
      transactionCount: 312,
      dailyAverage: 243.31,
      status: "completed",
    },
    {
      id: "2",
      month: "2024-12",
      monthName: "December 2024",
      totalSales: 8195.5,
      transactionCount: 398,
      dailyAverage: 264.37,
      status: "completed",
    },
    {
      id: "3",
      month: "2024-11",
      monthName: "November 2024",
      totalSales: 6812.25,
      transactionCount: 267,
      dailyAverage: 227.08,
      status: "completed",
    },
    {
      id: "4",
      month: "2024-10",
      monthName: "October 2024",
      totalSales: 7235.0,
      transactionCount: 289,
      dailyAverage: 233.39,
      status: "completed",
    },
    {
      id: "5",
      month: "2024-09",
      monthName: "September 2024",
      totalSales: 6985.8,
      transactionCount: 278,
      dailyAverage: 232.86,
      status: "completed",
    },
  ]);

  interface SaleItem {
    id: string;
    month: string;
    monthName: string;
    totalSales: number;
    transactionCount: number;
    dailyAverage: number;
    status: string;
  }

  const formatCurrency = (amount: number): string => {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatMonth = (monthString: string): string => {
    const [year, month] = monthString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    const currentDate = new Date();

    if (
      date.getFullYear() === currentDate.getFullYear() &&
      date.getMonth() === currentDate.getMonth()
    ) {
      return "This Month";
    } else if (
      date.getFullYear() === currentDate.getFullYear() &&
      date.getMonth() === currentDate.getMonth() - 1
    ) {
      return "Last Month";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
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
    const averageMonthlySale =
      salesData.length > 0 ? totalSales / salesData.length : 0;
    const highestMonthlySale = Math.max(
      ...salesData.map((item) => item.totalSales)
    );

    return {
      totalSales,
      totalTransactions,
      averageMonthlySale,
      highestMonthlySale,
    };
  }, [salesData]);

  const handleSalePress = (item: SaleItem) => {
    Alert.alert(
      "Monthly Sales Details",
      `Month: ${formatMonth(item.month)}\nTransactions: ${
        item.transactionCount
      }\nDaily Average: ${formatCurrency(
        item.dailyAverage
      )}\nTotal: ${formatCurrency(item.totalSales)}`,
      [{ text: "OK" }]
    );
  };

  const renderSalesItem = ({ item }: { item: SaleItem }) => (
    <TouchableOpacity onPress={() => handleSalePress(item)} activeOpacity={0.7}>
      <View className="bg-white rounded-lg shadow-md mb-4 p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <Calendar size={16} color="#266BE9" />
              <Text className="text-lg font-bold text-gray-900 ml-2">
                {formatMonth(item.month)}
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
                Monthly Total
              </Text>
            </View>
            <Text className="text-2xl font-bold text-orange-600">
              {formatCurrency(item.totalSales)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <View className="bg-orange-100 rounded-full p-6 mb-4">
        <DollarSign size={48} color="#D97706" />
      </View>
      <Text className="text-xl font-semibold text-gray-900 mb-2">
        No Monthly Sales Data
      </Text>
      <Text className="text-gray-600 text-center px-8 mb-6">
        Your monthly sales will appear here once you start recording
        transactions.
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
            <Text className="text-white font-bold text-lg">MONTHLY</Text>
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

export default MonthlySales;
