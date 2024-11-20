import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

// Dados mockados para os eventos, você pode substituir por dados da API
const mockEvents = [
  {
    id: '1',
    title: 'Festa de Aniversário',
    date: '2024-12-01',
    description: 'Venha comemorar o aniversário de João!',
  },
  {
    id: '2',
    title: 'Show de Rock',
    date: '2024-12-05',
    description: 'Prepare-se para uma noite de muito rock com as melhores bandas.',
  },
  {
    id: '3',
    title: 'Encontro de Tecnologia',
    date: '2024-12-10',
    description: 'Participe de workshops sobre inovação e tecnologia.',
  },
];

const EventsScreen = () => {
  const [events, setEvents] = useState([]);

  // Carregar eventos
  useEffect(() => {
    // Aqui você pode substituir pela sua chamada API real.
    setEvents(mockEvents); // Simulando a adição dos dados
  }, []);

  // Função chamada quando o evento é pressionado
  const handleEventPress = (event) => {
    Alert.alert('Detalhes do Evento', `Título: ${event.title}\nData: ${event.date}\nDescrição: ${event.description}`);
  };

  // Renderização de cada evento na lista
  const renderEvent = ({ item }) => (
    <TouchableOpacity style={styles.eventItem} onPress={() => handleEventPress(item)}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Eventos</Text>
      {/* Lista de eventos */}
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id.toString()} // Garantindo que a chave seja uma string
      />
    </View>
  );
};

// Estilos da tela de eventos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#07284B',
    marginBottom: 20,
  },
  eventItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07284B',
  },
  eventDate: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
});

export default EventsScreen;
