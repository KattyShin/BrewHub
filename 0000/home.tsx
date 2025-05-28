import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Calendar,
  DollarSign,
  Clock,
  Star,
  TrendingUp,
  ArrowUp,
  Eye,
  ChevronRight,
  Coffee,
  Snowflake,
} from "lucide-react-native";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "~/firebaseConfig";
import { useAuthStore } from "../stores/authstore";

interface SaleItem {
  id: string;
  sales_date: Date;
  daily_tot_sales: number;
  transid: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  item_sold: number;
  category: string;
  description: string;
  createdAt: string;
  imagePath: string; // Added imagePath to the interface
}

const Home = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [todaySales, setTodaySales] = useState<SaleItem[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [bestSelling, setBestSelling] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchTodaySales = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const salesQuery = query(
          collection(db, "sales_report"),
          where("userRef", "==", userRef),
          where("sales_date", ">=", today)
        );

        const querySnapshot = await getDocs(salesQuery);
        const sales: SaleItem[] = [];
        let dailyTotal = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const salesDate = data.sales_date?.toDate
            ? data.sales_date.toDate()
            : new Date();

          const saleItem = {
            id: doc.id,
            sales_date: salesDate,
            daily_tot_sales: data.daily_tot_sales || 0,
            transid: data.payment_transactionRef.id,
          };

          sales.push(saleItem);
          dailyTotal += saleItem.daily_tot_sales;
        });

        sales.sort((a, b) => b.sales_date.getTime() - a.sales_date.getTime());
        setTodaySales(sales);
        setTotalSales(dailyTotal);
      } catch (error) {
        console.error("Error fetching today's sales:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBestSelling = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const productsQuery = query(
          collection(db, "products"),
          where("user", "==", userRef),
          orderBy("item_sold", "desc"),
          limit(5)
        );

        const querySnapshot = await getDocs(productsQuery);
        const products: Product[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          products.push({
            id: doc.id,
            name: data.name,
            price: data.price,
            item_sold: data.item_sold || 0,
            category: data.category,
            description: data.description,
            createdAt: data.createdAt,
            imagePath: data.imagePath || "", // Add imagePath from Firestore
          });
        });

        setBestSelling(products);
      } catch (error) {
        console.error("Error fetching best selling products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchTodaySales();
    fetchBestSelling();
  }, [user?.uid]);

  const formatCurrency = (amount: number): string => {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderSaleItem = ({
    item,
    index,
  }: {
    item: SaleItem;
    index: number;
  }) => (
    <Pressable
      className="bg-white rounded-xl shadow-md mb-4 overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <View className="bg-green-50 px-3 py-1.5 rounded-full border border-green-300 self-start mb-2">
              <Text className="text-xs font-semibold text-green-600">
                Transaction # {item.transid}
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="bg-blue-50 p-1.5 rounded-full mr-2">
                <Clock size={16} color="#266BE9" />
              </View>
              <Text className="text-lg font-bold text-gray-900">
                {formatTime(item.sales_date)}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-2xl font-bold text-orange-600">
              {formatCurrency(item.daily_tot_sales)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <View className="bg-orange-100 rounded-full p-8 mb-6">
        <DollarSign size={56} color="#D97706" />
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-3">
        No Sales Today
      </Text>
      <Text className="text-gray-600 text-center px-8 leading-6">
        Today's sales will appear here once recorded. Start your first
        transaction!
      </Text>
    </View>
  );

  if (loading || loadingProducts) {
    return (
      <View className="flex-1 justify-center items-center bg-orange-50">
        <View>
          <ActivityIndicator size="large" color="#D97706" />
          <Text className="text-gray-600 mt-4 text-center font-medium">
            Loading your dashboard...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <StatusBar barStyle="light-content" backgroundColor="#D97706" />

      {/* Header */}
      <View className="bg-[#D97706] px-5 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className="bg-white/20 p-2 rounded-full mr-3">
              <Calendar size={20} color="white" />
            </View>
            <View>
              <Text className="text-white text-lg font-semibold">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <Text className="text-orange-100 text-sm">
                Dashboard Overview
              </Text>
            </View>
          </View>
          <View className="flex-row items-center bg-white/20 px-3 py-2 rounded-full">
            <Clock size={16} color="white" />
            <Text className="text-white text-sm font-medium ml-2">
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </View>
        </View>

        {/* Total Sales Card */}
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="bg-white rounded-lg p-4 shadow-md"
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <Text className="text-gray-500 text-sm">Today's Total</Text>
                <TrendingUp
                  size={16}
                  color="#10B981"
                  style={{ marginLeft: 8 }}
                />
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-1">
                {formatCurrency(totalSales)}
              </Text>
              <Text className="text-green-600 text-sm font-semibold">
                {todaySales.length} transaction
                {todaySales.length !== 1 ? "s" : ""}
              </Text>
            </View>
            <View className="bg-orange-100 p-3 rounded-full">
              <DollarSign size={24} color="#D97706" />
            </View>
          </View>
        </Animated.View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Best Selling Products */}
        <View className="px-5 py-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-900">
              Top 5 Best Selling Products
            </Text>
            <TouchableOpacity onPress={() => router.push("/Menu/inventory")}>
              <Text className="text-orange-600 text-sm font-semibold">
                View all
              </Text>
            </TouchableOpacity>
          </View>

          {bestSelling.length > 0 ? (
            <View>
              {bestSelling.map((item, index) => (
                <View key={item.id} style={styles.productCard}>
                  <View style={styles.productIndex}>
                    <Text style={styles.indexText}>{index + 1}</Text>
                  </View>
                  
                  {/* Product Image */}
                  {item.imagePath ? (
                    <Image
                      source={{ uri: item.imagePath }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.productImage, styles.productImagePlaceholder]}>
                      {item.category === "hot" ? (
                        <Coffee size={24} color="#D97706" />
                      ) : (
                        <Snowflake size={24} color="#3B82F6" />
                      )}
                    </View>
                  )}
                  
                  <View style={styles.productInfo}>
                    <View className="px-1">
                      <Text className="text-lg font-semibold text-gray-900 truncate">
                        {item.name}
                      </Text>
                      <Text className="text-sm text-gray-500 truncate">
                        {item.description}
                      </Text>
                    </View>
                    <Text style={styles.productCategory}>
                      {item.category} coffee
                    </Text>
                  </View>
                  
                  <View style={styles.salesInfo}>
                    <Text style={styles.salesCount}>{item.item_sold} sold</Text>
                    <Text style={styles.productPrice}>₱{item.price.toFixed(2)}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-xl p-6 items-center justify-center">
              <Star size={40} color="#D1D5DB" />
              <Text className="text-gray-500 mt-3 text-center">
                No best selling products yet. Start selling to see rankings.
              </Text>
            </View>
          )}
        </View>

        {/* Recent Transactions */}
        <View className="px-5 py-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-900">
              Recent Transactions
            </Text>
            <TouchableOpacity onPress={() => router.push("/sales/transaction")}>
              <Text className="text-orange-600 text-sm font-semibold">
                View all
              </Text>
            </TouchableOpacity>
          </View>

          {todaySales.length > 0 ? (
            <FlatList
              data={todaySales.slice(0, 6)}
              renderItem={renderSaleItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productIndex: {
    backgroundColor: "#FEE2E2",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  indexText: {
    color: "#DC2626",
    fontWeight: "bold",
    fontSize: 14,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productImagePlaceholder: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  salesInfo: {
    alignItems: "flex-end",
  },
  salesCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#047857",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
});

export default Home;