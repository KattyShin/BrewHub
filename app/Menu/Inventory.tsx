import "~/global.css";
import React, { useState, useEffect } from "react";
import { Search, Coffee, Snowflake, Edit,Trash2 } from "lucide-react-native";
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
  category: "iced" | "hot" | string;
  users?: string;
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
  const [addButtonScale] = useState(new Animated.Value(1));

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

  const animateButtonPress = (buttonType: 'edit' | 'delete') => {
    const scaleValue = buttonType === 'edit' ? editButtonScale : deleteButtonScale;
    
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
    animateButtonPress('edit');
    router.push(`/edit?id=${id}`);
  };

  const handleDelete = (id: string) => {
    animateButtonPress('delete');
    
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
      <StatusBar
        barStyle="light-content"
        backgroundColor="#D97706"
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

      {/* Add Product Button with Animation */}
      <View className="p-2 flex flex-row justify-end">
          <TouchableOpacity
            className="bg-black w-40 px-4 py-3 rounded-lg"
            onPress={() => {
              animateButtonPress('edit');
              router.push("/addproduct");
            }}
            activeOpacity={0.8}
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
                    <View className="w-20 h-20 bg-[#FEF3C7] rounded-xl items-center justify-center mr-4">
                      {item.category === "iced" ? (
                        <Snowflake size={32} color="#D97706" />
                      ) : (
                        <Coffee size={32} color="#D97706" />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <CardTitle className="text-black text-lg mb-1">
                        {item.name}
                      </CardTitle>
                      <Text className="text-gray-500 text-sm mb-2">
                        {item.description}
                      </Text>
                    </View>

                    <Text className="text-orange-600 font-bold text-lg">
                      ₱{item.price.toFixed(1)}
                    </Text>
                  </View>

                  <View className="flex flex-row justify-end mt-4 gap-2">
                    <Animated.View style={{ transform: [{ scale: editButtonScale }] }}>
                      <TouchableOpacity
                        className="bg-[#D97706] px-4 py-2 rounded-lg flex flex-row items-center"
                        onPress={() => handleEditPress(item.id)}
                        activeOpacity={0.8}
                      >
                        <Edit size={16} color="white" />
                        <Text className="text-white ml-2">Edit</Text>
                      </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={{ transform: [{ scale: deleteButtonScale }] }}>
                      <TouchableOpacity
                        className="bg-red-500 px-4 py-2 rounded-lg flex flex-row items-center"
                        onPress={() => handleDelete(item.id)}
                        activeOpacity={0.8}
                      >
                        <Trash2 size={16} color="white" />
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                </CardContent>
              </Card>
            ))
          )}
        </View>
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}