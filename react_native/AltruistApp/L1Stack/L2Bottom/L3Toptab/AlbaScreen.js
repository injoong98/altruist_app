import React from 'react';
import { StyleSheet, View, Image, Layout, ActivityIndicator, YellowBox, TouchableOpacity} from 'react-native';
import { Card, List, Text, Divider, Button, Spinner} from '@ui-kitten/components';
import axios from 'axios';
import {PostTime} from '../../../components/PostTime';
import Writesvg from '../../../assets/icons/write.svg'

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);

class AlbaScreen extends React.Component {

  constructor(props){
    super(props);
    this.state={
      current_page : 1,
      isLoading : true,
      isListLoading : false,
      isNoMoreData : false,
      lists : [],
      image_url : '/react_native/AltruistApp/assets/images/noimage.png',
      refreshing : false,
    }
  }

  Alba_salary_type = [
    {color : 'green', str : '시'},
    {color : 'purple', str : '일'},
    {color : 'blue', str : '주'},
    {color : 'red', str : '월'},  
  ]

  // const renderItemHeader = (headerProps, info) => (
  //   <View {...headerProps}>
        
  //   </View>
  // );

  // const renderItemFooter = (footerProps) => (
  //     <Text></Text>
  // );

  getPostList = async() =>{
    await axios.get(`http://dev.unyict.org/api/board_post/lists/b-a-3?page=${this.state.current_page}`)
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

  getPostFirst = async() => {
    await axios.get('http://dev.unyict.org/api/board_post/lists/b-a-3')
    .then((response)=>{
        this.setState({
          lists:response.data.view.list.data.list,
          isLoading:false,
          isListLoading:false,
        })
    })
    .catch((error)=>{
        alert('error')
    })
  }

  componentDidMount(){
    this.setState({isListLoading:true}, this.getPostList);
  }

  onRefresh = () => {
    this.setState({current_page:1, isNoMoreData : false,}, this.getPostFirst);
  }

  statefunction=()=>{
    this.setState({isLoading:true}, this.onRefresh());
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

  renderItem = ({item, index}) => (
      <Card
      onPress={() => {this.props.navigation.navigate('AlbaContent', {post_id:item.post_id})}}
      style={styles.carditem}>
        <View style={{flexDirection : 'row'}}>
            <View style={styles.Text}>
                <PostTime datetime = {item.post_datetime}/>
                <Text category='h5'>{item.post_nickname}</Text>
                <Text style={{marginTop :5, marginBottom : 5, fontSize : 20}} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
                <Divider style={{borderWidth : 0.5}}/>
                <View style={{flex : 1, flexDirection : 'row'}}>
                  <Text category='c2' style={{flex:1.2}} numberOfLines={1} ellipsizeMode='tail'> {item.post_location} </Text>
                  <View style={{flex : 1, flexDirection : 'row'}}>
                    <Text category='c2' style={{color : this.Alba_salary_type[item.alba_salary_type].color}}>{this.Alba_salary_type[item.alba_salary_type].str}</Text>
                    <Text category='c2'> {(item.alba_salary != '추후협의'?item.alba_salary+'원':item.alba_salary).replace(/\d(?=(\d{3})+\원)/g, '$&,')}</Text>
                  </View>
                </View>
            </View>
            <View style={styles.image}>
              {item.origin_image_url?
                <Image source={{uri:'http://dev.unyict.org'+item.origin_image_url}} style={{flex : 1, marginLeft: 10, width : '100%', resizeMode:'contain'}}/>
                :<Image source={{uri:'http://dev.unyict.org'+this.state.image_url}} style={{flex : 1, marginLeft: 10, width : '100%', resizeMode:'contain'}}/>
              }
            </View>
        </View>
      </Card>
  );
  

  render(){
    return (
      this.state.isLoading ? 
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text>
                <Spinner size="giant" />
            </Text>
        </View>:
      <>
      <View style={{flex:10}}>
        <List
          contentContainerStyle={styles.contentContainer}
          data={this.state.lists}
          renderItem={this.renderItem}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.load_more_data}
          onEndReachedThreshold = {0.9}
          ListFooterComponent={this.renderFooter}
          />
      </View>
      <TouchableOpacity 
        style={styles.bottomButton}
        onPress={()=>{this.props.navigation.navigate('AlbaWrite',{statefunction:this.statefunction});}}
        >
        <Writesvg />
      </TouchableOpacity>

      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
  },
  contentContainer: {
    paddingHorizontal: 2,
    paddingVertical: 2,
    marginHorizontal : 4,
    backgroundColor : 'white'
  },
  carditem: {
    marginVertical: 4,
    borderRadius : 25,
    backgroundColor : '#F4F4F4',
  },
  loader : {
    marginTop : 10,
    alignItems : 'center',
  },
  Text : {
    flex : 2,
    marginLeft : 20,
    marginTop : 10,
    },
  image :{
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
  },
  bottomView: {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
  },
  bottomButton: {
    position:'absolute',
    right : 10,
    bottom : 10,
  },
});

export {AlbaScreen} ;