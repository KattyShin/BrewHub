import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Calendar, DollarSign } from "lucide-react-native";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "~/firebaseConfig";
import { useAuthStore } from "../stores/authstore";

interface MonthlySale {
  id: string;
  month: string;
  year: string;
  totalSales: number;
  transactionCount: number;
}

const MonthlySales = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [monthlyData, setMonthlyData] = useState<MonthlySale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchSalesData = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const salesQuery = query(
          collection(db, "sales_report"),
          where("userRef", "==", userRef)
        );

        const querySnapshot = await getDocs(salesQuery);
        const monthlySalesMap = new Map<string, MonthlySale>();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const salesDate = data.sales_date?.toDate
            ? data.sales_date.toDate()
            : new Date();
            
          const month = salesDate.toLocaleString('default', { month: 'long' });
          const year = salesDate.getFullYear().toString();
          const key = `${month}-${year}`;
          
          const amount = data.daily_tot_sales || 0;

          if (monthlySalesMap.has(key)) {
            const existing = monthlySalesMap.get(key)!;
            existing.totalSales += amount;
            existing.transactionCount += 1;
          } else {
            monthlySalesMap.set(key, {
              id: key,
              month,
              year,
              totalSales: amount,
              transactionCount: 1
            });
          }
        });

        // Convert map to array and sort by year and month (newest first)
        const monthlySales = Array.from(monthlySalesMap.values()).sort((a, b) => {
          const dateA = new Date(`${a.month} 1, ${a.year}`);
          const dateB = new Date(`${b.month} 1, ${b.year}`);
          return dateB.getTime() - dateA.getTime();
        });

        setMonthlyData(monthlySales);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        Alert.alert("Error", "Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [user?.uid]);

  const formatCurrency = (amount: number): string => {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

 

  const renderMonthItem = ({ item }: { item: MonthlySale }) => (
    <View
      className="bg-white rounded-lg shadow-md mb-4 p-4"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <Calendar size={16} color="#266BE9" />
            <View className="ml-2">
              <Text className="text-lg font-bold text-gray-900">
                {item.month} {item.year}
              </Text>
              <Text className="text-sm text-gray-500">
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
        Your monthly sales will appear here once you start recording transactions.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-orange-50">
        <ActivityIndicator size="large" color="#D97706" />
      </View>
    );
  }

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
          View your monthly sales records
        </Text>
      </View>

      {/* Content */}
      <FlatList
        data={monthlyData}
        renderItem={renderMonthItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 100,
          flexGrow: monthlyData.length === 0 ? 1 : 0,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default MonthlySales;