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
    {color : '#EAB0B3', str : '시'},
    {color : '#E3898E', str : '일'},
    {color : '#CA676C', str : '주'},
    {color : '#B12D34', str : '월'},
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
        <View style = {styles.Text}>
          <PostTime datetime = {item.post_datetime}/>
          <View style={{flexDirection : 'row'}}>
              <View style={styles.Text}>
                  <Text category = 'c2' style={{marginVertical : 3, fontSize : 20}} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
                  <Text style={{fontSize : 16}} numberOfLines={1} ellipsizeMode='tail'>{item.post_content}</Text>
                  <View style = {{marginTop : 10, flexDirection : 'row'}}>
                    <View style={{marginVertical : 5, flex : 1, flexDirection : 'row', alignItems : 'center'}}>
                      <Text style={[styles.tagstyle,{backgroundColor:item.alba_type == 0?'#978DC7':'#63579D'}]} category='c2'>
                        {item.alba_type == 0?'단기':'장기'}
                      </Text>
                      <Text category='c2' style={{flex:1.2}} numberOfLines={1} ellipsizeMode='tail'> {item.post_location} </Text>
                    </View>
                    <View style={{flex : 1, flexDirection : 'row', alignItems : 'center'}}>
                        <Text style={[styles.tagstyle,{backgroundColor:this.Alba_salary_type[item.alba_salary_type].color}]} category='c2'>
                        {this.Alba_salary_type[item.alba_salary_type].str}
                        </Text>
                        <Text category='c2'> {(item.alba_salary != '추후협의'?item.alba_salary+'원':item.alba_salary).replace(/\d(?=(\d{3})+\원)/g, '$&,')}</Text>
                    </View>
                  </View>
              </View>
              <View style={styles.image}>
                {(item.post_thumb_use == 0)?
                  <Image source={require('../../../assets/images/noimage.png')} style={{flex : 1, marginLeft: 10, width : '100%', height : 90, resizeMode:'contain'}}/>
                  :<Image source={{uri:'http://dev.unyict.org'+item.origin_image_url}} style={{flex : 1, marginLeft: 10, width : '100%', resizeMode:'contain'}}/>
                }
              </View>
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
    },
  image :{
    flex : 1,
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
  tagstyle:{
    borderRadius : 20,
    paddingHorizontal : 5,
    textAlignVertical : 'center',
    justifyContent : 'center',
    color : 'white',
    maxHeight : 20
  }
});

export {AlbaScreen} ;