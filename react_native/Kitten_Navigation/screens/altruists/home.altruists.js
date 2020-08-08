/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View,SafeAreaView} from 'react-native';
import {Button, Divider, Layout, TopNavigation} from '@ui-kitten/components';
export const AltruistHomeScreen = ({navigation}) => {
   
  return (
    <>
    <SafeAreaView style={{flex: 1}}>
      
      <TopNavigation title="Altruists Home" alignment="center" />
      <Divider />
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button onPress={() => navigation.navigate("application")} >지   원</Button>
        <Divider />
        <Button onPress={() => navigation.navigate("search")}>조   회</Button>
        <Divider />
        <Button onPress={() => navigation.navigate("question")}>질   문</Button>
        <Divider />
        <Button onPress={() => navigation.navigate("answer")}>답   변</Button>
        <Divider />
        <Button onPress={() => navigation.navigate("review")}>리   뷰</Button>
      </Layout>
    </SafeAreaView>
    
    </> 
  );
};
