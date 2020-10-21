import React from 'react';
import {SafeAreaView,View,LogBox,StyleSheet,ActivityIndicator,TouchableOpacity, } from 'react-native';
import { Text,List,Spinner,TopNavigationAction,TopNavigation,Button, Icon, Input} from '@ui-kitten/components';
import axios from 'axios'
import {PostTime} from '../../../components/PostTime'
import Heartsvg from '../../../assets/icons/heart.svg'
import Viewsvg from '../../../assets/icons/view.svg'
import Commentsvg from '../../../assets/icons/comment.svg'
import Backsvg from '../../../assets/icons/back-arrow-color.svg'



const BackIcon = (props) => (
    <Icon
      style={{width: 24, height: 24}}
      fill="#63579D"
      name="back-arrow"
      pack="alticons"
    />
  );

  

export class MyLeave extends React.Component{
    constructor(props) {
      super(props);
      this.state={
          idConfirm:''
     }
    }

BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        this.props.navigation.goBack();
      }}
    />
  );
  
  SubmitForm = async () => {
    const {mem_userid} = this.state;
    let formdata = new FormData();
    
    
    formdata.append('mem_userid', mem_userid);
    // return Alert.alert(
      //   '접근 실패',
      //   '{`올바른 접근 방법이 아닙니다. \n 다시 시도해주세요.`}',
      //   [
        //     {
          //       text: 'OK',
          //     },
          //   ],
          //   {cancelable: false},
          // );
          
    console.info('form', this.state);

    await axios
      .post(`http://dev.unyict.org/api/membermodify/memleave`, formdata)
      .then((res) => {
        console.log(res);
      })
  };

    render(){
        const { idConfirm} = this.state;
        return(
            <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
            <TopNavigation
              alignment="center"
              accessoryLeft={this.BackAction}
            />
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text category="h2" style={{textAlign:'center'}}>
                    회원 탈퇴 확인
                </Text>
                <Text style={{textAlign:'center', alignContent:'center', justifyContent:'center', marginVertical:20, marginHorizontal:40}}>
                    회원 탈퇴 시, 가입하신 아이디가 삭제됩니다.
                    {` `}{`\n`}작성된 게시물, 댓글, 대댓글, 오픈질문의 글은 {`\n`}삭제 되지 않습니다.
                    <Text style={{color:"red", textAlign:'center'}}>{`\n`}회원 탈퇴 후 다시 복구 할 수 없습니다.
                    </Text>
                </Text>
            <Input
                placeholder="PASSWORD를 한번 더 입력해주세요!"
                style={styles.inputs}
                onChangeText={idConfirm=> {this.setState({idConfirm})}}
                onEndEditing={idConfirm=> this.setState({idConfirm})}
                caption= {!idConfirm ? null : "진짜 가는건가요?ㅠㅠ" }
                secureTextEntry = {true}
            />
              <Button
                style={{
                  alignSelf: 'center',
                  width: 114,
                  height: 34,
                  borderRadius: 6,
                }}
                >
                확인
              </Button>
            </View>
          </SafeAreaView>
            )
        }
    }
  
const styles = StyleSheet.create({

    inputs: {
        marginLeft: 35,
        marginRight: 35,
        paddingBottom: 30,
        backgroundColor: '#F8F8F8',
        borderRadius: 15,
        borderColor: '#FFFFFF',
        color: 'black',
      },
    container:{
        backgroundColor:"#F4F4F4",
        borderRadius : 20,
        marginVertical:4.5,
        marginHorizontal:19,
        padding:0,
        paddingLeft:21


    },
    buttoncontainer:{
        width:"100%",bottom:0,
        display :"flex", 
        justifyContent:"center", 
        alignItems:"center"
    },
    icon:{
        // width: 15,
        // height: 15
    },
    subtitle:{
        marginTop:10, display:"flex",flexDirection:"row", justifyContent:"space-between",
    },
    infocontainer:{
        display:"flex",flexDirection:"row",justifyContent:'space-evenly',
        borderTopLeftRadius:23,
        width:116,
        backgroundColor:"#ffffff",
        position:"relative",bottom:0,right:0,
        paddingTop:5,
        paddingLeft:20,
        paddingRight:10
    },
    loader:{
        marginTop : 10,
        alignItems : 'center',
    },
    infotext:{
        color:'#141552',
        fontSize:9
    },
    headtext:{
        marginTop:11,
        paddingTop:10,
        fontWeight:'bold'
    },
    subtext:{
        marginTop:5,
        maxWidth:200
    }
})