import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image,ActivityIndicator, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      ToastAndroid.show('Email and password are required', ToastAndroid.SHORT);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        navigation.replace('Home');
      } else {
        ToastAndroid.show(data.error || 'Login failed', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Network error', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container} >
    <Image source={require('./../assets/log.png')} style={styles.image} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Login" onPress={handleLogin}   style={styles.btn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {  padding: 20 , backgroundColor:'white'  },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20, font:'bold m', marginTop:20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 },
  image:{ marginTop:10, text:'center' , marginTop:50},
  btn:{  marginTop:10, },
});
