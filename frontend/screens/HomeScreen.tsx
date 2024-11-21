import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config/env';

const Tab = createBottomTabNavigator();

// Tela Home
const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
    </View>
  );
};

// Tela Map
const MapScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map Screen</Text>
    </View>
  );
};

// Tela Settings
const SettingsScreen = () => {
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedUserName = await AsyncStorage.getItem('username');
      setUserName(storedUserName ?? '');

      const cachedProfileImagePath = await AsyncStorage.getItem('profileImage');
      if (cachedProfileImagePath) {
        const imageUrl = `${config.API_URL}/uploads/${cachedProfileImagePath}`;
        setProfileImage(imageUrl);
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      Alert.alert('Erro ao carregar dados do usuário', axiosError.message);
    }
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await AsyncStorage.setItem('profileImage', uri.split('/').pop() ?? '');
    }
  };

  const handleSaveChanges = async () => {
    try {
      await AsyncStorage.setItem('username', userName);
      Alert.alert('Mudanças salvas', 'Seu perfil foi atualizado!');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro ao salvar dados', error.message);
      } else {
        Alert.alert('Erro ao salvar dados', 'Ocorreu um erro desconhecido');
      }
    }
  };  

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              const userId = await AsyncStorage.getItem('userId');
              const userToken = await AsyncStorage.getItem('userToken');
              const response = await axios.delete(`${config.API_URL}/api/v1/users/${userId}`, {
                headers: {
                  'authorization': `Bearer ${userToken}`,
                  'Content-Type': 'application/json',
                },
              });
              Alert.alert('Conta excluída');
            } catch (error) {
              const axiosError = error as AxiosError<any>;
              Alert.alert('Erro ao excluir conta', axiosError.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePickImage}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../assets/images/perfil.face.jpg')}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <Text style={styles.userName}>{userName}</Text>

      <TextInput
        style={styles.input}
        value={userName}
        onChangeText={setUserName}
        placeholder="Nome"
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>Salvar Mudanças</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDeleteAccount}>
        <Text style={styles.deleteAccountText}>Excluir Conta</Text>
      </TouchableOpacity>
    </View>
  );
};

// Tela de Eventos
const EventsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Eventos</Text>
      {/* Aqui você pode adicionar a lista de eventos, informações ou qualquer outro conteúdo relevante */}
    </View>
  );
};

// Navegação Principal
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = 'home';  // Ícone de "home" como primeiro
          } else if (route.name === 'Map') {
            iconName = 'map-marker';  // Ícone de "mapa" como segundo
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          } else if (route.name === 'Events') {
            iconName = 'calendar';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#07284B',  // Cor para o ícone ativo
        tabBarInactiveTintColor: 'gray',   // Cor para o ícone inativo
        tabBarShowLabel: false,            // Não mostrar o rótulo ao lado do ícone
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Events" component={EventsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>

  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#07284B',
    backgroundColor: '#e0e0e0',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#07284B',
    marginBottom: 15,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  saveButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#0f4c75',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteAccountText: {
    color: '#f00',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  text: {
    fontSize: 24,
  },
});

export default MainTabNavigator;
