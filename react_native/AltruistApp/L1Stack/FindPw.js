import React, {Component, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Alert} from 'react-native';
import {
  Text,
  Input,
  Button,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Tab,
  TabBar,
} from '@ui-kitten/components';
import axios from 'axios';

const BackIcon = (props) => (
  <Icon
    style={{width: 24, height: 24}}
    fill="#63579D"
    name="back-arrow"
    pack="alticons"
  />
);

const TitleContent = ({title = 0}) => {
  return (
    <View style={{paddingBottom: 30}}>
      <Text
        category="h2"
        style={{
          alignSelf: 'center',
          paddingTop: 40,
          paddingBottom: 20,
        }}>
        {title}로 찾기
      </Text>
      <Text style={{alignSelf: 'center', color: '#A897C2'}}>
        가입하신 {title}로 {title != `이메일` && '메일을 찾아 '}알려드립니다.
      </Text>
      <Text style={{alignSelf: 'center', color: '#A897C2'}}>
        가입할 때 등록한 {title}를 입력하고
      </Text>
      <Text style={{alignSelf: 'center', color: '#A897C2'}}>
        "PW 재설정" 버튼을 클릭해주세요.
      </Text>
    </View>
  );
};
class FindPwScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ['아이디', '휴대폰번호', '이메일'],
      indexClick: 0,
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

  SubmitForm = async () => {
    let formdata = new FormData();
    const {mem_email} = this.state;

    formdata.append('findtype', 'findidpw');
    formdata.append('idpw_email', mem_email);
    console.info('form', this.state);

    await axios
      .post(`http://dev.unyict.org/api/findaccount/findpw`, formdata)
      .then((res) => {
        if (res.data.status == 500) {
          //실패 모달
          console.log('실패');
          Alert.alert(
            '메일 전송 실패',
            JSON.stringify(res.data.view.message),
            [
              {
                text: 'OK',
              },
            ],
            {cancelable: false},
          );
        } else if (res.data.status == 200) {
          this.props.navigation.navigate('FindRwSuccessScreen');
        }
      })
      .catch((error) => {
        console.log('ERROR', error);
        console.error();
        //alert('')
      });
  };

  //TODO : 이메일 확인
  checkEmail = async () => {
    const {mem_email} = this.state;

    let formdata = new FormData();
    formdata.append('email', mem_email);

    await axios
      .post(`http://dev.unyict.org/api/register/email_check `, formdata)
      .then((res) => {
        if (!res.data.message.includes('이미 사용중')) {
          this.setState({
            checkEmailCaption: '입력한 이메일을 다시 한번 확인해주세요.',
          });
        } else {
          this.setState({
            checkEmailCaption: '',
          });
        }
        console.log('res.data', res.data);
      })
      .catch((error) => {
        console.log('ERROR', error);
        console.error();
      });
  };

  FindPwTab = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    console.log(selectedIndex);
    return (
      <TabBar
        selectedIndex={selectedIndex}
        onSelect={(index) => {
          setSelectedIndex(index);
          this.setState({indexClick: index});
        }}>
        <Tab title="아이디" />
        <Tab title="휴대전화" />
        <Tab title="이메일" />
      </TabBar>
    );
  };
  render() {
    const {title, indexClick} = this.state;
    // const title = this.state;
    // console.log(this.state);
    console.log('title -  ', title);
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <TopNavigation
          title={() => <Text category="h2">비밀번호 재설정</Text>}
          alignment="center"
          accessoryLeft={this.BackAction}
          style={{}}
        />
        <this.FindPwTab />
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TitleContent title={title[indexClick]} />
          <Input
            style={styles.inputs}
            textContentType="emailAddress" //ios
            placeholder="* 이메일"
            onChangeText={(mem_email) => {
              this.setState({mem_email});
            }}
            onEndEditing={() => {
              // this.checkNotNull();
              this.checkEmail(this.state.mem_email);
            }}
            caption={() =>
              this.state.checkEmailCaption ? (
                <Text category="s2" style={{color: '#ACACAC', paddingLeft: 10}}>
                  {this.state.checkEmailCaption}
                </Text>
              ) : (
                <Text> </Text>
              )
            }
          />
          <Button
            style={{
              alignSelf: 'center',
              width: 114,
              height: 34,
              borderRadius: 6,
            }}
            onPress={() =>
              !this.state.checkEmailCaption
                ? this.SubmitForm()
                : this.setState({
                    checkEmailCaption:
                      '입력한 이메일을 다시 한번 확인해주세요.',
                  })
            }>
            PW 재설정
          </Button>
        </View>
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
    marginLeft: 35,
    marginRight: 35,
    paddingBottom: 30,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    borderColor: '#FFFFFF',
    color: '#A897C2',
  },
});

export default FindPwScreen;
