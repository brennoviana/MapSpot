import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  login: undefined;
  register: undefined;
  home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'login'>;

interface LoginResponse {
  data: {
    id: number;
    token: string;
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
      const response = await fetch(`${process.env.API_URL}/api/v1/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseJson: LoginResponse = await response.json();

      if (response.ok) {
        console.log('Login bem-sucedido:', responseJson);
        await AsyncStorage.setItem('userId', String(responseJson.data.id));
        await AsyncStorage.setItem('userToken', responseJson.data.token);

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
        placeholderTextColor="#000000"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#000000"
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

      <Text style={styles.socialText}>Entrar com</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="google" size={30} color="#DB4437" style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="facebook" size={30} color="#4267B2" style={styles.socialIcon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.registerText}>Não tem conta? Cadastre-se</Text>
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
  logo: {
    width: 250,
    height: 200,
    marginBottom: 20,
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
    backgroundColor: '#fff',
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    backgroundColor: '#07284B',
    height: 64,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 42,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#3B82F6',
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    height: 50,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  socialText: {
    color: '#A6A6A6',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 80,
    marginBottom: 12,
  },
  socialIcon: {
    marginRight: 10,
  },
  registerText: {
    color: '#3B82F6',
    marginTop: 20,
  },
});

export default LoginScreen;
