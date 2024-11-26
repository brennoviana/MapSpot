import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Foundation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as ImagePicker from "expo-image-picker";
import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "../config/env";
import { Ionicons } from "@expo/vector-icons";

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
  const [showPersonalData, setShowPersonalData] = useState(false); 
  const [isExpanded, setIsExpanded] = useState(false); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedUserName = await AsyncStorage.getItem("username");
      setUserName(storedUserName ?? "");
      const cachedProfileImagePath = await AsyncStorage.getItem("profileImage");
      if (cachedProfileImagePath) {
        const imageUrl = `${config.API_URL}/uploads/${cachedProfileImagePath}`;
        setProfileImage(imageUrl);
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      Alert.alert("Erro ao carregar dados do usuário", axiosError.message);
    }
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await AsyncStorage.setItem("profileImage", uri.split("/").pop() ?? "");
    }
  };

  const handleSaveChanges = async () => {
    try {
      await AsyncStorage.setItem("username", userName);
      Alert.alert("Mudanças salvas", "Seu perfil foi atualizado!");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Erro ao salvar dados", error.message);
      } else {
        Alert.alert("Erro ao salvar dados", "Ocorreu um erro desconhecido");
      }
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const userId = await AsyncStorage.getItem("userId");
              const userToken = await AsyncStorage.getItem("userToken");
              const response = await axios.delete(`${config.API_URL}/api/v1/users/${userId}`, {
                headers: {
                  authorization: `Bearer ${userToken}`,
                  "Content-Type": "application/json",
                },
              });
              Alert.alert("Conta excluída");
            } catch (error) {
              const axiosError = error as AxiosError<any>;
              Alert.alert("Erro ao excluir conta", axiosError.message);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    setIsModalVisible(true);  // Exibe o modal de confirmação ao sair
  };

  const handleConfirmLogout = () => {
    // Lógica de logout, pode ser limpar os dados de login e redirecionar
    setIsModalVisible(false); // Fecha o modal
    Alert.alert("Você foi desconectado.");
  };

  const handleCancelLogout = () => {
    setIsModalVisible(false); // Fecha o modal
  };

  // Se o usuário clicar em Dados Pessoais, mostrar as informações
  if (showPersonalData) {
    return (
      <View style={styles.containerSettings}>
        <Text style={styles.header}>Dados Pessoais</Text>
        <TouchableOpacity onPress={handlePickImage}>
          <Image
            source={profileImage ? { uri: profileImage } : require("../assets/images/perfil.face.jpg")}
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

        {/* Botão para voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowPersonalData(false)}
        >
          <Ionicons name="arrow-back-outline" size={20} color="white" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Tela Principal
  return (
    <View style={styles.containerSettings}>
      <Text style={styles.header}>Olá, {userName}</Text>

      {/* Botão para abrir Dados Pessoais */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => setShowPersonalData(true)}
      >
        <Ionicons name="person-circle-outline" size={24} color="white" />
        <Text style={styles.menuText}>Dados pessoais</Text>
      </TouchableOpacity>

      {/* Suporte */}
      <View style={styles.menuItem}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
        <Text style={styles.menuText}>Suporte</Text>
      </View>

      {/* Perguntas Frequentes */}
      <View style={styles.menuItem}>
        <Ionicons name="help-circle-outline" size={24} color="white" />
        <Text style={styles.menuText}>Perguntas frequentes</Text>
      </View>

      {/* Informações com Accordion */}
      <View>
  <TouchableOpacity
    style={styles.menuItem}
    onPress={() => setIsExpanded(!isExpanded)}
  >
    <Ionicons name="document-text-outline" size={24} color="white" />
    <Text style={styles.menuText}>Informações</Text>
    <Ionicons
      name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
      size={20}
      color="white"
    />
  </TouchableOpacity>

  {isExpanded && (
    <View>
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => setShowPrivacyPolicy(true)} // Mostra a política de privacidade ao clicar
    >
      <Ionicons name="document-outline" size={20} color="white" />
      <Text style={styles.menuText}>Política de Privacidade</Text>
    </TouchableOpacity>

    {isExpanded && (
  <View>

    {/* Exibição da Política de Privacidade */}
    {showPrivacyPolicy && (
      <View style={[styles.container, { backgroundColor: 'white', padding: 20 }]}>
        <Text style={[styles.policyText, { color: 'black' }]}>
          {"\n"}
          **Termo de consentimento**
          {"\n\n"}
          **POLÍTICA DE PRIVACIDADE DO MAPSPOT**
          {"\n\n"}
          Última atualização: [inserir data]
          {"\n\n"}
          A sua privacidade é importante para nós. Esta Política de Privacidade explica como o MapSpot coleta, usa, compartilha e protege as suas informações, bem como as escolhas disponíveis para você em relação a esses dados.
          {"\n\n"}
          Ao utilizar o MapSpot, você concorda com os termos descritos nesta Política de Privacidade.
          {"\n\n"}
          1. Informações que coletamos
          {"\n\n"}
          (Inclua o restante do texto aqui)
        </Text>

        {/* Botão para voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowPrivacyPolicy(false)} // Volta ao menu principal
        >
          <Ionicons name="arrow-back-outline" size={20} color="white" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
)}
  </View>
  )}
</View>

{/* Linha separadora acima do item "Sair" */}
<View style={styles.separator} />

      {/* Botão de Sair */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text style={styles.menuText}>Sair</Text>
      </TouchableOpacity>

      {/* Modal de Logout */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={handleCancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tem certeza que deseja sair?</Text>
            <Text style={styles.modalText}>Ao clicar em sair, será necessário fazer o login novamente</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancelLogout}>
                <Text style={styles.modalButtonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonConfirm]} onPress={handleConfirmLogout}>
                <Text style={styles.modalButtonText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
          let IconComponent = Icon;
        
          if (route.name === 'Home') {
            iconName = 'home';
            IconComponent = Icon2; 
          } else if (route.name === 'Map') {
            iconName = 'map-marker'; 
          } else if (route.name === 'Settings') {
            iconName = 'cog'; 
          } else if (route.name === 'Events') {
            iconName = 'calendar'; 
          }
        
          return <IconComponent name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#07284B',  // Cor para o ícone ativo
        tabBarInactiveTintColor: 'gray',   // Cor para o ícone inativo
        tabBarShowLabel: false,            
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomColor: "#fff",
  },
  menuText: {
    fontSize: 18,
    color: "white",
    flex: 1,
    marginLeft: 8,
  },
  subMenuItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingLeft: 40,
  },
  subMenuText: {
    fontSize: 16,
    color: "white",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",  // Cor da linha de separação
    marginHorizontal: 10,  // Espaçamento das bordas
    marginTop: 20,  // Adiciona um pequeno espaço acima
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    marginLeft: 100,
    borderWidth: 2,
    borderColor: '#07284B',
    backgroundColor: '#e0e0e0',
  },
  userName: {
    fontSize: 20,
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "white",
    borderBottomWidth: 1,
    marginBottom: 16,
    color: "white",
    paddingHorizontal: 8,
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
    color: "white",
    fontSize: 16,
  },
  deleteAccountText: {
    color: "#FF3B30",
    fontSize: 16,
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: {
    color: "white",
    marginLeft: 5,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
    marginVertical: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  informationItem: {
    borderBottomWidth: 1,  // Adiciona a linha apenas para o item Informações
    borderBottomColor: "#fff",  // Define a cor da linha
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#D1D1D6",
    borderRadius: 5,
  },
  modalButtonText: {
    fontSize: 16,
    color: "white",
  },
  modalButtonConfirm: {
    backgroundColor: "#FF3B30",
  },
  text: {
    fontSize: 24,
  },
  policyText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  containerSettings: {
    flex: 1,
    backgroundColor: '#07284B',
    paddingHorizontal: 16,
    justifyContent: "center",
  },
});




export default MainTabNavigator;
