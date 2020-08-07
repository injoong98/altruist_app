/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';

// SafeAreaView is the root element of the screen. This helps us to avoid drawing UI over the notches on physical devices.
import {SafeAreaView} from 'react-native';

import {Button, Divider, Layout, TopNavigation} from '@ui-kitten/components';
export const HomeScreen = ({navigation}) => {
    const navigateDetails = () => {
        navigation.navigate('Details');
    };
//TopNavigation is the header of our application.
//Layout includes the main content of the screen.
  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation title="Altruists Home" alignment="center" />
      <Divider />
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button onPress={navigateDetails}>OPEN DETAILS</Button>
      </Layout>
    </SafeAreaView>
  );
};

/*
notice the naviation argument passed to HomeScreen.
It comes from React Navigation when navigator is configured and can be used to perform navigation between screens.
Open details button it will perform navigation to the Details screen, so let's focus on its implementation.
*/
