import React from 'react';
import {SafeAreaView,View,LogBox,StyleSheet,ActivityIndicator,TouchableOpacity,Alert} from 'react-native';
import { Text,List,Spinner,TopNavigationAction,TopNavigation,Button, Icon, Input, Modal} from '@ui-kitten/components';
import axios from 'axios'
import Confirm from '../../../components/confirm.component'
import {Signing} from '../../Context'
import { set } from 'react-native-reanimated';

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
        mem_password:'',
        inputborderRed:'',
        logOutModalVisible:false
       
    }
}
static contextType = Signing;

BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        this.props.navigation.goBack();
      }}
    />
  );

  SubmitForm = async () => {
    const {mem_password} = this.state;
    let formdata = new FormData();
    
    formdata.append('mem_password', mem_password);
    
    await axios
    .post(`https://dev.unyict.org/api/membermodify/memleave`, formdata)
    .then((res) => {
        console.log(res)
        if(res.data.status == 200){
            this.setState({ logOutModalVisible: true})
        }else{
            this.setState({colorRed:"red"})
        }
      })
  };

    render(){
    const { mem_password, colorRed, logOutModalVisible} = this.state;
    const {signOut} = this.context

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
                style={[{borderColor: colorRed ? colorRed : '#FFFFFF'}, styles.inputs]}
                onChangeText={mem_password=> {this.setState({mem_password})}}
                onEndEditing={mem_password=> this.setState({mem_password})}
                caption= {
                    !mem_password ? null : `진짜 가는건가요?ㅠㅠ`,
                    colorRed ? <Text style={{ marginHorizontal: 30, fontSize:10, color:colorRed}}>{`패스워드가 일치 하지 않습니다 !`}</Text> : null}
                secureTextEntry = {true}
            />
              <Button
                style={{
                  alignSelf: 'center',
                  width: 114,
                  height: 34,
                  borderRadius: 6,
                }}
                onPress={()=>{this.SubmitForm(); }}
                >
                확인
              </Button>
            </View>
            <Modal
            visible={logOutModalVisible}
            backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
            onBackdropPress={() => this.setState({logOutModalVisible:false})}
        >
            <Confirm 
                confirmText="그동안 이용에 감사드립니다!"
                scndText="확인"
                OnScndPress={() => {signOut()}}
            />
        </Modal>
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
        color: 'black',
      }
})