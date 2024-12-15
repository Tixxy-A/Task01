import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; // Ensure `expo-image-picker` is installed

export default function AddProduct({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pick Image from Gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Product name is required.');
      return false;
    }
    if (!price.trim() || isNaN(price)) {
      Alert.alert('Validation Error', 'Valid price is required.');
      return false;
    }
    return true;
  };

  const handleAddProduct = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      const products = storedProducts ? JSON.parse(storedProducts) : [];

      // Check for duplicate product
      const isDuplicate = products.some((product) => product.name === name);
      if (isDuplicate) {
        Alert.alert('Error', 'Product already exists.');
        setLoading(false);
        return;
      }

      // Add the new product
      const newProduct = { name, price, image };
      const updatedProducts = [...products, newProduct];
      await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));

      Alert.alert('Success', 'Product added successfully!');
      navigation.replace("Home"); // Navigate back to the Home screen
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Product</Text>
      <TextInput
        placeholder="Product Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Price"
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Pick an Image</Text>
        )}
      </TouchableOpacity>
      <Button
        title={loading ? 'Adding Product...' : 'Add Product'}
        onPress={handleAddProduct}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 16,
  },
  imagePicker: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 5,
  },
  imagePickerText: { color: '#666' },
  image: { width: '100%', height: '100%', borderRadius: 5 },
});
