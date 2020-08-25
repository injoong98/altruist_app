import React,{useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {SafeAreaView, View, TextInput} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, Radio, CheckBox } from '@ui-kitten/components'

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

// const AltApplyScreen =({navigation}) =>{

//     const BackAction = () =>(
//         <TopNavigationAction icon={BackIcon} onPress={() => {navigation.goBack()}}/>
//         )
 
//     return(
//     <SafeAreaView style={{flex:1}}>
//         <TopNavigation title="이타주의자" alignment="center" accessoryLeft={BackAction}/> 
//         <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
//             <Text>이타주의자 지원</Text>
//         </Layout>   
//     </SafeAreaView>
//     )
// }

//이거 다시 보기 !
function  BackAction({navigation}){
    return(
        <TopNavigationAction icon={BackIcon} onPress={() => {navigation.goBack()}}/>

    )

}
    



class AltApplyScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            text:'',
            setTest :'',
            setAgree:false,
            isShowTest :false
        };
    }

    setFollowUp = (nextChecked) =>{
        this.setState({setAgree : nextChecked});
        console.log("Button Pressed");
    }

    // setFollowUp = (nextChecked) => {
    //     this.setState({isFollowUp:nextChecked});
    //     this.setState({alba_salary:'추후협의'});
    // }
   
  
    applyAceept = () => {
        const {current} = this.state
        const agreeCheck = current.setAgree ? current.isShowTest = "flex" : current.isShowTest = "none"
        this.setState({isShowTest : agreeCheck})

    }


    
    
  render(){
    console.log('dhfjks');
      return(
        <SafeAreaView style={{flex:1}}>
            <TopNavigation title="이타주의자" alignment="center" accessoryLeft={BackAction}/> 
            <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
                <Text>이타주의자 지원</Text>
                <Text style={{ width:350}}>이타주의자에 지원하려는 당신을 환영합니다.
                    이타주의자는 누구나 될 수 있습니다.
                    나이, 성별, 국적, 경력을 따지지 않습니다. 서로가 서로의 이타주의자가 될 수 있는 이타주의자 입니다 :)
                </Text>
                <CheckBox
                    style={{margin : 10, width:200}}
                    checked={this.state.setAgree}
                    //checked={({check}) => {check.setAgree}}
                    onChange={nextChecked => this.setFollowUp(nextChecked)}>
                        {`이타주의자들에 대해 이해했으며 지원을 시작하겠습니다`}
                </CheckBox>
                {/* // onPress={}버튼 클릭시 아래 숨겨진 화면 보임 */}
                    <View
                    style={{flexDirection: "row"}}>
                        {/* 자기PR */}
                        <Text 
                        category="h5"
                        style={{flex:0.3}}
                        >자기PR</Text>
                        <TextInput
                            style={{flex:0.7, height: 40, borderColor: 'gray', borderWidth: 1}}
                            borderStyle="solid"
                            placeholder="10자 이내로 자신에 대해 설명해주세요!"
                            defaultValue={this.text}
                        />
                    </View>
                    <View
                    style={{flexDirection: "row"}}>
                        <View
                        style={{flexDirection: "column", flex:0.3}}>
                            <Text category="h5">활동카테고리</Text>
                            <Text category="s2"
                            >이타주의자로 활동하려는 영역을 선택해주세요(5개까지중복가능)</Text>
                        </View>
                        <CheckBox
                        style={{margin : 10, flex:0.7}}
                        checked={this.state.setAgree}
                        onChange={nextChecked => this.setFollowUp(nextChecked)}>
                            {`개발/프로그래밍`}
                        </CheckBox>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <Text category="h5"
                        style={{flex:0.3}}>긴글 소개 입력창</Text>
                        {/* axios.get으로 가지고 오기 */}
                        <TextInput
                            style={{flex:0.7, height: 40, borderColor: 'gray', borderWidth: 1}}
                            borderStyle="solid"
                            placeholder="긴글 소개 입력창"
                            defaultValue={this.text}
                        />
                    </View>
            </Layout>   
        </SafeAreaView>
      )
  }
 
  
}

export default AltApplyScreen;



// const DATA = [    
//   {
//     title: "자기 PR",
//     inputType: "TextInput",
//     caption: "자신을 10자 혹은 자신을 드러낼 수 있는 문구를 적어주세요 없어도 괜찮아요! 항목에서 선택가능 하답니다"
//   },
//   {
//     title: "이타주의자 활동 카테고리 선택",
//     inputType: "selectbox",
//     caption: "5개까지 중복 가능"
//   },
//   {
//     title: "프로필 사진",
//     inputType: "image",
//     caption: "이타주의자 프로필에서 보여질 사진을 업로드 해주세요."
//   },
//   {
//     title: "질문받을 유형 선택",
//     inputType: "selectbox",
//     caption: "1:1질문, 1:N 질문 중 꼭 하나 이상 선택해주세요. 둘 다 선택 할 수 도 있어요."
//   },
//   {
//     title: "긴글 자기소개",
//     inputType: "TextInput",
//     caption: ""
//   },
//   {
//     title: "경력사항",
//     inputType: "TextInput",
//     caption: "활동과 관련된 경력사항을 입력해주세요."
//   },
//   {
//     title: "경력사항 공개여부",
//     inputType: "selectbox",
//     caption: ""
//   },
//   {
//     title: "명예 답변 공개 여부",
//     inputType: "selectbox",
//     caption: "답변의 반응이 좋으면 명예 답변으로 등록되어 메인에 공개될 수 도 있습니다. 동의하시겠습니까?"
//   }
// ];