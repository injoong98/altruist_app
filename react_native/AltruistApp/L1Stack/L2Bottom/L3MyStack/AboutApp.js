import React from 'react';
import {SafeAreaView,View,LogBox,StyleSheet,ActivityIndicator,TouchableOpacity} from 'react-native';
import { Text,List,Spinner,TopNavigationAction,TopNavigation} from '@ui-kitten/components';
import Backsvg from '../../../assets/icons/back-arrow-color.svg'
import { ScrollView } from 'react-native-gesture-handler';


export class AboutApp extends React.Component{
    constructor(props){
        super(props);
       
    }
   
    BackAction = () =>(
        <TopNavigationAction icon={()=><Backsvg width={26} height={26}/>} onPress={() =>{this.props.navigation.goBack()}}/>
    )

    render(){
        return(
            <SafeAreaView style={{flex:1,backgroundColor:"#ffffff"}}>
            <TopNavigation alignment="center" accessoryLeft={this.BackAction} title="" /> 
            <ScrollView>
                <Text category="h2" style={{textAlign:'center'}}>{'더불어 사는 이타주의자들이란?'}</Text>
                <Text category="s1" style={styles.title}>VISION MISSION</Text>

                <Text category="p1" style={styles.subtitle}>VISION</Text>
                <Text category="p1" style={styles.content}> 
{`참부모님의 삶과 가르침을 연구하고 실천
To study and practice Ture Parents’ lives and their teachings`}
                </Text>
                <Text category="p1" style={styles.subtitle}>The right people to be(인재상)</Text>
                <Text category="p1" style={styles.content}>
                    더불어 성장하는 이타주의자들   Altruists who grow together
                </Text>
                
                <Text category="p1" style={styles.subtitle}>SPIRIT</Text>
                <Text category="p1" style={styles.content}>도전, 창조, 사랑  Challenge, Create, Love</Text>
                
                <Text category="p1" style={styles.subtitle}>MISSION</Text>
                <Text category="p1" style={styles.content}>
                    {` 진리탐구  Research the truth \n
참사랑 실천  Practice true love \n
참가정 완성  Perfect true families \n
인류 한 가족 실현  Realize one family of humanity `}
                </Text>
                    
                <Text category="p2" style={styles.subtitle}>
                    {` 여기에 있는 인재상을 생각하며,\n 본 사이트의 이름을 '이타주의자들'로 정하였습니다.`}
                </Text>
                <Text category="s1" style={styles.subtitle}>
                   {` ‘미션, 비젼, 인재상, 정신‘은 선언이 아니라 삶과 문화로 보여져야 할 것입니다. \n
오늘날 세상은 ”참부모님을 향한 믿음과 가르침에 대한 신념이 당신을 어떻게 변화시키고 있는가. 어떻게 살고 있는가. 그래서 만들어낸 문화는 무엇인가.”\n
라는 질문을 우리에게 던지고 있습니다. 미래세대인 성화, CARP, 성화청년회, 가정연합 식구 모두가 관심을 가지고 본 사이트를 방문하셔서 이글을 보시는 분들도 마찬가지라 생각합니다.
웹사이트 ‘이타주의자들’은 이러한 질문에 대한 답을 만들어가는데 도움을 주기 위해 개발하였습니다. 우리는 선후배관계가 아니라 ‘형제, 자매’ 관계입니다. 이를 위해 ‘이타주의자’라는 서로를 이어주는 프로그램을 개발했습니다. 우리는 위하여 사는 삶을 추구합니다. 서로 만나, 지식과 지혜, 사랑과 정을 나누고 싶어합니다.
이를 위해 ‘모임’ 기능을 넣었습니다. 각종 게시판도 열었습니다. 본 사이트가 우리의 비젼, 미션, 인재상을 이루어가는데 도움이 되길 바랍니다. 첫 개발이라 부족한 부분이 많을 것입니다. 의견을 계속 주십시오. 꾸준히 개발해 나가겠습니다.
사이트 회원 가입도 하시고, 모두들 이타주의자로 등록도 부탁드립니다. 우린 누군가의 멘토이고 멘토이니까 부담없이! ^^
CARP회장 김동연  susuact@gmail.com, facebook.com/susuact`
                    }
                </Text>
            </ScrollView>
        </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    title : {
        fontWeight:'bold',
        textAlign : 'center',
        textDecorationLine: 'underline',
    },
    subtitle : {
        textAlign : 'left'
        
    },
    content : {
        textAlign : 'center'

    }

})