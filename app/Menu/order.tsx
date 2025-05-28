import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Pressable,
  ActivityIndicator,
  Animated,
} from "react-native";
import {
  Search,
  ShoppingCart,
  Coffee,
  Snowflake,
  Plus,
  ArrowLeft,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import Header from "../header";
import CartView from "../cartview";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "~/firebaseConfig";
import { useAuthStore } from "../stores/authstore";

type CoffeeTab = "iced" | "hot";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function BrewHub() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<CoffeeTab>("iced");
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addButtonScale] = useState(new Animated.Value(1));

  useEffect(() => {
    if (!user?.uid) return;

    const userRef = doc(db, "users", user.uid);
    const q = query(collection(db, "products"), where("user", "==", userRef));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const items: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
          });
        });
        setProducts(items);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore fetching error: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const filteredItems = products.filter(
    (item) =>
      item.category === activeTab &&
      (item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  const addToCart = (item: Product) => {
    // Animate button press
    Animated.sequence([
      Animated.timing(addButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (showCart) {
    return (
      <CartView
        cart={cart}
        setCart={setCart}
        setShowCart={setShowCart}
        router={router}
      />
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#fef7ed]">
        <View className="bg-white p-8 rounded-2xl shadow-lg items-center">
          <ActivityIndicator size="large" color="#D97706" className="mb-4" />
          <Coffee size={40} color="#D97706" className="mb-4" />
          <Text className="text-gray-800 text-xl font-semibold mb-2">
            Brewing your coffee...
          </Text>
          <Text className="text-gray-500 text-center">
            Loading your favorite drinks
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FEF7ED" }}>
      <StatusBar barStyle="light-content" backgroundColor="#D97706" />

      {/* Header */}
      <View className="bg-[#D97706] px-5 py-4 rounded-b-2xl shadow-lg">
        <View className="flex flex-row items-center justify-between">
          <Header />

          <TouchableOpacity
            onPress={() => setShowCart(true)}
            style={{
              position: "relative",
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: 10,
              borderRadius: 12,
            }}
          >
            <ShoppingCart color="white" size={24} />
            {getTotalItems() > 0 && (
              <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[22px] h-[22px] flex items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {getTotalItems()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text className="text-gray-200 text-sm mt-1">
          Premium coffee delivered fresh
        </Text>
      </View>

      {/* Search Bar */}
      <View
        style={{ paddingHorizontal: 20, paddingVertical: 16, marginTop: 4 }}
      >
        <View style={{ position: "relative" }}>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search coffee..."
            placeholderTextColor="#9CA3AF"
            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-100 shadow-sm text-base"
          />
          <View style={{ position: "absolute", left: 14, top: 16 }}>
            <Search size={20} color="#9CA3AF" />
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
            <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
              <View className="flex flex-row bg-gray-200 p-1 mt-2 ">
                <Pressable
                  onPress={() => setActiveTab("iced")}
                  className={`flex-1 rounded py-2 px-3 flex flex-row items-center justify-center ${
                    activeTab === "iced" ? "bg-white" : "bg-transparent"
                  }`}
                >
                  <Snowflake
                    size={16}
                    color={activeTab === "iced" ? "#000" : "#6B7280"}
                    className="mr-1"
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      activeTab === "iced" ? "text-black" : "text-gray-600"
                    }`}
                  >
                    Iced Coffee
                  </Text>
                </Pressable>
      
                <Pressable
                  onPress={() => setActiveTab("hot")}
                  className={`flex-1 rounded py-2 px-3 flex flex-row items-center justify-center ${
                    activeTab === "hot" ? "bg-white" : "bg-transparent"
                  }`}
                >
                  <Coffee
                    size={16}
                    color={activeTab === "hot" ? "#000" : "#6B7280"}
                    className="mr-1"
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      activeTab === "hot" ? "text-black" : "text-gray-600"
                    }`}
                  >
                    Hot Coffee
                  </Text>
                </Pressable>
              </View>
            </View>

      {/* Product List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredItems.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-2xl p-5 mb-5 shadow-md border border-gray-50"
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <View className="w-20 h-20 bg-[#FEF3C7] rounded-xl items-center justify-center mr-4">
                {item.category === "iced" ? (
                  <Snowflake size={32} color="#D97706" />
                ) : (
                  <Coffee size={32} color="#D97706" />
                )}
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <Text className="text-lg font-bold text-gray-800 mb-1">
                  {item.name}
                </Text>

                <Text className="text-gray-600 text-sm mb-2 leading-5">
                  {item.description}
                </Text>
              </View>

              <View className="flex items-end ml-4">
                <Text className="text-[#D97706] font-bold text-xl">
                  ${item.price.toFixed(2)}
                </Text>
              </View>
            </View>

              <TouchableOpacity
                onPress={() => addToCart(item)}
                className="bg-[#D97706] rounded-lg py-3 mt-4 flex flex-row items-center justify-center"
                activeOpacity={0.8}
              >
                <Plus size={18} color="white" className="mr-1" />
                <Text className="text-white text-base font-semibold ml-1">
                  Add to Cart
                </Text>
              </TouchableOpacity>
          </View>
        ))}

        {filteredItems.length === 0 && (
          <View className="flex-1 items-center justify-center p-6 mt-10">
            <View className="bg-white rounded-2xl p-8 items-center shadow-md border border-gray-50">
              {activeTab === "iced" ? (
                <Snowflake size={56} color="#D1D5DB" />
              ) : (
                <Coffee size={56} color="#D1D5DB" />
              )}
              <Text className="text-gray-800 text-xl font-semibold mt-5 mb-2">
                No coffee found
              </Text>
              <Text className="text-gray-500 text-center">
                Try a different search term or browse our other category
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSearchText("");
                  setActiveTab(activeTab === "iced" ? "hot" : "iced");
                }}
                className="mt-5 bg-gray-100 py-3 px-6 rounded-lg"
              >
                <Text className="text-gray-700 font-medium">
                  Switch to {activeTab === "iced" ? "Hot" : "Iced"} Coffee
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
