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
// import moment from '@ui-kitten/moment';
import moment from 'moment';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import axios from 'axios';
// import RegisterSuccessScreen from './RegisterSuccess';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CalendarIcon = (props) => <Icon {...props} name="calendar" />;
const ApprovedIcon = (props) => (
  <Icon
    {...props}
    name="checkmark-outline
"
  />
);
const OneCheckIcon = (props) => (
  <Icon
    {...props}
    name="checkmark-outline
"
  />
);
const DoubleCheckcon = (props) => (
  <Icon
    {...props}
    name="done-all-outline


"
  />
);
const DangerIcon = (props) => (
  <Icon
    {...props}
    name="alert-circle-outline
"
  />
);

const LoadingIndicator = (props) => (
  <View style={[props.style, styles.indicator]}>
    <Spinner size="small" />
  </View>
);

class RegisterScreen extends Component {
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
      borderColor: '',
      EmailIcon: false,
      goNext: true,
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

  //처음엔 버튼을 disabled
  //다른 input 다 적으면 abled

  checkInputs = (e) => {
    console.log('checkInputs, submit전에');
    // this.state.goNext = 'true';
    this.state.goNext = false;
    if (!this.state.mem_username) {
      this.setState({usernameStyle: '{styles.inputDeny}'});
      return;
    }
    if (this.state.mem_nickname == '' || this.state.mem_nickname == null) {
      this.setState({nicknameStyle: styles.inputDeny});
      return;
    }
    if (this.state.mem_sex == '' || this.state.mem_sex == null) {
      this.setState({sexStyle: styles.inputDeny});
      return;
    }
    // if (this.state.mem_userid == '' || this.state.mem_userid == null) {
    //   this.setState({Style: styles.inputDeny});
    //   return;
    // }
    if (this.state.mem_email == '' || this.state.mem_email == null) {
      this.setState({emailStyle: styles.inputDeny});
      return;
    }
    if (this.state.mem_password == '' || this.state.mem_password == null) {
      this.setState({pwStyle: styles.inputDeny});
      return;
    }
    if (
      this.state.mem_password_re == '' ||
      this.state.mem_password_re == null
    ) {
      this.setState({pwreStyle: styles.inputDeny});
      return;
    }
    console.log('no');
    this.SubmitForm();
  };

  checkNotNull = () => {
    console.log('checkNotNull, input칸 떠날때마다');
    if (
      !this.state.mem_username ||
      !this.state.mem_nickname ||
      !this.state.mem_sex ||
      !this.state.mem_email ||
      !this.state.mem_password ||
      !this.state.mem_password_re
    ) {
      console.log('checkNotNull : atleastoneisnot');
      this.setState({goNext: true});
    } else if (
      this.state.mem_username &&
      this.state.mem_nickname &&
      this.state.mem_sex &&
      this.state.mem_email &&
      this.state.mem_password &&
      this.state.mem_password_re
    ) {
      console.log('checkNotNull : Allfilled');
      if (this.state.captionCheck) {
        console.log('checkNotNull : passwordNotmatched');
        this.setState({goNext: true});
      } else {
        console.log('checkNotNull : passwordmatched');
        this.setState({goNext: false});
      }
      //이메일 체크
      if (this.state.EmailCaption.includes('없는')) {
        console.log('checkNotNull : emailisnotright');
        this.setState({goNext: true});
      }
    }
    // return;
  };

