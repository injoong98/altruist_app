import React, {Component, isValidElement, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  Alert,
  DatePickerAndroid,
  Pressable,
} from 'react-native';
import {
  Text,
  Input,
  TopNavigation,
  TopNavigationAction,
  Icon,
  CheckBox,
  Radio,
  RadioGroup,
} from '@ui-kitten/components';
import {
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import axios from 'axios';
import Nextsvg from '../assets/icons/double-next.svg';

const BackIcon = (props) => (
  <Icon
    style={{width: 24, height: 24}}
    fill="#63579D"
    name="back-arrow"
    pack="alticons"
  />
);

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goNext: false,
      mem_sex: '1',
      captionCheck: '',
      column: '',
      borderColor: '',
      EmailIcon: false,
      date: new Date(),
      val: '',
      checked: false,
      nicknameCaption: '',
      idCaption: '',
      EmailCaption: '',
      pwmessage: '',
      equalPw: '',
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

  //components

  requiredInputList = [
    '* 이름',
    '* 닉네임',
    '* ID',
    '* EMAIL',
    '* 비밀번호',
    '* 비밀번호 확인',
  ];

  requiredStates = [
    'mem_username',
    'mem_nickname',
    'mem_userid',
    'mem_email',
    'mem_password',
    'mem_password_re',
  ];

  requiredInput = ({i}) => {
    const [color, setColor] = useState('#F8F8F8'); // 입력한 값을 set
    const [nextValKey, setNextValKey] = useState(this.requiredStates[i]);
    const [finalVal, setFinalVal] = useState('');

    const requiredCaption = [
      null,
      this.state.nicknameCaption,
      this.state.idCaption,
      this.state.EmailCaption,
      this.state.pwmessage,
      this.state.equalPw,
    ];

    console.log('현재 nextKEY : ', nextValKey);
    console.log('현재 nextKEY : ', finalVal);
    console.log('현재 input handler : ', this.requiredStates[i]);
    console.log('placeholder input : ', this.requiredInputList[i]);
    console.log('state input : ', this.state);

    return (
      <Input
        style={[
          {backgroundColor: '#F8F8F8', borderRadius: 15, borderColor: color},
        ]}
        placeholder={this.requiredInputList[i]}
        secureTextEntry={!nextValKey.includes('password') ? false : true}
        onChangeText={(nextVal) => {
          setFinalVal(nextVal);
          this.setState({[nextValKey]: finalVal});
          i == 1 && this.checkNickname();
          i == 2 && this.checkId();
          i == 3 && this.checkEmail();
          i == 4 && this.checkPassword();
          i == 5 && this.EqualPW(this.state.mem_password, finalVal);
        }}
        caption={() =>
          requiredCaption[i] ? (
            <Text
              style={{
                color: 'red',
                paddingLeft: 10,
                fontSize: 10,
                paddingBottom: 3,
              }}>
              {requiredCaption[i]}
            </Text>
          ) : null
        }
        onEndEditing={() => {
          this.setState({[nextValKey]: finalVal});
          !finalVal ? setColor('red') : setColor('#F8F8F8');
          i == 1 && this.checkNickname();
          i == 2 && this.checkId();
          i == 3 && this.checkEmail();
          i == 4 && this.checkPassword();
          i == 5 && this.EqualPW(this.state.mem_password, finalVal);
        }}
      />
    );
  };

  //   TODO : 패스워드 확인
  EqualPW = (a, b = '') => {
    console.log(this.state);
    let equalPw = '';
    let pwmessage = '';
    if (a == b) {
      equalPw = '';
    } else {
      pwmessage = '';
      equalPw = '비밀번호가 일치하지 않습니다.';
    }
    this.setState({equalPw: equalPw});
    this.setState({pwmessage: pwmessage});
  };

  notRequiredList = ['휴대전화', '생년월일', '추천인'];

  notRequiredStates = ['mem_phone', 'mem_birthday', 'mem_recommend'];

  maxLength = [13, 11, 20];

  dataDetectorTypes = ['phoneNumber', 'phoneNumber', null];
  keyboardType = ['phone-pad', 'numeric', null];

  //성별, 생년월일 "" STring으로 안9들어가는 문제
  // 생년월일 string으로 변환하는 문제
  ConvertString = (something) => {
    console.info(something);
    let type = something.toString();
    return type;
  };

  PhoneHyphen = (phonenum) => {
    var number = phonenum.replace(/[^0-9]/g, '');
    var phone = '';

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

  BdayHyphen = (phonenum) => {
    console.log(phonenum);
    var number = phonenum.replace(/[^0-9]/g, '');
    var phone = '';
    console.log(number);

    let this_year = new Date().getFullYear();
    console.log(this_year);

    if (number.length < 5) {
      console.log(number);
      return number;
    } else if (number.length < 7) {
      phone += number.substr(0, 4);
      phone += '-';
      phone += number.substr(4);
    } else if (number.length < 11) {
      phone += number.substr(0, 4);
      phone += '-';
      phone += number.substr(4, 2);
      phone += '-';
      phone += number.substr(6);
    } else {
      phone += number.substr(0, 4);
      phone += '-';
      phone += number.substr(4, 2);
      phone += '-';
      phone += number.substr(6);
    }

    var value = phone;
    this.setState({mem_birthday: value});
  };

  bdaySubstr = (overwrited) => {
    let phonefinal = '';

    if (10 < overwrited.length) {
      console.log('14이상', overwrited.length);
      phonefinal = overwrited.substr(0, 10);
      this.setState({mem_birthday: phonefinal});
    }
    console.log('bdaySubstr', phonefinal);
  };

  phoneSubstr = (overwrited) => {
    let phonefinal = '';
    if (13 < overwrited.length) {
      console.log('14이상', overwrited.length);
      phonefinal += overwrited.substr(0, 13);
      this.setState({mem_phone: phonefinal});
    }
    console.log('phonefinal', phonefinal);
  };

  NotRequiredInput = ({n}) => {
    // const {maxLength, dataDetectorTypes, keyboardType} = this.props;
    // const [val, setVal] = useState(''); // 입력한 값을 set
    // const [color, setColor] = useState('#FFFFFF'); // 입력한 값을 set
    const [checked, setChecked] = useState(false);
    const [notRequiredList, setNotRequiredList] = useState(
      this.notRequiredList[n],
    );
    const [key, setKey] = useState(this.notRequiredStates[n]);
    const [notRequired, setNotRequiredVal] = useState('');

    return (
      <Input
        maxLength={this.maxLength[n]}
        dataDetectorTypes={this.dataDetectorTypes[n]}
        keyboardType={this.keyboardType[n]}
        style={[{borderRadius: 15, borderColor: '#FFFFFF'}]}
        placeholder={notRequiredList}
        onChangeText={(nextVal) => {
          this.maxLength[0] ? this.PhoneHyphen(nextVal) : null;
          this.maxLength[1] ? this.BdayHyphen(nextVal) : null;
          setNotRequiredVal(nextVal);
          this.setState({[key]: notRequired});
        }}
      />
    );
  };

  // checkKeyList = ['', 'nickname', 'userid', 'email', 'password', 'password_re'];
  // APIList = [
  //   '',
  //   'http://dev.unyict.org/api/register/nickname_check',
  //   'http://dev.unyict.org/api/register/userid_check',
  //   'http://dev.unyict.org/api/register/email_check',
  //   'http://dev.unyict.org/api/register/password_check',
  //   '',
  // ];

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
        <Radio>
          <Text style={{color: '#63579D'}} category="p1">
            남자
          </Text>
        </Radio>
        <Radio>
          <Text style={{color: '#63579D'}} category="p1">
            여자
          </Text>
        </Radio>
      </RadioGroup>
    );
  };

  CheckboxKitten = () => {
    const [checked, setChecked] = React.useState(false);

    return (
      <CheckBox
        checked={checked}
        onChange={(nextChecked) => {
          setChecked(nextChecked);
          this.setState({checked: nextChecked});
        }}>
        {/* {`Checked: ${checked}`} */}
      </CheckBox>
    );
  };

  NoString = (str) => {
    var nostring = str.replace(/\D/g, '');
    this.setState({mem_phone: nostring});
  };
  NoString2 = (str) => {
    var nostring2 = str.replace(/\D/g, '');
    this.setState({mem_birthday: nostring2});
  };

  //이거 꼭 수정하기
  ReadAgreement = () => (
    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('AgreementScreen', {
            name: '회원약관',
            id: 1,
          })
        }>
        <Text
          category="s1"
          style={{
            color: '#63579D',
            textDecorationLine: 'underline',
            //ios
            textDecorationColor: '#63579D',
          }}>
          회원약관
        </Text>
      </TouchableOpacity>
      <Text
        category="s1"
        style={{
          color: '#63579D',
        }}>
        {' '}
        과{' '}
      </Text>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('AgreementScreen', {
            name: '개인정보 취급방침',
            id: 2,
          })
        }>
        <Text
          category="s1"
          style={{
            color: '#63579D',
            textDecorationLine: 'underline',
            //ios
            textDecorationColor: '#63579D',
          }}>
          개인정보 취급방침
        </Text>
      </TouchableOpacity>
      <Text
        category="s1"
        style={{
          color: '#63579D',
        }}>
        에 동의합니다
      </Text>
    </View>
  );
  //   TODO : 이메일 중복 확인
  checkEmail = async () => {
    const {mem_email} = this.state;

    let formdata = new FormData();
    formdata.append('email', mem_email);

    await axios
      .post(`http://dev.unyict.org/api/register/email_check`, formdata)
      .then((res) => {
        console.log(res.data);
        if (res.data.message.includes('예약어')) {
          // this.setState({goNext: true});
          this.setState({EmailCaption: res.data.message});
        } else if (res.data.message.includes('사용중')) {
          // this.setState({goNext: true});
          this.setState({EmailCaption: res.data.message});
        } else {
          this.setState({EmailCaption: res.data.message});
        }
      });
  };

  //   TODO : 비밀번호 확인
  checkPassword = async () => {
    const {mem_password} = this.state;

    let formdata = new FormData();
    formdata.append('password', mem_password);

    await axios
      .post(`http://dev.unyict.org/api/register/password_check`, formdata)
      .then((res) => {
        console.log(res.data);
        const pwmessage = res.data.message;
        this.setState({pwmessage: pwmessage});
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

  //userid - userid API
  checkId = async () => {
    const {mem_userid} = this.state;

    let formdata = new FormData();
    formdata.append('userid', mem_userid);

    await axios
      .post(`http://dev.unyict.org/api/register/userid_check`, formdata)
      .then((res) => {
        console.log(res.data);

        if (res.data.message.includes('사용중')) {
          this.setState({idCaption: res.data.message});
        } else if (res.data.result == 'available') {
          this.setState({idCaption: null});
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
        console.log(res.data);
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
        if (res.data.status == 500) {
          console.log('status', res.data.status);
          console.log(res.data.message);
          console.log('실패');
          //실패 모달
          Alert.alert(
            '가입실패',
            '문제가 계속되면 관리자에게 문의해주세요. \ndev.altruists.net@gmail.com',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
        } else if (res.data.status == 200) {
          console.log('status', res.data.status);
          console.log(res.data.message);
          this.props.navigation.navigate('RegisterSuccessScreen');
        } else {
        }
      })
      .catch((error) => {
        console.log('ERROR', error);
        console.error();
      });
  };

  //map OR bind notRequiredStates + requiredStates
  //AND for statement without useing for() or foreach()
  checkRequires = () => {
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

    //필수값 하나라도 없으면 필수값입력 안내
    if (
      !mem_username ||
      !mem_nickname ||
      !mem_sex ||
      !mem_userid ||
      !mem_email ||
      !mem_password ||
      !mem_password_re
    ) {
      Alert.alert(
        '필수값 미입력',
        '필수값은 \n이름, 닉네임, 성별, 아이디, 이메일, 비밀번호, 비밀번호 확인(총 7개)입니다.\n한번 더 확인 후, 문제가 계속되면\n관리자에게 문의해주세요.',
        [{text: '확인', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } else {
      if (!checked) {
        this.setState({goNext: false});
      } else {
        console.log('yes');
        this.setState({goNext: true});
        this.SubmitForm();
      }
    }
  };

  nextStep = () => (
    <View
      style={{
        paddingBottom: 60,
        flexDirection: 'row',
        alignContent: 'flex-end',
        alignSelf: 'flex-end',
      }}>
      {!this.state.goNext ? (
        <Text style={{color: '#63579D'}} category="p2">
          필수값을 입력해주세요
        </Text>
      ) : (
        <TouchableOpacity onPress={() => this.checkRequires()}>
          <Text style={{color: '#63579D'}} category="p2">
            다음{' '}
          </Text>
          <Nextsvg fill="#63579D" style={{transform: [{rotate: '180deg'}]}} />
        </TouchableOpacity>
      )}
    </View>
  );

  //end : components

  render() {
    console.log(this.state);
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <TopNavigation
          title={() => <Text category="h2">회원가입</Text>}
          alignment="center"
          accessoryLeft={this.BackAction}
        />
        <ScrollView
          style={{
            backgroundColor: '#FFFFFF',
            flex: 1,
            paddingEnd: 45,
            paddingStart: 45,
            paddingTop: 30,
          }}>
          {/* <ScrollView
          style={{
            backgroundColor: 'red',
          }}> */}
          {/* 이름 */}
          <this.requiredInput i={0} />
          {/* 닉네임 */}
          <this.requiredInput i={1} caption={this.state.idCaption} />
          {/* 성별 */}
          <this.RadioSexSelection />
          {/* '* ID', */}
          <this.requiredInput i={2} />
          {/* '* EMAIL', */}
          <this.requiredInput i={3} />
          {/* '* 비밀번호', */}
          <this.requiredInput i={4} />
          {/* '* 비밀번호 확인', */}
          <this.requiredInput i={5} />
          <View style={{padding: 10}}></View>

          <Input
            style={styles.inputs}
            maxLength={13}
            keyboardType="phone-pad"
            dataDetectorTypes="phoneNumber"
            placeholder="휴대전화"
            onChangeText={(mem_phone) => {
              this.setState({mem_phone: mem_phone});
              this.NoString(mem_phone);
              this.PhoneHyphen(mem_phone);
            }}
            onEndEditing={() => {
              this.phoneSubstr(this.state.mem_phone);
            }}
            caption={this.state.phoneCaption}
            value={this.state.mem_phone}
          />
          <Input
            style={styles.inputs}
            maxLength={10}
            keyboardType="numeric"
            dataDetectorTypes="phoneNumber"
            placeholder="생년월일 ( ex. 2000-01-01 ) "
            onChangeText={(mem_birthday) => {
              this.setState({mem_birthday: mem_birthday});
              this.NoString2(mem_birthday);
              this.BdayHyphen(mem_birthday);
            }}
            onEndEditing={() => this.bdaySubstr(this.state.mem_birthday)}
            caption={this.state.bdayCaption}
            value={this.state.mem_birthday}
          />

          <Input
            style={styles.inputs}
            placeholder="추천인 아이디"
            onChangeText={(mem_recommend) =>
              this.setState({mem_recommend: mem_recommend})
            }
            onEndEditing={() => {
              this.checkNotNull();
              this.checkRecommend();
            }}
            caption={this.state.recommendCaption}
          />

          {/* 휴대폰번호 */}
          {/* <this.NotRequiredInput n={0} /> */}
          {/* 생일 */}
          {/* <this.NotRequiredInput n={1} /> */}
          {/* 추천인 */}
          {/* <this.NotRequiredInput n={2} /> */}

          {/* 서명문 체크 */}
          <View
            style={{
              paddingTop: 10,
              // paddingLeft: 10, paddingRight: 10,
              // flex: 1,
              alignSelf: 'center',
              textDecorationColor: '#63579D',
              flexDirection: 'row',
            }}>
            <this.CheckboxKitten />
            <Text category="s1" style={{color: '#63579D'}}>
              {` `} * 하늘 부모님 성회 아래
              {`\n`} {` `}
              이타주의자 활동을 양심적으로 하겠습니다
            </Text>
          </View>
          {/* 개인정보 처리 & 이용약관 */}
          <View
            style={{
              paddingTop: 20,
              paddingBottom: 20,
            }}>
            <this.ReadAgreement />
          </View>
          <this.nextStep />
        </ScrollView>
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
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    borderColor: '#FFFFFF',
    color: '#A897C2',
  },
  inputDeny: {
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    borderColor: 'red',
  },
  radio: {
    fontSize: 13,
    padding: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statementfont: {
    fontWeight: 'bold',
    color: '#63579D',
    paddingLeft: 15,
  },
});

export default RegisterScreen;
