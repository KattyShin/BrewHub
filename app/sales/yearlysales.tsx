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
  BarChart3,
  Plus,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const YearlySales = () => {
  const router = useRouter();
  const [salesData, setSalesData] = useState([
    {
      id: "1",
      year: "2025",
      totalSales: 89450.75,
      transactionCount: 1250,
      monthlyAverage: 7454.23,
      status: "completed",
      growthRate: 12.5,
    },
    {
      id: "2",
      year: "2024",
      totalSales: 79520.50,
      transactionCount: 1180,
      monthlyAverage: 6626.71,
      status: "completed",
      growthRate: 8.3,
    },
    {
      id: "3",
      year: "2023",
      totalSales: 73425.25,
      transactionCount: 1095,
      monthlyAverage: 6118.77,
      status: "completed",
      growthRate: 15.2,
    },
    {
      id: "4",
      year: "2022",
      totalSales: 63750.00,
      transactionCount: 980,
      monthlyAverage: 5312.50,
      status: "completed",
      growthRate: 22.1,
    },
    {
      id: "5",
      year: "2021",
      totalSales: 52200.80,
      transactionCount: 850,
      monthlyAverage: 4350.07,
      status: "completed",
      growthRate: 18.7,
    },
  ]);

  interface SaleItem {
    id: string;
    year: string;
    totalSales: number;
    transactionCount: number;
    monthlyAverage: number;
    status: string;
    growthRate: number;
  }

  const formatCurrency = (amount: number): string => {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatYear = (yearString: string): string => {
    const currentYear = new Date().getFullYear();
    const year = parseInt(yearString);
    
    if (year === currentYear) {
      return `${yearString} (Current)`;
    }
    return yearString;
  };

  const formatGrowthRate = (rate: number): string => {
    const sign = rate >= 0 ? "+" : "";
    return `${sign}${rate.toFixed(1)}%`;
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
    const averageYearlySale = salesData.length > 0 ? totalSales / salesData.length : 0;
    const highestYearSale = Math.max(...salesData.map((item) => item.totalSales));

    return {
      totalSales,
      totalTransactions,
      averageYearlySale,
      highestYearSale,
    };
  }, [salesData]);

  const handleSalePress = (item: SaleItem) => {
    Alert.alert(
      "Yearly Sales Details",
      `Year: ${item.year}\nTotal Sales: ${formatCurrency(item.totalSales)}\nTransactions: ${item.transactionCount.toLocaleString()}\nMonthly Average: ${formatCurrency(item.monthlyAverage)}\nGrowth Rate: ${formatGrowthRate(item.growthRate)}`,
      [{ text: "OK" }]
    );
  };

  const renderSalesItem = ({ item }: { item: SaleItem }) => (
    <TouchableOpacity 
      onPress={() => handleSalePress(item)}
      activeOpacity={0.7}
    >
      <View className="bg-white rounded-lg shadow-md mb-4 p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <Calendar size={18} color="#D97706" />
              <Text className="text-xl font-bold text-gray-900 ml-2">
                {formatYear(item.year)}
              </Text>
            </View>

            <View className="flex-row items-center mb-3">
              <BarChart3 size={16} color="#F59E0B" />
              <Text className="text-sm text-gray-600 ml-2">
                Monthly Avg: {formatCurrency(item.monthlyAverage)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                <Text className="text-xs font-semibold text-orange-700">
                  {item.transactionCount.toLocaleString()} transactions
                </Text>
              </View>
              
              <View className={`px-3 py-1 rounded-full ${
                item.growthRate >= 0 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <Text className={`text-xs font-semibold ${
                  item.growthRate >= 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {formatGrowthRate(item.growthRate)} growth
                </Text>
              </View>
            </View>
          </View>

          <View className="items-end ml-4">
            <View className="flex-row items-center mb-1">
              <DollarSign size={16} color="#D97706" />
              <Text className="text-xs text-orange-600 font-medium ml-1">
                Annual Sales
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
        No Yearly Sales Data
      </Text>
      <Text className="text-gray-600 text-center px-8 mb-6">
        Your yearly sales performance will appear here once you have completed annual records.
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FEF7ED" />

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
            <Text className="text-white font-bold text-lg">YEARLY</Text>
            <Text className="text-white font-bold text-lg bg-black px-2">
              SALES
            </Text>
          </View>
        </View>
        <Text className="text-gray-200 text-sm mt-1">
          Annual performance overview
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

export default YearlySales;