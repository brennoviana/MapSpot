import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { StackNavigationProp } from '@react-navigation/stack';
import axios, { AxiosError } from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { config } from '../config/env';
import { Ionicons } from '@expo/vector-icons'; 

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'register'>;

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>(''); 
  const [imageUri, setImageUri] = useState<string | null>(null); 
  const [showPassword, setShowPassword] = useState<boolean>(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false); 
  const [modalVisible, setModalVisible] = useState<boolean>(false); 
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false); 
  const navigation = useNavigation<RegisterScreenNavigationProp>();


  const formatCpf = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 11); 
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
  };

  const handleImageSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão necessária", "É necessário permitir o acesso à galeria para selecionar uma imagem.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });
    
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const validatePassword = (): boolean => {
    if (password.length < 8) {
      Alert.alert("Erro", "A senha deve ter pelo menos 8 caracteres.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não correspondem.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validatePassword()) return;

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('cpf', cpf);
      formData.append('username', username);
      formData.append('password', password);

      if (!isTermsAccepted) {
        Alert.alert('Erro', 'Você precisa aceitar os termos para se cadastrar.');
        return;
      }

      if (imageUri) {
        formData.append('profileImage', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);        
      }

      const response = await axios.post(`${config.API_URL}/api/v1/users`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Cadastro efetuado com sucesso', '', [
        { text: 'OK', onPress: () => navigation.navigate('login') },
      ]);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response) {
          Alert.alert('Erro', axiosError.response.data.message || 'Erro no servidor');
        } else if (axiosError.request) {
          Alert.alert('Sem resposta do servidor');
        } else {
          Alert.alert('Erro ao configurar a requisição');
        }
      } else {
        Alert.alert('Erro desconhecido');
      }
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('login')}>
        <Ionicons name="arrow-back" size={35} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Image source={require('../assets/images/MAPSPOT.png')} style={styles.logo} />
      </View>

      <Text style={styles.welcomeText}>Faça o seu cadastro</Text>

      <TouchableOpacity onPress={handleImageSelect} style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Image source={require('../assets/images/perfil.face.jpg')} style={styles.profileImage} />
            <Text style={styles.profileText}>Adicione foto</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Nome */}
      <Text style={styles.label}>Nome</Text>
      <TextInput
        placeholder="Insira o seu nome completo"
        placeholderTextColor="#A6A6A6"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>CPF</Text>
      <TextInput
        value={cpf}
        placeholder="Insira o seu CPF"
        placeholderTextColor="#A6A6A6"
        style={styles.input}
        onChangeText={(text) => setCpf(formatCpf(text))}
        keyboardType="numeric"
      />

      <Text style={styles.label}>E-Mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Insira o seu e-mail"
        placeholderTextColor="#A6A6A6"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="No mínimo 8 caracteres"
        placeholderTextColor="#A6A6A6"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
      />

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButtonRight}>
        <Text style={styles.toggleText}>{showPassword ? 'Ocultar senha' : 'Mostrar senha'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Confirmar Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirme a sua Senha"
        placeholderTextColor="#A6A6A6"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showConfirmPassword} 
      />

      {confirmPassword.length > 0 && password !== confirmPassword && (
      <Text
        style={{color: 'red', fontSize: 12,alignSelf: 'flex-start',textAlign: 'left',      paddingLeft: 15,}}
      >
        As senhas não conferem
      </Text>
    )}
      <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.toggleButtonRight}>
        <Text style={styles.toggleText}>{showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}</Text>
      </TouchableOpacity>

      <View style={styles.termsContainer}>
      <TouchableOpacity
        style={styles.termsCheckboxContainer}
        onPress={() => setIsTermsAccepted(!isTermsAccepted)}
      >
        <Ionicons
          name={isTermsAccepted ? 'checkbox' : 'square-outline'}
          size={30}
          color={isTermsAccepted ? '#07284B' : '#BDBDBD'} 
        />
      </TouchableOpacity>
      <Text style={styles.termsTextButton}>
        Aceitar essas permissões significa que você permite que este aplicativo use seus dados conforme especificado em Termo de Consentimento localizado abaixo:
      </Text>
    </View>

      <TouchableOpacity onPress={openModal} style={styles.termsButton}>
        <Text style={styles.termsText}>Leia o Termo de Consentimento aqui</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('login')}>
        <Text style={styles.loginText}>Já tem conta? Voltar ao login</Text>
      </TouchableOpacity>

      <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* ScrollView para tornar o conteúdo rolável */}
          <ScrollView style={styles.modalTextContainer}>
            <Text style={styles.modalText}>
              Termo de Consentimento para Tratamento e Armazenamento de Dados Pessoais
              {'\n\n'}
              Ao realizar o cadastro no MapSpot, você concorda com a coleta, tratamento e armazenamento de seus dados pessoais, conforme descrito abaixo, de acordo com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/18 - LGPD):
              {'\n\n'}
              1. Os dados fornecidos por você, como nome, e-mail, CPF, endereço e demais informações relevantes para o cadastro, serão coletados e tratados exclusivamente para fins de criação de conta, fornecimento de serviços, personalização da experiência do usuário e comunicação relacionada à sua utilização do MapSpot.
              {'\n\n'}
              2. Os dados pessoais serão armazenados de forma segura em nossos servidores, com acesso restrito e adotando medidas adequadas para garantir a sua proteção contra acessos não autorizados, vazamentos ou quaisquer outros incidentes de segurança.
              {'\n\n'}
              3. Você tem o direito de acessar, corrigir, atualizar, ou excluir seus dados pessoais a qualquer momento. Caso deseje exercer qualquer um desses direitos ou tenha dúvidas sobre o tratamento de seus dados, entre em contato conosco através do e-mail: mapspot.marica.suporte@gmail.com.
              {'\n\n'}
              4. Ao prosseguir com o cadastro, você declara estar ciente e de acordo com os termos deste consentimento, autorizando o tratamento dos seus dados pessoais conforme descrito acima. Caso não concorde, recomendamos que não prossiga com o preenchimento do cadastro.
              {'\n\n'}
              5. Reservamo-nos o direito de alterar este Termo de Consentimento a qualquer momento. Em caso de alterações significativas, você será notificado através do e-mail cadastrado.
            </Text>
          </ScrollView>

          <TouchableOpacity onPress={closeModal} style={styles.closeModalButton}>
            <Text style={styles.closeModalButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 100,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',

  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
  
  },
