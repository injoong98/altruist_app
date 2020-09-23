import React, {Component} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {
  Icon,
  Text,
  TopNavigationAction,
  TopNavigation,
} from '@ui-kitten/components';
import axios from 'axios';
import {Button, Footer} from 'native-base';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

class AgreementScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      information: [],
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

  componentDidMount() {
    this.GetAgreement();
    // this.setState();
  }

  GetAgreement = async () => {
    await axios
      .get('http://dev.unyict.org/api/register/get_register_policy')
      .then((res) => {
        console.log(res);
        console.log(res.data.view);
        this.state = {
          information: [
            {
              // id: res.key,
              id: 1,
              name: '회원약관',
              content: res.data.view.member_register_policy1,
            },
            {
              id: 2,
              name: '개인정보취급방침',
              content: res.data.view.member_register_policy2,
            },
          ],
        };
        // for(let i=0; i < res.data.view.)
        console.log('rendr', this.state);
      })
      .catch((error) => {
        console.log('ERROR', error);
        console.error();
      });
  };

  render() {
    console.log('this.state', this.state);
    return (
      <>
        <TopNavigation
          title={this.state.information.name}
          alignment="center"
          accessoryLeft={this.BackAction}
        />
        <SafeAreaView style={styles.container}>
          <View style={styles.contentSection}>
            <Text>{this.state.information.content}</Text>
            <Button onPress={() => this.GetAgreement()}></Button>
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
