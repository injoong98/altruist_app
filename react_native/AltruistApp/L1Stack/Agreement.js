import React, {Component} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {
  Icon,
  Text,
  TopNavigationAction,
  TopNavigation,
} from '@ui-kitten/components';
import axios from 'axios';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

class AgreementScreen extends Component {
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

  GetAgreement = async () => {
    await axios
      .get('http://dev.unyict.org/api/register/get_register_policy')
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log('ERROR', error);
        console.error();
      });
  };

  render() {
    console.log(this.state);
    return (
      <>
        <TopNavigation
          title="이용방침"
          alignment="center"
          accessoryLeft={this.BackAction}
        />
        <SafeAreaView style={styles.container}>
          <View style={styles.contentSection}>
            <Text>이용방침</Text>
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

export default AgreementScreen;
