import { StyleSheet } from 'react-native';
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
  
  export default styles;
  