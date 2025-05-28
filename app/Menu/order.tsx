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
  Image,
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
  imagePath: string;
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
            imagePath: data.imagePath || "",
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
      <View className="px-5 py-4">
        <View className="relative">
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search coffee..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm"
          />
          <View className="absolute left-3 top-3">
            <Search size={20} color="#6B7280" />
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="px-5 mb-4">
        <View className="flex flex-row bg-gray-200 p-1">
          {["iced", "hot"].map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab as CoffeeTab)}
              className={`flex-1 rounded py-2 px-3 flex flex-row items-center justify-center ${
                activeTab === tab ? "bg-white" : "bg-transparent"
              }`}
            >
              {tab === "iced" ? (
                <Snowflake
                  size={16}
                  color={activeTab === "iced" ? "#000" : "#6B7280"}
                />
              ) : (
                <Coffee
                  size={16}
                  color={activeTab === "hot" ? "#000" : "#6B7280"}
                />
              )}
              <Text
                className={`ml-2 font-medium ${
                  activeTab === tab ? "text-black" : "text-gray-600"
                }`}
              >
                {tab === "iced" ? "Iced Coffee" : "Hot Coffee"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Product List - Updated to match products page design */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      >
        <View className="px-2">
          {filteredItems.length === 0 ? (
            <View className="flex items-center justify-center py-16">
              <View className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Coffee size={32} color="#EF4444" />
              </View>
              <Text className="text-gray-600 text-xl font-medium mb-2">
                No coffee found
              </Text>
              <Text className="text-gray-400 text-sm text-center max-w-xs">
                Try adjusting your search terms or check back later for new
                additions
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {filteredItems.map((item) => (
                <View
                  key={item.id}
                  className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden mb-2"
                >
                  <View className="flex flex-row ">
                    {/* Image Section */}
                    <View className="relative">
                      {item.imagePath ? (
                        <Image
                          source={{ uri: item.imagePath }}
                          style={{
                            width: 100,
                            height: 120,
                            backgroundColor: "#f3f4f6",
                          }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={{
                            width: 100,
                            height: 120,
                            backgroundColor: "#f3f4f6",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {item.category === "iced" ? (
                            <Snowflake size={24} color="#9CA3AF" />
                          ) : (
                            <Coffee size={24} color="#9CA3AF" />
                          )}
                          <Text className="text-gray-400 text-xs mt-1">
                            No Image
                          </Text>
                        </View>
                      )}
                      {/* Price Badge */}
                      <View className="absolute top-2 right-2 bg-amber-500 px-2 py-1 rounded-lg">
                        <Text className="text-white text-xs font-bold">
                          ₱{item.price.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    {/* Content Section */}
                    <View style={{ flex: 1 }} className="p-4 justify-between">
                      <View>
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                          {item.name}
                        </Text>
                        <Text
                          className="text-gray-600 text-sm leading-5"
                          numberOfLines={2}
                        >
                          {item.description}
                        </Text>
                      </View>

                      {/* Add to Cart Button */}
                      <TouchableOpacity
                        onPress={() => addToCart(item)}
                        className="bg-amber-500 rounded-lg py-2 mt-3 flex flex-row  items-center justify-center"
                        activeOpacity={0.7}
                      >
                        <Plus size={18} color="white" className="mr-1" />
                        <Text className="text-white text-sm font-medium">
                          Add to Cart
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
