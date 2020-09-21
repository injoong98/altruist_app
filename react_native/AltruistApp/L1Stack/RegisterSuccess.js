import React, {Component, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
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

class RegisterSuccessScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        this.props.navigation.navigate('Login');
      }}
    />
  );

  render() {
    console.log(this.state);
    return (
      <>
        <TopNavigation
          title="회원가입 인증요청"
          alignment="center"
          accessoryLeft={this.BackAction}
        />
        <SafeAreaView style={styles.container}>
          <View style={styles.contentSection}>
            <View style={styles.content}>
              <Text>조금만 더 ...</Text>
              <Text>작성한 이메일로 가입인증 메일이 전송됩니다.</Text>
              <Text>인증 완료시, 로그인이 가능합니다</Text>
            </View>
            <View style={styles.btnSection}>
              <Button
                style={styles.gobtn}
                onPress={() => {
                  this.props.navigation.navigate('Login');
                }}>
                <Text>확인</Text>
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentSection: {
    flex: 10,
  },
  content: {
    flex: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goLogin: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 3,
  },
  btnSection: {
    flex: 4,
    margin: 30,
  },
  gobtn: {},
});

export default RegisterSuccessScreen;
