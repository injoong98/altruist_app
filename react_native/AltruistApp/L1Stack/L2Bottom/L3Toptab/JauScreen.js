import React, { Fragment } from 'react';
import { StyleSheet, View, Image, Dimensionsm, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Button, Card, List, Layout, Text,Icon, StyleService, Spinner, Divider} from '@ui-kitten/components'
import { PlusIcon } from '../../../assets/icons/icons';
import { getPostList } from "./extra/getPost";
import axios from 'axios';
import HTML from 'react-native-render-html';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';
import {PostTime} from '../../../components/PostTime'


const AltsIcon = (props) => <Icon {...props} name="star" />;
const ShareIcon = (props) => <Icon {...props} name="share-outline" />;
const ArrowIcon = (props) => <Icon {...props} name="arrow-forward-outline" />;

const  ViewIcon = (props)=>(
  <Icon style={styles.icon} fill='#8F9BB3' name="view-filled" pack="alticons"/>
)
const CommentIcon = (props)=>(
  <Icon  style={styles.icon} fill='#8F9BB3' name="message-circle" {...props}/>
)
const HeartIcon = (props)=>(
  <Icon style={styles.icon} fill='#8F9BB3' name="heart-filled" pack="alticons"/>
)
const WriteIcon = (props)=>(
  <Icon style={styles.icon} fill='#8F9BB3' name="write" pack="alticons"/>
)


function JauHeader(props){
  return(
    <View>
      {/* 카테고리, 제목, 작성자, 시간, 공유 */}
      <View style={styles.itemHeaderTop}>
          {/*     text-overflow: ellipsis; */}
          <View>
              {/* <Text category='h4'>[{props.category}]{props.title}
              </Text> */}
          </View>
          <Button
                  style={styles.iconButton}
                  appearance='ghost'
                  status='basic'
                  accessoryLeft={ShareIcon} 
                  />
      </View>
      <View style={styles.itemHeaderBottom}>
          <Text category='s2'>{props.nickname}</Text>
          <Text category='s2'> | {props.datetime}</Text>
          <Text category='s2'> | {props.hit}</Text>
      </View>
  </View>
  )
}

function JauFooter(onDetailButtonPress) {
  return (
    <View style={styles.itemFooter}>
          <View style={styles.itemReactionsContainer}>
              <Button
                  style={styles.iconButton}
                  appearance='ghost'
                  status='basic'
                  accessoryLeft={HeartIcon} />
              <Button
                  style={styles.iconButton}
                  appearance='ghost'
                  status='danger'
                  accessoryLeft={AltsIcon} />
          </View>
          {/* <Button
              style={styles.itemAddButton}
              appearance='ghost'
              onPress={onDetailButtonPress}
              accessoryLeft={ArrowIcon}>
          </Button> */}
      </View>
  );
}


function JauCard(props){
  return (
    <Card header=  {() => JauHeader(props)}
    footer={() => JauFooter()}>
    </Card>
  );
}

class JauScreen extends React.Component {

  constructor(props){
    super(props);
    this.state={
      isLoading : true,
      lists : '',
      image_url : '/react_native/AltruistApp/assets/images/noimage_120x90.gif',
      categorys: ''
    }
  }

  getPostList = async() =>{
    await axios.get(`http://10.0.2.2/api/board_post/lists/ilban`)
    .then( response =>{
      console.log(response)
        this.setState({
          lists : response.data.view.list.data.list,
          isLoading : false
        })
        console.log('list' + response.data.view.list.data.list)
    })
    .catch((error)=>{
        alert('error')
    })
  }

  getCategory = async() =>{
    await axios.get(`http://10.0.2.2/api/board_post/lists/ilban`)
    .then( res =>{
      console.log(res)
        this.setState({
          categorys : res.data.view.list.board.category[0],
          isLoading : false
        })
        console.log('cate' + res.data.view.list.board.category[0])
    })
    .catch((error)=>{
        alert('error')
    })
  }

  //LIFECYCLE
  componentDidMount(){
    this.getPostList();
    this.getCategory();
  } 
  
  renderItem = ({item, index}) => (
    
    <View style={{flex:1}}>
      {/* header */}
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        {/*카테고리(이미지)/ 제목 / 공유*/}
        {/* */}
        <View style={{flexDirection:'row'}}>
          <Text>{item.post_category}</Text>
          <Text>{item.post_title}</Text>
        </View>
        <Text>{`shareicon`}</Text>
      </View>
      {/* image */}
      <View>
        <Text>{item.post_content}</Text>
        <View style={{flexDirection:'row'}}>
          <Image source={{uri : 'http://10.0.2.2/react_native/AltruistApp/assets/images/noimage_120x90.gif'}} style={{width:100,height:100}}/>
          <Image source={{uri : 'http://10.0.2.2/react_native/AltruistApp/assets/images/noimage_120x90.gif'}} style={{width:100,height:100}}/>
          <Image source={{uri : 'http://10.0.2.2/react_native/AltruistApp/assets/images/noimage_120x90.gif'}} style={{width:100,height:100}}/>
        </View>
      </View>
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <View style={{flexDirection:'row'}}>
          <Text>{item.display_name}</Text> 
          <PostTime datetime = {item.post_datetime} />
        </View>
        <View style={{flexDirection:'row'}}>
          <HeartIcon />
          <Text>{item.post_like}</Text>
          <CommentIcon />
          <Text>{item.post_comment_count}</Text>
          <ViewIcon />
          <Text>{item.post_hit}</Text>
        </View>
      </View>
    </View>
  );
  
  renderCategory = ({item}) =>(
    <Button category='h4'> {item.bca_value} </Button>
  )  

  render(){
    return (
    <>
      <View style={{flex:1}}>
        <ScrollView horizontal={true}>
          <List
            horizontal={true}
            data={this.state.categorys}
            renderItem = {this.renderCategory}
          />
        </ScrollView>
      </View>
      <SafeAreaView style={{flex:10,backgroundColor:"#ffffff"}}>
        <List
          // contentContainerStyle={styles.contentContainer}
          data={this.state.lists}
          renderItem={this.renderItem}
          refreshing={this.state.isLoading}
          onRefresh={this.getPostList}
          />
        <TouchableOpacity 
            style={{position:'absolute', right:20,bottom:14}} 
            onPress={()=>{this.props.navigation.navigate('IlbanWrite',{statefunction:this.statefunction})}} 
        >
            <WriteIcon />
        </TouchableOpacity>
      </SafeAreaView>
    </>
    );
  }
};


const styles = StyleSheet.create({
  renderers: {

  },
  list: {
      flex: 1,
  },
  listContent: {
      paddingHorizontal: 16,
      paddingVertical: 8,
  },
  item: {
      marginVertical: 8,
  },
  itemHeader: {
      minHeight: 220,
  },

  itemTitle: {
      position: 'absolute',
      left: 24,
      bottom: 24,
  },
  itemDescription: {
      marginHorizontal: -8,
  },
  itemFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  itemHeaderTop: {
      marginLeft : 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  itemHeaderBottom: {
      marginRight : 10,
      flexDirection: 'row',
      justifyContent: 'flex-end',
  },
  itemReactionsContainer: {
      flexDirection: 'row',
  },
  itemAddButton: {
      flexDirection: 'row-reverse',
      paddingHorizontal: 0,
  },
  iconButton: {
      paddingHorizontal: 0,
  },
  followButton: {
    marginTop: 24,
  },
  infotext:{
    color:'#141552',
    fontSize:9
  },
  })

export {JauScreen} ;