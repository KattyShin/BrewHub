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
  StatusBar,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "./schema/product";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "~/firebaseConfig";
import { useAuthStore } from "./stores/authstore";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null); // Add this state
  const user = useAuthStore((state) => state.user);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      imagePath: "",
    },
    mode: "onBlur",
  });

  const currentImagePath = watch("imagePath"); // Watch the imagePath value

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) throw new Error("No product ID provided");

        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          Alert.alert("Error", "Product not found");
          router.push("/Menu/inventory");
          return;
        }

        const data = docSnap.data();
        reset({
          name: data.name || "",
          description: data.description || "",
          category: data.category || "",
          price: data.price?.toString() || "",
          imagePath: data.imagePath || "",
        });
        setImageUri(data.imagePath || null); // Set the initial image URI

      } catch (error) {
        console.warn("Could not fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const pickedUri = result.assets[0].uri;
      const fileName = pickedUri.split("/").pop();
      const folderName = "imagesStorage";
      const newDir = FileSystem.documentDirectory + folderName;

      const dirInfo = await FileSystem.getInfoAsync(newDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(newDir, { intermediates: true });
      }

      const newPath = `${newDir}/${fileName}`;
      await FileSystem.copyAsync({ from: pickedUri, to: newPath });
      setValue("imagePath", newPath);
      setImageUri(newPath); // Update the image URI state
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    Alert.alert("Confirm", "Are you sure you want to update this product?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {
          router.push("/Menu/inventory");
        }
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            if (!id) throw new Error("No product ID");

            await updateDoc(doc(db, "products", id as string), {
              name: data.name,
              description: data.description,
              category: data.category,
              price: parseFloat(data.price),
              imagePath: data.imagePath,
              updatedAt: serverTimestamp(),
              user: user?.uid ? doc(db, "users", user.uid) : null,
            });

            Alert.alert("Success", "Product updated successfully!");
            router.push("/Menu/inventory");
          } catch (error) {
            console.error("Update error:", error);
            Alert.alert("Error", "Failed to update product.");
          }
        },
      },
    ]);
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
            <StatusBar barStyle="light-content" backgroundColor="#D97706" />
      
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          flexGrow: 1,
          paddingBottom: 50,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => router.push("/Menu/inventory")}
          className="flex-row items-center mb-6"
        >
          <ChevronLeft size={20} color="#000" />
          <Text className="text-black text-base ml-2 font-semibold">Back</Text>
        </TouchableOpacity>

        <View className="flex-1 bg-white rounded-xl p-5 shadow-md w-full max-w-md mx-auto">
          <View className="flex-1">
            <Text className="text-xl font-bold py-5">Edit Product</Text>

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
                />
              )}
            />
            {errors.name && (
              <Text className="text-red-500 text-sm mb-3">
                {errors.name.message}
              </Text>
            )}

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
                  className={`bg-gray-200 py-3 px-4 rounded-lg mb-2 text-base ${
                    errors.description ? "border border-red-500" : ""
                  }`}
                />
              )}
            />
            {errors.description && (
              <Text className="text-red-500 text-sm mb-3">
                {errors.description.message}
              </Text>
            )}

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
                    className="bg-gray-200 py-2 px-4 text-base text-gray-600"
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

            <Text className="text-base mb-2 font-semibold">Price</Text>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter price (e.g., 4.99)"
                  keyboardType="numeric"
                  className={`bg-gray-200 py-3 px-4 rounded-lg mb-2 text-base ${
                    errors.price ? "border border-red-500" : ""
                  }`}
                />
              )}
            />
            {errors.price && (
              <Text className="text-red-500 text-sm mb-3">
                {errors.price.message}
              </Text>
            )}

            <TouchableOpacity
              onPress={pickImage}
              className="mt-4 py-3 px-4 rounded-lg bg-blue-600 items-center"
            >
              <Text className="text-white font-semibold">
                {currentImagePath ? "Change Image" : "Pick Image"}
              </Text>
            </TouchableOpacity>
            {errors.imagePath && (
              <Text className="text-red-500 text-sm mb-3">
                {errors.imagePath.message}
              </Text>
            )}

            {(imageUri || currentImagePath) && (
              <Image
                source={{ uri: imageUri || currentImagePath }}
                style={{
                  width: "100%",
                  height: 200,
                  marginTop: 10,
                  borderRadius: 10,
                  resizeMode: "contain",
                }}
              />
            )}
          </View>

          <View className="flex-row justify-between mt-6 mb-4">
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="flex-1 py-4 rounded-lg mr-2 items-center bg-[#D97706]"
            >
              <Text className="text-white text-base font-semibold">Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/Menu/inventory")}
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