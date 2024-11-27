import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, FlatList, Modal, ScrollView, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Foundation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config/env';
import MapView, { Marker } from "react-native-maps";
import { RootStackParamList } from './types';
import { StackNavigationProp } from '@react-navigation/stack';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'home'>;



const Tab = createBottomTabNavigator();

// Tela Home
const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([
    // Lista inicial de resultados fictícios, removível quando a integração estiver pronta
    { id: 1, name: 'Av. Roberto Silveira, 437 - Maricá, 14', distance: '500m', rating: 5 },
    { id: 2, name: 'Av. Roberto Silveira, 487 -  Maricá', distance: '800m', rating: 4 },
  ]);

  // Função de busca futura, para conectar com a API ou backend
 // const handleSearch = (query) => {
    //setSearch(query);
     //Aqui, no futuro, você pode fazer a requisição para buscar os resultados
  //};

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <Text style={styles.greeting}>{"{Usuário}, Qual seu próximo destino?"}</Text>
        <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' contém informações completas do lugar
          console.log(data, details);
        }}
        query={{
          key: "AIzaSyBOHnUBuNpRoyT2tcA2DC8isX4IKtIyQ2w",
          language: 'pt-BR',
          types: '(cities)',
        }} onFail={(error) => console.log('Erro:', error)}
        fetchDetails={false} // Obtém detalhes do lugar selecionado
        styles={{
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
        }}
      />
      </View>

      {/* Caixa de resultados */}
      {search !== '' && (
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultText}>{item.name}</Text>
              <Text style={styles.resultDistance}>{item.distance}</Text>
              <Text style={styles.resultRating}>{item.rating} estrelas</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      {/* Mapa */}
      <MapView
        style={styles.map}
        region={{
          latitude: -22.9333,
          longitude: -42.8167,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: -23.5505,
            longitude: -46.6333,
          }}
          title="Sua localização"
          description="Você está aqui!"
        />
      </MapView>

      {/* Detalhes do campo selecionado */}
      <View style={styles.fieldDetails}>
        <Image
          source={{ uri: 'https://via.placeholder.com/60' }} // Imagem de exemplo, trocar na futura integração
          style={styles.fieldImage}
        />
        <View style={styles.fieldInfo}>
          <Text style={styles.fieldName}>Endereço 1 - Rua Prefeito Joaquim Mendes, 79</Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <Icon key={index} name="star" size={16} color="#FFD700" />
            ))}
            <Text style={styles.reviewCount}>(123 avaliações)</Text> {/* Número fictício */}
          </View>
        </View>
      </View>
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

  const navigation = useNavigation<HomeScreenNavigationProp>();


  const handleLogout = () => {
    setIsModalVisible(true);  // Exibe o modal de confirmação ao sair
  };

  const handleConfirmLogout = () => {
    // Lógica de logout, pode ser limpar os dados de login e redirecionar
    setIsModalVisible(false); // Fecha o modal
    Alert.alert("Você foi desconectado.");
    navigation.navigate('login');
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
  // Lista inicial de eventos
  const [events, setEvents] = useState([
    {
      id: 1,
      time: "12:30 - 14:00",
      category: "Inteligência Emocional",
      title: "Como fazer amigos e influenciar pessoas",
      location: "Sala 2",
      color: "#9c27b0", // Roxo
    },
    {
      id: 2,
      time: "14:30 - 17:00",
      category: "Design",
      title: "O futuro do Design - Projetando a próxima geração",
      location: "Auditório 3",
      color: "#2196f3", // Azul
    },
    {
      id: 3,
      time: "14:30 - 17:00",
      category: "Marketing",
      title: "Pesquisa e Inovação",
      location: "Auditório 2",
      color: "#ff9800", // Laranja
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("Design"); // Categoria ativa
  const [modalVisible, setModalVisible] = useState(false); // Controle do modal de cadastro
  const [newEvent, setNewEvent] = useState({
    time: "",
    category: "",
    title: "",
    location: "",
    color: "",
  });

  // Função para adicionar um evento
  const addEvent = () => {
    if (
      newEvent.time &&
      newEvent.category &&
      newEvent.title &&
      newEvent.location &&
      newEvent.color
    ) {
      setEvents([
        ...events,
        { ...newEvent, id: events.length + 1 },
      ]);
      setModalVisible(false); // Fechar o modal
      setNewEvent({ time: "", category: "", title: "", location: "", color: "" }); // Resetar formulário
    }
  };

  // Filtro de eventos pela categoria selecionada
  const filteredEvents = events.filter(
    (event) => event.category === selectedCategory
  );

  return (
    <View style={styles.containerEvents}>
      {/* Header com categorias */}
      <View style={styles.headerEvents}>
        {["Tecnologia", "Design", "Marketing"].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.tab,
                selectedCategory === category && styles.activeTab,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão para adicionar evento */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Adicionar Evento</Text>
      </TouchableOpacity>

      {/* Lista de eventos */}
      <ScrollView>
        {filteredEvents.map((event) => (
          <View
            key={event.id}
            style={[styles.eventCard, { borderLeftColor: event.color }]}
          >
            <Text style={styles.eventTime}>{event.time}</Text>
            <View style={styles.eventDetails}>
              <Text
                style={[
                  styles.categoryLabel,
                  { backgroundColor: event.color },
                ]}
              >
                {event.category}
              </Text>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventLocation}>📍 {event.location}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal para cadastro de eventos */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitleEvent}>Cadastrar Novo Evento</Text>
          <TextInput
            placeholder="Horário (ex: 12:30 - 14:00)"
            style={styles.inputEvent}
            value={newEvent.time}
            onChangeText={(text) => setNewEvent({ ...newEvent, time: text })}
          />
          <TextInput
            placeholder="Categoria (ex: Design)"
            style={styles.inputEvent}
            value={newEvent.category}
            onChangeText={(text) =>
              setNewEvent({ ...newEvent, category: text })
            }
          />
          <TextInput
            placeholder="Título"
            style={styles.inputEvent}
            value={newEvent.title}
            onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
          />
          <TextInput
            placeholder="Localização"
            style={styles.inputEvent}
            value={newEvent.location}
            onChangeText={(text) =>
              setNewEvent({ ...newEvent, location: text })
            }
          />
          <Button title="Salvar" onPress={addEvent} />
          <Button
            title="Cancelar"
            onPress={() => setModalVisible(false)}
            color="red"
          />
        </View>
      </Modal>
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
    justifyContent: "center",},

  searchContainer: {
    backgroundColor: '#001946',
    width: '100%',
    paddingTop: 35,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },

  resultText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    marginTop: 10,
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  resultsContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 10,
    position: 'absolute',
    top: 130,
    width: '90%',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  resultsTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    margin:0,
  },

  fieldDetails: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  fieldImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  fieldInfo: {
    flex: 1,
  },
  fieldName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  reviewCount: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  resultDistance: {
    fontSize: 14,
    color: '#666',
  },
  resultRating: {
    fontSize: 14,
    color: '#666',
  },
  containerEvents: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerEvents: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    fontSize: 16,
    color: "#777",
  },
  activeTab: {
    color: '#07284B',
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: '#07284B',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  eventCard: {
    flexDirection: "row",
    margin: 10,
    padding: 10,
    borderLeftWidth: 5,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginRight: 10,
  },
  eventDetails: {
    flex: 1,
  },
  categoryLabel: {
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  eventLocation: {
    fontSize: 14,
    color: "#777",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  modalTitleEvent: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputEvent: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },

  textInputContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textInput: {
    height: 40,
    fontSize: 16,
  },
});





export default MainTabNavigator;
