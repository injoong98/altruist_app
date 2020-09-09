import React from 'react';
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
import Axios from 'axios';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const Calender = (props) => <Icon {...props} name="calendar-outline" />;

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mem_userid: '',
      mem_password: '',
      mem_password_confirm: '',
      mem_nickname: '',
      mem_email: '',
    };
  }

  //   proptypes
  //   registerScreen.PropTypes = {
  //     mem_userid : PropTypes.string.isRequired,

  //   };

  BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        this.props.navigation.goBack();
      }}
    />
  );

  //   TODO : 생년월일

  UselessTextInput = ({key, placeholder}) => {
    const [textInputValue, setTextInputValue] = React.useState('');

    return (
      <Input
        key={key}
        onChangeText={(text) => setTextInputValue(text)}
        value={textInputValue}
        placeholder={placeholder}
      />
    );
  };
  //   TODO : 성별

  //   TODO : 휴대폰 번호

  componentDidMount() {
    // console.log('mount됌');
    // Axios.post(' dev.unyict.org/api/register/form', formdata);
  }
  componentDidUpdate() {
    console.log('update됌');
  }
  render() {
    return (
      <>
        <TopNavigation
          title="회원가입"
          alignment="center"
          accessoryLeft={this.BackAction}
        />
        <SafeAreaView style={{flex: 1}}>
          <View style={{flex: 1, justifyContent: 'center', padding: 50}}>
            <this.UselessTextInput
              style={{padding: 3}}
              placeholder="이메일 / ID로 사용합니다"
              key="mem_email"
            />
            <this.UselessTextInput
              style={{padding: 3}}
              placeholder="비밀번호"
              key={mem_password}
            />
            <this.UselessTextInput
              style={{padding: 3}}
              placeholder="비밀번호 확인"
              key={mem_password_confirm}
            />
            <this.UselessTextInput style={{padding: 3}} placeholder="닉네임" />
            <this.UselessTextInput
              style={{padding: 3}}
              placeholder="휴대전화"
              key={mem_phone}
            />
            <View
              style={{
                padding: 3,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <this.UselessTextInput
                placeholder="주민번호 앞 6자리"
                key={mem_birthday}
              />
              <Text>-</Text>
              <this.UselessTextInput placeholder="1" key={mem_sex} />
              <Text>******</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'stretch',
                alignContent: 'stretch',
              }}>
              <Button
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
              </Button>
            </View>
            <View
              style={{
                flexDirection: 'row',
                padding: 3,
              }}>
              <CheckBox></CheckBox>
              <Text
                onPress={() =>
                  this.props.navigation.navigate('AgreementScreen')
                }>
                {' '}
                개인정보 취급방침
              </Text>
              <Text>에 동의합니다</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                padding: 3,
              }}>
              <CheckBox></CheckBox>
              <Text
                onPress={() =>
                  this.props.navigation.navigate('AgreementScreen')
                }>
                {' '}
                이용약관
              </Text>
              <Text>에 동의합니다</Text>
            </View>
            <Button
              onPress={() => this.props.navigation.navigate('QuestionScreen')}>
              다음
            </Button>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default RegisterScreen;
