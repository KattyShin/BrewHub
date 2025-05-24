import "~/global.css";
import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  Star,
  Coffee,
  Snowflake,
} from "lucide-react-native";
import { Card, CardContent, CardTitle } from "components/ui/card";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Button,
  Pressable,
} from "react-native";

export default function BrewHub() {
  type CoffeeTab = "iced" | "hot";

  const coffeeItems = {
    iced: [
      {
        id: 1,
        name: "Iced Cappuccino",
        description: "Chilled with chocolate.",
        price: 4.8,
        rating: 4.8,
      },
      {
        id: 2,
        name: "Iced Latte",
        description: "Smooth and refreshing.",
        price: 4.5,
        rating: 4.7,
      },
      {
        id: 3,
        name: "Cold Brew",
        description: "Bold and smooth.",
        price: 5.0,
        rating: 4.9,
      },
    ],
    hot: [
      {
        id: 4,
        name: "Hot Cappuccino",
        description: "Steamy with chocolate.",
        price: 4.3,
        rating: 4.6,
      },
      {
        id: 5,
        name: "Espresso",
        description: "Strong and aromatic.",
        price: 3.8,
        rating: 4.5,
      },
      {
        id: 6,
        name: "Flat White",
        description: "Creamy and rich.",
        price: 4.6,
        rating: 4.7,
      },
    ],
  };

  const [activeTab, setActiveTab] = useState<CoffeeTab>("hot");
  const [searchText, setSearchText] = useState("");

  // Debug log to verify active tab changes
  console.log("Active tab:", activeTab);

  // Filter items based on search text
  const filteredItems =
    coffeeItems[activeTab]?.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase())
    ) || [];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fef7ed" }}>
      {/* Header */}
      <View className="bg-[#D97706] px-4 py-6">
        <View className="flex flex-row items-center justify-between mb-2">
          <View className="flex flex-row items-center gap-2">
            <View className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Text className="text-[#D97706] font-bold text-lg">B</Text>
            </View>
            <Text className="text-white font-bold text-xl">BREW HUB</Text>
          </View>
          <TouchableOpacity>
            <ShoppingCart color="white" size={24} />
          </TouchableOpacity>
        </View>
        <Text className="text-[#fed7aa] text-sm">
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
      {/* Tab Navigation */}
      <View className="px-4 mb-6">
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
      <View className="px-4 ">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="bg-white shadow-md rounded-lg border-transparent mb-4"
          >
            <CardContent className="p-4">
              <View className="flex flex-row items-center gap-4">
                {/* Coffee Image Placeholder */}
                <View className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                  <Text className="text-gray-400 text-xs">Image</Text>
                </View>

                {/* Coffee Details */}
                <View style={{ flex: 1 }}>
                  <CardTitle className="text-black text-xl mb-1">
                    {item.name}
                  </CardTitle>
                  <Text className="text-gray-500 text-sm mb-2">
                    {item.description}
                  </Text>

                  <View className="flex flex-row items-center gap-2">
                    <View className="flex flex-row items-center gap-1 bg-black rounded-full px-2 py-1">
                      <Star fill="#FFD700" stroke="none" size={12} />
                      <Text className="text-white text-xs">{item.rating}</Text>
                    </View>
                  </View>
                </View>

                {/* Price and Add Button */}
                <View style={{ alignItems: "flex-end" }}>
                  <Text className="text-2xl font-bold text-orange-600 mb-2">
                    ₱{item.price.toFixed(1)}
                  </Text>
                  <TouchableOpacity className="bg-[#D97706] px-4 py-2 rounded-lg">
                    <Text className="text-white font-medium text-sm">
                      Add to Cart
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <View className="flex items-center justify-center py-8">
            <Text className="text-gray-500 text-lg">No coffee found</Text>
            <Text className="text-gray-400 text-sm">
              Try a different search term
            </Text>
          </View>
        )}
      </View>

      {/* Bottom spacing */}
      <View className="h-20" />
    </ScrollView>
  );
}
