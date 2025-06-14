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
import { ChevronLeft, Calendar, DollarSign, Clock } from "lucide-react-native";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "~/firebaseConfig";
import { useAuthStore } from "../stores/authstore";

interface SaleItem {
  id: string;
  sales_date: Date;
  daily_tot_sales: number;
  transid: string;
}

const DailySales = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [salesData, setSalesData] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
        const sales: SaleItem[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Make sure to properly handle the timestamp conversion
          const salesDate = data.sales_date?.toDate
            ? data.sales_date.toDate()
            : new Date();

          sales.push({
            id: doc.id,
            sales_date: salesDate,
            daily_tot_sales: data.daily_tot_sales || 0,
            transid: data.payment_transactionRef.id,
          });
        });

        // Sort by date (newest first)
        sales.sort((a, b) => b.sales_date.getTime() - a.sales_date.getTime());
        setSalesData(sales);
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

  const formatDate = (date: Date): string => {
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

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };



  const renderSalesItem = ({ item }: { item: SaleItem }) => (
    <View
      className="bg-white rounded-lg shadow-md mb-4 p-4"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <Calendar size={16} color="#266BE9" />
            <View className="ml-2">
              <Text className="text-lg font-bold text-gray-900">
                {formatDate(item.sales_date)}
              </Text>
              <Text className="text-sm text-gray-500">
                {formatTime(item.sales_date)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="bg-green-50 px-3 py-1 rounded-full border border-green-300">
              <Text className="text-xs font-semibold text-green-600">
                Transaction # {item.transid}
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
            {formatCurrency(item.daily_tot_sales)}
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
            <Text className="text-white font-bold text-lg">DAILY</Text>
            <Text className="text-white font-bold text-lg bg-black px-2">
              SALES
            </Text>
          </View>
        </View>
        <Text className="text-gray-200 text-sm mt-1">
          View your daily sales records
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
      />
    </SafeAreaView>
  );
};

export default DailySales;