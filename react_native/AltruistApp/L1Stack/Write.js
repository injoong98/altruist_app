import React from 'react';
import {StyleSheet,SafeAreaView, View, Image, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, Alert,VirtualizedList,TouchableOpacity} from 'react-native';
import {Layout,Button,Text,TopNavigation,TopNavigationAction,Icon, Divider, Input,CheckBox} from '@ui-kitten/components'
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';
import Axios from 'axios';
const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)
const CloseIcon =  (props) =>(
    <Icon {...props} name = "close"/>
)
const UpIcon =  (props) =>(
    <Icon {...props} name = "arrow-circle-up-outline"/>
)


const defaultWrite = ({navigation}) =>{
    
    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )
    
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} /> 
        <Divider />
        <Layout style={{flex:10}}>
            <ScrollView>
                <Text>This is Write</Text>
            </ScrollView>
        </Layout>
        <View style={styles.bottomView}>
            <Button 
                style={styles.bottomButton}
                onPress={()=>{navigation.goBack()}}>
                    글쓰기 
            </Button>
        </View>    
    </SafeAreaView>

    )
}
class GominWrite extends React.Component {

    constructor(props){
        super(props);
        this.state={
            isLoading :true,
            post_title:'',
            post_content:'',
            post_anoymous_yn:1,
            post_category:1,
            checked:true
            
        }
    }
    submitPost= () => {
    const {post_title,post_content,post_anoymous_yn,post_category} = this.state;
    // alert(`title: ${post_title}\n category: ${post_category}\n content: ${post_content}\n anontmous: ${post_anoymous_yn}`);
    const config ={
        url:"10.0.2.2/api/board_write/write/b-a-1",
        data:{
            post_title,
            post_content,
            post_anoymous_yn,
            post_category
            }
        }
    Alert.alert(
        "게시글",
        "게시글을 작성하시겠습니까?",
        [
          {
            text: "Cancel",
            onPress: () => alert('취소했습니다.')
          },
          { text: "OK", onPress: async() =>
          {
            await Axios.post(config)
            .then(reponse=>{
                alert('성공했어요!')
            })
            .catch(error=>{
                alert('You failed')
            })
          }
        }
        ],
        { cancelable: false }
      );
    }
    
    SubmitButton = () =>(
        <TopNavigationAction icon={UpIcon} onPress={() =>{this.submitPost()}}/>
    )

    CloseAction = () =>(
        <TopNavigationAction icon={CloseIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    )
    render(){
        const {navigation} = this.props;
        const {post_title,post_category,post_anoymous_yn,post_content,checked} =this.state;
        return(

            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="글작성" alignment="center" accessoryLeft={this.CloseAction} accessoryRight={this.SubmitButton} /> 
                <Divider />
                <Input
                    placeholder="Place your Post's Title"
                    onChangeText={nextValue => this.setState({post_title:nextValue})}
                />
                <Divider />
                <Input
                    placeholder="Place your Post's content"
                    onChangeText={nextValue => this.setState({post_content:nextValue})}
                    multiline={true}
                    textStyle={{minHeight:100}}
                />            
                <View style={{alignItems:"flex-end"}}>
                    <CheckBox 
                    checked={checked} 
                    onChange={nextChecked=>this.setState({post_anoymous_yn: nextChecked? 1 : 0,checked:nextChecked })}>
                    {`익명`}
                    </CheckBox>
                </View>
            </SafeAreaView>
    
        )
    }
}

const MarketWrite = ({route, navigation}) => {

    const DATA = [
        require('../market/asset/market-image-1.jpg'),
        require('../market/asset/image-plus.jpg'),
    ];

    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )

    const getItem = (data, index) => {
        return {
            id: Math.random().toString(12).substring(0),
            title: `Item ${index+1}`,
            uri: data[index]
        }
    }
          
    const getItemCount = (data) => {
        return data.length;
    }
          
    const Item = ({ uri })=> {
        return (
            <View style={styles.photo}>
                <Image source={uri} style={{width:200, height:200}}/>
            </View>
        );
    }

    return(
        <SafeAreaView style={{flex:1}}>

            <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} />

            <Divider />
            
            <Layout>
                <Text>상품명</Text>
                <Input></Input>
            </Layout>
            <Layout style={{flexDirection:'row'}}>
                <Layout style={{flex:1}}>
                    <Text>판매가격</Text>
                    <Input></Input>
                </Layout>
                <Layout style={{flex:1}}>
                    <Text>지역</Text>
                    <Input></Input>
                </Layout>
            </Layout>
            <Layout>
                <Text>사진</Text>
                <VirtualizedList
                    data={DATA}
                    initialNumToRender={4}
                    renderItem={({ item }) => <Item uri={item.uri} />}
                    keyExtractor={item => item.id}
                    getItemCount={getItemCount}
                    getItem={getItem}
                    horizontal={true}
                />
            </Layout>
            <Layout>
                <Text>상세정보</Text>
                <Input></Input>
            </Layout>
        </SafeAreaView>
    )
}

const AlbaWrite = ({navigation}) =>{
    
    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )
    
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} /> 
        <Divider />
        <Layout style={{flex:10}}>
            <ScrollView>
                <Text>This is Write</Text>
            </ScrollView>
        </Layout>
        <View style={styles.bottomView}>
            <Button 
                style={styles.bottomButton}
                onPress={()=>{navigation.goBack()}}>
                    글쓰기 
            </Button>
        </View>   
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    item: {
      backgroundColor: '#f9c2ff',
      height: 150,
      justifyContent: 'center',
      marginVertical: 8,
      marginHorizontal: 16,
      padding: 20,
    },
    title: {
      fontSize: 32,
    },
    photo: {
        justifyContent: 'center', 
        alignItems: 'center', 
        margin: 10, 
        borderWidth: 2,
        borderColor: 'grey'
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
  

export {defaultWrite, MarketWrite, AlbaWrite,GominWrite}