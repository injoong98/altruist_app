import React, { Fragment } from 'react';
import { StyleSheet, View, Image} from 'react-native';
import { Button, Card, List, Layout, Text,Icon, StyleService, Spinner} from '@ui-kitten/components'
import { HeartIcon, PlusIcon } from '../../../assets/icons/icons';
import { getPostList } from "./extra/getPost";
import axios from 'axios';

const AltsIcon = (props) => <Icon {...props} name="star" />;
const ShareIcon = (props) => <Icon {...props} name="share-outline" />;
const ArrowIcon = (props) => <Icon {...props} name="arrow-forward-outline" />;

function JauHeader(props){
  return(
    <View>
      {/* 카테고리, 제목, 작성자, 시간, 공유 */}
      <View style={styles.itemHeaderTop}>
          {/*     text-overflow: ellipsis; */}
          <View>
              <Text category='s2'>{props.category}
              </Text>
              <Text category='h4'>{props.title}
              </Text>
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

function JauCard(){
    //<Card header={header} footer={footer}>
    //</Card>
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

          <Button
              style={styles.itemAddButton}
              appearance='ghost'
              onPress={onDetailButtonPress}
              accessoryLeft={ArrowIcon}>
                          더보기

          </Button>
      </View>
  );
}

class JauScreen extends React.Component {

  constructor(props){
    super(props);
    this.state={
      isLoading : true,
      lists : '',
      image_url : '/react_native/AltruistApp/assets/images/noimage_120x90.gif',
    }
  }

  getPostList = async() =>{
    await axios.get(`http://10.0.2.2/api/board_post/lists/ilban`)
    .then( response =>{
        this.setState({
          lists : response.data.view.list.data.list,
          isLoading : false
        })
    })
    .catch((error)=>{
        alert('error')
    })
  }

  //LIFECYCLE
  componentDidMount(){
    this.getPostList();
  } 
   
  renderItem = ({item, index}) => (
     
     <View>
        <JauHeader 
        category = {item.category.bca_value}
        title={item.post_title} 
        nickname={item.post_nickname} 
        datetime={item.post_datetime} 
        hit={item.post_hit} />
        <JauFooter />
      </View>
  );
  

  render(){
    return (
    <>
      <View style={{flex:10}}>
        <List
          contentContainerStyle={styles.contentContainer}
          data={this.state.lists}
          renderItem={this.renderItem}
          // refreshing={this.state.isLoading}
          // onRefresh={this.getPostList()}
          />
      </View>
      
      <View style={styles.bottomView}>
        <Button
          style={styles.bottomButton}
          onPress={() => { this.props.navigation.navigate('AlbaWrite'); } }>
          글쓰기
        </Button>
      </View>
      </>
    );
  }
};


const styles = StyleSheet.create({
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
  })

export {JauScreen} ;


