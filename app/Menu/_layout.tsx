import React from "react";
import { Tabs } from "expo-router";

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "Home", headerShown: false }} />
      <Tabs.Screen name="order" options={{ title: "Order", headerShown: false }} />
      <Tabs.Screen name="inventory" options={{ title: "Inventory", headerShown: false }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", headerShown: false }} />
    </Tabs>
  );
};

export default _layout;
