import { View, Text } from "react-native";
import React from "react";
import Header from "../header";

const Home = () => {
  return (
    <View>
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
        </View>

        <Text className="text-gray-200 text-sm mt-1">
          Premium coffee delivered fresh
        </Text>
      </View>
    </View>
  );
};

export default Home;
