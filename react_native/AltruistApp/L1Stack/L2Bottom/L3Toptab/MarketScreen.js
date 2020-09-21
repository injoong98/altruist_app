import React, { useEffect, useState } from 'react';
import {Image, ActivityIndicator, SafeAreaView, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction, Button, List, Card, Spinner} from '@ui-kitten/components';
import axios from 'axios'

import Writesvg from '../../../assets/icons/write.svg'


class MarketScreen extends React.Component {

  constructor(props){
    super(props);
    this.state={
      isLoading : true,
      lists : [],
      image_url : '/react_native/AltruistApp/assets/images/noimage_120x90.gif',
      refreshing : false,
      current_page:1,
      isListLoading : false,
      isNoMoreData : false,
    }
  }
  getPostList = async() =>{
    await axios.get(`http://dev.unyict.org/api/board_post/lists/b-a-2?page=${this.state.current_page}`)
    .then((response)=>{
      if(response.data.view.list.data.list.length > 0){
        this.setState({
          lists:this.state.lists.concat(response.data.view.list.data.list),
          isLoading:false,
          isListLoading:false,
        })
      }
      else{
        console.log('no page data');
        this.setState({isListLoading:false, isNoMoreData : true});
      }
    })
    .catch((error)=>{
        alert('error')
    })
  }

  getPostFirst = async() =>{
    await axios.get('http://dev.unyict.org/api/board_post/lists/b-a-2')
    .then((response)=>{
        this.setState({
          lists:response.data.view.list.data.list,
          isLoading:false,
          isListLoading:false})
    })
    .catch((error)=>{
        alert('error')
    })
  }

  componentDidMount(){
    this.setState({current_page:1, isNoMoreData : false,}, this.getPostFirst);
  } 

  onRefresh= () =>{
    this.getPostFirst();
  }

  renderItem = ({item}) => (
    <TouchableOpacity style={styles.item} onPress={() => {this.props.navigation.navigate('MarketContent',{OnGoback:() =>this.onRefresh(), post_id:item.post_id})}}>
        <View style={styles.textArea}>
          <View style={styles.textTop}>
            <Text style={styles.text} category='h4'>
                {item.title}
            </Text>
          </View>
          <View style={{}}>
            <Text style={{marginLeft:4, color : 'gray'}} category='c2'>
                {item.post_location} 
            </Text>
          </View>
          <View style={styles.textBottom}>
            <View style={{flex:1, justifyContent:'center'}}>
                <Text style={styles.text} category='h5'>
                    {item.deal_price.replace(/(<([^>]+)>)/ig,"")} 원
                </Text>
            </View>
            <View style={{justifyContent: 'center'}}>
                <Text style={styles.text}>
                    {item.post_nickname}
                </Text>
            </View>
          </View>
        </View>
        <View style={{width:100, justifyContent:'center', alignItems:'center'}}>
            <Image 
              source={item.origin_image_url? {uri : 'http://dev.unyict.org'+item.origin_image_url}:{uri : 'http://dev.unyict.org'+item.thumb_url}} 
              style={{width:86, height:86, resizeMode:'cover', borderRadius:10}}
            />
        </View>
    </TouchableOpacity>
  );
  
  statefunction=(str)=>{
    this.setState({isLoading:true});
    this.componentDidMount()    
  }

  load_more_data = () => {
      if(!this.state.isNoMoreData){
          this.setState({
          current_page : this.state.current_page + 1,
          isListLoading : true},
          this.getPostList, console.log(this.state.current_page))
      }
  }

  renderFooter=()=>{
    return(
      this.state.isListLoading ?
      <View style = {styles.loader}>
        <ActivityIndicator size='large'/>
      </View>:null
    )
  }
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
            data={this.state.lists}
            renderItem={this.renderItem}
            refreshing={this.state.refreshing}
            onEndReached={this.load_more_data}
            onEndReachedThreshold = {0.9}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.onRefresh}
        />
        <TouchableOpacity 
          style={{position:'absolute', right:20,bottom:14}} 
          onPress={()=>{this.props.navigation.navigate('MarketWrite',{statefunction:this.statefunction})}} 
        >
          <Writesvg />
        </TouchableOpacity>
        {/* <Button style={{position:'absolute', width:'20%', left:'40%', bottom:10}} 
        onPress={()=>this.props.navigation.navigate('MarketWrite')}>
            등록
        </Button> */}
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
        margin:5,
        backgroundColor:'#F4F4F4',
        borderRadius:10,
    },
    textArea: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        maxHeight: 100,
    },
    textTop: {
        flex: 1,
        // justifyContent: 'center'
    },
    textBottom: {
        flexDirection: 'row'
    },
    loader:{
        marginTop : 10,
        alignItems : 'center',
    },
    text: {
        margin: 4,
    }
  });

export {MarketScreen};