import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { StackNavigationProp } from '@react-navigation/stack';
import axios, { AxiosError } from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { config } from '../config/env';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'register'>;

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [imageUri, setImageUri] = useState<string | null>(null); // State to store image URI
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleImageSelect = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão necessária", "É necessário permitir o acesso à galeria para selecionar uma imagem.");
      return;
    }

    // Open the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',  // Usando 'images' em letras minúsculas
      allowsEditing: true,
      quality: 1,
    });
    
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('cpf', cpf);
      formData.append('zipCode', zipCode);
      formData.append('username', username);
      formData.append('password', password);

      if (imageUri) {
        formData.append('profileImage', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);        
      }

      const response = await axios.post(`${config.API_URL}/api/v1/users`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Cadastro efetuado com sucesso', '', [
        { text: 'OK', onPress: () => navigation.navigate('login') },
      ]);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response) {
          Alert.alert('Erro', axiosError.response.data.message || 'Erro no servidor');
        } else if (axiosError.request) {
          Alert.alert('Sem resposta do servidor');
        } else {
          Alert.alert('Erro ao configurar a requisição');
        }
      } else {
        Alert.alert('Erro desconhecido');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImageSelect} style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>Selecionar Imagem</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.welcomeText}>Crie sua conta!</Text>

      <TextInput
        style={styles.input}
        placeholder="E-Mail"
        placeholderTextColor="#000000"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Nome de usuário"
        placeholderTextColor="#000000"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#000000"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        value={cpf}
        placeholder="CPF"
        placeholderTextColor="#000000"
        style={styles.input}
        onChangeText={(text) => setCpf(text)}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="CEP"
        placeholderTextColor="#000000"
        style={styles.input}
        value={zipCode}
        onChangeText={setZipCode}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('login')}>
        <Text style={styles.loginText}>Já tem conta? Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 25,
  },
  button: {
    backgroundColor: '#07284B',
    height: 64,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 42,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginText: {
    color: '#3B82F6',
    marginTop: 20,
  },
});

export default RegisterScreen;
