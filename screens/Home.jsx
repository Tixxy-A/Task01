import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    const storedProducts = await AsyncStorage.getItem('products');
    setProducts(JSON.parse(storedProducts) || []);
  };

  const handleDelete = async (productName) => {
    const updatedProducts = products.filter(p => p.name !== productName);
    setProducts(updatedProducts);
    await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.divv}>
      <Button title="Logout" onPress={handleLogout} />
      <TextInput
        placeholder="Search products..."
        style={styles.input}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      </View>
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.product}>
              <Text>{item.name} - ${item.price}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.name)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>No Products Found </Text>
      )}
      <TouchableOpacity
      style={styles.addButton}
        onPress={() => navigation.replace('AddProduct')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 },
  product: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  delete: { color: 'red' },
  addButton: { position: 'absolute', bottom: 20, backgroundColor:'blue' , right: 20, borderRadius: 50, padding: 20 },
  addButtonText: { color: 'white', fontSize: 24 },
});