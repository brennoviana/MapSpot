import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { StackNavigationProp } from '@react-navigation/stack';
import axios, { AxiosError } from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { config } from '../config/env';
import { Ionicons } from '@expo/vector-icons'; 

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'register'>;

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>(''); 
  const [imageUri, setImageUri] = useState<string | null>(null); 
  const [showPassword, setShowPassword] = useState<boolean>(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false); 
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const formatCpf = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 11); 
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
  };

  const handleImageSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão necessária", "É necessário permitir o acesso à galeria para selecionar uma imagem.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });
    
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const validatePassword = (): boolean => {
    if (password.length < 8) {
      Alert.alert("Erro", "A senha deve ter pelo menos 8 caracteres.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não correspondem.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validatePassword()) return;

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('cpf', cpf);
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
    <ScrollView contentContainerStyle={styles.container}>
  {/* Botão de seta para voltar ao login */}
  <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('login')}>
    <Ionicons name="arrow-back" size={35} color="#fff" />
  </TouchableOpacity>

  {/* Contêiner azul arredondado */}
  <View style={styles.headerContainer}>
    <Image source={require('../assets/images/MAPSPOT.png')} style={styles.logo} />
  </View>

  <Text style={styles.welcomeText}>Faça o seu cadastro</Text>

      <TouchableOpacity onPress={handleImageSelect} style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>Add Imagem</Text>
          </View>
        )}
      </TouchableOpacity>

  
      {/* Nome */}
      <Text style={styles.label}>Nome</Text>
      <TextInput
        placeholder="Insira o seu nome completo"
        placeholderTextColor="#A6A6A6"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />


      {/* CPF */}
      <Text style={styles.label}>CPF</Text>
      <TextInput
        value={cpf}
        placeholder="Insira o seu CPF"
        placeholderTextColor="#A6A6A6"
        style={styles.input}
        onChangeText={(text) => setCpf(formatCpf(text))}
        keyboardType="numeric"
      />

      {/* E-Mail */}
      <Text style={styles.label}>E-Mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Insira o seu e-mail"
        placeholderTextColor="#A6A6A6"
        value={email}
        onChangeText={setEmail}
      />


      {/* Senha */}
      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="No mínimo 8 caracteres"
        placeholderTextColor="#A6A6A6"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword} // Controla se a senha é visível ou não
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButtonRight}>
        <Text style={styles.toggleText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
      </TouchableOpacity>

      {/* Confirmar Senha */}
      <Text style={styles.label}>Confirmar Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirme a sua Senha"
        placeholderTextColor="#A6A6A6"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showConfirmPassword} // Controla se a confirmação da senha é visível ou não
      />
      <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.toggleButtonRight}>
        <Text style={styles.toggleText}>{showConfirmPassword ? 'Ocultar' : 'Mostrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('login')}>
        <Text style={styles.loginText}>Já tem conta? Voltar ao login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 100,
    left: 20,
    padding: 10,
    zIndex: 10, 

  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
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
    marginBottom: 40,
    marginTop: 20,
    color: '#2F5F98',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 15,
  },
  label: {
    color: '#2F5F98',
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  toggleButtonRight: {
    alignSelf: 'flex-end',  
    marginBottom: 10,       
  },
  toggleText: {
    color: '#3B82F6',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#07284B',
    height: 64,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 102,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginText: {
    color: '#3B82F6',
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    width: 250,
    height: 200,
    marginBottom: 30,
    marginTop: 2,
  },

  headerContainer: {
  width: '100%',
  height: 300,
  backgroundColor: '#07284B',
  alignItems: 'center',
  paddingVertical: 40,
  borderBottomLeftRadius: 25,
  borderBottomRightRadius: 25, 
},

inputContainer: {
  padding: 0,
}


});

export default RegisterScreen;
