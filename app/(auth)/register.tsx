import * as React from 'react';
import {
  View,
  TextInput,
  Pressable,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';
import Logo from '~/assets/images/brewhub.png';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '~/firebaseConfig';

export default function SignUpScreen() {
  const router = useRouter();

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username,
        email,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Account created!');
      router.push('/(auth)');
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Registration Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Re-password</Text>
        <TextInput
          style={[styles.input, styles.lastInput]}
          placeholder="Confirm password"
          value={confirmPassword}
          secureTextEntry
          onChangeText={setConfirmPassword}
        />

        <Button style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </Button>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an Account? </Text>
        <Pressable onPress={() => router.push('/(auth)')}>
          <Text style={styles.footerLink}>Log in</Text>
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
    marginBottom: 40,
    textAlign: 'center',
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
    marginBottom: 16,
  },
  lastInput: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
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
