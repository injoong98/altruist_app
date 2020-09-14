import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
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
      .post('http://10.0.2.2/api/register/form', formdata)
      .then((response) => {
        console.log('response', response);
        console.log('this.state', this.state);
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

  UselessTextInput = ({column, placeholder}) => {
    const [textInputValue, setTextInputValue] = React.useState('');

    return (
      <Input
        onChangeText={(text) => setTextInputValue(text)}
        value={textInputValue}
        placeholder={placeholder}
      />
    );
  };
  //   TODO : 성별

  //   TODO : 휴대폰 번호

  //   TODO : 패스워드 확인
  CheckPassword = ({mem_password, mem_password_re}) => {
    console.log(this.state);
    const {checkPassword} = this.state;
    if ({mem_password} == {mem_password_re}) {
      this.checkPassword = 'Not matched';
    } else {
      this.checkPassword = '';
    }
    this.setState({captionCheck: checkPassword});
  };

  componentDidMount() {
    // console.log('mount됌');
    // Axios.post(' dev.unyict.org/api/register/form', formdata);
  }
  componentDidUpdate() {
    console.log('update됌');
  }

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
            <View style={{flex: 1, justifyContent: 'center', padding: 50}}>
              <Input
                style={{padding: 3}}
                placeholder="이름"
                onChangeText={(mem_userid) =>
                  this.setState({mem_userid: mem_userid})
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
                placeholder="이메일 (ID 겸용) "
                onChangeText={(mem_email) => this.setState({mem_email: mem_email})}
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
                onChangeText={(mem_password_re) =>
                  this.setState({mem_password_re: mem_password_re})
                }
                caption={this.state.caption}
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
                <Button style={{width: '45%'}}>여성</Button>
                <Button style={{width: '45%'}}>남성</Button>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'stretch',
                  alignContent: 'stretch',
                }}>
                {/* <Button
                  style={{alignSelf: 'stretch'}}
                  onPress={() =>
                    this.props.navigation.navigate('QuestionScreen')
                  }>
                  여성
                </Button>
                <Button
                  style={{alignSelf: 'stretch'}}
                  onPress={() =>
                    this.props.navigation.navigate('QuestionScreen')
                  }>
                  남성
                </Button> */}
              </View>
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
