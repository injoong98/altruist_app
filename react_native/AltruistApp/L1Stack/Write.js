import React from 'react';
import {StyleSheet,SafeAreaView, View, Image, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, VirtualizedList,} from 'react-native';
import {Layout,Button,Text,TopNavigation,TopNavigationAction,Icon, Divider, Input} from '@ui-kitten/components'
import {Card, CardItem} from 'native-base';

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)


const defaultWrite = ({navigation}) =>{
    
    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )
    
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} /> 
        <Divider />
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text>글작성 화면입니다.</Text>
        </Layout>   
    </SafeAreaView>

    )
    }

const MarketWrite = ({route, navigation}) => {

    const DATA = [
        require('../market/asset/market-image-1.jpg'),
        require('../market/asset/image-plus.jpg'),
    ];

    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )

    const getItem = (data, index) => {
        return {
            id: Math.random().toString(12).substring(0),
            title: `Item ${index+1}`,
            uri: data[index]
        }
    }
          
    const getItemCount = (data) => {
        return data.length;
    }
          
    const Item = ({ uri })=> {
        return (
            <View style={styles.photo}>
                <Image source={uri} style={{width:200, height:200}}/>
            </View>
        );
    }

    return(
        <SafeAreaView style={{flex:1}}>

            <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} />

            <Divider />
            
            <Layout>
                <Text>상품명</Text>
                <Input></Input>
            </Layout>
            <Layout style={{flexDirection:'row'}}>
                <Layout style={{flex:1}}>
                    <Text>판매가격</Text>
                    <Input></Input>
                </Layout>
                <Layout style={{flex:1}}>
                    <Text>지역</Text>
                    <Input></Input>
                </Layout>
            </Layout>
            <Layout>
                <Text>사진</Text>
                <VirtualizedList
                    data={DATA}
                    initialNumToRender={4}
                    renderItem={({ item }) => <Item uri={item.uri} />}
                    keyExtractor={item => item.id}
                    getItemCount={getItemCount}
                    getItem={getItem}
                    horizontal={true}
                />
            </Layout>
            <Layout>
                <Text>상세정보</Text>
                <Input></Input>
            </Layout>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    item: {
      backgroundColor: '#f9c2ff',
      height: 150,
      justifyContent: 'center',
      marginVertical: 8,
      marginHorizontal: 16,
      padding: 20,
    },
    title: {
      fontSize: 32,
    },
    photo: {
        justifyContent: 'center', 
        alignItems: 'center', 
        margin: 10, 
        borderWidth: 2,
        borderColor: 'grey'
    }
});
  

export {defaultWrite, MarketWrite}