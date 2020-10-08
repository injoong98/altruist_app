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

const TitleContent = ({title}) => {
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
      formName: ['idpw_id', 'idpw_hp', 'idpw_email'],
      formType: ['findbyid', 'findbyhp', 'findidpw'],
      title: ['아이디', '휴대폰번호', '이메일'],
      indexClick: 0,
      findtype: 'findbyid',
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
    const {idpw_hp, idpw_id, findtype, idpw_email} = this.state;

    console.log(this.state);
    formdata.append('findtype', findtype);

    if (findtype == 'findidpw') {
      formdata.append('idpw_email', idpw_email);
    } else if (findtype == 'findbyhp') {
      formdata.append('idpw_hp', idpw_hp);
    } else if (findtype == 'findbyid') {
      formdata.append('idpw_id', idpw_id);
    } else {
      return Alert.alert(
        '접근 실패',
        '{`올바른 접근 방법이 아닙니다. \n 다시 시도해주세요.`}',
        [
          {
            text: 'OK',
          },
        ],
        {cancelable: false},
      );
    }
    console.info('form', this.state);

    await axios
      .post(`http://dev.unyict.org/api/findaccount/findpw`, formdata)
      .then((res) => {
        console.log(res);
        if (res.data.status == 500) {
          if (findtype == 'findbyhp') {
            Alert.alert(
              '메일 전송 실패',
              '해당하는 번호에 이메일이 없습니다. 회원가입을 진행해주세요.',
              [
                {
                  text: 'OK',
                },
              ],
              {cancelable: false},
            );
          } else {
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
          }
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

  checkExists = async (type, value) => {
    console.log('check', type);
    console.log(value);

    let formdata = new FormData();

    //ID
    if (type == 'idpw_id') {
      formdata.append('userid', value);

      await axios
        .post(`http://dev.unyict.org/api/register/userid_check`, formdata)
        .then((res) => {
          if (res.data.result != `no`) {
            this.setState({
              checkEmailCaption: `등록되지 않은 아이디입니다.
입력한 아이디를 다시 한번 확인해주세요.`,
            });
          } else {
            this.setState({
              checkEmailCaption: '',
            });
          }
          console.log('emailCaption', this.state.checkEmailCaption);

          console.log('res.data', res.data);
        })
        .catch((error) => {
          console.log('ERROR', error);
          console.error();
        });
    }
    //이메일
    else if (type == 'idpw_email') {
      formdata.append('email', value);

      await axios
        .post(`http://dev.unyict.org/api/register/email_check`, formdata)
        .then((res) => {
          if (!res.data.message.includes('이미 사용중')) {
            this.setState({
              checkEmailCaption: `등록되지 않은 이메일 입니다.
              입력한 이메일을 다시 한번 확인해주세요.`,
            });
          } else {
            this.setState({
              checkEmailCaption: '',
            });
          }
          console.log('emailCaption', this.state.checkEmailCaption);
          console.log('res.data', res.data);
        })
        .catch((error) => {
          console.log('ERROR', error);
          console.error();
        });
    } else {
      console.log('this.state.idpw_hp', this.state.idpw_hp);
    }
  };

  FindPwTab = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const {formType} = this.state;

    console.log(selectedIndex, this.state.findtype);
    return (
      <TabBar
        selectedIndex={selectedIndex}
        onSelect={(index) => {
          setSelectedIndex(index);
          this.setState({indexClick: index});
          this.setState({findtype: formType[index]});
          this.setState({checkEmailCaption: ''});
        }}>
        <Tab title="아이디" />
        <Tab title="휴대전화" />
        <Tab title="이메일" />
      </TabBar>
    );
  };

  inputChangeHandler = (inputName, inputValue) => {
    console.log('inputName', inputName);
    if (inputName == 'idpw_hp') {
      console.log('inputValue1', inputValue);

      var number = inputValue.replace(/[^0-9]/g, '');
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

      console.log('inputValue2', inputValue);
      console.log('value:', value);
      this.setState(() => ({idpw_hp: value}));
    } else {
      this.setState(() => ({
        [inputName]: inputValue, // <-- Put square brackets
      }));
    }
  };

  FindPwInput = () => {
    const {indexClick, title, formName} = this.state;
    console.log('return formName[indexClick]', formName[indexClick]);
    return (
      <Input
        style={styles.inputs}
        placeholder={`* ${title[indexClick]}`}
        onChangeText={(text) =>
          this.inputChangeHandler(formName[indexClick], text)
        }
        onEndEditing={(valu) => {
          this.checkExists(formName[indexClick], valu.nativeEvent.text);
        }}
        caption={() =>
          this.state.checkEmailCaption ? (
            <Text category="s2" style={{color: '#ef8b98', paddingLeft: 10}}>
              {this.state.checkEmailCaption}
            </Text>
          ) : (
            <Text> </Text>
          )
        }
      />
    );
  };

  render() {
    const {title, indexClick, findtype} = this.state;
    // const title = this.state;
    console.log(this.state);
    // console.log('title -  ', title);
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
          <this.FindPwInput titile={title[indexClick]} />
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
                : findtype == 'findbyhp'
                ? this.SubmitForm()
                : this.setState({
                    checkEmailCaption: '입력한 정보를 다시 한번 확인해주세요.',
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
