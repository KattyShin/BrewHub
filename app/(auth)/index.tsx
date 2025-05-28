import * as React from "react";
import {
  View,
  TextInput,
  Pressable,
  Image,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import Logo from "~/assets/images/brewhub.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "~/firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authstore";

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  React.useEffect(() => {
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  async function handleLogin() {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      useAuthStore.getState().setUser(userCredential.user);
      router.push('/Menu/home');

    } catch (error) {
      let errorMessage = "Login failed. Please try again.";

      // Handle specific Firebase errors
      switch ((error as { code: string }).code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
      }

      Alert.alert("Login Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCreateAccount() {
    router.push("/register");
  }

  return (
   
      
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
   
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header with Logo */}
            <View style={styles.header}>
              <Image source={Logo} style={styles.logo} resizeMode="contain" />
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.subtitle}>
                Sign in to continue to BrewHub
              </Text>
            </View>

            {/* Form Container */}
            <View style={styles.formContainer}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View
                  style={[styles.inputWrapper, emailError && styles.inputError]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) validateEmail(text);
                    }}
                    style={styles.input}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    passwordError && styles.inputError,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) validatePassword(text);
                    }}
                    style={styles.input}
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </Pressable>
                </View>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              {/* Forgot Password */}
              <Pressable
                style={styles.forgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>

              {/* Login Button */}
              <Button
                style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </Button>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Pressable onPress={handleCreateAccount} hitSlop={8}>
                <Text style={styles.footerLink}>Sign Up</Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
        </KeyboardAvoidingView>
   
 
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#D97706",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//     minHeight: "100%",
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingVertical: 40,
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 40,
//   },
//   logo: {
//     width: 180,
//     height: 45,
//     marginBottom: 24,
//   },
//   welcomeText: {
//     color: "white",
//     fontSize: 32,
//     fontWeight: "bold",
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   subtitle: {
//     color: "rgba(255, 255, 255, 0.8)",
//     fontSize: 16,
//     textAlign: "center",
//   },
//   formContainer: {
//     width: "100%",
//     maxWidth: 400,
//     alignSelf: "center",
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "500",
//     marginBottom: 8,
//   },
//   inputWrapper: {
//     backgroundColor: "white",
//     borderRadius: 5,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     minHeight: 52,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   inputError: {
//     borderWidth: 1,
//     borderColor: "#EF4444",
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: "#1F2937",
//   },
//   eyeIcon: {
//     padding: 4,
//   },
//   errorText: {
//     color: "#FEE2E2",
//     fontSize: 14,
//     marginTop: 4,
//     marginLeft: 4,
//   },
//   forgotPassword: {
//     alignSelf: "flex-end",
//     marginBottom: 32,
//     padding: 4,
//   },
//   forgotPasswordText: {
//     color: "rgba(255, 255, 255, 0.9)",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   loginButton: {
//     backgroundColor: "#1F2937",
//     paddingVertical: 16,
//     borderRadius: 12,
//     marginBottom: 24,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4.65,
//     elevation: 8,
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
//   loginButtonText: {
//     color: "white",
//     textAlign: "center",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 40,
//     paddingBottom: 20,
//   },
//   footerText: {
//     color: "rgba(255, 255, 255, 0.8)",
//     fontSize: 16,
//   },
//   footerLink: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//     textDecorationLine: "underline",
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D97706",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    minHeight: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 180,
    height: 45,
    marginBottom: 24,
  },
  welcomeText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: "white",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    minHeight: 52,
    elevation: 5, // Use elevation for Android
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: "#FEE2E2",
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 32,
    padding: 4,
  },
  forgotPasswordText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#1F2937",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 8, // Use elevation for Android
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    paddingBottom: 20,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  footerLink: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
