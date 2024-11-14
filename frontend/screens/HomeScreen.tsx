import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config/env'

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
    </View>
  );
};

const MapScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map Screen</Text>
    </View>
  );
};

const SettingsScreen = () => {
  const [userName] = useState('Nome do Usuário');
  const [profileImage, setProfileImage] = useState(null);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  };

  const handleSaveChanges = () => {
    Alert.alert('Mudanças salvas', 'Seu perfil foi atualizado!');
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
              const response = await axios.delete(`${config.API_URL}/api/v1/users/${await AsyncStorage.getItem('userId')}`, {
                headers: {
                  'authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
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
          source={profileImage ? { uri: profileImage } : require('../assets/images/default-profile.png')}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <Text style={styles.userName}>{userName}</Text>

      <TextInput
        style={styles.input}
        value={userName}
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

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Map') {
            iconName = 'map-marker';
          } else if (route.name === 'Home') {
            iconName = 'map-o';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#07284B',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

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