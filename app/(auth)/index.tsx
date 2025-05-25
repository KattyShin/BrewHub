import * as React from 'react';
import { View, TextInput, Pressable, Image, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useRouter } from 'expo-router';
import Logo from '~/assets/images/brewhub.png';

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  function handleLogin() {
    router.push('/Menu/Home');
  }

  function handleCreateAccount() {
    router.push('/register');
  }

  return (
    <View className="flex-1 justify-center items-center p-6 bg-[#D97706]">
      <View className="absolute top-14 left-6">
        <Image source={Logo} className="w-40 h-10" resizeMode="contain" />
      </View>

      <Text className="text-white text-3xl font-bold mb-20">Log-in Account</Text>

      <View className="w-full max-w-sm">
        <Text className="text-white mb-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          className="bg-white rounded-md p-3 mb-6"
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <Text className="text-white mb-1">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          className="bg-white rounded-md p-3 mb-10"
          placeholder="Enter your password"
          secureTextEntry
        />

        <Button className="bg-black text-white mb-5" onPress={handleLogin}>
          <Text className="text-white text-center">Log in</Text>
        </Button>

        <Button variant="outline" className="bg-white flex-row items-center justify-center">
          <AntDesign name="google" size={20} color="#4285F4" />
          <Text className="text-gray-700 ml-2">Continue with Google </Text>
        </Button>
      </View>

      <View className="absolute bottom-20 flex-row">
        <Text className="text-white">Don’t have an Account? </Text>
        <Pressable onPress={handleCreateAccount}>
          <Text className="text-white underline font-semibold">Create Account</Text>
        </Pressable>
      </View>
    </View>
  );
}
