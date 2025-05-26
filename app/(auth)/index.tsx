import * as React from 'react';
import { View, TextInput, Pressable, Image, Alert, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useRouter } from 'expo-router';
import Logo from '~/assets/images/brewhub.png';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '~/firebaseConfig'; // db = getFirestore(app)

export default function LoginScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  async function handleLogin() {
    try {
      // Lookup the email from Firestore using the username
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Login Error', 'Username not found');
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const email = userData.email;

      //  Log in with email + password
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/Menu/home'); // Adjust path if needed
    } catch (error) {
      Alert.alert('Login Error', (error as Error).message);
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
        <Text style={styles.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholder="Enter your username"
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
