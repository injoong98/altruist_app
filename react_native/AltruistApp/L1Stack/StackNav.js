import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ComBottomNav} from './L2Bottom/ComBottomNav'
import {defaultContent, MarketContent} from './Content'
import {defaultWrite} from './Write'

import {SafeAreaView} from 'react-native'
import {Layout,Text,TopNavigation} from '@ui-kitten/components'

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
        <Screen name = "Bottom" component={ComBottomNav}/>
        <Screen name = "Write" component={defaultWrite}/>
        <Screen name = "Content" component={defaultContent}/>
        <Screen name = "MarketContent" component={MarketContent}/>
    </Navigator>
)
