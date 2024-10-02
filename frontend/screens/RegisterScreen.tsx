import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { StackNavigationProp } from '@react-navigation/stack';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'register'>;

const formatCPF = (text: string) => {
    return text.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
  };

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation<RegisterScreenNavigationProp>();


  const handleRegister = () => {
    console.log({
      name,
      cpf,
      address,
      number,
      city,
      state,
      zipCode,
      username,
      password,
    });
    // Navegar para a próxima tela após o registro
  };

  const handleLogin = () => {
    navigation.navigate('login');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/MAPSPOT.png')}
        style={styles.logo}
      />
      <Text style={styles.welcomeText}>Crie sua conta!</Text>

      <TextInput
        style={styles.input}
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
      />

       <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        value={cpf}
        style={styles.input}
        onChangeText={(text) => setCpf(formatCPF(text))}
        keyboardType="numeric"
        placeholder="CPF"
      />

      <TextInput
        style={styles.input}
        placeholder="CEP"
        value={zipCode}
        onChangeText={setZipCode}
      />


      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin}>
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
  logo: {
    width: 200,
    height: 150,
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
  loginText: {
    color: '#3B82F6',
    marginTop: 20,
  },
});

export default RegisterScreen;
