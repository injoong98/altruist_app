/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {SafeAreaView} from 'react-native';
import {  TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Divider,  Icon,  Layout,  Text,  TopNavigation,  TopNavigationAction,} from '@ui-kitten/components';
const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
export const AltruistSearchScreen = ({navigation}) => {
  const navigateBack = () => {
    navigation.goBack();
  };
  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );
  const getDataUsingSimpleGetCall = () => {
    axios
      .get('https://jsonplaceholder.typicode.com/posts/1')
      .then(function(response) {
        // handle success
        alert(JSON.stringify(response.data));
      })
      .catch(function(error) {
        // handle error
        alert(error.message);
      })
      .finally(function() {
        // always executed
        alert('Finally called');
      });
  };
  return (
    <>
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation     
        title="Altruists/Search"
        alignment="center"
        accessoryLeft={BackAction} />
      <Divider />
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category="h1">Search</Text>
      <TouchableOpacity
       
        onPress={getDataUsingSimpleGetCall}>
        <Text>Simple Get Call</Text>
      </TouchableOpacity>
      </Layout>
    </SafeAreaView>
    
    </> 
  );
};

