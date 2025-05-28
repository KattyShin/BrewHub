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
  Animated,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "../header";
import { useAuthStore } from "../stores/authstore";
import { collection, onSnapshot, query, where, doc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

type CoffeeTab = "iced" | "hot";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  rating?: number;
  category: "iced" | "hot" | string;
  users?: string;
  imagePath?: string; // 🔁 NEW FIELD
};

export default function BrewHub() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CoffeeTab>("iced");
  const [searchText, setSearchText] = useState("");
  const [editButtonScale] = useState(new Animated.Value(1));
  const [deleteButtonScale] = useState(new Animated.Value(1));

  useEffect(() => {
    if (!user?.uid) return;
    const userRef = doc(db, "users", user.uid);

    const q = query(
      collection(db, "products"),
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
            imagePath: data.imagePath || "", // 🔁 Default to empty string
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

  const animateButtonPress = (buttonType: "edit" | "delete") => {
    const scaleValue = buttonType === "edit" ? editButtonScale : deleteButtonScale;
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleEditPress = (id: string) => {
    animateButtonPress("edit");
    router.push(`/edit?id=${id}`);
  };

  const handleDelete = (id: string) => {
    animateButtonPress("delete");
    Alert.alert("Confirm Delete", "Are you sure you want to delete this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await import("firebase/firestore").then(async ({ doc, deleteDoc }) => {
              const docRef = doc(db, "products", id);
              await deleteDoc(docRef);
            });
            Alert.alert("Deleted", "Product has been deleted.");
          } catch (error) {
            console.error("Delete failed:", error);
            Alert.alert("Error", "Failed to delete product.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#fef7ed]">
        <View className="bg-white p-8 rounded-2xl shadow-lg items-center">
          <ActivityIndicator size="large" color="#D97706" className="mb-4" />
          <Coffee size={40} color="#D97706" className="mb-4" />
          <Text className="text-gray-800 text-xl font-semibold mb-2">
            Loading your inventory...
          </Text>
          <Text className="text-gray-500 text-center">
            Fetching your products
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fef7ed" }}>
      <StatusBar barStyle="light-content" backgroundColor="#D97706" />
      <View style={{ backgroundColor: "#D97706", padding: 16 }}>
        <Header />
        <Text className="text-gray-200 text-sm mt-1">
          Premium coffee delivered fresh
        </Text>
      </View>

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

      <View className="p-2 flex flex-row justify-end">
        <TouchableOpacity
          className="bg-black w-40 px-4 py-3 rounded-lg"
          onPress={() => {
            animateButtonPress("edit");
            router.push("/addproduct");
          }}
          activeOpacity={0.8}
        >
          <Text className="text-white font-medium text-center">Add Product</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <View className="flex flex-row bg-gray-200 p-1 mt-2">
          {["iced", "hot"].map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab as CoffeeTab)}
              className={`flex-1 rounded py-2 px-3 flex flex-row items-center justify-center ${
                activeTab === tab ? "bg-white" : "bg-transparent"
              }`}
            >
              {tab === "iced" ? (
                <Snowflake size={16} color={activeTab === "iced" ? "#000" : "#6B7280"}  />
              ) : (
                <Coffee size={16} color={activeTab === "hot" ? "#000" : "#6B7280"} />
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
              <Text className="text-gray-600 text-xl font-medium mb-2">No coffee found</Text>
              <Text className="text-gray-400 text-sm text-center max-w-xs">
                Try adjusting your search terms or check back later for new additions
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {filteredItems.map((item, index) => (
                <Card key={item.id} className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                  <CardContent className="p-0">
                    <View className="flex flex-row">
                      {/* Image Section */}
                      <View className="relative">
                        {item.imagePath ? (
                          <Image
                            source={{ uri: item.imagePath }}
                            style={{ 
                              width: 100, 
                              height: 120, 
                              backgroundColor: "#f3f4f6" 
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
                            <Coffee size={24} color="#9CA3AF" />
                            <Text className="text-gray-400 text-xs mt-1">No Image</Text>
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
                          <CardTitle className="text-lg font-bold text-gray-800 mb-1">
                            {item.name}
                          </CardTitle>
                          <Text 
                            className="text-gray-600 text-sm leading-5" 
                            numberOfLines={2}
                          >
                            {item.description}
                          </Text>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex flex-row justify-end gap-3 mt-3">
                          <TouchableOpacity 
                            onPress={() => handleEditPress(item.id)}
                            className="bg-blue-50 p-2 rounded-lg"
                            activeOpacity={0.7}
                          >
                            <Animated.View style={{ transform: [{ scale: editButtonScale }] }}>
                              <Edit size={18} color="#3B82F6" />
                            </Animated.View>
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            onPress={() => handleDelete(item.id)}
                            className="bg-red-50 p-2 rounded-lg"
                            activeOpacity={0.7}
                          >
                            <Animated.View style={{ transform: [{ scale: deleteButtonScale }] }}>
                              <Trash2 size={18} color="#EF4444" />
                            </Animated.View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}