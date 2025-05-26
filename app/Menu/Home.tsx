import { View, Text, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import React from "react";
import Header from "../header";
import { useLocalSearchParams } from "expo-router";
import { useAuthStore } from "../stores/authstore";

const Home = () => {
  
  const user = useAuthStore((state) => state.user);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content" // or "dark-content" depending on your background
        backgroundColor="#D97706" // match your header color
      />
      <View style={styles.container}>
        {/* Your custom header */}
        <View style={styles.headerContainer}>
          <Header />
        </View>

        {/* Main content */}
        <View>
          <Text>Welcome, {user?.email}!</Text>
          <Text>User ID: {user?.uid}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#D97706", // Match your header background
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: "#D97706",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
});

export default Home;
