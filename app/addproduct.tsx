import "~/global.css";
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "./schema/product";
import { useAuthStore } from "./stores/authstore";

// Firestore imports
import { collection, addDoc ,doc } from "firebase/firestore";
import { db, } from "~/firebaseConfig";

export default function AddProduct() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
    },
    mode: "onBlur", // Validate inputs when they lose focus
  });

  const onSubmit = async (data: ProductFormData) => {
    Alert.alert("Confirm", "Are you sure you want to add this product?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {
          router.push("/Menu/inventory"); // Navigate back to inventory
        },
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            await addDoc(collection(db, "products"), {
              name: data.name,
              description: data.description,
              category: data.category,
              price: parseFloat(data.price),
              createdAt: new Date().toISOString(),
              user: user?.uid ? doc(db, "users", user.uid) : null, // ensure user ID is defined

            });
            Alert.alert("Success", "Product added successfully!");
            router.push("/Menu/inventory"); // Navigate back to inventory
            reset();
          } catch (error) {
            console.error("Error adding document: ", error);
            Alert.alert("Error", "Failed to add product.");
          }
        },
      },
    ]);
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#fef7ed]"
    >
      <View>
        <Text>Welcome, {user?.email}!</Text>
        <Text>User ID: {user?.uid}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.push("/Menu/inventory")}
          className="flex-row items-center mb-6"
        >
          <ChevronLeft size={20} color="#000" />
          <Text className="text-black text-base ml-2 font-semibold">Back</Text>
        </TouchableOpacity>

        {/* Form Container */}
        <View className="flex h-full justify-between mt-10 bg-white rounded-xl p-5 shadow-md w-full max-w-md mx-auto">
          <View>
            <Text className="flex justify text-xl font-bold py-5">
              Add Product
            </Text>

            {/* Name Field */}
            <Text className="text-base mb-2 font-semibold">Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter product name"
                  className={`bg-gray-200 py-3 px-4 rounded-lg mb-2 text-base ${
                    errors.name ? "border border-red-500" : ""
                  }`}
                  returnKeyType="next"
                />
              )}
            />
            {errors.name && (
              <Text className="text-red-500 text-sm mb-3">
                {errors.name.message}
              </Text>
            )}

            {/* Description Field */}
            <Text className="text-base mb-2 font-semibold">Description</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter product description"
                  multiline
                  numberOfLines={3}
                  className={`bg-gray-200 py-3 px-4 rounded-lg mb-2 text-base text-top ${
                    errors.description ? "border border-red-500" : ""
                  }`}
                  returnKeyType="next"
                />
              )}
            />
            {errors.description && (
              <Text className="text-red-500 text-sm mb-3">
                {errors.description.message}
              </Text>
            )}

            {/* Category Field */}
            <Text className="text-base mb-2 font-semibold">Category</Text>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <View
                  className={`bg-gray-200 rounded-lg mb-2 overflow-hidden ${
                    errors.category ? "border border-red-500" : ""
                  }`}
                >
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    className="bg-gray-200 py-2 px-4 text-base text-gray-600 "
                  >
                    <Picker.Item label="Select a category" value="" />
                    <Picker.Item label="Hot Coffee" value="hot" />
                    <Picker.Item label="Iced Coffee" value="iced" />
                  </Picker>
                </View>
              )}
            />
            {errors.category && (
              <Text className="text-red-500 text-sm mb-3">
                {errors.category.message}
              </Text>
            )}

            {/* Price Field */}
            <Text className="text-base mb-2 font-semibold">Price</Text>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter product price (e.g., 4.99)"
                  keyboardType="numeric"
                  className={`bg-gray-200 py-3 px-4 rounded-lg mb-2 text-base ${
                    errors.price ? "border border-red-500" : ""
                  }`}
                  returnKeyType="done"
                />
              )}
            />
            {errors.price && (
              <Text className="text-red-500 text-sm mb-3">
                {errors.price.message}
              </Text>
            )}
          </View>

          {/* Buttons */}
          <View className="flex-row justify-between mt-6 w-full max-w-md">
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="flex-1 py-4 rounded-lg mr-2 items-center bg-[#D97706]"
              // Disabled removed so user can always submit and see errors
            >
              <Text className="text-white text-base font-semibold">Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancel}
              className="flex-1 bg-black py-4 rounded-lg ml-2 items-center"
            >
              <Text className="text-white text-base font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
