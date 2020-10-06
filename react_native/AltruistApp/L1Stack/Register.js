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

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // mem_userid: '',
      // mem_email: '',
      // mem_password: '',
      // mem_password_re: '',
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
    const [finalVal, setfinalVal] = useState('');
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
        secureTextEntry={false}
        onChangeText={(nextVal) => {
          setfinalVal(nextVal);
          this.setState({[nextValKey]: finalVal});
        }}
        onEndEditing={() =>
          //중복, 형식 체크
          // : 닉네임, ID, EMAIL, 비밀번호, 비밀번호 확인
          {
            this.setState({[nextValKey]: finalVal});
            !finalVal ? setColor('red') : color;
            {
              console.log('color', color);
              console.log('finalVal', finalVal);
            }
          }
        }
      />
    );
  };

  notRequiredList = ['휴대폰 번호', '생년월일', '추천인'];

  notRequiredStates = ['mem_phone', 'mem_birthday', 'mem_recommend'];

  NotRequiredInput = ({i}) => {
    // const [val, setVal] = useState(''); // 입력한 값을 set
    // const [color, setColor] = useState('#FFFFFF'); // 입력한 값을 set
    const [checked, setChecked] = useState(false);
    const [nextValKey, setNextValKey] = useState(this.notRequiredStates[i]);
    const [finalVal, setfinalVal] = useState('');

    return (
      <Input
        style={[{borderRadius: 15, borderColor: '#FFFFFF'}]}
        placeholder={this.notRequiredList[i]}
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
        style={{
          color: '#63579D',
        }}>
        에 동의합니다
      </Text>
    </View>
  );
  // checkFormAndDuplicate = (j) => {
  //   checkKeyList[j] = this.state;

  //   let formdata = new FormData();
  //   formdata.append(checkFormAndDuplicateList[j], this.checkKeyList[j]);

  //   await axios
  //   .post(this.APIList[j], formdata)
  //   .then((res) => {
  //     console.log(res.data);

  //   });
  // }

  //end : components

  render() {
    console.log(this.state);
    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
          paddingLeft: 30,
          paddingRight: 30,
        }}>
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
        {/* 휴대폰번호 */}
        <this.NotRequiredInput i={0} />
        {/* 생일 */}
        <this.NotRequiredInput i={1} />
        {/* 추천인 */}
        <this.NotRequiredInput i={2} />
        {/* 서명문 체크 */}
        {/* <this.checkAgreementState /> */}
        <View
          style={{
            // flex: 1,
            paddingTop: 20,
            paddingBottom: 20,
            padding: 3,
            alignSelf: 'center',
            textDecorationColor: '#63579D',
            flexDirection: 'row',
          }}>
          <this.CheckboxKitten />
          <Text category="s1" style={{color: '#63579D'}}>
            {` `} * 하늘 부모님 성회 아래
            {`\n`} {` `}
            {` `} 이타주의자 활동을 양심적으로 하겠습니다
          </Text>
        </View>
        {/* 개인정보 처리 & 이용약관 */}
        <this.ReadAgreement />
        <Text category="p2">다음</Text>
      </View>
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
