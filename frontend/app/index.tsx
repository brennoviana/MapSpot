import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './login';
import Register from './register';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="register" component={Register} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default App;