import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Modal, ScrollView, Button } from 'react-native';
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
import styles from '../styles/homeScreenStyle';
import DateTimePicker from "react-native-modal-datetime-picker";

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
          textInputProps={{
            placeholderTextColor: '#000000',
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

type Event = {
  id: number;
  date: string;
  title: string;
  location: string;
  category: string;
  description: string;
};

const EventsScreen = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Design");
  const [modalVisible, setModalVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    date: "",
    title: "",
    location: "",
    category: "",
    description: "",
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const fetchEvents = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");

      const response = await fetch(`${config.API_URL_LOCATION}/api/v1/event`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const eventsData: Event[] = (result.data || []).map((event: Event) => {
          const date = new Date(event.date);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
      
          return {
            ...event,
            date: `${day}/${month}/${year}`,
          };
        });        setEvents(eventsData);
      } else {
        setEvents([]);
        console.error("Failed to fetch events", await response.text());
      }
    } catch (error) {
      setEvents([]);
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    setNewEvent({ ...newEvent, date: formattedDate });
    hideDatePicker();
  };

  const addEvent = async () => {
    if (newEvent.date && newEvent.title && newEvent.location) {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        const formattedDate = `${newEvent.date.split('/')[2]}-${newEvent.date.split('/')[1]}-${newEvent.date.split('/')[0]}`;
        console.log(newEvent);

        const response = await fetch(`${config.API_URL_LOCATION}/api/v1/event`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            date: formattedDate,
            title: newEvent.title,
            location: newEvent.location,
            category: newEvent.category,
            description: newEvent.description
          }),
        });

        console.log(response)

        if (response.ok) {
          const createdEvent: Event = await response.json();
          setEvents([...events, createdEvent]);
          setModalVisible(false);
          setNewEvent({
            date: "",
            title: "",
            location: "",
            category: "",
            description: "",
          });
          fetchEvents();
        } else {
          console.error("Failed to add event", await response.text());
        }
      } catch (error) {
        console.error("Error adding event:", error);
      }
    } else {
      alert("Por favor, preencha todos os campos!");
    }
  };

  return (
    <View style={styles.containerEvents}>
      <View style={styles.headerEvents}>
        {["Tecnologia", "Design", "Marketing"].map((category, index) => (
          <TouchableOpacity
            key={index}
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
  {events.filter((event) => event.category === selectedCategory).length > 0 ? (
    events
      .filter((event) => event.category === selectedCategory)
      .map((event) => (
        <View key={event.id} style={styles.eventCard}>
          <Text style={styles.eventTitle}>{event.title}</Text><Text style={styles.eventDate}>{event.date}</Text>
          <Text style={styles.eventLocation}>
          📍{event.location.split(',')[0]}{'\n'}{event.location.split(',')[1]}
          </Text>        
        </View>
      ))
  ) : (
    <Text style={styles.noEventText}>Nenhum evento encontrado nesta categoria.</Text>
  )}
</ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitleEvent}>Cadastrar Novo Evento</Text>
          <TouchableOpacity onPress={showDatePicker} style={styles.inputEvent2}>
            <Text>{newEvent.date || "Selecione a Data"}</Text>
          </TouchableOpacity>

          <DateTimePicker
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <TextInput
            placeholder="Título"
            style={styles.inputEvent2}
            value={newEvent.title}
            placeholderTextColor='#000000'
            onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
          />
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
                onFail={(error) => console.log(error)}
                renderDescription={(row) => {
                  const name = row.structured_formatting.main_text;
                  const addressParts = row.structured_formatting.secondary_text.split(',');
                  const cityState =
                    addressParts.length > 1
                      ? `${addressParts[addressParts.length - 2]}, ${addressParts[addressParts.length - 1]}`
                      : '';
                  return `${name} - ${cityState}`;
                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
                onPress={(data, details = null) => {
                  const formattedAddress = details?.formatted_address || '';
                  setNewEvent({ ...newEvent, location: formattedAddress });
                }}
                styles={{
                  textInput: {
                    ...styles.inputEvent2,
                    color: '#000000',
                    marginBottom: 5,
                  },
                  listView: {
                    maxHeight: 150,
                    marginBottom: 5,
                  },
                  container: {
                    flex: 0,
                    marginBottom: 5,
                  },
                }}
                textInputProps={{
                  placeholderTextColor: '#000000',
                }}
              />

          <TextInput 
            style={styles.inputEvent2}
            placeholder='Categoria'
            placeholderTextColor='#000000'
            value={newEvent.category}
            onChangeText={(text) => 
              setNewEvent({ ...newEvent, category: text })}
          />


          <TextInput 
            style={styles.inputEvent2}
            placeholder='Descrição'
            placeholderTextColor='#000000'
            value={newEvent.description}
            onChangeText={(text) => 
            setNewEvent({ ...newEvent, description: text })}
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

export default MainTabNavigator;
