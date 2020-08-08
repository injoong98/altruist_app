/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {SafeAreaView} from 'react-native';
import { Divider,  Icon,  Layout,  Text,  TopNavigation,  TopNavigationAction,} from '@ui-kitten/components';
const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export const AltruistAnswerScreen = ({navigation}) => {
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
        title="Altruists/Answer"
        alignment="center"
        accessoryLeft={BackAction} />
      <Divider />
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category="h1">Answer</Text>
      </Layout>
    </SafeAreaView>
    
    </> 
  );
};
