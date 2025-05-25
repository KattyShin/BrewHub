import * as React from 'react';
import { View, TextInput, Pressable, Image, Alert, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useRouter } from 'expo-router';
import Logo from '~/assets/images/brewhub.png';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '~/firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/Menu/Home'); // Adjust path if needed
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  }

  function handleCreateAccount() {
    router.push('/register');
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.title}>Log-in Account</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={[styles.input, styles.lastInput]}
          placeholder="Enter your password"
          secureTextEntry
        />

        <Button style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </Button>

        <Button variant="outline" style={styles.googleButton}>
          <AntDesign name="google" size={20} color="#4285F4" />
          <Text style={styles.googleText}>Continue with Google </Text>
        </Button>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an Account? </Text>
        <Pressable onPress={handleCreateAccount}>
          <Text style={styles.footerLink}>Create Account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#D97706',
  },
  logoContainer: {
    position: 'absolute',
    top: 56,
    left: 24,
  },
  logo: {
    width: 160,
    height: 40,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 80,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  label: {
    color: 'white',
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  lastInput: {
    marginBottom: 40,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  googleText: {
    color: '#4B5563',
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
  },
  footerText: {
    color: 'white',
  },
  footerLink: {
    color: 'white',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
