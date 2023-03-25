/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {LogBox} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import Login from './screens/login';
import Register from './screens/register';
import splash from './screens/splash';
import Tabs from './navigation/tabs';
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: 'transparent',
  },
};

const Stack = createStackNavigator();

const forFade = ({current, closing}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

LogBox.ignoreAllLogs();

const App = () => {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={'Splash'}>
        <Stack.Screen
          name="Splash"
          component={splash}
          options={{cardStyleInterpolator: forFade}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{cardStyleInterpolator: forFade}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{cardStyleInterpolator: forFade}}
        />
        {/* Tabs */}
        <Stack.Screen
          name="Home"
          component={Tabs}
          options={{cardStyleInterpolator: forFade}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
