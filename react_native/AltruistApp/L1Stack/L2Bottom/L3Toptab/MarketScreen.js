import React, { useEffect, useState } from 'react';
import {Image, SafeAreaView, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction, Button, List, Card} from '@ui-kitten/components';
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
    await axios.get('http://10.0.2.2/api/board_post/lists/b-a-2')
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
            <Image source={{uri : 'http://10.0.2.2'+item.origin_image_url}} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
        </View>
        <Layout style={styles.textArea}>
            <Layout style={styles.textTop}>
            <Text style={styles.text} category='s1'>
                {item.title}
            </Text>
            </Layout>
            <Layout style={{}}>
            <Text style={{marginLeft:4}} category='s2'>
                {item.place} 
            </Text>
            </Layout>
            <Layout style={styles.textBottom}>
            <Layout style={{flex:1, justifyContent:'center'}}>
                <Text style={styles.text} category='h6'>
                    {item.post_content.replace(/(<([^>]+)>)/ig,"")} 원 
                </Text>
            </Layout>
            <Layout style={{justifyContent: 'center'}}>
                <Text style={styles.text}>
                    {item.user}
                </Text>
            </Layout>
            </Layout>
        </Layout>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={{flex:1}}>
        <List
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            data={this.state.list}
            renderItem={this.renderItem}
            // refreshing={this.state.refreshing}
            // onRefresh={this.onRefresh}
        />
        <Button style={{position:'absolute', width:'20%', left:'40%', bottom:10}} 
        onPress={()=>navigation.navigate('MarketWrite')}>
            등록
        </Button>
      </View>
    );
  }
};


//  MarketScreen = ({navigation}) =>{
    
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [list, setList] = React.useState('');

//     useEffect(() => {
//       const fetchData = async () => {
//       await axios.get('http://10.0.2.2/api/board_post/lists/b-a-2')
//       .then((response) => {
//         setList(response.data.view.list.data.list);
//         setIsLoading(false);
//       })
//         .catch((error)=>{
//             alert('error')
//         })
//       }

//       fetchData();
//     }, []);

//     renderItem = ({item}) => (
//         <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('MarketContent', item.item)}>
//             <View style={{width:100}}>
//                 <Image source={{uri : 'http://10.0.2.2'+item.item.origin_image_url}} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
//             </View>
//             <Layout style={styles.textArea}>
//                 <Layout style={styles.textTop}>
//                 <Text style={styles.text} category='s1'>
//                     {item.item.title}   {/*item.item으로 데이터 road*/}
//                 </Text>
//                 </Layout>
//                 <Layout style={{}}>
//                 <Text style={{marginLeft:4}} category='s2'>
//                     {item.item.place} 
//                 </Text>
//                 </Layout>
//                 <Layout style={styles.textBottom}>
//                 <Layout style={{flex:1, justifyContent:'center'}}>
//                     <Text style={styles.text} category='h6'>
//                         {item.item.post_content.replace(/(<([^>]+)>)/ig,"")} 원 
//                     </Text>
//                 </Layout>
//                 <Layout style={{justifyContent: 'center'}}>
//                     <Text style={styles.text}>
//                         {item.item.user}
//                     </Text>
//                 </Layout>
//                 </Layout>
//             </Layout>
//         </TouchableOpacity>
//     );
      
//       return (
//         <View style={{flex:1}}>
//             <List
//                 style={styles.container}
//                 contentContainerStyle={styles.contentContainer}
//                 data={list}
//                 renderItem={renderItem}
//             />
//             <Button style={{position:'absolute', width:'20%', left:'40%', bottom:10}} 
//             onPress={()=>navigation.navigate('MarketWrite')}>
//                 등록
//             </Button>
//         </View>
//       );
// }

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