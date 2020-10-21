import React from 'react';
import { StyleSheet, View, Image, Layout, ActivityIndicator, TouchableOpacity, LogBox} from 'react-native';
import { Card, List, Text, Divider, Button, Spinner} from '@ui-kitten/components';
import axios from 'axios';
import {PostTime} from '../../../components/PostTime';
import Writesvg from '../../../assets/icons/write.svg'
import Viewsvg from '../../../assets/icons/view.svg';
LogBox.ignoreLogs([
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
      total_rows : 0,
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
          total_rows:response.data.view.list.data.total_rows,
        })
    })
    .catch((error)=>{
        alert('error')
    })
  }

  componentDidMount(){
    this.setState({isListLoading:true}, this.getPostFirst);
  }

  onRefresh = () => {
    this.setState({current_page:1, isNoMoreData : false,}, this.getPostFirst);
  }

  statefunction=()=>{
    this.setState({isLoading:true}, this.onRefresh());
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

  renderItem = ({item, index}) => (
      <TouchableOpacity 
        onPress={() => {this.props.navigation.navigate('AlbaContent', {post_id:item.post_id, OnGoback: () => this.onRefresh()})}}
        style={styles.carditem}>
          <View style={{flexDirection : 'row'}}>
              <View style={{flex : 6.5}}>
                <View style={{flexDirection:'row', marginVertical : 5, padding : 5, flex : 6, maxHeight:50}}>
                  <View style={{flex:2.5}}>
                    <PostTime category='c1' style={{marginHorizontal:5}} datetime = {item.post_datetime}/>
                    <Text category = 'h4' style={{margin:5 , borderRadius : 20}} 
                          numberOfLines={2} ellipsizeMode='tail'>{item.title}
                    </Text>
                  </View>
                </View>
                <View style = {{flexDirection : 'row', flex:1}}>
                  <View style = {{flexDirection : 'row', backgroundColor:'white', borderTopRightRadius:10, flex:1, width : 220, maxHeight:35, marginTop:10}}>
                    <View style={{flexDirection : 'row', alignItems : 'center', flex:0.6, marginLeft : 5}}>
                      <Text style={{color:'#FF6262', fontWeight:'bold'}} category='c1'>
                        {this.Alba_salary_type[item.alba_salary_type].str+' '}
                      </Text>
                      <Text category='c1' numberOfLines={1} ellipsizeMode='tail'> 
                        {(item.alba_salary).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </Text>
                    </View>
                    <View style={{flexDirection : 'row', alignItems : 'center', flex:1}}>
                      <Text style={{color:'#7370DD', fontWeight:'bold'}} category='c1'>{item.alba_type == 0?'단기':'장기'}</Text>
                      <Text category='c1' numberOfLines={1} ellipsizeMode='tail'> {item.post_location} </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{justifyContent:'flex-end', alignItems:'center', marginLeft : 10, width : 30}}>
                <Viewsvg width = {20} height={20}/>
                <Text style = {{marginHorizontal:5}} category="c1">{item.post_hit}</Text>
              </View>
              {(item.post_thumb_use == 0)?
                <Image source={require('../../../assets/images/noimage.png')} style={styles.image}/>
                :<Image source={{uri:item.thumb_url}} style={styles.image}/>
              }
          </View>
      </TouchableOpacity>
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
          {/* <Writesvg /> */}
          <Image source={{uri:"http://dev.unyict.org/uploads/icons/write-pink.png"}} style={{width:50,height:50}}/>

        </TouchableOpacity>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
  },
  contentContainer: {
    backgroundColor : 'white'
  },
  carditem: {
    margin : 20,
    marginVertical : 8,
    borderRadius : 15,
    backgroundColor : '#F4F4F4',
    flex : 1,
  },
  loader : {
    marginTop : 10,
    alignItems : 'center',
  },
  Text : {
    
  },
  image :{
    width : 80, 
    height : 80, 
    borderRadius : 15, 
    margin : 7,
  },
  NameView: {
    flex:1,
    alignItems:'flex-end',
  },
  bottomButton: {
    position:'absolute',
    right : 30,
    bottom : 14,
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