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

        const inputRange = state.routes.map((_, i) => i);
        const opacity = Animated.interpolate(position, {
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0)),
        });

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems:'center',justifyContent:'center'}}
          >
            <Animated.Text style={{ opacity }}>
              {label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
class TopText extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    const{selected,index} =this.props
    return(
      <View {...this.props}>
        <Text style={[styles.tabtext,{backgroundColor: selected==index ?'#ffffff':'#c4c4c4',borderWidth:1}]}>
          {this.props.text}
        </Text>
      </View>
    )
  }
}
const TopTabBar = ({ navigation, state }) => (
    <TabBar
      selectedIndex={state.index}
      onSelect={index => {navigation.navigate(state.routeNames[index]);console.log(state.index)}}
      style={{borderWidth:1}}
      indicatorStyle={styles.indicatorStyle}
    >
    <Tab title={evaProps => <TopText {...evaProps} style={{borderWidth:1}} text='보낸 질문' selected={state.index} index ={0}/>}/>
    <Tab title={evaProps => <TopText {...evaProps} style={{borderWidth:1}} text='받은 질문' selected={state.index} index ={1}/>}/>
  </TabBar>
);

const TabNavigator = () => (
  // <Navigator tabBar={props => <TopTabBar {...props} />}>
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