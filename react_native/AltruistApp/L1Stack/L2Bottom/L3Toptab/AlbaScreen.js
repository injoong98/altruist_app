import React from 'react';
import { StyleSheet, View, Image, Layout, ActivityIndicator} from 'react-native';
import { Card, List, Text, Divider, Button, Spinner} from '@ui-kitten/components';
import axios from 'axios';

class AlbaScreen extends React.Component {

  constructor(props){
    super(props);
    this.state={
      current_page : 1,
      isLoading : true,
      isListLoading : false,
      isNoMoreData : false,
      lists : [],
      image_url : '/react_native/AltruistApp/assets/images/noimage_120x90.gif',
      refreshing : false,
    }
  }

  // const renderItemHeader = (headerProps, info) => (
  //   <View {...headerProps}>
        
  //   </View>
  // );

  // const renderItemFooter = (footerProps) => (
  //     <Text></Text>
  // );

  getPostList = async() =>{
    await axios.get(`http://10.0.2.2/api/board_post/lists/b-a-3?page=${this.state.current_page}`)
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

  componentDidMount(){
    this.setState({isListLoading:true}, this.getPostList);
  }

  onRefresh = () => {
    this.setState({current_page:1, isNoMoreData : false, lists:[]}, this.getPostList);
  }

  statefunction=()=>{
    this.setState({isLoading:true}, this.componentDidMount);
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
      onPress={() => {this.props.navigation.navigate('AlbaContent', item.post_id)}}
      style={styles.carditem}
      status='basic'>
        <View style={{flexDirection : 'row'}}>
            <View style={styles.Text}>
                <Text style={{fontSize : 20}}>{item.post_nickname}</Text>
                <Text style={{marginTop :5, marginBottom : 5}}>{item.title}</Text>
                <Divider style={{borderWidth : 0.5}}/>
                <Text>item.post_location<Text style={{color : 'red'}}>item.alba_salary_type</Text> item.alba_salary</Text>
            </View>
            <View style={styles.image}>
              {item.origin_image_url?
                <Image source={{uri:'http://10.0.2.2'+item.origin_image_url}} style={{flex : 1, marginLeft: 10, width : '100%', resizeMode:'contain'}}/>
                :<Image source={{uri:'http://10.0.2.2'+this.state.image_url}} style={{flex : 1, marginLeft: 10, width : '100%', resizeMode:'contain'}}/>
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
      <View style={styles.bottomView}>
        <Button 
          style={styles.bottomButton}
          onPress={()=>{this.props.navigation.navigate('AlbaWrite',{statefunction:this.statefunction});}}>
            글쓰기 
          </Button>
      </View>
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
  },
  carditem: {
    marginVertical: 4,
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
    backgroundColor : 'lightgrey',
  },
  bottomButton: {
    width : "95%",
  },
});

export {AlbaScreen} ;