import React from 'react';
import {StyleSheet,SafeAreaView,View,TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Layout, Text,TopNavigation,Button } from '@ui-kitten/components';

import {TopBarTune} from '../../../components/TopBarTune'
import {TopTab} from '../../../components/TopTab'
import {WriteContentToptab} from '../../../components/WriteContentTopBar'
import {AltQueList} from './Question'
import Animated from 'react-native-reanimated';
const { Navigator, Screen } = createMaterialTopTabNavigator();
const AltQueListSend = (props) => (
            <SafeAreaView style={{flex:1}}>
               <AltQueList {...props} type='indi' scndType='send'/>
            </SafeAreaView>
)
const AltQueListRecieve = (props) => (
            <SafeAreaView style={{flex:1}}>
               <AltQueList {...props} type='indi' scndType='recieve'/>
            </SafeAreaView>
)

function MyTabBar({ state, descriptors, navigation, position }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems:'center',justifyContent:'center',backgroundColor:isFocused ? '#ffffff' : '#DEDEDE', borderTopLeftRadius:21,borderTopRightRadius:21,paddingVertical:8}}
          >
            <Text  category='h1' style={{fontSize:14,color :isFocused ? '#63579D' : '#6A6A6A',}}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


const TabNavigator = () => (
  <Navigator tabBar={props => <MyTabBar {...props} />}>
    <Screen name='Send' component={AltQueListSend} options={ {title:'보낸 질문'}}/>
    <Screen name='Recieve' component={AltQueListRecieve}  options={{title:'받은 질문'}}/>
  </Navigator>
);

export const AltQueToptab= ({navigation}) => (
  <SafeAreaView style={{flex:1}}>
    {/* <TopNavigation title ="Community" alignment ='center' style={{backgroundColor : '#B09BDE'}}/> */}
      <WriteContentToptab
          text='1대1 질문'
          gbckfunc={() => {
              this.props.navigation.goBack();
          }}
          gbckuse={true}
          style={{backgroundColor:'#f4f4f4'}}
      />
      <TabNavigator/>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  indicatorStyle:{
    height:0
  },
  tabtext:{
    fontSize:15
  }
})