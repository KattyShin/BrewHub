
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
import { ChevronLeft, Calendar, DollarSign, Clock, CreditCard } from "lucide-react-native";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "~/firebaseConfig";
import { useAuthStore } from "../stores/authstore";

interface Transaction {
  id: string;
  amount: number;
  change: number;
  orderRef: string;
  payment_date: Date;
  total_paid: number;
  orderId?: string;
  customerName?: string;
}

const TransactionHistory = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

    const fetchTransactions = async () => {
      try {
        // First get all orders for this user
        const userRef = doc(db, "users", user.uid);
        const ordersQuery = query(
          collection(db, "order"),
          where("userRef", "==", userRef)
        );

        const ordersSnapshot = await getDocs(ordersQuery);
        const transactionsData: Transaction[] = [];

        // For each order, find its transactions
        for (const orderDoc of ordersSnapshot.docs) {
          const transactionsQuery = query(
            collection(db, "payment_transaction"),
            where("order", "==", doc(db, "order", orderDoc.id))
          );

          const transactionsSnapshot = await getDocs(transactionsQuery);
          
          for (const transactionDoc of transactionsSnapshot.docs) {
            const data = transactionDoc.data();
            const transaction: Transaction = {
              id: transactionDoc.id,
              amount: data.amount || 0,
              change: data.change || 0,
              orderRef: data.order?.path || "",
              payment_date: data.payment_date?.toDate() || new Date(),
              total_paid: data.total_paid || 0,
            };

            // Fetch customer name if customerRef exists in order
            const orderData = orderDoc.data();
            if (orderData.customerRef) {
              const customerDoc = await getDoc(doc(db, orderData.customerRef.path));
              if (customerDoc.exists()) {
                transaction.customerName = customerDoc.data().name || "Customer";
              }
            }

            transactionsData.push(transaction);
          }
        }

        // Sort by payment date (newest first)
        transactionsData.sort((a, b) => b.payment_date.getTime() - a.payment_date.getTime());
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        Alert.alert("Error", "Failed to load transaction history");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
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



  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View
      className="bg-white rounded-lg shadow-md mb-4 p-4"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <CreditCard size={16} color="#266BE9" />
            <View className="ml-2">
              <Text className="text-l font-bold text-gray-900">
                Transaction # 
              </Text>
              <Text className="text-m font-bold text-gray-500">
              {item.id}              </Text>
              <Text className="text-sm text-gray-500">
                {formatDate(item.payment_date)} at {formatTime(item.payment_date)}
              </Text>
            </View>
          </View>

         
        </View>

        <View className="items-end">
          <View className="flex-row items-center mb-1">
            <DollarSign size={16} color="#D97706" />
            <Text className="text-xs text-orange-600 font-medium ml-1">
              Amount
            </Text>
          </View>
          <Text className="text-2xl font-bold text-orange-600">
            {formatCurrency(item.total_paid)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <View className="bg-orange-100 rounded-full p-6 mb-4">
        <CreditCard size={48} color="#D97706" />
      </View>
      <Text className="text-xl font-semibold text-gray-900 mb-2">
        No Transactions Found
      </Text>
      <Text className="text-gray-600 text-center px-8 mb-6">
        Your payment transactions will appear here once you start processing orders.
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
            <Text className="text-white font-bold text-lg">TRANSACTION</Text>
            <Text className="text-white font-bold text-lg bg-black px-2">
              HISTORY
            </Text>
          </View>
        </View>
        <Text className="text-gray-200 text-sm mt-1">
          View your payment transaction records
        </Text>
      </View>

      {/* Content */}
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 100,
          flexGrow: transactions.length === 0 ? 1 : 0,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default TransactionHistory;