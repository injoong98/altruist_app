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

  SessionOut = async() =>{
    axios.get(`https://dev.unyict.org/api/login/session_clear`)
    .then(res => console.log(res))
  }

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
                    ?????? ?????? ??????
                </Text>
                <Text style={{textAlign:'center', alignContent:'center', justifyContent:'center', marginVertical:20, marginHorizontal:40}}>
                    ?????? ?????? ???, ???????????? ???????????? ???????????????.
                    {` `}{`\n`}????????? ?????????, ??????, ?????????, ??????????????? ?????? {`\n`}?????? ?????? ????????????.
                    <Text style={{color:"red", textAlign:'center'}}>{`\n`}?????? ?????? ??? ?????? ?????? ??? ??? ????????????.
                    </Text>
                </Text>
            <Input
                placeholder="PASSWORD??? ?????? ??? ??????????????????!"
                style={[{borderColor: colorRed ? colorRed : '#FFFFFF'}, styles.inputs]}
                onChangeText={mem_password=> {this.setState({mem_password})}}
                onEndEditing={mem_password=> this.setState({mem_password})}
                caption= {
                    !mem_password ? null : `?????? ????????? ????????????????`,
                    colorRed ? <Text style={{ marginHorizontal: 30, fontSize:10, color:colorRed}}>{`??????????????? ?????? ?????? ???????????? !`}</Text> : null}
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
                ??????
              </Button>
            </View>
            <Modal
            visible={logOutModalVisible}
            backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
            onBackdropPress={() => this.setState({logOutModalVisible:false})}
        >
            <Confirm 
                type="result"
                confirmText={` ???????????? ????????? ????????? ??????????????? ???????????????! 
                \n ??? ?????? ?????????! \n ????????? ????????? ??????????????????!`}
                frstText="??????"
                OnFrstPress={() => {signOut()}}
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