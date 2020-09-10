import React, { useEffect, useState } from 'react';
import {Image, SafeAreaView, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction, Button, List, Card, Spinner} from '@ui-kitten/components';
import axios from 'axios'


class MarketScreen extends React.Component {

  constructor(props){
    super(props);
    this.state={
      isLoading : true,
      list : '',
      image_url : '/react_native/AltruistApp/assets/images/noimage_120x90.gif',
      refreshing : false,
    }
  }


  getPostList = async() =>{
    await axios.get('http://dev.unyict.org/api/board_post/lists/b-a-2')
    .then((response)=>{
        this.setState({list:response.data.view.list.data.list,isLoading:false})
    })
    .catch((error)=>{
        alert('error')
    })
  }

  componentDidMount(){
    this.getPostList();
  }

  onRefresh = () => {
    this.getPostList();
  }

  renderItem = ({item}) => (
    <TouchableOpacity style={styles.item} onPress={() => {this.props.navigation.navigate('MarketContent', item.post_id)}}>
        <View style={{width:100}}>
            <Image source={item.origin_image_url? {uri : 'http://dev.unyict.org'+item.origin_image_url}:{uri : 'http://dev.unyict.org'+item.thumb_url}} style={{flex : 1, width:'100%', resizeMode:'cover'}}/>
        </View>
        <Layout style={styles.textArea}>
            <Layout style={styles.textTop}>
            <Text style={styles.text} category='s1'>
                {item.title}
            </Text>
            </Layout>
            <Layout style={{}}>
            <Text style={{marginLeft:4}} category='s2'>
                {item.post_location} 
            </Text>
            </Layout>
            <Layout style={styles.textBottom}>
            <Layout style={{flex:1, justifyContent:'center'}}>
                <Text style={styles.text} category='h6'>
                    {item.deal_price.replace(/(<([^>]+)>)/ig,"")} 원
                </Text>
            </Layout>
            <Layout style={{justifyContent: 'center'}}>
                <Text style={styles.text}>
                    {item.post_nickname}
                </Text>
            </Layout>
            </Layout>
        </Layout>
    </TouchableOpacity>
  );

  render() {
    return (
      this.state.isLoading ?
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
          <Text>is Loading now...</Text>
          <Spinner size="giant"/>
      </View>
      :
      <View style={{flex:1}}>
        <List
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            data={this.state.list}
            renderItem={this.renderItem}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
        />
        <Button style={{position:'absolute', width:'20%', left:'40%', bottom:10}} 
        onPress={()=>this.props.navigation.navigate('MarketWrite')}>
            등록
        </Button>
      </View>
    );
  }
};



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
        // justifyContent: 'center'
    },
    textBottom: {
        flexDirection: 'row'
    },
    text: {
        margin: 4,
    }
  });

export {MarketScreen};