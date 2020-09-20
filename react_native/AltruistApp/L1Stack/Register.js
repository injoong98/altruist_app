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
// import RegisterSuccessScreen from './RegisterSuccess';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CalendarIcon = (props) => <Icon {...props} name="calendar" />;

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

  //성별, 생년월일 "" STring으로 안9들어가는 문제
  // 생년월일 string으로 변환하는 문제
  ConvertString = (something) => {
    console.info(something);
    let type = something.toString();
    return type;
  };

  //   TODO : 생년월일
  DatepickerBday = () => {
    // const today = new Date(1900, 1, 1);
    const [date, setDate] = useState(new Date());
    const formatDateService = new NativeDateService('en', {
      format: 'YYYY-MM-DD',
    });
    // console.log('date', today);
    return (
      <Datepicker
        accessoryRight={CalendarIcon}
        min={new Date(1900, 1, 1)}
        date={date}
        dateService={formatDateService}
        onSelect={(nextDate) => {
          setDate(nextDate);
          this.setState({
            mem_birthday: moment(this.ConvertString(nextDate)).format(
              'YYYY-MM-DD',
            ),
          });
        }}
      />
    );
  };

  //   TODO : 성별
  RadioSexSelection = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    return (
      <RadioGroup
        style={{
          padding: 3,
          marginBottom: 8,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
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
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                paddingRight: 30,
                paddingLeft: 30,
              }}>
              <Input
                style={{padding: 3}}
                placeholder="이름"
                onChangeText={(mem_username) =>
                  this.setState({mem_username: mem_username})
                }
              />
              <Input
                style={{padding: 3}}
                placeholder="닉네임 / 활동명"
                onChangeText={(mem_nickname) =>
                  this.setState({mem_nickname: mem_nickname})
                }
              />
              <this.RadioSexSelection />
              <Input
                keyboardType="email-address"
                textContentType="emailAddress" //ios
                placeholder="Email (example@email.com)"
                onChangeText={(mem_email) => {
                  this.setState({mem_email: mem_email, mem_userid: mem_email});
                }}
                onEndEditing={this.checkEmail}
                caption={this.state.EmailCaption}
                style={{padding: 3}}
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
                // caption={() =>
                //   this.state.captionCheck ? (
                //     <Text style={{color: 'red'}}>
                //       {this.state.captionCheck}
                //     </Text>
                //   ) : null
                // }
                caption={() => (
                  <Text style={{color: 'red'}}>{this.state.captionCheck}</Text>
                )}
                secureTextEntry
              />
              <Input
                keyboardType="phone-pad"
                dataDetectorTypes="phoneNumber"
                style={{padding: 3}}
                placeholder="휴대전화"
                onChangeText={(mem_phone) =>
                  this.setState({mem_phone: mem_phone})
                }
              />
              <this.DatepickerBday />
              <Input
                style={{padding: 3}}
                placeholder="추천인"
                onChangeText={(mem_recommend) =>
                  this.setState({mem_recommend: mem_recommend})
                }
              />
              <Input style={{padding: 3}} placeholder="서명문" />
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'stretch',
                  alignContent: 'stretch',
                }}></View> */}
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

RegisterScreen.propTypes = {
  mem_email: PropTypes.string.isRequired,
  mem_password: PropTypes.string.isRequired,
  mem_password_confirm: PropTypes.string.isRequired,
  mem_nickname: PropTypes.string.isRequired,
  mem_phone: PropTypes.string.isRequired,
  mem_sex: PropTypes.number.isRequired,
  mem_birthday: PropTypes.instanceOf(Date).isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RegisterScreen;
