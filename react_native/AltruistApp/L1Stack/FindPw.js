import React, {Component, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Alert} from 'react-native';
import {
  Text,
  Input,
  Button,
  TopNavigation,
  TopNavigationAction,
  Icon,
} from '@ui-kitten/components';
import axios from 'axios';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

class FindPwScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    let formdata = new FormData();
    const {mem_userid} = this.state;

    formdata.append('findtype', 'findidpw');
    formdata.append('idpw_email', mem_userid);
    console.info('form', this.state);

    await axios
      .post(`http://dev.unyict.org/api/findaccount/findpw`, formdata)
      .then((res) => {
        if (res.data.status === 500) {
          //실패 모달
          console.log('status500', res);
          console.log('status', res.status);
          console.log('실패');
        } else if (res.data.status === 200) {
          console.log('status200', res);
          console.log('status', res.status);
          this.props.navigation.navigate('RegisterSuccessScreen');
          //실패시,
        } else {
        }
        // console.log('this.state', this.state);
        // Alert.alert(
        //   '가입 테스트',
        //   '가입 테스트 완료',
        //   [
        //     {
        //       text: 'OK',
        //       // onPress: () => {
        //       //   this.gobackfunc();
        //       // },
        //     },
        //   ],
        //   {cancelable: false},
        // );
      })
      .catch((error) => {
        console.log('ERROR', error);
        console.error();
        //alert('')
      });
  };

  //TODO : 이메일 확인
  checkEmail = async () => {
    const {mem_userid} = this.state;

    let formdata = new FormData();
    formdata.append('email', mem_userid);

    await axios
      .post(`http://dev.unyict.org/api/register/email_check`, formdata)
      .then((res) => {
        if (!res.data.email) {
          this.setState({checkEmailCaption: '존재하지 않는 아이디 입니다.'});
        } else {
          this.setState({checkEmailCaption: ''});
        }
        console.log('res.data', res.data);
        console.log('res.data.email', res.data.email);
      });
  };

  render() {
    console.log(this.state);
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <TopNavigation
          title={() => <Text category="h2">비밀번호 재설정</Text>}
          alignment="center"
          accessoryLeft={this.BackAction}
        />
        <View style={{flex: 3}}>
          <View style={{paddingBottom: 30}}>
            <Text
              category="h3"
              style={{
                alignSelf: 'center',
                paddingTop: 40,
                paddingBottom: 20,
                color: '#A897C2',
                fontWeight: 'bold',
              }}>
              비밀번호 재설정
            </Text>
            <Text style={{alignSelf: 'center', color: '#A897C2'}}>
              가입하신 메일 주소로 알려드립니다.
            </Text>
            <Text style={{alignSelf: 'center', color: '#A897C2'}}>
              가입할 때 등록한 메일 주소를 입력하고
            </Text>
            <Text style={{alignSelf: 'center', color: '#A897C2'}}>
              "PW 재설정" 버튼을 클릭해주세요.
            </Text>
          </View>
          <Input
            style={styles.inputs}
            textContentType="emailAddress" //ios
            placeholder="* 이메일 (ID겸용)"
            onChangeText={(mem_userid) => {
              this.setState({
                mem_userid: mem_userid,
              });
              this.checkEmail(mem_userid);
            }}
            onEndEditing={() => {
              // this.checkNotNull();
              this.checkEmail(this.state.mem_userid);
            }}
            caption={this.state.checkEmailCaption}
          />
          <Button
            style={{
              alignSelf: 'center',
              width: 114,
              height: 34,
              borderRadius: 6,
            }}
            onPress={() =>
              !this.state.checkEmailCaption
                ? this.SubmitForm()
                : this.setState({
                    checkEmailCaption:
                      '입력한 이메일을 다시 한번 확인해주세요.',
                  })
            }>
            PW 재설정
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputs: {
    marginLeft: 35,
    marginRight: 35,
    paddingBottom: 30,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    borderColor: '#FFFFFF',
    color: '#A897C2',
  },
});

export default FindPwScreen;
