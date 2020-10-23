import React from 'react';
import {SafeAreaView,View,LogBox,StyleSheet,ActivityIndicator,TouchableOpacity} from 'react-native';
import { Text,List,Spinner,TopNavigationAction,TopNavigation} from '@ui-kitten/components';
import Backsvg from '../../../assets/icons/back-arrow-color.svg'


export class AboutApp extends React.Component{
    constructor(props){
        super(props);
       
    }
   
    BackAction = () =>(
        <TopNavigationAction icon={()=><Backsvg width={26} height={26}/>} onPress={() =>{this.props.navigation.goBack()}}/>
    )

    render(){
        return(
            <SafeAreaView style={{flex:1,backgroundColor:"#ffffff"}}>
            <TopNavigation alignment="center" accessoryLeft={this.BackAction} title="" /> 
                <Text category="h2" style={{textAlign:'center'}}>{'더불어 사는 이타주의자들이란?'}</Text>
                <Text>gkgkgkgkgk</Text>
            </SafeAreaView>
        )
    }
}