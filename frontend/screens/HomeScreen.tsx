import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Modal, ScrollView, Button } from 'react-native';
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
import * as Location from 'expo-location';
import { Linking } from 'react-native';
import 'react-native-get-random-values';
import { AntDesign } from '@expo/vector-icons';
import { AirbnbRating } from 'react-native-ratings';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'home'>;

const Tab = createBottomTabNavigator();

type Location = {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  photoUrl: string;
  establishmentPhotoUrl?: string ;
  rating?: number;
  userRatingsTotal?: number;
  website?: string;
};

const HomeScreen = () => {
  const [userName, setUserName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  const fetchUserData = async () => {
    try {
      const storedUserName = await AsyncStorage.getItem("username");
      setUserName(storedUserName ?? "");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão para acessar a localização negada');
        return;
      }
    }

    const location = await Location.getCurrentPositionAsync({});
    setUserLocation({
      name: 'Sua Localização',
      address: 'Localização atual',
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
      photoUrl: '',
    });
  };

  const fetchPlaceDetails = async (placeId: string) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${config.GOOGLE_API_KEY}`);
    const data = await response.json();
    
    if (data.result) {
      const placeDetails = {
        photoUrl: '',
        rating: data.result.rating || null,
        userRatingsTotal: data.result.user_ratings_total || 0,
        website: data.result.website || null,
      };
  
      if (data.result.photos && data.result.photos.length > 0) {
        const photoReference = data.result.photos[0].photo_reference;
        placeDetails.photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${config.GOOGLE_API_KEY}`;
      }
      
      return placeDetails;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.greeting}>{userName}, Qual seu próximo destino?</Text>
        <View style={styles.searchBar}>
          <GooglePlacesAutocomplete
            placeholder="Busque por estabelecimentos"
            query={{
              key: config.GOOGLE_API_KEY,
              language: 'pt-BR',
              components: 'country:br',
              types: 'establishment',
              location: `${userLocation?.coordinates.lat},${userLocation?.coordinates.lng}`,
              radius: 5000,
            }}
            fields="formatted_address,name,geometry,vicinity,place_id"
            onPress={async (data, details = null) => {
              console.log(details);
              if (details?.geometry?.location) {
                let establishmentPhotoUrl = '';
                let rating = null;
                let userRatingsTotal = 0;
                let website = null;
                
                if (details.place_id) {
                  const placeDetails = await fetchPlaceDetails(details.place_id);
                  if (placeDetails) {
                    establishmentPhotoUrl = placeDetails.photoUrl || '';
                    rating = placeDetails.rating;
                    userRatingsTotal = placeDetails.userRatingsTotal;
                    website = placeDetails.website;
                  }
                }

                setSelectedLocation({
                  name: details.name || data.description,
                  address: details.formatted_address || details.vicinity || 'Endereço não disponível',
                  coordinates: {
                    lat: details.geometry.location.lat,
                    lng: details.geometry.location.lng,
                  },
                  photoUrl: details.icon ?? '',
                  establishmentPhotoUrl,
                  rating,
                  userRatingsTotal,
                  website,
                });
              }
            }}
            onFail={(error) => console.log(error)}
            renderDescription={(row) => {
              const name = row.structured_formatting.main_text;
              const addressParts = row.structured_formatting.secondary_text.split(',');
              const cityState = addressParts.length > 1 ? `${addressParts[addressParts.length - 2]}, ${addressParts[addressParts.length - 1]}` : '';
              return `${name} - ${cityState}`;
            }}        
            fetchDetails={true}
            enablePoweredByContainer={false}
            requestUrl={{
              url:
                'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
              useOnPlatform: 'web',
            }}
          />
        </View>
      </View>

      {/* Mapa */}
      <MapView
        style={styles.map}
        region={{
          latitude: selectedLocation?.coordinates.lat || userLocation?.coordinates.lat ||  -22.9333,
          longitude: selectedLocation?.coordinates.lng || userLocation?.coordinates.lng || -42.8167,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coordinates.lat,
              longitude: userLocation.coordinates.lng,
            }}
            title="Sua localização"
            description="Você está aqui!"
          />
        )}

        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.coordinates.lat,
              longitude: selectedLocation.coordinates.lng,
            }}
            title={selectedLocation.name}
            description={selectedLocation.address}
          />
        )}
      </MapView>
      
      {selectedLocation && (
        <View style={styles.fieldDetails}>
          {selectedLocation.establishmentPhotoUrl && (
            <Image
              source={{ uri: selectedLocation.establishmentPhotoUrl }}
              style={{ width: '100%', height: 100, marginTop: 10, marginBottom: 10, borderRadius: 8 }}
            />
          )}

          <Text style={styles.fieldName}>
            {selectedLocation.name}
            <Text>  </Text>
            {selectedLocation.photoUrl && (
              <Image
                source={{ uri: selectedLocation.photoUrl }}
                style={{ width: 25, height: 30, objectFit: 'cover' }}
              />
            )}
          </Text>

          {selectedLocation.rating !== null && (
            <View style={styles.ratingContainer}>
              <AirbnbRating
                count={5}
                defaultRating={selectedLocation.rating}
                size={20}
                isDisabled
                showRating={false}
              />
            <Text style={styles.fieldRating}>
              {selectedLocation.rating} ({selectedLocation.userRatingsTotal} avaliações)
              {selectedLocation.website && (
              <Text style={styles.fieldWebsite}>
                <AntDesign name="link" size={16} color="blue" onPress={() => Linking.openURL(selectedLocation.website ?? '')} />
              </Text> )}
            </Text>
            </View>
          )}
          <Text style={styles.fieldAddress}>{selectedLocation.address}</Text>
          <Text style={styles.fieldCoordinates}>
            Lat: {selectedLocation.coordinates.lat}, Lng: {selectedLocation.coordinates.lng}
          </Text>
        </View>
      )}
    </View>
  );
};

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
    setIsModalVisible(true);
  };

  const handleConfirmLogout = () => {
    setIsModalVisible(false);
    Alert.alert("Você foi desconectado.");
    navigation.navigate('login');
  };

  const handleCancelLogout = () => {
    setIsModalVisible(false);
  };

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

  return (
    <View style={styles.containerSettings}>
      <Text style={styles.header}>Olá, {userName}</Text>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => setShowPersonalData(true)}
      >
        <Ionicons name="person-circle-outline" size={24} color="white" />
        <Text style={styles.menuText}>Dados pessoais</Text>
      </TouchableOpacity>

      <View style={styles.menuItem}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
        <Text style={styles.menuText}>Suporte</Text>
      </View>

      <View style={styles.menuItem}>
        <Ionicons name="help-circle-outline" size={24} color="white" />
        <Text style={styles.menuText}>Perguntas frequentes</Text>
      </View>

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
      onPress={() => setShowPrivacyPolicy(true)}
    >
      <Ionicons name="document-outline" size={20} color="white" />
      <Text style={styles.menuText}>Política de Privacidade</Text>
    </TouchableOpacity>

    {isExpanded && (
  <View>

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

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowPrivacyPolicy(false)}
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

<View style={styles.separator} />
      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text style={styles.menuText}>Sair</Text>
      </TouchableOpacity>

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

const EventsScreen = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      time: "12:30 - 14:00",
      category: "Inteligência Emocional",
      title: "Como fazer amigos e influenciar pessoas",
      location: "Sala 2",
      color: "#9c27b0",
    },
    {
      id: 2,
      time: "14:30 - 17:00",
      category: "Design",
      title: "O futuro do Design - Projetando a próxima geração",
      location: "Auditório 3",
      color: "#2196f3",
    },
    {
      id: 3,
      time: "14:30 - 17:00",
      category: "Marketing",
      title: "Pesquisa e Inovação",
      location: "Auditório 2",
      color: "#ff9800",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("Design");
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    time: "",
    category: "",
    title: "",
    location: "",
    color: "",
  });

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
      setModalVisible(false);
      setNewEvent({ time: "", category: "", title: "", location: "", color: "" });
    }
  };

  const filteredEvents = events.filter(
    (event) => event.category === selectedCategory
  );

  return (
    <View style={styles.containerEvents}>
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

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Adicionar Evento</Text>
      </TouchableOpacity>

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
        tabBarActiveTintColor: '#07284B',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,            
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Events" component={EventsScreen} options={{ headerShown: false }} />
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
    borderBottomColor: "#fff",
    marginHorizontal: 10,
    marginTop: 20,
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
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
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
    position: 'absolute',
    top:0,
    backgroundColor: '#001946',
    width: '100%',
    height: 130,
    paddingTop: 35,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    zIndex: 1000,
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
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  fieldImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 10,
  },
  fieldInfo: {
    marginLeft: 10,
  },
  fieldName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  fieldAddress: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  fieldCoordinates: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  reviewCount: {
    marginLeft: 5,
    fontSize: 12,
    color: '#888',
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
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    width: '100%'
  },
  textInput: {
    marginLeft: 0,
    marginRight: 0,
    height: 38,
    color: '#5d5d5d',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8
  },


  searchBar: {
    height: 500,

  },
  fieldRating: {
    fontSize: 14,
    color: 'gray',
    opacity: 0.5,
  },
  fieldReviews: {
    fontSize: 14,
    color: 'gray',
  },
  fieldWebsite: {
    fontSize: 14,
    color: 'gray',
  },
});

export default MainTabNavigator;
