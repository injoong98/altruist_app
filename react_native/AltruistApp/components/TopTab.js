import React from 'react';
import {View,StyleSheet,TouchableOpacity} from 'react-native';

import {Text} from '@ui-kitten/components';

export class TopTab extends React.Component{

    constructor(props){
        super(props)
    }
    render(){
        var {thisindex,selected,abovectgry,abovetext,belowctgry,belowtext} = this.props
        return(
        <View style={styles.tabcontainer}>
            <Text style={thisindex==selected ?styles.borderselected : styles.border} category={abovectgry}>{abovetext}</Text>
            {
                belowtext!=''&belowtext!=null?
            <Text style={thisindex==selected ?styles.borderselected : styles.border} category={belowctgry}>{belowtext}</Text>
              :null
             }
        </View>
        )
    }
}
export function MyTabBar({ state, descriptors, navigation, position }) {
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
const styles = StyleSheet.create({
    tabcontainer:{
        paddingBottom:18,
        paddingTop:16,
    },
    border :{
        lineHeight:20,
        color:"#B09BDE",
        textAlignVertical:'bottom',
        padding:0,
        // borderWidth:1,
        // borderStyle:'solid',
        // borderColor:'blue',
    },
    borderselected :{
        lineHeight:20,
        color:"#35367B",
        textAlignVertical:'bottom',
        padding:0,
        // borderWidth:1,
        // borderStyle:'solid',
        // borderColor:'blue',
    },
    indicatorStyle:{
         height:0
    },
    tabtext:{
        fontSize:15
    }
}) 