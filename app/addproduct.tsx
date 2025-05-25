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
  Alert // Added Alert import
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

export default function AddProduct() {
  const [name, setName] = useState("");
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const handleAddProduct = () => {
    // Handle adding the product
    console.log({ name, description, category, price });
  };

  const handleCancel = () => {
    // Handle cancel action
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
  };

  const showConfirmation = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to add this product?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => {
            handleAddProduct();
            Alert.alert("Success", "Product added successfully!");
          }
        }
      ]
    );
  };

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

        <View className="flex h-full justify-between mt-10 bg-white rounded-xl p-5  h-full shadow-md w-full max-w-md mx-auto">
          <View>
            <Text className="flex justify text-xl font-bold py-5">Add Product</Text>
            {/* Name Field */}
            <Text className="text-base mb-2 font-semibold">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter product name"
              className="bg-gray-200 py-3 px-4 rounded-lg mb-5 text-base"
              returnKeyType="next"
            />

            {/* Description Field */}
            <Text className="text-base mb-2 font-semibold">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter product description"
              multiline
              numberOfLines={3}
              className="bg-gray-200 py-3 px-4 rounded-lg mb-5 text-base text-top"
              returnKeyType="next"
            />

            {/* Category Field */}
            <Text className="text-base mb-2 font-semibold">Category</Text>
            <View className="bg-gray-200 rounded-lg mb-5 overflow-hidden">
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={{ height: 50 }}
              >
                <Picker.Item label="Select a category" value="" />
                <Picker.Item label="Hot Coffee" value="hot" />
                <Picker.Item label="Iced Coffee" value="iced" />
              </Picker>
            </View>

            {/* Price Field */}
            <Text className="text-base mb-2 font-semibold">Price</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="Enter product price"
              keyboardType="numeric"
              className="bg-gray-200 py-3 px-4 rounded-lg mb-2 text-base"
              returnKeyType="done"
            />
          </View>

          {/* Buttons */}
          <View className="flex-row justify-between mt-6 w-full max-w-md">
            <TouchableOpacity
              onPress={showConfirmation}
              className="flex-1 bg-[#D97706] py-4 rounded-lg mr-2 items-center"
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