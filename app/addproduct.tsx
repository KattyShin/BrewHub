import "~/global.css";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Link, useRouter } from "expo-router";
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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fef7ed" }}>
      {/* Back Button */}
    <TouchableOpacity
     
      onPress={() => router.push("/Menu/Inventory")}
    >
      <Text className="text-black text-base flex flex-row items-center" >
        <ChevronLeft /> Back
      </Text>
    </TouchableOpacity>

      {/* Form */}
      <View
        style={{
          marginHorizontal: 16,
          padding: 16,
          backgroundColor: "#fff",
          borderRadius: 8,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        {/* Name Field */}
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter product name"
          style={{
            backgroundColor: "#f3f3f3",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        />

        {/* Description Field */}
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter product description"
          style={{
            backgroundColor: "#f3f3f3",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        />

        {/* Category Field */}
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Category</Text>
        <View
          style={{
            backgroundColor: "#f3f3f3",
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Select a category" value="" />
            <Picker.Item label="Hot Coffee" value="hot" />
            <Picker.Item label="Iced Coffee" value="iced" />
          </Picker>
        </View>

        {/* Price Field */}
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Price</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="Enter product price"
          keyboardType="numeric"
          style={{
            backgroundColor: "#f3f3f3",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        />
      </View>

      {/* Buttons */}
      <View style={{ marginHorizontal: 16, marginTop: 16 }}>
        <TouchableOpacity
          onPress={handleAddProduct}
          style={{
            backgroundColor: "#D97706",
            padding: 16,
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
            Add
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancel}
          style={{
            backgroundColor: "#000",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