profileText: {
  color: '#2F5F98',
},

  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    marginTop: 20,
    color: '#2F5F98',
  },
  input: {
    height: 50,
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 30,
    paddingLeft: 10,
    borderRadius: 15,
  },
  label: {
    color: '#2F5F98',
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
    marginLeft: 25,
  },
  toggleButtonRight: {
    alignSelf: 'flex-end', 
    marginBottom: 10,      
  },
  toggleText: {
  color: '#2F5F98',
    fontSize: 14,
    marginRight: 30,
  },
  button: {
    backgroundColor: '#07284B',
    height: 64,
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 45,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginText: {
    color: '#3B82F6',
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    width: 250,
    height: 200,
    marginBottom: 20,
    marginTop: 0,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#07284B',
    alignItems: 'center',
    paddingVertical: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  termsCheckboxContainer: {
    marginRight: 10,
    marginLeft: 56,
  },
  termsCheckbox: {
    fontSize: 20,
    color: '#2F5F98',
    marginTop: 50,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  termsText: {
    color: '#3B82F6',
    fontSize: 14,
  },
  termsTextButton: {
    color: '#A6A6A6',
    fontSize: 12,
    marginRight: 58,
    marginTop: 40,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '82%',
    height: '60%',
    borderRadius: 10,
    padding: 20,
  },
  modalTextContainer: {
    maxHeight: 450,
  },
  modalText: {
    fontSize: 15,
    color: '#333',
    
    
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: '#07284B',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  termsButton: {
    marginBottom: 30,
    marginRight: 90,
  }, 

 });

export default RegisterScreen;
