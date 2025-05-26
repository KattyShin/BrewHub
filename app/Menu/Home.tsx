import { View, Text } from "react-native";
import React from "react";
import Header from "../header";
import { useAuth } from "contexts/Auth"; // adjust the path

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
      </View>
    </View>
  );
};

export default Home;
