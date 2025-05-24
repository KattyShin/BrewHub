// components/LogoHeader.tsx
import React from 'react';
import { Image, View } from 'react-native';

export default function LogoHeader() {
  return (
    <View className="absolute top-10 left-6">
      <Image
        source={require('~/assets/images/brewhub.png')}
        style={{ width: 240, height: 80, resizeMode: 'contain' }}
      />
    </View>
  );
}
