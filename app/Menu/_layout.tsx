import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from 'react-native-safe-area-context';

const _layout = () => {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#D97706",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 0,
            elevation: 0,
            height: 60,
            paddingBottom: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            marginBottom: 5,
          },
          tabBarItemStyle: {
            borderRadius: 10,
            margin: 5,
            marginHorizontal: 8,
          },
          headerShown: false, // Keep headers disabled
        }}
      >
        <Tabs.Screen 
          name="home" 
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home-filled" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="order" 
          options={{
            title: "Orders",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="clipboard-list" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="inventory" 
          options={{
            title: "Inventory",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="inventory" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="settings" 
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-sharp" size={size} color={color} />
            ),
          }} 
        />
      </Tabs>
    </SafeAreaProvider>
  );
};

export default _layout;