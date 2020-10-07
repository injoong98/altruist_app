import React, {Component, useState} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {
  Text,
  Button,
  TopNavigation,
  TopNavigationAction,
  Icon,
} from '@ui-kitten/components';

const BackIcon = (props) => (
  <Icon
    style={{width: 24, height: 24}}
    fill="#63579D"
    name="back-arrow"
    pack="alticons"
  />
);

class ResendAuthmailSuccessScreen extends Component {
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
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <TopNavigation
          title={() => <Text category="h2"></Text>}
          alignment="center"
          accessoryLeft={this.BackAction}
        />
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{}}>
            <Text
              category="h2"
              style={{
                alignSelf: 'center',

                paddingBottom: 20,
              }}>
              인증 메일 재전송
            </Text>
            <Text style={{alignSelf: 'center', color: '#A897C2'}}>
              인증 메일 재전송 메일을 전송하였습니다.
            </Text>
            <Text style={{alignSelf: 'center', color: '#A897C2'}}>
              인증을 완료하면 로그인 할 수 있습니다.
            </Text>
          </View>
          <View style={{marginTop: 30}}>
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

export default ResendAuthmailSuccessScreen;
