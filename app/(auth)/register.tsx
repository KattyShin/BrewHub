import * as React from 'react';
import { View, TextInput, Pressable, Image, Alert } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';
import Logo from '~/assets/images/brewhub.png';

export default function SignUpScreen() {
  const router = useRouter();

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    Alert.alert('Success', 'Account created!');
    router.push('/login');
  };

  return (
    <View className='flex-1 justify-center items-center p-6 bg-[#D97706]'>
      <View className="absolute top-14 left-6">
        <Image source={Logo} className="w-40 h-10" resizeMode="contain" />
      </View>
      <Text className='text-white text-3xl font-bold mb-10 text-center'>Create Account</Text>

      <View className='w-full max-w-sm'>
        <Text className='text-white mb-1'>Username</Text>
        <TextInput
          className='bg-white rounded-md p-3 mb-4'
          placeholder='Enter your username'
          value={username}
          onChangeText={setUsername}
        />

        <Text className='text-white mb-1'>Email</Text>
        <TextInput
          className='bg-white rounded-md p-3 mb-4'
          placeholder='Enter your email'
          value={email}
          keyboardType='email-address'
          onChangeText={setEmail}
        />

        <Text className='text-white mb-1'>Password</Text>
        <TextInput
          className='bg-white rounded-md p-3 mb-4'
          placeholder='Enter your password'
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <Text className='text-white mb-1'>Re-password</Text>
        <TextInput
          className='bg-white rounded-md p-3 mb-6'
          placeholder='Confirm password'
          value={confirmPassword}
          secureTextEntry
          onChangeText={setConfirmPassword}
        />

        <Button className='bg-black text-white mb-10' onPress={handleRegister}>
          <Text className='text-white text-center'>Create Account</Text>
        </Button>
      </View>

      <View className='absolute bottom-20 flex-row'>
        <Text className='text-white'>Already have an Account? </Text>
        <Pressable onPress={() => router.push('/login')}>
          <Text className='text-white underline font-semibold'>Log in</Text>
        </Pressable>
      </View>
    </View>
  );
}
