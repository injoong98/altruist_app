/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {SafeAreaView} from 'react-native';
import { Divider,  Icon,  Layout,  Text,  TopNavigation,  TopNavigationAction,} from '@ui-kitten/components';
const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export const AltruistQuestionScreen = ({navigation}) => {
  const navigateBack = () => {
    navigation.goBack();
  };
  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );
  return (
    <>
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation     
        title="Altruists/Question"
        alignment="center"
        accessoryLeft={BackAction} />
      <Divider />
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category="h1">Question</Text>
      </Layout>
    </SafeAreaView>
    
    </> 
  );
};

/*
notice the naviation argument passed to HomeScreen.
It comes from React Navigation when navigator is configured and can be used to perform navigation between screens.
Open details button it will perform navigation to the Details screen, so let's focus on its implementation.
*/
