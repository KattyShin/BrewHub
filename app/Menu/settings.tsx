import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert,StatusBar } from "react-native";
import {
  BarChart3,
  Calendar,
  CalendarDays,
  ShoppingBag,
  CreditCard,
  Package,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  User,
  Bell,
  Shield,
  HelpCircle,
  CircleUserRound
} from "lucide-react-native";
import { Card, CardContent } from "components/ui/card";
import "~/global.css";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '~/firebaseConfig';

const Settings = () => {
  const [userInfo, setUserInfo] = useState({ username: "", email: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const uid = user.uid;
          const userDoc = await getDoc(doc(db, "users", uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as { username: string; email: string };
            setUserInfo(userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // Add your logout logic here
          console.log("User logged out");
          router.push("/"); // Redirect to login page
        },
      },
    ]);
  };

  const handleDailySales = () => {
    router.push("/sales/dailysales");
  };

  const handleMonthlySales = () => {
    console.log("Navigating to Monthly Sales");
    // Add navigation logic for Monthly Sales
    router.push("/sales/monthlysales");
  };

  const handleYearlySales = () => {
    console.log("Navigating to Yearly Sales");
    // Add navigation logic for Yearly Sales
    router.push("/sales/yearlysales");
  };

  const handleTransactions = () => {
    console.log("Navigating to Transactions");
    // Add navigation logic for Transactions
     router.push("/sales/transaction");
  };

  // Daily Sales Component
  const DailySalesOption = () => (
    <Card className="bg-white shadow-sm rounded-xl border-0 mb-3">
      <CardContent className="p-0">
        <TouchableOpacity
          className="p-4"
          style={{ borderRadius: 12 }}
          activeOpacity={0.7}
          onPress={handleDailySales}
        >
          <View className="flex flex-row items-center">
            <View
              className="w-11 h-11 rounded-xl flex items-center justify-center mr-4"
              style={{ backgroundColor: "#10B98115" }}
            >
              <BarChart3 size={22} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text className="text-gray-900 font-semibold text-base mb-1">
                Daily Sales
              </Text>
              <Text className="text-gray-500 text-sm">
                View today's performance
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>
      </CardContent>
    </Card>
  );

  // Monthly Sales Component
  const MonthlySalesOption = () => (
    <Card className="bg-white shadow-sm rounded-xl border-0 mb-3">
      <CardContent className="p-0">
        <TouchableOpacity
          className="p-4"
          style={{ borderRadius: 12 }}
          activeOpacity={0.7}
          onPress={handleMonthlySales}
        >
          <View className="flex flex-row items-center">
            <View
              className="w-11 h-11 rounded-xl flex items-center justify-center mr-4"
              style={{ backgroundColor: "#3B82F615" }}
            >
              <Calendar size={22} color="#3B82F6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text className="text-gray-900 font-semibold text-base mb-1">
                Monthly Sales
              </Text>
              <Text className="text-gray-500 text-sm">
                Monthly Sales overview
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>
      </CardContent>
    </Card>
  );

  // Yearly Sales Component
  const YearlySalesOption = () => (
    <Card className="bg-white shadow-sm rounded-xl border-0 mb-3">
      <CardContent className="p-0">
        <TouchableOpacity
          className="p-4"
          style={{ borderRadius: 12 }}
          activeOpacity={0.7}
          onPress={handleYearlySales}
        >
          <View className="flex flex-row items-center">
            <View
              className="w-11 h-11 rounded-xl flex items-center justify-center mr-4"
              style={{ backgroundColor: "#8B5CF615" }}
            >
              <CalendarDays size={22} color="#8B5CF6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text className="text-gray-900 font-semibold text-base mb-1">
                Yearly Sales
              </Text>
              <Text className="text-gray-500 text-sm">
                Annual business overview
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>
      </CardContent>
    </Card>
  );

  // Transactions Component
  const TransactionsOption = () => (
    <Card className="bg-white shadow-sm rounded-xl border-0 mb-3">
      <CardContent className="p-0">
        <TouchableOpacity
          className="p-4"
          style={{ borderRadius: 12 }}
          activeOpacity={0.7}
          onPress={handleTransactions}
        >
          <View className="flex flex-row items-center">
            <View
              className="w-11 h-11 rounded-xl flex items-center justify-center mr-4"
              style={{ backgroundColor: "#F59E0B15" }}
            >
              <CreditCard size={22} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text className="text-gray-900 font-semibold text-base mb-1">
                Transactions
              </Text>
              <Text className="text-gray-500 text-sm">
                Payment history 
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>
      </CardContent>
    </Card>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FFF7ED]">
       <StatusBar
      barStyle="light-content" // or "dark-content" depending on your background
      backgroundColor="#D97706" // match your header color
    />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="bg-[#D97706] px-4 pt-8 pb-6 mb-6">
  <View className="flex-row items-center">
    {/* Avatar */}
    <View className="w-14 h-14 rounded-full bg-green-100 justify-center items-center mr-4">
       <CircleUserRound  size={20} color="#23A347"/>
      
    </View>

    {/* Username and Email */}
    <View>
      <Text className="text-white font-semibold text-base">
        {userInfo.username}
      </Text>
      <Text className="text-white text-sm">
        {userInfo.email}
      </Text>
    </View>
  </View>
</View>




        <View className="px-6">
          {/* Reports & Analytics Section */}
          <View className="mb-8">
            <Text className="text-gray-900 text-xl font-bold mb-1">
              Reports & Analytics
            </Text>
            <Text className="text-gray-500 text-sm mb-5">
              Track your business performance
            </Text>

            <DailySalesOption />
            <MonthlySalesOption />
            <YearlySalesOption />
            <TransactionsOption />
          </View>
        </View>

        {/* Bottom spacing */}
        <View className="h-6" />
      </ScrollView>

      {/* Fixed Sign Out Button at Bottom */}
      <View className="px-6 py-4 absolute bottom-0 left-0 right-0">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-black px-6 py-4 rounded-xl flex flex-row items-center justify-center"
        >
          <LogOut size={20} color="white" />
          <Text className="text-white font-semibold ml-3 text-base">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
