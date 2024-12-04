import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 250,
    height: 200,
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
    borderRadius: 15,
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
    fontSize: 19,
  },
  forgotPassword: {
    color: '#3B82F6',
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    height: 50,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  socialText: {
    color: '#A6A6A6',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 80,
    marginBottom: 12,
  },
  socialIcon: {
    marginRight: 10,
  },
  registerText: {
    color: '#3B82F6',
    marginTop: 20,
  },
});

export default styles;