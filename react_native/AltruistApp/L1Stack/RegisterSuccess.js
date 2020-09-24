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
      <SafeAreaView style={{flex: 2, backgroundColor: '#FFFFFF'}}>
        <TopNavigation
          title={() => <Text category="h2">메일 전송</Text>}
          alignment="center"
          accessoryLeft={this.BackAction}
        />
        <View style={{flex: 4}}>
          <View style={{flex: 1}}>
            <Text
              category="h3"
              style={{
                alignSelf: 'center',
                paddingTop: 60,
                paddingBottom: 20,
                color: '#A897C2',
                fontWeight: 'bold',
              }}>
              메일 전송
            </Text>
            <Text style={{alignSelf: 'center', color: '#A897C2'}}>
              메일 전송이 성공하였습니다.
            </Text>
            <Text style={{alignSelf: 'center', color: '#A897C2'}}>
              메일함을 확인해주세요.
            </Text>
          </View>
          <View style={{flex: 2}}>
            <Button
              style={{
                alignSelf: 'center',
                width: 114,
                height: 34,
                borderRadius: 6,
              }}
              onPress={() => {
                this.props.navigation.navigate('Login');
              }}>
              확인
            </Button>
          </View>
        </View>
      </SafeAreaView>
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
