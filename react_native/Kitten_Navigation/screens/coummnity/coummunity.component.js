/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {SafeAreaView} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,Button
} from '@ui-kitten/components';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export const CoummunityScreens = ({navigation}) => {
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );
//   accessoryLeft={BackAction}
  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title="커뮤니티"
        alignment="center"
     
      />
      <Divider />
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text category="h1">Coummunity Tab</Text>
        <Button onPress ={() => navigation.navigate("search")}>search navigaate</Button>
        <Button onPress ={() => navigation.push("search")}>search push</Button>
      </Layout>
    </SafeAreaView>
  );
};


/*
The code above demonstrates the same structure as a Home screen, but with a few changes:

TopNavigationAction is used to render a back arrow.
navigateBack function is called when TopNavigationAction is pressed and navigates back to the Home screen.
That's it! All we need to do is to connect Home and Details screens using React Navigation.

*/