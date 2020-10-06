import React, {Component, useState} from 'react';
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
      mem_sex: '1',
      captionCheck: '',
      column: '',
      borderColor: '',
      EmailIcon: false,
      goNext: true,
      date: new Date(),
      val: '',
      checked: false,
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
    const [val, setVal] = useState(''); // 입력한 값을 set
    const [color, setColor] = useState('#FFFFFF'); // 입력한 값을 set
    const [checked, setChecked] = useState(false);
    const [nextValKey, setNextValKey] = useState(this.requiredStates[i]);
    const [finalVal, setFinalVal] = useState('');
    const [caption, setCaption] = useState('');
    const initialBoarderColor = '#FFFFFF';

    console.log('현재 nextKEY : ', nextValKey);
    console.log('현재 nextKEY : ', finalVal);
    console.log('현재 input handler : ', this.requiredStates[i]);
    console.log('placeholder input : ', this.requiredInputList[i]);
    console.log('state input : ', this.state);

    return (
      <Input
        style={[{borderRadius: 15, borderColor: color}]}
        placeholder={this.requiredInputList[i]}
        secureTextEntry={!nextValKey.includes('password') ? false : true}
        onChangeText={(nextVal) => {
          setFinalVal(nextVal);
          this.setState({[nextValKey]: finalVal});
        }}
        caption={() =>
          caption ? (
            <Text style={{paddingLeft: 10, fontSize: 10}}>{caption}</Text>
          ) : null
        }
        onEndEditing={() =>
          //중복, 형식 체크
          // : 닉네임, ID, EMAIL, 비밀번호, 비밀번호 확인
          {
            this.setState({[nextValKey]: finalVal});
            !finalVal ? setColor('red') : setColor('#FFFFFF');
            !finalVal ? setCaption('없습니다 값이') : setCaption('');
            {
              console.log('color', color);
              console.log('finalVal', finalVal);
            }
          }
        }
      />
    );
  };

  notRequiredList = ['휴대전화', '생년월일', '추천인'];

  notRequiredStates = ['mem_phone', 'mem_birthday', 'mem_recommend'];

  maxLength = [13, 11, 20];

  dataDetectorTypes = ['phoneNumber', 'phoneNumber', null];
  keyboardType = ['phone-pad', 'numeric', null];

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

  checkKeyList = ['', 'nickname', 'userid', 'email', 'password', 'password_re'];
  APIList = [
    '',
    'http://dev.unyict.org/api/register/nickname_check',
    'http://dev.unyict.org/api/register/userid_check',
    'http://dev.unyict.org/api/register/email_check',
    'http://dev.unyict.org/api/register/password_check',
    '',
  ];

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

  // checkAgreementState = () => (

  // );

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
      console.log('yes');
      this.SubmitForm();
    }
  };

  nextStep = () => (
    <TouchableOpacity
      style={{
        paddingBottom: 60,
        flexDirection: 'row',
        alignContent: 'flex-end',
        alignSelf: 'flex-end',
      }}
      onPress={() => this.checkRequires()}>
      <Text style={{color: '#63579D'}} category="p2">
        다음{' '}
      </Text>
      <Nextsvg fill="#63579D" style={{transform: [{rotate: '180deg'}]}} />
    </TouchableOpacity>
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
          <this.requiredInput i={1} />
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
          {/* 휴대폰번호 */}
          <this.NotRequiredInput n={0} />

          {/* 생일 */}
          <this.NotRequiredInput n={1} />
          {/* 추천인 */}
          <this.NotRequiredInput n={2} />

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
