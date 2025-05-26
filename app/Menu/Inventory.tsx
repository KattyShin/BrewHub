import "~/global.css";
import React, { useState, useEffect } from "react";
import { Search, Coffee, Snowflake, Edit, Trash2 } from "lucide-react-native";
import { Card, CardContent, CardTitle } from "components/ui/card";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "../header";
import { useAuthStore } from "../stores/authstore";
// Firestore imports
import { collection, onSnapshot, query, where, doc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

type CoffeeTab = "iced" | "hot";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  rating?: number;
  category: "iced" | "hot" | string; // assuming category corresponds to coffee tabs
  users?: string; // Ensure users is an array
};

export default function BrewHub() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CoffeeTab>("iced");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!user?.uid) return;
    // Create reference to the user document
    const userRef = doc(db, "users", user.uid);

    const q = query(
      collection(db, "products"),
      where("user", "==", userRef) // Must match reference
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
  // Filter products based on activeTab and search text
  const filteredItems = products.filter(
    (item) =>
      item.category === activeTab &&
      (item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Firestore delete
              await import("firebase/firestore").then(
                async ({ doc, deleteDoc }) => {
                  const docRef = doc(db, "products", id);
                  await deleteDoc(docRef);
                }
              );
              Alert.alert("Deleted", "Product has been deleted.");
            } catch (error) {
              console.error("Delete failed:", error);
              Alert.alert("Error", "Failed to delete product.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#fef7ed]">
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fef7ed" }}>
      <View>
        <Text>Welcome, {user?.email}!</Text>
        <Text>User ID: {user?.uid}</Text>
      </View>
      <StatusBar
        barStyle="light-content" // or "dark-content" depending on your background
        backgroundColor="#D97706" // match your header color
      />
      <View
        style={{
          backgroundColor: "#D97706",
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <View className="flex flex-row items-center justify-between">
          <Header />
        </View>
        <Text className="text-gray-200 text-sm mt-1">
          Premium coffee delivered fresh
        </Text>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
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

      {/* Add Product Button */}
      <View className="p-2 flex flex-row justify-end">
        <TouchableOpacity
          className="bg-black w-40 px-4 py-3 rounded-lg"
          onPress={() => router.push("/addproduct")}
        >
          <Text className="text-white font-medium text-center">
            Add Product
          </Text>
        </TouchableOpacity>
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

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Products List */}

        <View className="px-2">
          {filteredItems.length === 0 ? (
            <View className="flex items-center justify-center py-8">
              <Text className="text-gray-500 text-lg">No coffee found</Text>
              <Text className="text-gray-400 text-sm">
                Try a different search term
              </Text>
            </View>
          ) : (
            filteredItems.map((item) => (
              <Card
                key={item.id}
                className="bg-white shadow-md rounded-lg border-transparent mb-4"
              >
                <CardContent className="p-4">
                  <View className="flex flex-row items-center gap-4">
                    {/* Coffee Icon */}
                    <View className="w-14 h-14 bg-gray-200 rounded items-center justify-center mr-5">
                      {item.category === "iced" ? <Snowflake /> : <Coffee />}
                    </View>

                    {/* Coffee Details */}
                    <View style={{ flex: 1 }}>
                      <CardTitle className="text-black text-lg mb-1">
                        {item.name}
                      </CardTitle>
                      <Text className="text-gray-500 text-sm mb-2">
                        {item.description}
                      </Text>
                    </View>

                    {/* Price */}
                    <Text className="text-orange-600 font-bold text-lg">
                      ₱{item.price.toFixed(1)}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex flex-row justify-end mt-4 gap-2">
                    <TouchableOpacity
                      className="bg-[#D97706] px-4 py-2 rounded-lg flex flex-row items-center"
                      onPress={() => router.push(`/edit?id=${item.id}`)}
                    >
                      <Edit size={16} color="white" />
                      <Text className="text-white ml-2">Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="bg-red-500 px-4 py-2 rounded-lg flex flex-row items-center"
                      onPress={() => handleDelete(item.id)}
                    >
                      <Trash2 size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </CardContent>
              </Card>
            ))
          )}
        </View>
        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
