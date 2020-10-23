import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {SafeAreaView} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction} from '@ui-kitten/components';
import AltMainScreen from './Main';
import AltApplyScreen,{AltApplyStatus} from './Apply';
import AltListScreen from './List';
import AltProfileScreen from './Profile';
import {AltQuestionWrite,AltQueType,AltAreaList,AltQueContent,AltQueList,AltReplying,AltOpqQueList} from './Question';
import AltApplyFormScreen from './ApplyForm';
import ApplyCompleteScreen from './ApplyComplete';
import {AltQueToptab} from './AltQueToptab'
const {Navigator,Screen} = createStackNavigator();

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

const SpareScreen =({navigation}) =>{

    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {navigation.goBack()}}/>
        )
 
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="이타주의자" alignment="center" accessoryLeft={BackAction}/> 
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text>이타주의자</Text>
        </Layout>   
    </SafeAreaView>
    )
}

export const AltStackNav = ({navigation}) =>{

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', e => {
          // Prevent default behavior
          console.log("tabPress Listener : Hi!")
          navigation.navigate('AltMain')
          // Do something manually
          // ...
        });
      
        return unsubscribe;
      }, [navigation]);

     return(
        <Navigator headerMode="none">
            <Screen name = "AltMain" component={AltMainScreen}/>
            <Screen name = "AltApply" component={AltApplyScreen}/>
            <Screen name = "AltList" component={AltListScreen}/>
            <Screen name = "AltProfile" component={AltProfileScreen}/>
            <Screen name = "AltApplyForm" component={AltApplyFormScreen}/>
            <Screen name = "AltApplyComplete" component={ApplyCompleteScreen}/>
            <Screen name = "AltApplyStatus" component={AltApplyStatus}/>
            <Screen name = "AltQueType" component={AltQueType}/>
            <Screen name = "AltAreaList" component={AltAreaList}/>
            <Screen name = "AltQuestionWrite" component={AltQuestionWrite}/>
            <Screen name = "AltQueList" component={AltQueList}/>
            <Screen name = "AltQueContent" component={AltQueContent}/>
            <Screen name = "AltReplying" component={AltReplying}/>
            <Screen name = "AltQueToptab" component={AltQueToptab}/>
            <Screen name = "AltOpqQueList" component={AltOpqQueList}/>
        </Navigator>
     ) 
}

