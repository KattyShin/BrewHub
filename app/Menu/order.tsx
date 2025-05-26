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
} from "react-native";
import { Search, ShoppingCart, Star, Coffee, Snowflake } from "lucide-react-native";
import { useRouter } from "expo-router";
import Header from "../header";
import CartView from "../cartview";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from '~/firebaseConfig';

type CoffeeTab = "iced" | "hot";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Add uid as a prop to your BrewHub component
interface BrewHubProps {
  uid?: string; // Make it optional in case it's not always passed
}

export default function BrewHub({ uid }: BrewHubProps) {
  const [activeTab, setActiveTab] = useState<CoffeeTab>("iced");
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch products from Firestore
  useEffect(() => {
    const q = query(collection(db, "products"), where("category", "==", activeTab));
    
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
            rating: data.rating || 4.5, // Default rating if not provided
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
  }, [activeTab]);

  const filteredItems = products.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const addToCart = (item: Product) => {
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
        uid={uid} // Pass the uid to CartView
      />
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF7ED" }}>
        <StatusBar barStyle="light-content" backgroundColor="#D97706" />
        <View className="flex-1 items-center justify-center">
          <Text>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF7ED" }}>
      <StatusBar barStyle="light-content" backgroundColor="#D97706" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#D97706",
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <View className="flex flex-row items-center justify-between">
          <Header />

          <TouchableOpacity
            onPress={() => setShowCart(true)}
            style={{ position: "relative" }}
          >
            <ShoppingCart color="white" size={24} />
            {getTotalItems() > 0 && (
              <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[20px] h-5 flex items-center justify-center">
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
      <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        <View style={{ position: "relative" }}>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search coffee..."
            placeholderTextColor="#9CA3AF"
            className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm text-base"
          />
          <View style={{ position: "absolute", left: 12, top: 12 }}>
            <Search size={18} color="#9CA3AF" />
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <View className="flex flex-row bg-gray-200  p-1 mt-2 ">
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

      {/* Coffee Items */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-lg p-4 mb-4 shadow-md"
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              {/* Coffee Icon */}
              <View className="w-14 h-14 bg-gray-200 rounded items-center justify-center mr-5">
                {activeTab === "iced" ? <Snowflake /> : <Coffee />}
              </View>

              {/* Coffee Details */}
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text className="text-lg font-bold text-gray-800 mb-1">
                  {item.name}
                </Text>
                <Text className="text-gray-600 text-sm mb-2">
                  {item.description}
                </Text>
                <View className="flex flex-row items-center mt-1 bg-black rounded-full px-2 py-1 w-24">
                  <Star size={16} fill="#FFC918" />
                  <Text className="text-white text-xs">Best Selling </Text>
                </View>
              </View>

              {/* Price */}
              <View className="flex items-end ml-4">
                <Text className="text-[#D97706] font-bold text-lg mx-2">
                  ${item.price.toFixed(1)}
                </Text>
              </View>
            </View>

            {/* Add to Cart Button */}
            <TouchableOpacity
              onPress={() => addToCart(item)}
              className="bg-[#D97706] rounded-lg py-2 mt-4 flex items-center"
            >
              <Text className="text-white text-base font-semibold">
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {filteredItems.length === 0 && (
          <View className="flex-1 items-center justify-center p-4">
            <Coffee size={48} color="#9CA3AF" />
            <Text className="text-gray-600 text-lg mt-4">No coffee found</Text>
            <Text className="">Try a different search term</Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}