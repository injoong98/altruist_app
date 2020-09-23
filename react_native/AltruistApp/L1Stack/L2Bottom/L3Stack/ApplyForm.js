import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {
  Layout,
  Text,
  TopNavigation,
  Button,
  Icon,
  TopNavigationAction,
  Radio,
  CheckBox,
  Card,
} from '@ui-kitten/components';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {Signing} from '../../Context';
import axios from 'axios';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

class AltApplyFormScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mem_id:'',
      alt_aboutme: '',
      alt_content: '',
      alt_answertype: '',
      alt_status: '',
      alt_honor: '',
      acv_type: '',
      acv_year: '',
      acv_content: '',
      acv_status: '',
      acv_open: '',
      act_id: '',
    };
  }
  static contextType = Signing;
  
  handleSubmit() {
    const {userForm, user} = this.props;

    if (userForm.valid) {
      // userForm.$form.valid in V1
      // submit user here
    } else {
      // show errors
    }
  }

  BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        this.props.navigation.goBack();
      }}
    />
  );

  setAltruist = async () => {
    //const {
    //     mem_id,
    //     alt_aboutme,
    //     alt_content,
    //     alt_answertype,
    //     alt_status,
    //     alt_honor,
    //     acv_type,
    //     acv_year,
    //     acv_content,
    //     acv_status,
    //     acv_open,
    //     act_id,
    // } = this.state;

    let formdata = new FormData();
    // formdata.append("mem_id", mem_id);
    // formdata.append("alt_aboutme", alt_aboutme);
    // formdata.append("alt_content", alt_content);
    // formdata.append("alt_answertype", alt_answertype);
    // formdata.append("alt_status", 'R');
    // formdata.append("alt_honor", alt_honor);
    // // formdata.append("acv_type[]", 'J');
    // formdata.append("acv_type[]", acv_type);
    // // formdata.append("acv_year[]", '2021');
    // formdata.append("acv_year[]", acv_year);
    // // formdata.append("acv_content[]", '2021초보주부론 편찬의원회');
    // formdata.append("acv_content[]", acv_content);
    // // formdata.append("acv_status[]", '0');
    // formdata.append("acv_status[]", acv_status);
    // // formdata.append("acv_open[]", '1');
    // formdata.append("acv_open[]", acv_open);
    // // formdata.append("act_id[]", '1');
    // formdata.append("act_id[]", act_id);

    // formdata.append("mem_id", "106");
    // formdata.append("alt_aboutme",'언택트 주부 9단');
    // formdata.append("alt_content", '안녕하세요 적당히 바람이 시원해 언택트 주부 9단이 왔어요 ');
    // formdata.append("alt_answertype", '2');
    // formdata.append("alt_status", 'R');
    // formdata.append("alt_honor", '0');
    // formdata.append("acv_type[]", 'J');
    // formdata.append("acv_type[]", 'J');
    // formdata.append("acv_year[]", '2021');
    // formdata.append("acv_year[]", '2022');
    // formdata.append("acv_content[]", '2021초보주부론 편찬의원회');
    // formdata.append("acv_content[]", '2020초보주부론 편찬의원회');
    // formdata.append("acv_status[]", '0');
    // formdata.append("acv_status[]", '0');
    // formdata.append("acv_open[]", '1');
    // formdata.append("acv_open[]", '1');
    // formdata.append("act_id[]", '1');
    // formdata.append("act_id[]", '1');

    console.log(formdata);

    await axios
      .post('http://dev.unyict.org/api/altruists/apply', formdata, {
        'Content-Type': 'application/form-data',
      })
      .then((response) => {
        console.log(response);
        console.log(response.data.status);
        if (response.data.status == '500') {
          Alert.alert('Error', `${response.data.message}`, [{text: 'OK'}], {
            cancelable: false,
          });
        } else {
          Alert.alert(
            '이타주의자',
            '작성 완료',
            [
              {
                text: 'OK',
              },
            ],
            {cancelable: true},
          );
        }
      })

      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  getAreaCat = async () => {
    await axios
      .get('http://dev.unyict.org/api/altruists/area_category')
      .then((res) => {
        //console.log(res)
        this.setState({category: res.data.data});
        // console.log(this.state.category);
      })
      .catch((err) => {
        alert(err);
      });
  };

  componentDidMount() {
    //this.setAltruist()
    this.getAreaCat();
    this.setState({mem_id:this.context.session_mem_id})
  }

  // renderItem = ({item, key}) => {
  //     console.log(item);
  // }

  render() {
    const {category} = this.state;
    console.log('cat : ' + this.props);
    return (
      <SafeAreaView style={styles.container}>
        <TopNavigation title="이타주의자" accessoryLeft={this.BackAction} />
        <View>
          <Text> 이타주의자 지원하기 FORM </Text>
        </View>
        <ScrollView>
          <View style={{flexDirection: 'row'}}>
            <Text>자기PR</Text>
            <TextInput
              style={styles.contentInput}
              value={this.state.alt_aboutme}
              onChangeText={(text) => this.setState({alt_aboutme: alt_aboutme})}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text>자기소개</Text>
            <TextInput
              style={styles.contentInput}
              value={this.state.alt_content}
              onChangeText={(text) => this.setState({alt_content: alt_content})}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text>답변대기</Text>
            <TextInput
              style={styles.contentInput}
              value={this.state.alt_answertype}
              onChangeText={(text) =>
                this.setState({alt_answertype: alt_answertype})
              }
            />
          </View>
          {/* <View style={{flexDirection:'row'}}>
                            <Text>상태</Text>
                            <TextInput style={styles.contentInput} value={this.state.alt_status} onChangeText={text =>this.setState({alt_status:alt_status})}/>
                        </View> */}
          <View style={{flexDirection: 'row'}}>
            <Text>명예여부</Text>
            <TextInput
              style={styles.contentInput}
              value={this.state.alt_honor}
              onChangeText={(text) => this.setState({alt_honor: alt_honor})}
            />
          </View>

          {/* 경력구분 */}
          <View style={{flexDirection: 'row'}}>
            <Text>경력년도</Text>
            <TextInput
              style={styles.contentInput}
              value={this.state.acv_type}
              onChangeText={(text) => this.setState({careertype: text})}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text>경력내용</Text>
            <TextInput
              style={styles.contentInput}
              value={this.state.acv_year}
              onChangeText={(text) => this.setState({careeryear: text})}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text>최종경력여부</Text>
            <TextInput
              style={styles.contentInput}
              value={this.state.acv_content}
              onChangeText={(text) => this.setState({careerfinal: text})}
            />
          </View>
          {/* <View style={{flexDirection:'row'}}>
                            <Text>증빙용첨부파일</Text>
                            <TextInput style={styles.contentInput} value={this.state.acv_content} onChangeText={text =>this.setState({careerfile:text})}/>
                        </View> */}
          <View style={{flexDirection: 'row'}}>
            <Text>경력인증상태</Text>
            <TextInput
              style={styles.contentInput}
              value={this.state.acv_status}
              onChangeText={(text) => this.setState({careerstatus: text})}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text>공개여부</Text>
            <TextInput
              style={styles.contentInput}
              value={this.state.acv_open}
              onChangeText={(text) => this.setState({careeropen: text})}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text>경력 카테고리코드 </Text>
            <TextInput
              style={styles.contentInput}
              value={this.state.act_id}
              onChangeText={(text) => this.setState({categoryid: text})}
            />
          </View>
          <View>
            <Button style={{margin: 10}}>취소</Button>
            {/* <Button style={{margin:10}} onPress={()=>navigation.navigate('AltApplyComplete')}>완료</Button> */}
            <Button style={{margin: 10}} onPress={() => this.setAltruist()}>
              완료
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    margin: 10,
    backgroundColor: '#eaeaea',
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  titleInput: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  contentInput: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginHorizontal: 10,
    marginBottom: 20,
    // 휴대폰 width - titleInput
    width: 350,
  },
});

export default AltApplyFormScreen;
