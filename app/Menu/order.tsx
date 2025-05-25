import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Pressable,
  Image,
} from "react-native";
import {
  Search,
  ShoppingCart,
  Star,
  Coffee,
  Snowflake,
  Plus,
  Minus,
  Trash2,
  X,
  ArrowLeft,
} from "lucide-react-native";
import { useRouter } from "expo-router";
type CoffeeTab = "iced" | "hot";
import Header from "../header";
interface CoffeeItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface CartItem extends CoffeeItem {
  quantity: number;
}

export default function BrewHub() {
  const [activeTab, setActiveTab] = useState<CoffeeTab>("iced");
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const router = useRouter();
  const coffeeItems = {
    iced: [
      {
        id: 1,
        name: "Cappuccino",
        description: "with chocolate",
        price: 4.8,
        rating: 4.8,
      },
      {
        id: 2,
        name: "Cappuccino",
        description: "with chocolate",
        price: 4.8,
        rating: 4.8,
      },
      {
        id: 3,
        name: "Cold Brew",
        description: "Bold and smooth",
        price: 5.0,
        rating: 4.9,
      },
    ],
    hot: [
      {
        id: 4,
        name: "Hot Cappuccino",
        description: "with chocolate",
        price: 4.3,
        rating: 4.6,
      },
      {
        id: 5,
        name: "Espresso",
        description: "Strong and aromatic",
        price: 3.8,
        rating: 4.5,
      },
      {
        id: 6,
        name: "Flat White",
        description: "Creamy and rich",
        price: 4.6,
        rating: 4.7,
      },
    ],
  };

  const filteredItems =
    coffeeItems[activeTab]?.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase())
    ) || [];

  const addToCart = (item: CoffeeItem) => {
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

  const updateQuantity = (id: number, increment: boolean) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQuantity = increment
            ? item.quantity + 1
            : Math.max(item.quantity - 1, 1);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    const totalPrice = getTotalPrice();
    const enteredAmount = parseFloat(paymentAmount);

    if (isNaN(enteredAmount) || enteredAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid payment amount.");
      return;
    }

    if (enteredAmount < totalPrice) {
      Alert.alert(
        "Insufficient Payment",
        `The total is $${totalPrice.toFixed(
          2
        )}. Please enter an amount equal to or greater than the total.`
      );
      return;
    }

    Alert.alert(
      "Payment Successful",
      `Change: $${(enteredAmount - totalPrice).toFixed(
        2
      )}\nThank you for your purchase!`,
      [
        {
          text: "OK",
          onPress: () => {
            setCart([]);
            setShowCart(false);
            setPaymentAmount("");
            router.push("/receipt"); // Navigate to receipt page}
          },
        },
      ]
    );
  };

  if (showCart) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF7ED" }}>
        <StatusBar barStyle="light-content" backgroundColor="#D97706" />

        <TouchableOpacity
          onPress={() => setShowCart(false)}
          className="flex flex-row items-center py-3 px-2"
        >
          <ArrowLeft size={20} />
          <Text className=" text-base font-medium ml-2">Back</Text>
        </TouchableOpacity>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-2xl font-bold mt-6 mb-4 text-gray-800">
            Your Cart ({cart.length})
          </Text>

          {cart.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 64 }}>
              <ShoppingCart color="#9CA3AF" size={48} />
              <Text className="text-gray-600 text-lg mt-4">
                Your cart is empty
              </Text>
            </View>
          ) : (
            <>
              {cart.map((item) => (
                <View
                  key={item.id}
                  className="bg-white rounded-lg p-4 mb-3 shadow-sm"
                >
                  <View className="flex flex-row items-center gap-2 justify-between">
                    {/* Left side - Product info */}
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-gray-800 mb-1">
                        {item.name}
                      </Text>
                      <Text className="text-gray-500 text-sm mb-2">
                        {item.description}
                      </Text>

                      {/* Best Selling badge */}
                      <View className="bg-black flex w-24 rounded-full px-3 py-1 items-center">
                        <View className="flex flex-row items-center">
                          <Star fill="#FFC918" size={12} />
                          <Text className="text-white text-xs ml-1 font-medium">
                            Best Selling
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Right side - Price and controls */}
                    <View className="flex flex-col items-end ml-4">
                      <Text className="text-lg font-bold text-[#D97706] mb-3">
                        Price: ₱ {(item.price * item.quantity).toFixed(2)}
                      </Text>

                      {/* Quantity controls */}
                      <View className="flex flex-row items-center">
                        <TouchableOpacity
                          onPress={() => updateQuantity(item.id, false)}
                          className="w-8 h-8 bg-gray-200 rounded-md items-center justify-center "
                        >
                          <Minus color="#374151" size={14} />
                        </TouchableOpacity>

                        <Text className="mx-1 text-base font-semibold text-gray-800 min-w-[20px] text-center ">
                          {item.quantity}
                        </Text>

                        <TouchableOpacity
                          onPress={() => updateQuantity(item.id, true)}
                          className="w-8 h-8 bg-gray-200 rounded-sm items-center justify-center mr-2"
                        >
                          <Plus size={14} />
                        </TouchableOpacity>
                      </View>

                      {/* Delete button */}
                      <TouchableOpacity
                        onPress={() => removeFromCart(item.id)}
                        className="mt-2"
                      >
                        <Trash2 color="#ED1A1A" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}

              <View className="bg-white rounded-lg p-4 mt-4 mb-6 shadow-md">
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-lg font-bold text-gray-800">
                    Total:
                  </Text>
                  <Text className="text-lg font-bold text-[#D97706] mx-2">
                    ${getTotalPrice().toFixed(1)}
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 24, marginBottom: 32 }}>
                <Text className="text-base font-semibold mb-2 text-gray-800">
                  Enter Payment Amount
                </Text>
                <TextInput
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  placeholder="$0.0"
                  keyboardType="numeric"
                  className="bg-white rounded-lg py-3 px-4 mb-4 text-base border border-gray-200 shadow-sm"
                />

                <TouchableOpacity
                  onPress={handleCheckout}
                  style={{
                    backgroundColor: "#D97706",
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                  >
                    Complete Payment
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
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
