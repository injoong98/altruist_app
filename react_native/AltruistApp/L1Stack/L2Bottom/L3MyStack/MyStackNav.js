import React from 'react';
import {SafeAreaView,TouchableWithoutFeedback,Linking} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack';
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction} from '@ui-kitten/components';
import {IlbanContent, GominContent, MarketContent, AlbaContent} from '../../Content'
import {Mypage} from './Mypage';
import {MyList} from './MyList';
import {MyPoint} from './MyPoint';
import {MyProfEdit} from './MyProfEdit';
import {MyAlarmSetting} from './MyAlarm';
import MyAltCareer from './MyAltCareer';
import MyAltProf from './MyAltProf';
import {AltQueToptab} from '../L3Stack/AltQueToptab';
import {AltQueContent,AltReplying} from '../L3Stack/Question';
const {Navigator,Screen} = createStackNavigator();

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

const SpareScreen =({navigation}) =>{

    return(
    <SafeAreaView style={{flex:1}}>
        <TouchableWithoutFeedback
            style={{flex:1,justifyContent:"center", alignItems:"center"}}
            onPress={()=>{Linking.openSettings()}}
        >
            <Text>이타주의자</Text>
        </TouchableWithoutFeedback>   
    </SafeAreaView>
    )
}

export const MyStackNav = () =>(
    <Navigator headerMode="none">
        <Screen name = "Mypage" component={Mypage}/>
        <Screen name = "MyList" component={MyList}/>
        <Screen name = "MyPoint" component={MyPoint}/>
        <Screen name = "MyProfEdit" component={MyProfEdit}/>
        <Screen name = "MyIlban" component={IlbanContent}/>
        <Screen name = "MyGomin" component={GominContent}/>
        <Screen name = "MyMarket" component={MarketContent}/>
        <Screen name = "MyAlba" component={AlbaContent}/>
        <Screen name = "MyQueList" component={AltQueToptab}/>
        <Screen name = "AltReplying" component={AltReplying}/>
        <Screen name = "AltQueContent" component={AltQueContent}/>
        <Screen name = "MyAlarmSetting" component={MyAlarmSetting}/>
        <Screen name = "MyAltCareer" component={MyAltCareer}/>
        <Screen name = "MyAltProf" component={MyAltProf}/>
    </Navigator>
)
