import React, {Component, useState} from 'react';
import {
  View,
  TextInput,
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
  Spinner
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
      checked : true,
      isLoading : false
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
    this.setState({isLoading:true})
    this.state.goNext = false;
    if (!this.state.mem_userid) {
      return;
    }
    if (!this.state.mem_username) {
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
    // if (!this.state.checked) {
    //   return;
    // }
    console.log('no');
    this.SubmitForm();
  };

  checkNotNull = () => {
    console.log('checkNotNull, input칸 떠날때마다');
    if (
      !this.state.mem_userid ||
      !this.state.mem_username ||
      !this.state.mem_nickname || 
      !this.state.mem_sex ||
      !this.state.mem_email ||
      !this.state.mem_password ||
      !this.state.mem_password_re
    ) {
      if (!this.state.mem_userid) {
        this.setState({
          useridStyle: {
            backgroundColor: '#F8F8F8',
            borderRadius: 15,
            borderColor: 'red',
          },
        });
      } else {
        this.setState({useridStyle: ''});
      }
      if (!this.state.mem_username) {
        console.log('checkNotNull : usernameisempty');
        this.setState({
          usernameStyle: {
            backgroundColor: '#F8F8F8',
            borderRadius: 15,
            borderColor: 'red',
          },
        });
      } else {
        this.setState({usernameStyle: ''});
      }
      if (!this.state.mem_nickname) {
        this.setState({
          nicknameStyle: {
            backgroundColor: '#F8F8F8',
            borderRadius: 15,
            borderColor: 'red',
          },
        });
      } else {
        this.setState({nicknameStyle: ''});
      }
      if (!this.state.mem_sex) {
        this.setState({
          sexStyle: {
            backgroundColor: '#F8F8F8',
            borderRadius: 15,
            borderColor: 'red',
          },
        });
      } else {
        this.setState({sexStyle: ''});
      }
      if (!this.state.mem_email || !this.state.mem_email.includes('@')) {
        this.setState({
          emailStyle: {
            backgroundColor: '#F8F8F8',
            borderRadius: 15,
            borderColor: 'red',
          },
        });
      } else {
        this.setState({emailStyle: ''});
      }
      if (!this.state.mem_password) {
        this.setState({
          pwStyle: {
            backgroundColor: '#F8F8F8',
            borderRadius: 15,
            borderColor: 'red',
          },
        });
      } else {
        this.setState({pwStyle: ''});
      }
      if (!this.state.mem_password_re) {
        this.setState({
          pwreStyle: {
            backgroundColor: '#F8F8F8',
            borderRadius: 15,
            borderColor: 'red',
          },
        });
      } else {
        this.setState({pwreStyle: ''});
      }
      console.log('checkNotNull : atleastoneisnot');
      this.setState({goNext: true});
    } else if (
      this.state.mem_userid &&
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
        this.setState({checkNull: true});
      } else {
        console.log('checkNotNull : passwordmatched');
        console.log('this.state.checked', this.state.checked);
        this.setState({
          pwmessage: '',
          pwreStyle: '',
          goNext: false,
        });
      }
      //이메일 체크
      if (this.state.EmailCaption.includes('없는')) {
        console.log('checkNotNull : emailisnotright');
        this.setState({goNext: true});
      }
      if (this.state.EmailCaption.includes('예약어')) {
        this.setState({goNext: true});
      }
      if (this.state.EmailCaption.includes('가능')) {
        this.setState({goNext: false});
        this.setState({pwStyle: ''});
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
      .post('https://dev.unyict.org/api/register/form', formdata)
      .then((res) => {
        this.setState({isLoading:false})
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
            '필수값 압력이나 중복값이 없는지 확인해주세요!',
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

  handleInputChange = (text) => {
    if (/^\d+$/.test(text)) {
      this.setState({
        text: text,
      });
    }
  };

  NoString = (str) => {
    var nostring = str.replace(/\D/g, '');
    this.setState({mem_phone: nostring});
  };
  NoString2 = (str) => {
    var nostring2 = str.replace(/\D/g, '');
    this.setState({mem_birthday: nostring2});
  };

  //   TODO : 휴대폰 번호
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
    //넣었다가 아니면 뱉어주고
    //11자 되기 전에는 3자리, 8자리 기준으로
    //3자리에서 뱉어주고 뱉어준거 다시 받아서
    //4자리부터는 -가지고 다시 이어나갈 수 있도록
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

    // if (1900 < phone.substr(0, 4) < this_year) {
    //   console.log('1990]]]=fsaf', number.substr(0, 4).toString());
    // } else {
    //   this.setState({
    //     bdayCaption: '먼저 태어난 해를 4글자로 먼저 입력해주세요',
    //   });
    //   console.log('1990', number.substr(0, 4).toString());
    // }

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

  //   TODO : 이메일 중복 확인
  checkEmail = async () => {
    const {mem_email} = this.state;

    let formdata = new FormData();
    formdata.append('email', mem_email);

    await axios
      .post(`https://dev.unyict.org/api/register/email_check`, formdata)
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

  //   TODO : 비밀번호 확인
  checkPassword = async () => {
    const {mem_password} = this.state;

    let formdata = new FormData();
    formdata.append('password', mem_password);

    await axios
      .post(`https://dev.unyict.org/api/register/password_check`, formdata)
      .then((res) => {
        console.log(res.data);
        const pwmessage = res.data.message;
        this.setState({pwmessage: pwmessage});
      });
  };

  //추천인 - userid API
  checkRecommend = async () => {
    console.log('checkRecommend on');
    const {mem_recommend} = this.state;

    let formdata = new FormData();
    formdata.append('userid', mem_recommend);

    await axios
      .post(`https://dev.unyict.org/api/register/userid_check`, formdata)
      .then((res) => {
        console.log('res.data : ', res.data);

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
      .post(`https://dev.unyict.org/api/register/userid_check`, formdata)
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
      .post(`https://dev.unyict.org/api/register/nickname_check`, formdata)
      .then((res) => {
        console.log(res.data);
        if (res.data.reason == '닉네임값이 넘어오지 않았습니다') {
          this.setState({goNext: true});
          this.setState({nicknameCaption: '닉네임을 입력해주세요'});
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
        <Radio>
          <Text style={{color: '#63579D'}} category="p1">
            공개안함
          </Text>
        </Radio>
      </RadioGroup>
    );
  };

  //   TODO : 패스워드 확인
  EqualPW = (a, b = '') => {
    console.log(this.state);
    let eqaulPW = '';
    if (a == b) {
      eqaulPW = '';
      this.setState({goNext: false, pwmessage: ''});
    } else {
      eqaulPW = '비밀번호가 일치하지 않습니다.';
      this.setState({goNext: true});
    }
    this.setState({captionCheck: eqaulPW});
  };

  nextStep = () => (
    <TouchableOpacity
      style={{
        paddingBottom: 60,
        flexDirection: 'row',
        alignContent: 'flex-end',
        alignSelf: 'flex-end',
      }}
      onPress={() => this.checkInputs()}>
      <Text
        category="p2"
        style={{
          color: '#63579D',
        }}>
        {`다 음  `}
      </Text>
      <Nextsvg fill="#63579D" style={{transform: [{rotate: '180deg'}]}} />
    </TouchableOpacity>
  );

 
  clicktest = () =>{
    

    }

  componentDidMount(){
    console.log(this.state.isLoading)
  }

  render() {
    console.log(this.state);
    console.log('this.state.checked', this.state.checked);
    return (
      this.state.isLoading 
      ?
      <SafeAreaView
      style={{
        flex: 1,
        justifyContent:'center',
        alignItems:'center'  
      }}>
          <Spinner size="giant" />
          <Text style={{padding:20}}> 
          회원님의 정보를 저장중입니다 ... 
          </Text>
      </SafeAreaView>
      :      
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
        {
        this.state.isLoading&&
            <View style={{
              flex: 1,
              justifyContent:'center',
              alignItems:'center'}}>
               <Spinner size="giant"/>
               <Text> 회원님의 정보를 저장중입니다 ... </Text>
            </View>
  } 
          {/* 필수 */}
          <Input
            style={
              this.state.usernameStyle
                ? this.state.usernameStyle
                : styles.inputs
            }
            placeholder="* 이름"
            onChangeText={(mem_username) => {
              this.setState({mem_username: mem_username});
            }}
            onEndEditing={() => {
              this.checkNotNull();
            }}
          />
          <Input
            style={
              this.state.nicknameStyle
                ? this.state.nicknameStyle
                : styles.inputs
            }
            placeholder="* 닉네임 "
            onChangeText={(mem_nickname) => {
              this.setState({mem_nickname: mem_nickname});
              this.checkNotNull();
            }}
            onEndEditing={() => {
              this.checkNotNull();
              this.checkNickname();
            }}
            caption={() =>
              this.state.nicknameCaption != null && (
                <Text
                  style={{
                    color: 'red',
                    paddingLeft: 10,
                    fontSize: 10,
                    paddingBottom: 3,
                  }}>
                  {this.state.nicknameCaption}
                </Text>
              )
            }
          />
                      <Text category="s1" style={{color: '#63579D'}}>
              {` `} *닉네임은 설정 후 30일 뒤에 변경할 수 있습니다.
              
            </Text>
          <this.RadioSexSelection />
          {/* validation : 사용자가 input창에서 딱 벗어났을 때 
                1. null 값 체크 
                2. mem_email 마지막으로 입력된 값*/}
          {/* id 
                중복 체크,
                빈값 체크
                    */}
          <Input
            style={
              this.state.useridStyle ? this.state.useridStyle : styles.inputs
            }
            placeholder="* ID"
            onChangeText={(mem_userid) => {
              this.setState({mem_userid});
            }}
            onEndEditing={() => {
              this.checkNotNull();
              this.checkId(this.state.mem_userid);
            }}
            caption={() =>
              this.state.idCaption != null && (
                <Text
                  style={{
                    color: 'red',
                    paddingLeft: 10,
                    fontSize: 10,
                    paddingBottom: 3,
                  }}>
                  {this.state.idCaption}
                </Text>
              )
            }
          />
          <Input
            style={
              this.state.emailStyle ? this.state.emailStyle : styles.inputs
            }
            keyboardType="email-address"
            textContentType="emailAddress" //ios
            placeholder="* 이메일"
            
            onChangeText={(mem_email) => {
              this.setState({mem_email});
            }}
            onEndEditing={() => {
              this.checkNotNull();
              this.checkEmail(this.state.mem_email);
            }}
            caption={() =>
              this.state.EmailCaption != null && (
                <Text
                  style={{
                    color: 'red',
                    paddingLeft: 10,
                    fontSize: 10,
                    paddingBottom: 3,
                  }}>
                  {this.state.EmailCaption}
                </Text>
              )
            }
          />
          <Input
            style={
              this.state.pwStyle ? this.state.pwStyle : styles.inputs
            }
            secureTextEntry={true}
            
            placeholder="* 비밀번호"
            onChangeText={(mem_password) => {
              this.setState({mem_password});
              this.EqualPW(mem_password, this.state.mem_password_re);
            }}
            onEndEditing={() => {
              this.checkPassword();
              this.checkNotNull();
            }}
            caption={() =>
              this.state.pwmessage != null && (
                <Text
                  style={{
                    color: 'red',
                    paddingLeft: 10,
                    fontSize: 10,
                    paddingBottom: 13,
                  }}>
                  {this.state.pwmessage}
                </Text>
              )
            }
          />
          <Input
            style={
              this.state.pwreStyle ? this.state.pwreStyle : styles.inputs
            }
            secureTextEntry={true}
            placeholder="* 비밀번호 확인"
            onChangeText={(mem_password_re) => {
              this.setState({mem_password_re});
              this.EqualPW(this.state.mem_password, mem_password_re);
            }}
            onEndEditing={() => {
              this.checkPassword();
              this.checkNotNull();
            }}
            caption={() =>
              this.state.captionCheck != null && (
                <Text
                  style={{
                    color: 'red',
                    paddingLeft: 10,
                    fontSize: 10,
                    paddingBottom: 13
                  }}>
                  {this.state.captionCheck}
                </Text>
              )
            }
          />
          <View style={{paddingTop: 15}}>
            <Input
              style={styles.inputs}
              maxLength={13}
              keyboardType="phone-pad"
              dataDetectorTypes="phoneNumber"
              placeholder="휴대전화"
              onChangeText={(mem_phone) => {
                this.setState({mem_phone});
                this.NoString(mem_phone);
                this.PhoneHyphen(mem_phone);
              }}
              onEndEditing={() => {
                this.phoneSubstr(this.state.mem_phone);
              }}
              caption={() =>
                this.state.phoneCaption != null && (
                  <Text
                    style={{
                      color: 'red',
                      paddingLeft: 10,
                      fontSize: 10,
                      paddingBottom: 3,
                    }}>
                    {this.state.phoneCaption}
                  </Text>
                )
              }
              value={this.state.mem_phone}
            />

            <Input
              style={styles.inputs}
              maxLength={10}
              keyboardType="numeric"
              dataDetectorTypes="phoneNumber"
              placeholder="생년월일 ( ex. 2000-01-01 ) "
              onChangeText={(mem_birthday) => {
                this.setState({mem_birthday});
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
                this.setState({mem_recommend})
              }
              onEndEditing={() => {
                this.checkNotNull();
                this.checkRecommend();
              }}
              caption={() =>
                this.state.recommendCaption != null && (
                  <Text
                    style={{
                      color: 'red',
                      paddingLeft: 10,
                      fontSize: 10,
                      paddingBottom: 3,
                    }}>
                    {this.state.recommendCaption}
                  </Text>
                )
              }
            />
          </View>
          <View
            style={{
              paddingTop: 30,
              paddingBottom: 20,
              textDecorationColor: '#63579D',
              flexDirection: 'row',
            }}>
            {/* <this.CheckboxKitten /> */}
            <Text category="s1" style={{color: '#63579D'}}>
              {` `} * 하늘 부모님 성회 아래
              {`\n`} {` `}
              {` `} 이타주의자 활동을 양심적으로 하겠습니다
            </Text>
          </View>
          {/* 동의 및 다음 버튼 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
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
          <View>
            {this.state.goNext || !this.state.checked ? (
              <Text
                category="p2"
                style={{
                  paddingTop: 15,
                  paddingBottom: 60,
                  color: '#A3A3A3',
                  textAlign: 'right',
                }}>
                필수 인적사항을 채워주세요.
              </Text>
            ) : (
              <this.nextStep />
            )}
          </View>       
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
    color: '#63579D',
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
