import React from 'react';
import {SafeAreaView, View, Image} from 'react-native';
import {Layout,Button,Text,TopNavigation,TopNavigationAction,Icon, Divider} from '@ui-kitten/components'

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)


const defaultContent = ({navigation}) =>{
    
    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )
    
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} /> 
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text>글본문입니다</Text>
        </Layout>   
    </SafeAreaView>
    )
}

const MarketContent = ({route, navigation}) =>{

    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )
    
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} />
        <View style={{flex:1}}>
            <View style={{height:394}}>
                <Image source={route.params.uri} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
            </View>
            <View style={{}}>
                <Layout>
                <Text category='h2'>{route.params.title}</Text>
                </Layout>
                <Layout>
                <Text category='h4'>{route.params.price}</Text>
                </Layout>
            </View>
            <Divider/>
            <Layout style={{height:50,flexDirection:'row'}}>
                <Layout style={{width:50}}>
                <Image source={require('../market/asset/market-image-1.jpg')} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
                </Layout>
                <Layout style={{justifyContent:'center'}}>
                <Text>{route.params.user}</Text>
                </Layout>
            </Layout>
            <Divider/>
            <Layout style={{flex:1}}>
                <Text>Details</Text>
                <Text> ㅇPlace : {route.params.place}</Text>
            </Layout>
            <Divider/>
            <Layout>
                <Text>Comment</Text>
            </Layout>
        </View>
    </SafeAreaView>

    )
}

    

export {defaultContent, MarketContent}