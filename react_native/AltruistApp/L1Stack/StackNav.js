import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ComBottomNav} from './L2Bottom/ComBottomNav'
import {defaultContent, IlbanContent, GominContent, MarketContent, AlbaContent} from './Content'
import {defaultWrite, MarketWrite, AlbaWrite,GominWrite, IlbanWrite} from './Write'

import {SafeAreaView} from 'react-native'
import {Layout,Text,TopNavigation} from '@ui-kitten/components'
import LoginScreen from './Login'
const {Navigator,Screen} = createStackNavigator();

const SpareScreen =() =>(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="스페어" alignment="center"/> 
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text>스페어</Text>
        </Layout>   
    </SafeAreaView>
)
export const StackNav = () =>(
    <Navigator headerMode="none">
        <Screen name = "Login" component={LoginScreen}/>
        <Screen name = "Bottom" component={ComBottomNav}/>
        <Screen name = "Write" component={defaultWrite}/>
        <Screen name = "Content" component={defaultContent}/>
        <Screen name = "IlbanContent" component={IlbanContent}/>
        <Screen name = "GominContent" component={GominContent}/>
        <Screen name = "MarketContent" component={MarketContent}/>
        <Screen name = "IlbanWrite" component={IlbanWrite}/>
        <Screen name = "AlbaContent" component={AlbaContent}/>
        <Screen name = "MarketWrite" component={MarketWrite}/>
        <Screen name = "AlbaWrite" component={AlbaWrite}/>
        <Screen name = "GominWrite" component={GominWrite}/>
    </Navigator>
)
