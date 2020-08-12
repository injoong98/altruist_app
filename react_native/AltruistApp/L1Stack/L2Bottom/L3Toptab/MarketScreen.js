import React from 'react';
import {Image, SafeAreaView, View, StyleSheet} from 'react-native';
import {Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction, Button, List, Card} from '@ui-kitten/components';


const data = new Array(
    {
        title: '샤오미 전동퀵보드',
        place: '서울 노원구',
        price: '50,900',
        user: 'Edward',
        uri : require('../../../market/asset/market-image-1.jpg')
    },
    {
        title: '3년산 샤넬백 팝니다',
        place: '대전 유성구',
        price: '250,000,900',
        user: 'Tune',
        uri : require('../../../market/asset/market-image-2.jpg')
    },
    {
        title: '캐논 초고해상 카메라 + 고배율 렌즈 세트로 판매',
        place: '부산 해운대',
        price: '857,000',
        user: 'Seikun',
        uri : require('../../../market/asset/market-image-3.jpg')
    },
    {
        title: '나이키 에어',
        place: '강원도 대관령',
        price: '50,000',
        user: 'Roothyo',
        uri : require('../../../market/asset/market-image-4.jpg')
    },
    {
        title: '중고 유모차 팔아요',
        place: '서울 관악구',
        price: '250,000',
        user: 'Rimi',
        uri : require('../../../market/asset/market-image-5.jpg')
    },
);


const MarketScreen = ({navigation}) =>{


    const renderItem = (info) => {
        

        return (
            <View style={{flex:1, flexDirection:'row', height:100, margin:5}}>
                <View style={{width:100}}>
                    <Image source={info.item.uri} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
                </View>
                <Layout style={styles.textArea}>
                    <Layout style={styles.listTop}>
                    <Text style={styles.text} category='s1'>
                        {info.item.title}   {/*info.item으로 데이터 road*/}
                    </Text>
                    </Layout>
                    <Layout style={{}}>
                    <Text style={{marginLeft:4}} category='s2'>
                        {info.item.place} 
                    </Text>
                    </Layout>
                    <Layout style={styles.listBottom}>
                    <Layout style={{flex:1, justifyContent:'center'}}>
                        <Text style={styles.text} category='h6'>
                            {info.item.price} 원 
                        </Text>
                    </Layout>
                    <Layout style={{justifyContent: 'center'}}>
                        <Text style={styles.text}>
                            {info.item.user}
                        </Text>
                    </Layout>
                    </Layout>
                </Layout>
            </View>
        );
    };
      
      return (
        <View>
          <List
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            data={data}
            renderItem={renderItem}
          />
        </View>
      );
}


const styles = StyleSheet.create({
    container: {
    },
    contentContainer: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    item: {
      marginVertical: 4,
    },
    textArea: {
        flex: 1,
        paddingHorizontal: 10,
        maxHeight: 100
    },
    listTop: {
        flex: 1,
      justifyContent: 'center'
    },
    listBottom: {
      flexDirection: 'row'
    },
    text: {
        margin: 4,
    }
  });

export {MarketScreen}