  //form submit
  SubmitForm = async () => {
    const {
      mem_username,
      mem_nickname,
      mem_sex,
      mem_userid,
      mem_email,
      mem_password,
      mem_password_re,
      mem_phone,
      mem_birthday,
      mem_recommend,
    } = this.state;

    let formdata = new FormData();
    formdata.append('mem_username', mem_username);
    formdata.append('mem_nickname', mem_nickname);
    formdata.append('mem_sex', mem_sex);
    formdata.append('mem_userid', mem_userid);
    formdata.append('mem_email', mem_email);
    formdata.append('mem_password', mem_password);
    formdata.append('mem_password_re', mem_password_re);
    formdata.append('mem_phone', mem_phone);
    formdata.append('mem_birthday', mem_birthday);
    formdata.append('mem_recommend', mem_recommend);
    console.info('form', this.state);

    await axios
      .post('http://dev.unyict.org/api/register/form', formdata)
      .then((res) => {
        console.log('response', res);
        console.log('status', res.data.status);
        console.log('data', res.data);
        if (res.status == 500) {
          Alert.aler(
            '실패',
            res.data.reason[
              {
                text: '확인',
              }
            ],
          );
          //실패시,
          return;
        } else if (res.status == 200) {
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
  PhoneHyphen = (phonenum) => {
    //넣었다가 아니면 뱉어주고
    //11자 되기 전에는 3자리, 8자리 기준으로
    //3자리에서 뱉어주고 뱉어준거 다시 받아서
    //4자리부터는 -가지고 다시 이어나갈 수 있도록
    console.log(phonenum);
    var number = phonenum.replace(/[^0-9]/g, '');
    var phone = '';
    console.log(number);

    if (number.length < 4) {
      return number;
    } else if (number.length < 7) {
      phone += number.substr(0, 3);
      phone += '-';
      phone += number.substr(3);
    } else if (number.length < 11) {
      phone += number.substr(0, 3);
      phone += '-';
      phone += number.substr(3, 3);
      phone += '-';
      phone += number.substr(6);
    } else {
      phone += number.substr(0, 3);
      phone += '-';
      phone += number.substr(3, 4);
      phone += '-';
      phone += number.substr(7);
    }
    var value = phone;
    this.setState({mem_phone: value});
  };

  //   TODO : 이메일 중복 확인
  checkEmail = async () => {
    const {mem_userid} = this.state;

    let formdata = new FormData();
    formdata.append('email', mem_userid);

    await axios
      .post(`http://dev.unyict.org/api/register/email_check`, formdata)
      .then((res) => {
        console.log(res.data);
        if (res.data.message.includes('예약어')) {
          this.setState({goNext: true});
          this.setState({EmailCaption: res.data.message});
        } else if (res.data.message.includes('사용중')) {
          this.setState({goNext: true});
          this.setState({EmailCaption: res.data.message});
        } else {
          this.setState({EmailCaption: res.data.message});
          this.setState({EmailIcon: true});
        }
      });
  };

  //추천인 - userid API
  checkRecommend = async () => {
    const {mem_recommend} = this.state;

    let formdata = new FormData();
    formdata.append('userid', mem_recommend);

    await axios
      .post(`http://dev.unyict.org/api/register/userid_check`, formdata)
      .then((res) => {
        console.log(res.data);

        if (res.data.message.includes('사용중')) {
          this.setState({recommendCaption: null});
        } else if (res.data.result == 'available') {
          this.setState({recommendCaption: '없는 아이디 입니다.'});
        }
      });
  };

  checkNickname = async () => {
    const {mem_nickname} = this.state;

    let formdata = new FormData();
    formdata.append('nickname', mem_nickname);

    await axios
      .post(`http://dev.unyict.org/api/register/nickname_check`, formdata)
      .then((res) => {
        if (res.data.reason == '닉네임값이 넘어오지 않았습니다') {
          this.setState({goNext: true});
          this.setState({nicknameCaption: '닉네임값을 입력해주세요'});
        } else {
          if (res.data.message.includes('사용중')) {
            this.setState({goNext: true});
            this.setState({nicknameCaption: res.data.reason});
          } else {
            this.setState({nicknameCaption: res.data.reason});
          }
        }
      });
  };

  //성별, 생년월일 "" STring으로 안9들어가는 문제
  // 생년월일 string으로 변환하는 문제
  ConvertString = (something) => {
    console.info(something);
    let type = something.toString();
    return type;
  };

  //   TODO : 생년월일
  DatepickerBday = () => {
    const [date, setDate] = useState(new Date());
    const formatDateService = new NativeDateService('en', {
      format: 'YYYY-MM-DD',
    });
    return (
      <Datepicker
        size="small"
        style={{margin: 10}}
        min={new Date(1900, 1, 1)}
        date={date}
        dateService={formatDateService}
        onSelect={(nextDate) => {
          setDate(nextDate);
        }}
      />
    );
  };

  //   TODO : 성별
  RadioSexSelection = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    return (
      <RadioGroup
        style={styles.radio}
        selectedIndex={selectedIndex}
        onChange={(index) => {
          setSelectedIndex(index);
          this.setState({mem_sex: this.ConvertString(index + 1)});
        }}>
        <Radio>남자</Radio>
        <Radio>여자</Radio>
      </RadioGroup>
    );
  };

  //   TODO : 패스워드 확인
  CheckPassword = (a, b = '') => {
    console.log(this.state);
    let checkPassword = '';
    if (a == b) {
      checkPassword = '';
      this.setState({goNext: false});
    } else {
      checkPassword = '비밀번호가 일치하지 않습니다.';
      this.setState({goNext: true});
    }
    this.setState({captionCheck: checkPassword});
  };

  changeBorderColor = () => {};

  render() {
    console.log(this.state);
    return (
      <>
        <TopNavigation
          title="회원가입"
          alignment="center"
          accessoryLeft={this.BackAction}
        />
        <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
          <ScrollView>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                paddingRight: 60,
                paddingLeft: 60,
              }}>
              <Input
                style={styles.inputs}
                placeholder="* 이름"
                onChangeText={(mem_username) => {
                  this.setState({mem_username: mem_username});
                }}
                onEndEditing={() => {
                  this.checkNotNull();
                }}
              />
              <Input
                style={styles.inputs}
                placeholder="* 닉네임 "
                onChangeText={(mem_nickname) => {
                  this.setState({mem_nickname: mem_nickname});
                  this.checkNotNull();
                }}
                onEndEditing={() => {
                  this.checkNotNull();
                }}
                caption={this.state.nicknameCaption}
              />
              <this.RadioSexSelection />
              {/* validation : 사용자가 input창에서 딱 벗어났을 때 
            1. null 값 체크 
            2. mem_email 마지막으로 입력된 값*/}
              <Input
                // {...(this.checkNotNull ? 'yes' : '')}
                style={styles.inputs}
                keyboardType="email-address"
                textContentType="emailAddress" //ios
                placeholder="* 이메일 (ID겸용)"
                onChangeText={(mem_email) => {
                  this.setState({mem_email: mem_email, mem_userid: mem_email});
                  this.checkEmail(mem_email);
                }}
                onEndEditing={() => {
                  this.checkNotNull();
                  this.checkEmail(this.state.mem_email);
                }}
                caption={this.state.EmailCaption}
              />
              <Input
                style={
                  !this.state.mem_password ? styles.inputDeny : styles.inputs
                }
                secureTextEntry={true}
                placeholder="* 비밀번호"
                onChangeText={(mem_password) => {
                  this.setState({mem_password: mem_password});
                  this.CheckPassword(mem_password, this.state.mem_password_re);
                }}
                onEndEditing={() => {
                  this.checkNotNull();
                }}
              />
              <Input
                style={
                  !this.state.mem_password_re ? styles.inputDeny : styles.inputs
                }
                secureTextEntry={true}
                placeholder="* 비밀번호 확인"
                onChangeText={(mem_password_re) => {
                  this.setState({mem_password_re: mem_password_re});
                  //{} 하면 obj로 던져서 obj.이름 해야지 됌
                  this.CheckPassword(this.state.mem_password, mem_password_re);
                }}
                onEndEditing={() => {
                  this.checkNotNull();
                }}
                caption={() =>
                  this.state.captionCheck ? (
                    <Text category="c1" style={{color: 'red'}}>
                      {this.state.captionCheck}
                    </Text>
                  ) : null
                }
              />
              <Input
                style={styles.inputs}
                maxLength={13}
                keyboardType="phone-pad"
                dataDetectorTypes="phoneNumber"
                placeholder="휴대전화"
                onChangeText={(mem_phone) => {
                  this.setState({mem_phone: mem_phone});
                  this.PhoneHyphen(mem_phone);
                }}
                onEndEditing={() => this.PhoneHyphen(this.state.mem_phone)}
                caption={this.state.phoneCaption}
                value={this.state.mem_phone}
              />
              <this.DatepickerBday />
              <Input
                style={styles.inputs}
                placeholder="추천인 이메일"
                onChangeText={(mem_recommend) =>
                  this.setState({mem_recommend: mem_recommend})
                }
                onEndEditing={() => {
                  this.checkNotNull();
                  this.checkRecommend();
                  this.changeBorderColor();
                }}
                caption={this.state.recommendCaption}
              />
              <View>
                <Text style={styles.statementfont}>서명문</Text>

                <Input
                  style={styles.inputs}
                  label={() => (
                    <Text category="s2" style={styles.statementfont}>
                      이타주의자 앱 사용중에
                    </Text>
                  )}
                  placeholder="위와 동일하게 작성"
                  onChangeText={(text) => this.setState({mustInput: text})}
                />

                {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'stretch',
                  alignContent: 'stretch',
                }}></View> */}
              </View>
            </View>
            {/* 동의 및 다음 버튼 */}
            <View
              style={{
                alignSelf: 'center',
                flexDirection: 'row',
                padding: 3,
                color: '#63579D',
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('AgreementScreen')
                }>
                <Text
                  style={{
                    color: 'blue',
                    textDecorationLine: 'underline',
                    //ios
                    textDecorationColor: 'blue',
                  }}>
                  이용 방침
                </Text>
              </TouchableOpacity>
              <Text> 과 </Text>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('AgreementScreen')
                }>
                <Text
                  style={{
                    color: 'blue',
                    textDecorationLine: 'underline',
                    //ios
                    textDecorationColor: 'blue',
                  }}>
                  개인정보 취급방침
                </Text>
              </TouchableOpacity>
              <Text>에 동의합니다</Text>
            </View>
            <TouchableOpacity
              style={{
                alignContent: 'flex-end',
                alignSelf: 'flex-end',
                marginRight: 50,
              }}
              appearance="ghost"
              disabled={this.state.goNext}
              onPress={() => this.checkInputs()}>
              <Text style={{color: '#63579D', textAlign: 'center'}}>다음</Text>
            </TouchableOpacity>
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
  inputs: {
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    borderColor: '#FFFFFF',
    color: '#A897C2',
    // height: 30,
    // padding: 3,
    // marginTop: 15,
  },
  inputDeny: {
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    borderColor: 'red',
    // height: 30,
    // padding: 3,
    // marginTop: 15,
  },
  radio: {
    padding: 3,
    // marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statementfont: {
    color: '#63579D',
    paddingLeft: 15,
  },
});

export default RegisterScreen;
