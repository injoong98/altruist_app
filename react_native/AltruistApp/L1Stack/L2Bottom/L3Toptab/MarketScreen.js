import React, { useEffect, useState } from 'react';
import {Image, SafeAreaView, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction, Button, List, Card} from '@ui-kitten/components';
import axios from 'axios'

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
    {
        title: '샤오미 전동퀵보드',
        place: '서울 노원구',
        price: '50,900',
        user: 'Edward',
        uri : require('../../../market/asset/market-image-1.jpg')
    },
);


const MarketScreen = ({navigation}) =>{

    
    const [isLoading, setIsLoading] = React.useState(true);
    const [list, setList] = React.useState('');
    
    
    // const getPostList = async() =>{
    //   await axios.get('http://10.0.2.2/api/board_post/lists/b-a-1')
    //   .then((response)=>{
    //       setList(response.data.view.list.data.list);
    //       setIsLoading(false);
    //   })
    //   .catch((error)=>{
    //       alert('error')
    //   })
    // }

    useEffect(() => {
      const fetchData = async () => {
      const response = await axios.get(
        'http://10.0.2.2/api/board_post/lists/b-a-1'
      );

      setList(response.data.view.list.data.list);
      setIsLoading(false);
      };

      fetchData();
    }, []);

    const renderItem = (info) => {
        

        return (
            <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('MarketContent', info.item)}>
                <View style={{width:100}}>
                    <Image source={{uri : 'http://10.0.2.2'+info.item.origin_image_url}} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
                </View>
                <Layout style={styles.textArea}>
                    <Layout style={styles.textTop}>
                    <Text style={styles.text} category='s1'>
                        {info.item.title}   {/*info.item으로 데이터 road*/}
                    </Text>
                    </Layout>
                    <Layout style={{}}>
                    <Text style={{marginLeft:4}} category='s2'>
                        {info.item.place} 
                    </Text>
                    </Layout>
                    <Layout style={styles.textBottom}>
                    <Layout style={{flex:1, justifyContent:'center'}}>
                        <Text style={styles.text} category='h6'>
                            {info.item.post_content.replace(/(<([^>]+)>)/ig,"")} 원 
                        </Text>
                    </Layout>
                    <Layout style={{justifyContent: 'center'}}>
                        <Text style={styles.text}>
                            {info.item.user}
                        </Text>
                    </Layout>
                    </Layout>
                </Layout>
            </TouchableOpacity>
        );
    };
      
      return (
        <View style={{flex:1}}>
            <List
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                data={list}
                renderItem={renderItem}
            />
            <Button style={{position:'absolute', width:'20%', left:'40%', bottom:10}} 
            onPress={()=>navigation.navigate('MarketWrite')}>
                등록
            </Button>
        </View>
      );
}

const MarketContent = ({navigation}) => {
  
    const navigateBack = () => {
      navigation.goBack();
    };
    const BackAction = () => (
      <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
    );

    return (
      <View style={{flex:1}}>
        <View>
          <TopNavigation     
            accessoryLeft={BackAction} />
        </View>
        <View style={{height:394}}>
          <Image source={require('../../../market/asset/market-image-1.jpg')} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
        </View>
        <View style={{}}>
          <Layout>
            <Text category='h1'>Title</Text>
          </Layout>
          <Layout>
            <Text category='h4'>Price</Text>
          </Layout>
        </View>
        <Divider/>
        <Layout style={{height:50,flexDirection:'row'}}>
          <Layout style={{width:50}}>
            <Image source={require('../../../market/asset/market-image-1.jpg')} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
          </Layout>
          <Layout style={{justifyContent:'center'}}>
            <Text>User</Text>
          </Layout>
        </Layout>
        <Divider/>
        <Layout style={{flex:1}}>
          <Text>Details</Text>
        </Layout>
        <Divider/>
        <Layout>
          <Text>Comment</Text>
        </Layout>
  
      </View>
    );
  
  }



const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    contentContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    item: {
        flex:1, 
        flexDirection:'row', 
        height:100, 
        margin:5
    },
    textArea: {
        flex: 1,
        paddingHorizontal: 10,
        maxHeight: 100
    },
    textTop: {
        flex: 1,
        justifyContent: 'center'
    },
    textBottom: {
        flexDirection: 'row'
    },
    text: {
        margin: 4,
    }
  });

export {MarketScreen, MarketContent}