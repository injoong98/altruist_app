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
import {ScrollView} from 'react-native-gesture-handler';

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
        // let key = 0;
        // //리스트에 key값 넣기
        console.log(res);
        console.log(res.data.view);
        this.setState({information: res.data.view});
      })
      .catch((error) => {
        console.log('ERROR', error);
        console.error();
      });
  };

  render() {
    console.log('this.state', this.state);
    // const {route} = this.props;
    const {information} = this.state;
    const {id, name} = this.props.route.params;
    // Object.keys(information).map((key) => [Number(key), information[key]]);
    // Object.keys(information).map((key) => [key, obj[key]]);
    // Object.entries(information).map((key) => {
    //   [Number(k++), information[key]];
    //   console.log('information2', [Number(k), information[key]]);
    // });

    return (
      <>
        <TopNavigation
          title={name}
          alignment="center"
          accessoryLeft={this.BackAction}
        />
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.content}>
              {id === 1 ? (
                <Text>{information.member_register_policy1}</Text>
              ) : (
                <Text>{information.member_register_policy2}</Text>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 15,
  },
});

export default AgreementScreen;
