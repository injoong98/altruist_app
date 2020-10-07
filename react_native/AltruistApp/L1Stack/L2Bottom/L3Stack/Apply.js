import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
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
import {FlatList} from 'react-native-gesture-handler';
import {WriteContentToptab} from '../../../components/WriteContentTopBar';
import FlowerP from '../../../assets/icons/flower-peach.svg'
import FlowerS from '../../../assets/icons/flower-sky.svg'
import FlowerY from '../../../assets/icons/flower-yellow.svg'

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
export class AltApplyStatus extends React.Component {
    constructor(props){
      super(props)
    }
  
  BackAction = () =>(
      <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
  )

  render(){ 
      return(
          <SafeAreaView style={styles.statusContainer}>
                  <WriteContentToptab
                      gbckfunc={() => {
                          this.props.navigation.navigate('AltMain');
                      }}
                      gbckuse={true}
                  />
                  <Layout style={styles.statusWrapper}>
                      <View style={{alignItems:'center',paddingHorizontal:30,paddingTop:35,paddingBottom:0}}>
                          <Text category='h2' style={styles.statusTitle}>이타주의자</Text>
                          <Text category='h2' style={styles.statusTitle}>승인 대기중입니다.</Text>
                          <View style={{position:'absolute',bottom:0,right:0}}>
                              <FlowerS height={30.8} width={30}/>
                          </View>
                          <View style={{position:'absolute',top:40,left:5}}>
                              <FlowerY height={15.8} width={15}/>
                          </View>
                          <View style={{position:'absolute',top:5,left:15}}>
                              <FlowerP height={30.8} width={30}/>
                          </View>
                      </View>
                      <View style={{marginTop:30,alignItems:'center'}}>
                          <Text style={{}}> 현재 심사 중에 있으니 기다려 주시길 바랍니다.</Text>
                          <Text style={{marginTop:10}}> 관리자 확인과 정식 등록 시 리스트에 보이게 됩니다.</Text>
                          <Text style={{marginTop:10}}> 심사 완료 시 푸쉬 알림으로 알려드립니다.</Text>
                      </View>
                      <TouchableHighlight 
                          style={{marginTop:50, alignItems:'center',justifyContent:'center',borderRadius:7.5,height:33,width:60,backgroundColor:'#63579D'}}
                          onPress={() => this.props.navigation.navigate('AltMain')}>
                          <Text style={{fontSize:18,fontWeight:'bold',color:'#ffffff'}}>완료</Text>
                      </TouchableHighlight>
                  </Layout>
          </SafeAreaView>
      )
  }
}
class AltApplyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      information: [],
      checkboxes: [false, false, false],
      title: ['이타주의자란', '1:1답변하기', '오픈질문'],
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

  CheckAgrees = ({i}) => {
    const [checked, setChecked] = useState(false);
    return (
      <CheckBox
        style={{padding: 15}}
        checked={checked}
        onChange={(nextChecked) => {
          setChecked(nextChecked);
          this.handleClick(i, nextChecked);
        }}>
        <Text category="h5" style={{color: '#63579D'}}>
          {this.state.title[i]}
        </Text>
      </CheckBox>
    );
  };

  handleClick(i, checked) {
    const checkboxes = this.state.checkboxes;
    checkboxes[i] = checked == true ? true : false;
    this.setState({checkboxes: checkboxes});
  }

  goNextStep() {
    if (this.state.checkboxes.includes(false)) {
      alert('지원하기 전에 한번 다 읽어보시고 체크박스에 체크 부탁드립니다 !');
    } else {
      this.props.navigation.navigate('AltApplyForm');
    }
  }

  render() {
    const {information} = this.state;
    console.log(information);
    const {navigation} = this.props;
    const {title} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <WriteContentToptab
          text="지원하기"
          gbckfunc={() => {
            this.props.navigation.goBack();
          }}
          gbckuse={true}
          style={{backgroundColor: '#f4f4f4'}}
        />
        <ScrollView style={styles.wrapper}>
          <View style={styles.agrees}>
            <View style={styles.checks}>
              <View style={styles.checkbox}>
                <this.CheckAgrees i={0} />
                <Text category="p1" style={styles.chkText}>
                  {`당신의 가치 있는 경험을 사람들에게 공유하세요.
Share your valuable experiences with people.
이타주의자는 자신이 갖고 있는 재능과 경험을 사람들에게 나누고자 하는 사람입니다.
이타주의자는 1:1 질의응답을 통해 사람들과 나눔을 실천합니다.
더불어 성장하는 사람의 실천을 통해 더 가치있는 세상을 만들어 갑니다.`}
                </Text>
              </View>
              <View style={styles.checkbox}>
                <this.CheckAgrees i={1} />
                <Text category="p1" style={styles.chkText}>
                  {`STEP1. 질문이 올 경우 푸쉬알람이 전송됩니다.
STEP2. 자신에게 온 질문은 
'마이페이지 > 이타주의자 > 질문함'에서 확인할 수 있습니다.
STEP3. 질문을 선택하여 답변을 작성합니다.

[Check-Point]
- 한번한 답변은 수정이 불가능하니 신중히 답변하시기 바랍니다.
- 질문을 받으면 이타주의자에게 알림이 전송됩니다. 
- 상시 확인 부탁드립니다.
- 답변을 확인한 경우, 해당 질문이 '답변 중' 상태로 변경됩니다.
- 작성 후, '답변 완료'라고 상태가 변경되어 답변을 수정할 수 없습니다.

[주의사항]
- 이타주의자는 부적절한 질문에 대해 신고할 수 있습니다.
- 질문자는 부적절한 답변에 대한 신고할 수 있습니다.
- 아래에 해당하는 질문은 답변을 거절할 수 있습니다.
> 「더불어 성장하는 이타주의자들」 이용규칙에 준수되지 않는 내용
> 이타주의자 전문분야와 무관한 질문
> 외부 행사 참여 요청(활동방법은 제외)
> 인터뷰 혹은 과제 요청`}
                </Text>
              </View>
              <View style={styles.checkbox}>
                <this.CheckAgrees i={2} />
                <Text category="p1" style={styles.chkText}>
                  {`STEP1. 자신이 설정한 전문 분야에 오픈 질문이 올라올 경우, 푸쉬알람이 전송됩니다.
STEP2. 해당 질문은 '마이페이지 > 이타주의자 > 질문함'에서 확인할 수 있습니다.
STEP3. 질문을 선택하여 답변을 작성합니다.

[Check-Point]
- 질문자는 기간을 정해서 다양한 답변을 받을 수 있습니다.
- 질문자에게 답변이 선택 될 경우, 해당 답변이 누구에게나 공개됩니다.
- 선택된 답변은 수정이 불가능하니 신중히 답변하시기 바랍니다.

[주의사항]
- 이타주의자는 부적절한 질문에 대해 신고할 수 있습니다.
- 질문자는 부적절한 답변에 대한 신고할 수 있습니다.
- 아래에 해당하는 질문은 답변을 거절할 수 있습니다.
> 「더불어 성장하는 이타주의자들」 이용규칙에 준수되지 않는 내용
> 이타주의자 전문분야와 무관한 질문
> 외부 행사 참여 요청(활동방법은 제외View
> 인터뷰 혹은 과제 요청`}
                </Text>
              </View>
            </View>
            <TouchableHighlight
              style={styles.btn}
              onPress={() => this.goNextStep()}>
              <Text category="h2" style={styles.btnText}>
                다음
              </Text>
            </TouchableHighlight>
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
    backgroundColor: '#f4f4f4',
  },
  agrees: {
    marginHorizontal: '5%',
  },
  checks: {
    paddingHorizontal: 22,
    paddingVertical: 30,
    borderRadius: 17,
    backgroundColor: '#ffffff',
  },
  checkbox: {
    flex: 0.5, //height (according to its parent)
    flexDirection: 'column', //its children will be in a row
    // flexDirection: 'row',
    // marginVertical: 6,
  },
  chkText: {
    color: '#696969',
    fontSize: 12,
    marginLeft: 14,
  },
  btn: {
    backgroundColor: '#63579D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 23,
  },
  btnText: {
    color: '#ffffff',
  },
  statusContainer: {
    flex: 1,
    backgroundColor:'#ffffff',
  },
  statusWrapper :{
      flex:1,
      alignItems:'center',
      justifyContent:'center'
  },
  statusTitle: {
      color:'#63579D',
      fontSize:24
  }
});

export default AltApplyScreen;
