import "~/global.css";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "./schema/product";
import { useAuthStore } from "./stores/authstore";
import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "~/firebaseConfig";

export default function AddProduct() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const pickedUri = result.assets[0].uri;
      const fileName = pickedUri.split("/").pop();
      const folderName = "imagesStorage";
      const newDir = FileSystem.documentDirectory + folderName;

      // Ensure the directory exists
      const dirInfo = await FileSystem.getInfoAsync(newDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(newDir, { intermediates: true });
      }

      const newPath = `${newDir}/${fileName}`;
      await FileSystem.copyAsync({ from: pickedUri, to: newPath });
      setImage(newPath);
      setValue("imagePath", newPath);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    Alert.alert("Confirm", "Are you sure you want to add this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          try {
            await addDoc(collection(db, "products"), {
              name: data.name,
              description: data.description,
              category: data.category,
              price: parseFloat(data.price),
              imagePath: data.imagePath,
              createdAt: new Date().toISOString(),
              user: user?.uid ? doc(db, "users", user.uid) : null,
            });

            Alert.alert("Success", "Product added successfully!");
            reset();
            setImage(null);
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
    setImage(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#fef7ed]"
    >
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
            <Text className="text-xl font-bold py-5">Add Product</Text>

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

            <Controller
              control={control}
              name="imagePath"
              render={({ field }) => (
                <>
                  <TouchableOpacity
                    onPress={pickImage}
                    className="mt-4 py-3 px-4 rounded-lg bg-blue-600 items-center"
                  >
                    <Text className="text-white font-semibold">
                      {image ? "Change Image" : "Pick Image"}
                    </Text>
                  </TouchableOpacity>
                  {errors.imagePath && (
                    <Text className="text-red-500 text-sm mb-3">
                      {errors.imagePath.message}
                    </Text>
                  )}
                </>
              )}
            />

            {image && (
              <Image
                source={{ uri: image }}
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