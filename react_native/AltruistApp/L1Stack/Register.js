import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, Alert} from 'react-native';
import {
  Text,
  Input,
  Button,
  CheckBox,
  TopNavigation,
  TopNavigationAction,
  Icon,
  TextInput,
} from '@ui-kitten/components';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import axios from 'axios';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const Calender = (props) => <Icon {...props} name="calendar-outline" />;

// RegisterScreen.PropTypes = {
//   mem_email: PropTypes.string.isRequired,
//   mem_password: PropTypes.string.isRequired,
//   mem_password_confirm: PropTypes.string.isRequired,
//   mem_nickname: PropTypes.string.isRequired,
//   mem_phone: PropTypes.string.isRequired,
//   mem_sex: PropTypes.number.isRequired,
// };
class RegisterScreen extends React.Component {
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
      mem_sex: '',
      mem_address: '',
      mem_profile_content: '',
      mem_recommend: '',
      captionCheck: '',
      column: '',
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
    formdata.append('mem_nickname', mem_nickname);
    formdata.append('mem_sex', mem_sex);
    formdata.append('mem_birthday', mem_birthday);
    formdata.append('mem_recommend', mem_recommend);

    await axios
      .post('http://dev.unyict.org/api/register/form', formdata)
      .then((response) => {
        // console.log('response', response);
        // console.log('this.state', this.state);
        Alert.alert(
          '가입 테스트',
          '가입 테스트 완료',
          [
            {
              text: 'OK',
              onPress: () => {
                this.gobackfunc();
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch((error) => {
        console.log(error);
        console.error();
        //alert('')
      });
  };

  //   TODO : 생년월일

  // UselessTextInput = ({placeholder}) => {
  //   const [textInputValue, setTextInputValue] = React.useState('');
  //   const column = this.state.column
  //   return (
  //     <Input
  //       onChangeText={(text) => setTextInputValue(text)}
  //       value={({textInputValue}) => this.setState({this.state.column: textInputValue})}
  //       placeholder={placeholder}
  //     />
  //   );
  // };

  //   TODO : 성별

  //   TODO : 이메일

  //   TODO : 휴대폰 번호

  //   TODO : 패스워드 확인
  CheckPassword = (a, b) => {
    console.log(this.state);
    let checkPassword = '';
    if (a == b) {
      checkPassword = '';
      console.log(checkPassword);
    } else {
      checkPassword = '비밀번호가 일치하지 않습니다.';
      console.log(checkPassword);
    }
    this.setState({captionCheck: checkPassword});
  };

  render() {
    console.log(this.state);
    return (
      <>
        <TopNavigation
          title="회원가입"
          alignment="center"
          accessoryLeft={this.BackAction}
        />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView>
            <View style={{flex: 1, justifyContent: 'center', padding: 30}}>
              <Input
                style={{padding: 3}}
                placeholder="이름"
                onChangeText={(mem_username) =>
                  this.setState({mem_username: mem_username})
                }
              />
              <Input
                style={{padding: 3}}
                placeholder="Email (example@email.com) "
                onChangeText={(mem_email) =>
                  this.setState({mem_email: mem_email, mem_userid: mem_email})
                }
              />
              <Input
                style={{padding: 3}}
                placeholder="닉네임 / 활동명"
                onChangeText={(mem_nickname) =>
                  this.setState({mem_nickname: mem_nickname})
                }
              />
              <Input
                style={{padding: 3}}
                secureTextEntry={true}
                placeholder="비밀번호"
                onChangeText={(mem_password) =>
                  this.setState({mem_password: mem_password})
                }
                secureTextEntry
              />
              <Input
                style={{padding: 3}}
                secureTextEntry={true}
                placeholder="비밀번호 확인"
                onChangeText={(mem_password_re) => {
                  this.setState({mem_password_re: mem_password_re});
                  //{} 하면 obj로 던져서 obj.이름 해야지 됌
                  this.CheckPassword(this.state.mem_password, mem_password_re);
                }}
                caption={() => (
                  <Text style={{color: 'red'}}>{this.state.captionCheck}</Text>
                )}
                secureTextEntry
              />
              <Input
                style={{padding: 3}}
                placeholder="휴대전화"
                onChangeText={(mem_phone) =>
                  this.setState({mem_phone: mem_phone})
                }
              />
              <Input
                placeholder="생년월일 (ex. 2000-01-01)"
                onChangeText={(mem_birthday) =>
                  this.setState({mem_birthday: mem_birthday})
                }
              />
              <View
                style={{
                  padding: 3,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Button
                  style={{width: '45%'}}
                  onPress={() => this.setState({mem_sex: 2})}>
                  여성
                </Button>
                <Button
                  style={{width: '45%'}}
                  onPress={() => this.setState({mem_sex: 1})}>
                  남성
                </Button>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'stretch',
                  alignContent: 'stretch',
                }}></View>
            </View>
            {/* 동의 및 다음 버튼 */}
            <View
              style={{
                alignSelf: 'center',
                flexDirection: 'row',
                padding: 3,
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('AgreementScreen')
                }>
                <Text style={{color: 'blue'}}>이용 방침</Text>
              </TouchableOpacity>
              <Text> 과 </Text>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('AgreementScreen')
                }>
                <Text style={{color: 'blue'}}>개인정보 취급방침</Text>
              </TouchableOpacity>
              <Text>에 동의합니다</Text>
            </View>
            <Button
              style={{alignSelf: 'center', width: 200}}
              onPress={() => this.SubmitForm()}>
              다음
            </Button>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

export default RegisterScreen;
