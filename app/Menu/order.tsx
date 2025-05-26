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
import {
  Search,
  ShoppingCart,
  Star,
  Coffee,
  Snowflake,
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
  rating: number;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function BrewHub() {
  const user = useAuthStore((state) => state.user);

  const [activeTab, setActiveTab] = useState<CoffeeTab>("iced");
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false); // Add separate loading for tab switches
  const router = useRouter();

  useEffect(() => {
    if (!user?.uid) return;

    // Create a document reference to the user
    const userRef = doc(db, "users", user.uid);

    // Create query filtering by category and user reference
    const q = query(
      collection(db, "products"),
      where("category", "==", activeTab),
      where("user", "==", userRef)
    );

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
            rating: data.rating || 4.5,
          });
        });
        setProducts(items);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore fetching error: ", error);
        setLoading(false);
        setTabLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

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
      />
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#fef7ed]">
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF7ED" }}>
      <StatusBar barStyle="light-content" backgroundColor="#D97706" />

      {/* Main content */}
      <View>
        <Text>Welcome, {user?.email}!</Text>
        <Text>User ID: {user?.uid}</Text>
      </View>

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

      {/* Coffee Items */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Show loading indicator when switching tabs */}
        {tabLoading ? (
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-gray-600 text-lg">
              Loading {activeTab} coffee...
            </Text>
          </View>
        ) : (
          <>
            {filteredItems.map((item) => (
              <View
                key={item.id}
                className="bg-white rounded-lg p-4 mb-4 shadow-md"
              >
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  {/* Coffee Icon - Now properly matches the item category */}
                  <View className="w-14 h-14 bg-gray-200 rounded items-center justify-center mr-5">
                    {item.category === "iced" ? <Snowflake /> : <Coffee />}
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

            {filteredItems.length === 0 && !tabLoading && (
              <View className="flex-1 items-center justify-center p-4">
                {activeTab === "iced" ? (
                  <Snowflake size={48} color="#9CA3AF" />
                ) : (
                  <Coffee size={48} color="#9CA3AF" />
                )}
                <Text className="text-gray-600 text-lg mt-4">
                  No coffee found
                </Text>
                <Text className="">Try a different search term</Text>
              </View>
            )}
          </>
        )}

        <View />
      </ScrollView>
    </SafeAreaView>
  );
}
