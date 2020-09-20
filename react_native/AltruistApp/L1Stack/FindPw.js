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
    this.state = {
      mem_userid: '',
      mem_email: '',
      mem_password: '',
      mem_password_re: '',
      mem_username: '',
      mem_nickname: '',
      mem_homepage: '',
      mem_phone: '',
      mem_birthday: '',
      mem_sex: '1',
      mem_address: '',
      mem_profile_content: '',
      mem_recommend: '',
      captionCheck: '',
      column: '',
      date: new Date(),
    };
  }

  BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        this.props.navigation.goBack();
      }}
    />
  );

  //form submit
  SubmitForm = async () => {
    const {
      mem_userid,
      mem_password,
      mem_password_re,
      mem_nickname,
      mem_phone,
      mem_email,
      mem_sex,
      mem_birthday,
      mem_recommend,
    } = this.state;

    let formdata = new FormData();
    formdata.append('mem_userid', mem_userid);
    formdata.append('mem_email', mem_email);
    formdata.append('mem_password', mem_password);
    formdata.append('mem_password_re', mem_password_re);
    formdata.append('mem_phone', mem_phone);
    formdata.append('mem_nickname', mem_nickname);
    formdata.append('mem_sex', mem_sex);
    formdata.append('mem_birthday', mem_birthday);
    formdata.append('mem_recommend', mem_recommend);
    console.info('form', this.state);

    await axios
      .post('http://dev.unyict.org/api/register/form', formdata)
      .then((res) => {
        console.log('response', res);
        console.log('status', res.status);
        if (res.status == 500) {
          // () => this.props.navigation.navigate('AgreementScreen');
          this.props.navigation.navigate('RegisterSuccessScreen');
        } else if (res.status == 200) {
          //실패시,
          this.props.navigation.navigate('RegisterSuccessScreen');
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

  //TODO :

  //TODO : 모달 (실패)

  //   TODO : 이메일 중복 확인
  checkEmail = async () => {
    const {mem_userid, checkEmail} = this.state;
    console.log('jklsajf');

    let formdata = new FormData();
    formdata.append('userid', mem_userid);

    await axios
      .post(`http://dev.unyict.org/api/register/userid_check`, formdata)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        this.setState({EmailCaption: res.data.message});
      });
  };

  // TODO : 이메일 입력

  // TODO :

  render() {
    console.log(this.state);
    return (
      <>
        <TopNavigation
          title="비밀번호찾기"
          alignment="center"
          accessoryLeft={this.BackAction}
        />
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView>
            <Text>비밀번호 찾기</Text>
            <Button
              style={{alignSelf: 'center', width: 200}}
              // onPress={() => this.SubmitForm()}
            >
              다음
            </Button>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FindPwScreen;
