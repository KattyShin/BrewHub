import "~/global.css";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "./schema/product"; 

// Firestore imports
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from '~/firebaseConfig';

export default function EditProduct() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get product ID from route params

  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
    },
    mode: "onBlur",
  });

  // Fetch existing product data and set it to the form
  useEffect(() => {
    if (!id) {
      Alert.alert("Error", "No product ID provided");
      router.push("/Menu/inventory");
      return;
    }

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          reset({
            name: data.name || "",
            description: data.description || "",
            category: data.category || "",
            price: data.price ? data.price.toString() : "",
          });
        } else {
          Alert.alert("Error", "Product not found");
          router.push("/Menu/inventory");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        Alert.alert("Error", "Failed to load product data");
        router.push("/Menu/inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, reset, router]);

  const onSubmit = async (data: ProductFormData) => {
    Alert.alert("Confirm", "Are you sure you want to update this product?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            if (!id) throw new Error("No product ID");

            const docRef = doc(db, "products", id as string);
            await updateDoc(docRef, {
              name: data.name,
              description: data.description,
              category: data.category,
              price: parseFloat(data.price),
              updatedAt: serverTimestamp(),
            });
            Alert.alert("Success", "Product updated successfully!");
            router.push("/Menu/inventory"); // Navigate back after update
          } catch (error) {
            console.error("Error updating product: ", error);
            Alert.alert("Error", "Failed to update product.");
          }
        },
      },
    ]);
  };

  const handleCancel = () => {
    router.push("/Menu/inventory");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#fef7ed]">
        <ActivityIndicator size="large" color="#D97706" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#fef7ed]"
    >
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
              Edit Product
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
            >
              <Text className="text-white text-base font-semibold">Update</Text>
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
