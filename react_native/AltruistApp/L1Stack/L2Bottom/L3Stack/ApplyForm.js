import React,{useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {SafeAreaView, View, TextInput, StyleSheet, KeyboardAvoidingView, Alert} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, Radio, CheckBox, Card } from '@ui-kitten/components'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';


const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)





class AltApplyFormScreen extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            // //기본사항
            // aboutme : '',
            // aboutmyself : '',
            // answertype : '',
            // photo : '',
            // //경력사항
            // type : '',
            // year: [],
            // contents:[],
            // final : '',
            // files:[],
            // status:[],
            // open: ''

        }
    }
    
    handleSubmit() {
        const { userForm, user } = this.props;
      
        if (userForm.valid) { // userForm.$form.valid in V1
          // submit user here
        } else {
          // show errors
        }
      }


    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )


    setAltruist = async() => {
        console.log(this.state);
//        const {post_title, post_content, post_location, post_hp, alba_type, alba_salary_type, alba_salary} = this.state;

        let formdata = new FormData();
        formdata.append("mem_id", "5");
        formdata.append("alt_aboutme",'언택트 주부 9단');
        formdata.append("alt_content", '안녕하세요 적당히 바람이 시원해 언택트 주부 9단이 왔어요 ');
        formdata.append("alt_answertype", '2');
        formdata.append("alt_status", 'R');
        formdata.append("alt_honor", '0');
        formdata.append("acv_type[]", 'J');
        formdata.append("acv_year[]", '2020');
        formdata.append("acv_content[]", '2020초보주부론 편찬의원회');
        formdata.append("acv_status[]", '0');
        formdata.append("acv_open[]", '1');
        formdata.append("act_id[]", '1');
        
        // formdata.append("acv_type[]", 'J');
        // formdata.append("acv_year[]", '2020');
        // formdata.append("acv_content[]", '2020초보주부론 편찬의원회');
        // formdata.append("acv_status[]", '0');
        // formdata.append("acv_open[]", '1');
        // formdata.append("act_id[]", '1');
    
        console.log(formdata);
        
        await axios.post('http://10.0.2.2/api/altruists/apply', formdata,
          {'Content-Type':'application/form-data'}
        //   formdata
        // { 
        //     'mem_id' : 5,
        //     'alt_aboutme' : '언택트 주부 9단',
        //     'alt_content' : '안녕하세요 적당히 바람이 시원해 언택트 주부 9단이 왔어요 ',
        //     'alt_answertype' : '2',
        //     'alt_status' : 'R',
        //     'alt_honor' : '0',
        //     // 'acv_type' : ['J','J'],
        //     // 'acv_year' : ['2020', '2019'],
        //     // 'acv_content' : ['초보주부론 편찬의원회', '언택트 주부 9단 초대강의 강사'],
        //     // 'acv_status' : ['0', '0'],
        //     // 'acv_open' : ['1','1'],
        //     // 'act_id' : ['1','1']
        //     'acv_type' : ['J'],
        //     'acv_year' : ['2020'],
        //     'acv_content' : ['초보주부론 편찬의원회'],
        //     'acv_status' : ['0'],
        //     'acv_open' : ['1'],
        //     'act_id' : ['1']
        // }
        )
        .then(response=>{
            console.log(response)
            console.log(response.data.status)
            if(response.data.status == '500'){
                Alert.alert(
                    "Error",
                    `${response.data.message}` ,
                    [
                        {text:"OK"}
                    ],
                    { cancelable: false }
                )
            }else{Alert.alert(
                    "이타주의자",
                    "작성 완료",
                    [
                        { 
                            text: "OK", 
                        }
                    ],
                    { cancelable: true }
                );
            }
        })
    
        .catch(error=>{
            console.log(error);
            alert(error);
        })
    }

    getAreaCat = async() => {
        await axios.get('http://10.0.2.2/api/altruists/area_category')
        .then(res => {
            //console.log(res)
            this.setState({category : res.data.data})
            console.log(this.state.category);
        })
        .catch(err => {
            alert(err)
        })
    }
    

    componentDidMount(){
        //this.setAltruist()
        this.getAreaCat()
    }

    

    getCategory = (category) => {
        const category_name = category.act_id
        const category_content = category.act_content
        const category_use = category.act_use
        console.log(category_content)
        return (
            <View>
                <Text>
                    {category_name}
                </Text>
                <Text>
                    {category_content}
                </Text>
                <Text>
                    {category_use}
                </Text>
            </View>
        )
    }

    render(){ 

        // const {aboutme
        // ,aboutmyself
        // ,answertype
        // ,status
        // ,honor
        // ,careertype
        // ,careeryear
        // ,careerfinal
        // ,careerfile
        // ,careerstatus
        // ,careeropen
        // ,categoryid, 
        const {category} = this.state
        console.log('cat : '+this.props)
        return(
            
            <SafeAreaView style={styles.container}>
                <TopNavigation 
                title="이타주의자" accessoryLeft={this.BackAction} /> 
                    <View>
                        <Text> 이타주의자 지원하기 FORM </Text>
                    </View>
                    <ScrollView>
                        <View><this.getCategory/></View>
                        <View style={{flexDirection:'row', justifyContent:'center'}}>
                            <Button style={{margin:10}}>취소</Button>
                            {/* <Button style={{margin:10}} onPress={()=>navigation.navigate('AltApplyComplete')}>완료</Button> */}
                            <Button style={{margin:10}} onPress={()=>this.setAltruist()}>완료</Button>
                        </View>
                    </ScrollView>
            </SafeAreaView>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper :{
        margin: 10,
        backgroundColor: "#eaeaea"
      },
      title: {
        marginTop: 16,
        paddingVertical: 8,
        borderWidth: 4,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#61dafb",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold"
      },
      titleInput :{
        backgroundColor:'#ffffff',
        borderRadius:15,
        marginHorizontal:10,
        marginBottom:20
    },
      contentInput :{
        backgroundColor:'#ffffff',
        borderRadius:15,
        marginHorizontal:10,
        marginBottom:20,
        // 휴대폰 width - titleInput
        width:350
    },
});



export default AltApplyFormScreen;


{/*  */}
