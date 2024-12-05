import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config/env'
import { RootStackParamList } from './types';
import styles from '../styles/loginScreenStyle';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'login'>;

interface LoginResponse {
  data: {
    id: number;
    token: string;
    username: string;
    profileImage: string;
  };
  token?: string;
  message?: string;
}

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const isValidEmail = (email: string): boolean => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${config.API_URL}/api/v1/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseJson: LoginResponse = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userId', String(responseJson.data.id));
        await AsyncStorage.setItem('userToken', responseJson.data.token);
        await AsyncStorage.setItem('profileImage', responseJson.data.profileImage ?? '');
        await AsyncStorage.setItem('username', responseJson.data.username);

        navigation.navigate('home');
      } else {
        console.log('Falha no login:', responseJson);
        Alert.alert('Falha no login', responseJson.message || 'Ocorreu um erro durante o login.');
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      Alert.alert(
        'Erro',
        'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('register');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/MAPSPOT.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>

      <TextInput
        style={styles.input}
        placeholder="Insira seu email"
        placeholderTextColor="#A6A6A6"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#A6A6A6"
        placeholder="Insira sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.registerText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
