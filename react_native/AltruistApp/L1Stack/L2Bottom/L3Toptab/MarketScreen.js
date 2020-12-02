import React, { useEffect, useState } from 'react';
import {Image, ActivityIndicator, SafeAreaView, View, StyleSheet, TouchableOpacity,StatusBar} from 'react-native';
import {Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction, Button, List, Card, Spinner} from '@ui-kitten/components';
import axios from 'axios'
import {PostTime} from '../../../components/PostTime'

import Writesvg from '../../../assets/icons/write.svg'
import Viewsvg from '../../../assets/icons/view.svg'
import Timesvg from '../../../assets/icons/Time.svg'


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
      total_rows:0,
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
          isListLoading:false,
          total_rows:response.data.view.list.data.total_rows,})
    })
    .catch((error)=>{
        alert('error')
    })
  }

  componentDidMount(){
    this.setState({current_page:1, isNoMoreData : false,}, this.getPostFirst);
  } 
  
  
  componentWillUnmount(){
    this._ismounted = false;
    console.log('marketScreen : componentwillunount')
  }

  onRefresh= () =>{
    this.getPostFirst();
  }

  renderItem = ({item}) => (
    <TouchableOpacity style={styles.item} onPress={() => {this.props.navigation.navigate('MarketContent',{OnGoback:() =>this.onRefresh(), post_id:item.post_id})}}>
        <View style={{width:100, justifyContent:'center', alignItems:'center'}}>
            <Image 
              source={item.thumb_url? {uri : item.thumb_url}:{uri : "http://dev.unyict.org/assets/images/noimage.png"}} 
              style={{width:90, height:90, resizeMode:'cover', borderRadius:10}}
            />
        </View>
        <View style={styles.textArea}>
            <View style={{flexDirection:'row'}}>
                {item.deal_status==0
                ?<View style={{flex:1, flexDirection:'row', alignItems:'center', paddingLeft:8}}>
                    <Text style={{color:'#D4787D', fontSize:6, marginRight:10}}>●</Text>
                    <Text style={{marginLeft:-4, color : '#D4787D', fontSize:11}} category='h1'>
                      판매완료
                    </Text>
                </View>
                :<View style={{flex:1, flexDirection:'row', alignItems:'center', paddingLeft:8}}>
                    <Text style={{color:'#439DB1', fontSize:6, marginRight:10}}>●</Text>
                    <Text style={{marginLeft:-4, color : '#439DB1', fontSize:11}} category='h1'>
                      {item.deal_type==0? '판매중  /  배송':item.deal_type==1? '판매중  /  직거래':'판매중  /  배송 & 직거래'}
                    </Text>
                </View>
                }
            </View>
            <View style={{flex:1, paddingHorizontal:5, justifyContent:'space-between'}}>
                <View style={styles.textTop}>
                    <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail" category='h4'>
                        {item.title}
                    </Text>
                </View>
                <View style={styles.textBottom}>
                    <View style={{}}>
                        <Text style={{...styles.text, color:'#878787', fontSize:10}} numberOfLines={1} ellipsizeMode="tail" category='h4'>
                           {item.post_location}
                        </Text>
                    </View>
                    <View style={{}}>
                        <Text style={{...styles.text, color:'black', fontSize:13}} category='h4'>
                            {(item.deal_price+'원').replace(/\d(?=(\d{3})+\원)/g, '$&,')}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{flexDirection: 'row', position:'absolute', bottom:5, right:15}}>
                {/* <Text category='h4' style={{fontSize:9}}>
                    {item.post_nickname}
                </Text> */}
                <View style={{justifyContent:'center', alignItems:'center', marginRight:10}}>
                    <Viewsvg width='15' height='15'/>
                    <Text style={{color:'#878787', fontSize:8}} category='p1'>{item.post_hit}</Text>
                </View>
                <View style={{justifyContent:'center', alignItems:'center', paddingTop:3}}>
                    <Timesvg width='10' height='10'/>
                    <PostTime style={{color:'#878787', fontSize:8, marginTop:2}} category='p1' datetime={item.post_datetime}/>
                </View>
            </View>
        </View>
    </TouchableOpacity>
  );
  
  statefunction=(str)=>{
    this.setState({isLoading:true});
    this.componentDidMount()    
  }

  load_more_data = () => {
    if(this.state.total_rows < 20){
    this.setState({isNoMoreData:true});
		}
    else if(!this.state.isNoMoreData){
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
          style={{position:'absolute', right:30,bottom:14}} 
          onPress={()=>{
            if(!global.mem_id) {
              this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
           }else{
             this.props.navigation.navigate('MarketWrite',{statefunction:this.statefunction})
           }
          }} 
        >
          {/* <Writesvg /> */}
          <Image source={{uri:"http://dev.unyict.org/uploads/icons/write-pink.png"}} style={{width:50,height:50}}/>

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
        paddingHorizontal: 15,
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
        paddingVertical: 7,
        paddingRight: 5,
        paddingLeft: 0,
        maxHeight: 100,
    },
    textTop: {
        flex:1,
        backgroundColor:'#FFFFFF',
        borderRadius:10,
        justifyContent: 'center',
        marginTop:5
    },
    textBottom: {
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