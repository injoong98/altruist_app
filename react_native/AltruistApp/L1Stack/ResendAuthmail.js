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

const BackIcon = (props) => (
  <Icon
    style={{width: 24, height: 24}}
    fill="#63579D"
    name="back-arrow"
    pack="alticons"
  />
);
class ResendAuthmailScreen extends Component {
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
    const {mem_email} = this.state;

    formdata.append('findtype', 'verifyemail');
    formdata.append('verify_email', mem_email);
    console.info('form', this.state);

    await axios
      .post(`https://dev.unyict.org/api/findaccount/verifyemail`, formdata)
      .then((res) => {
        if (res.data.status == 500) {
          Alert.alert(
            '메일 전송 실패',
            JSON.stringify(res.data.view.message),
            [
              {
                text: 'OK',
              },
            ],
            {cancelable: false},
          );
        } else if (res.data.status == 200) {
          this.props.navigation.navigate('ResendAuthmailSuccessScreen');
        }
      })
      .catch((error) => {
        console.log('ERROR', error);
        console.error();
        //alert('')
      });
  };

  //TODO : 이메일 확인
  checkEmail = async () => {
    const {mem_email} = this.state;

    let formdata = new FormData();
    formdata.append('email', mem_email);

    await axios
      .post(`https://dev.unyict.org/api/register/email_check `, formdata)
      .then((res) => {
        if (!res.data.message.includes('이미 사용중')) {
          this.setState({
            checkEmailCaption: '입력한 이메일을 다시 한번 확인해주세요.',
          });
        } else {
          this.setState({
            checkEmailCaption: '',
          });
        }
        console.log('res.data', res.data);
      })
      .catch((error) => {
        console.log('ERROR', error);
        console.error();
      });
  };

  render() {
    console.log(this.state);
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <TopNavigation
          title={() => <Text category="h2"></Text>}
          alignment="center"
          accessoryLeft={this.BackAction}
          style={{}}
        />
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{paddingBottom: 30}}>
            <Text
              category="h2"
              style={{
                alignSelf: 'center',
                paddingTop: 40,
                paddingBottom: 20,
              }}>
              인증 메일 재전송
            </Text>
            <Text style={{alignSelf: 'center', color: '#A897C2'}}>
              인증 메일을 못 받았을 경우,
            </Text>
            <Text style={{alignSelf: 'center', color: '#A897C2'}}>
              가입시 입력한 메일 주소를 입력하고
            </Text>
            <Text style={{alignSelf: 'center', color: '#A897C2'}}>
              "Email 재전송" 버튼을 클릭해주세요.
            </Text>
          </View>
          <Input
            style={styles.inputs}
            textContentType="emailAddress" //ios
            placeholder="* 이메일"
            onChangeText={(mem_email) => {
              this.setState({mem_email});
            }}
            onEndEditing={() => {
              // this.checkNotNull();
              this.checkEmail(this.state.mem_email);
            }}
            caption={() =>
              this.state.checkEmailCaption ? (
                <Text category="s2" style={{color: '#ACACAC', paddingLeft: 10}}>
                  {this.state.checkEmailCaption}
                </Text>
              ) : (
                <Text> </Text>
              )
            }
          />
          <Button
            style={{
              alignSelf: 'center',
              width: 124,
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
            Email 재전송
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

export default ResendAuthmailScreen;
