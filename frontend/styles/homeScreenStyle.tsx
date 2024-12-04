import { StyleSheet } from 'react-native';

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
      paddingTop: 30,
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
    eventDate: {
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
  
  export default styles;
  