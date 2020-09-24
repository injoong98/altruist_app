import React, {Component, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  Alert,
  DatePickerAndroid,
} from 'react-native';
import {
  Text,
  Input,
  Button,
  CheckBox,
  TopNavigation,
  TopNavigationAction,
  Icon,
  TextInput,
  Radio,
  RadioGroup,
  Datepicker,
  Calendar,
  NativeDateService,
} from '@ui-kitten/components';
import moment from 'moment';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import axios from 'axios';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CalendarIcon = (props) => <Icon {...props} name="calendar" />;

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

  SubmitForm = async (checkUserid) => {
    let formdata = new FormData();

    formdata.append('userid', checkUserid);
    console.info('form', this.state);

    await axios
      .post('http://dev.unyict.org/api/findaccount/findpw', formdata)
      .then((res) => {
        if (res.status == 500) {
          console.log('status500', res);
          console.log('status', res.status);
        } else if (res.status == 200) {
          console.log('status200', res);
          console.log('status', res.status);
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

  //   TODO : 휴대폰 번호
  PhoneHyphen = () => {};

  //   TODO : 이메일 중복 확인
  checkEmail = async () => {
    const {mem_userid} = this.state;

    let formdata = new FormData();
    formdata.append('userid', mem_userid);

    await axios
      .post(`http://dev.unyict.org/api/register/userid_check`, formdata)
      .then((res) => {
        const checkUserid = res.data.userid;
        console.log(res.data.userid);
        if (!checkUserid) {
          Alert('아이디없음');
        } else {
          this.SubmitForm(checkUserid);
        }
        console.log(res);
      });
  };

  // TODO : 이메일 입력
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
            style={
              this.state.emailStyle ? this.state.emailStyle : styles.inputs
            }
            keyboardType="email-address"
            textContentType="emailAddress" //ios
            placeholder="* 이메일 (ID겸용)"
            onChangeText={(mem_email) => {
              this.setState({
                mem_email: mem_email,
                mem_userid: mem_email,
              });
              this.checkEmail(mem_email);
            }}
            onEndEditing={() => {
              // this.checkNotNull();
              this.checkEmail(this.state.mem_email);
            }}
          />
          <Button
            style={{
              alignSelf: 'center',
              width: 114,
              height: 34,
              borderRadius: 6,
            }}
            onPress={() => this.checkEmail()}>
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
