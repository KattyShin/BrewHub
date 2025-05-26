import { View, Text } from 'react-native';
import React from 'react';
import Header from '../header';
import { useLocalSearchParams } from 'expo-router';

const Home = () => {
  const { username } = useLocalSearchParams(); //  Get the username from the login screen

  return (
    <View>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#D97706',
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

        <Text style={{ color: 'white', marginTop: 8, fontWeight: 'bold' }}>
          Logged in as: {username}
        </Text>
      </View>
    </View>
  );
};

export default Home;
