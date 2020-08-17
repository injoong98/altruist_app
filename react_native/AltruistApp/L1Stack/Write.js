import React from 'react';
import {StyleSheet,SafeAreaView, View, Image, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, VirtualizedList,Alert,useState} from 'react-native';
import {Layout,Button,Text,TopNavigation,TopNavigationAction,Icon, Divider, Input, RadioGroup, Radio, Tooltip, CheckBox, IndexPath, Select, SelectItem} from '@ui-kitten/components'
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';
import { HeartIcon } from '../assets/icons/icons';
import axios from 'axios';
const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)
const CloseIcon =  (props) =>(
    <Icon {...props} name = "close"/>
)
const UpIcon =  (props) =>(
    <Icon {...props} name = "arrow-circle-up-outline"/>
)


const defaultWrite = ({navigation}) =>{
    
    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )
    
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} /> 
        <Divider />
        <Layout style={{flex:10}}>
            <ScrollView>
                <Text>This is Write</Text>
            </ScrollView>
        </Layout>
        <View style={styles.bottomView}>
            <Button 
                style={styles.bottomButton}
                onPress={()=>{navigation.goBack()}}>
                    글쓰기 
            </Button>
        </View>    
    </SafeAreaView>

    )
}
class GominWrite extends React.Component {

    constructor(props){
        super(props);
        this.state={
            isLoading :true,
            post_title:'',
            post_content:'',
            post_anoymous_yn:1,
            post_category:1,
            checked:true
            
        }
    }
    
    submitPost= async()=>{
        const {post_title,post_content,post_anoymous_yn,post_category} =this.state
        let formdata = new FormData();
            formdata.append("brd_key", 'b-a-1');
            formdata.append("post_title", post_title);
            formdata.append("post_content", post_content);
            formdata.append("post_category", post_category);
            formdata.append("post_anoymous_yn", post_anoymous_yn);
        await axios.post(
            'http://10.0.2.2/api/board_write/write',
            formdata
            )
        .then(response=>{
            if(!response.data.view.form_validation){
                var title = '유효하지 않는 글입니다.';
                var message = '필수값이 누락됐거나 금지 단어가 존재합니다'
            }else{
                var title = '게시글';
                var message=response.data.message;
            }
            Alert.alert(
                `${title}`,
                `${message}`,
                [
                    { 
                        text: "확인", 
                        onPress: ()=> {if(response.data.view.form_validation){this.gobackfunc();}else{return true}}
                    }
                ],
                { cancelable: false }
            );
        })
        .catch(error=>{
            alert('BYE:(')
        })    
    
    }
    submitAlert= () => {
        Alert.alert(
            "게시글",
            "게시글을 작성하시겠습니까?",
            [
                { 
                    text: "작성", 
                    onPress: ()=> this.submitPost()
                },
                {
                    text: "취소",
                    onPress: () => alert('취소했습니다.')
                }
                
            ],
            { cancelable: false }
        );
    }
    gobackfunc = () =>{
        const {navigation,route} = this.props;
        navigation.goBack();
        route.params.statefunction();
    } 
    SubmitButton = () =>(
        <TopNavigationAction icon={UpIcon} onPress={() =>{this.submitAlert()}}/>
    )

    CloseAction = () =>(
        <TopNavigationAction icon={CloseIcon} onPress={() =>{this.props.navigation.goBack();}}/>
    )
    render(){
        const {navigation} = this.props;
        const {post_title,post_category,post_anoymous_yn,post_content,checked} =this.state;
        return(

            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="글작성" alignment="center" accessoryLeft={this.CloseAction} accessoryRight={this.SubmitButton} /> 
                <Divider />
                <Input
                    placeholder="Place your Post's Title"
                    onChangeText={nextValue => this.setState({post_title:nextValue})}
                />
                <Divider />
                <Input
                    placeholder="Place your Post's content"
                    onChangeText={nextValue => this.setState({post_content:nextValue})}
                    multiline={true}
                    textStyle={{minHeight:100}}
                />            
                <View style={{alignItems:"flex-end"}}>
                    <CheckBox 
                    checked={checked} 
                    onChange={nextChecked=>this.setState({post_anoymous_yn: nextChecked? 1 : 0,checked:nextChecked })}>
                    {`익명`}
                    </CheckBox>
                </View>
            </SafeAreaView>
    
        )
    }
}

class MarketWrite extends React.Component {

    constructor(props){
        super(props);
        this.state={
            isLoading :true,
            post_title:'',
            post_content:'',
            post_location:'',
            deal_price:'',
            deal_type:2, // 0: 직거래, 1: 배송, 2: 둘다가능
            deal_status:1, // 0: 판매완료, 1: 판매중
        }
    }

    submit_Market_Post = async() => {

        const {post_title,post_content,post_location,deal_price,deal_type,deal_status}  = this.state

        let formdata = new FormData();
            formdata.append("post_title", post_title);
            formdata.append("post_content", post_content);
            formdata.append("post_location", post_location);
            formdata.append("deal_price", deal_price);
            formdata.append("deal_type", deal_type);
            formdata.append("deal_status", deal_status);
            
        await axios.post('http://10.0.2.2/api/board_write/write/b-a-2',formdata)
        .then(response=>{
            Alert.alert(
                "상품등록",
                "상품등록 완료",
                [
                    { 
                        text: "OK", 
                        onPress: ()=> alert('Hi')
                    }
                ],
                { cancelable: false }
            );
        })
        .catch(error=>{
            alert('BYE:(')
        })    
    }

    submit_Market_Alert= () => {
        Alert.alert(
            "상품등록",
            "상품을 등록하시겠습니까?",
            [
                {
                    text: "취소",
                    onPress: () => alert('취소했습니다.')
                },
                { 
                    text: "등록", 
                    onPress: ()=> this.submit_Market_Post()
                }
            ],
            { cancelable: false }
        );
    }

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    )

    render() {
        return(
            <SafeAreaView style={{flex:1}}>
    
                <TopNavigation title="글작성" alignment="center" accessoryLeft={this.BackAction} />
    
                <Divider />
                
                <Layout>
                    <Text>상품명</Text>
                    <Input
                        onChangeText={text => this.setState({post_title : text})}
                        // value={itemName}
                    />
                </Layout>
                <Layout style={{flexDirection:'row'}}>
                    <Layout style={{flex:1}}>
                        <Text>판매가격</Text>
                        <Input
                            onChangeText={text => this.setState({deal_price : text})}
                            // value={price}
                        />
                    </Layout>
                    <Layout style={{flex:1}}>
                        <Text>지역</Text>
                        <Input
                            onChangeText={text => this.setState({post_location : text})}
                            // value={loaction}
                        />
                    </Layout>
                </Layout>
                <Layout>
                    <Text>사진</Text>
                    {/* <VirtualizedList
                        data={DATA}
                        initialNumToRender={4}
                        renderItem={({ item }) => <Item uri={item.uri} />}
                        keyExtractor={item => item.id}
                        getItemCount={getItemCount}
                        getItem={getItem}
                        horizontal={true}
                    /> */}
                </Layout>
                <Layout>
                    <Text>상세정보</Text>
                    <Input
                        onChangeText={text => this.setState({post_content : text})}
                        // value={detail}
                    />
                </Layout>
                <Button onPress={()=>this.submit_Market_Alert()}>등 록</Button>
            </SafeAreaView>
        )
    }
}



class AlbaWrite extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            post_title : '',
            post_content : '',
            post_location : '',
            alba_type : 0,
            alba_salary_type : 0,
            alba_salary : '',
            _File : [],
            isTipVisible:false,
            isFollowUp:false,
        }
    }

    Salary_Type = [
        '시',
        '일',
        '주',
        '월'
    ]
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    )

    setTipVisible = (bool) => {this.setState({isTipVisible:bool});}
    setFollowUp = (nextChecked) => {
        this.setState({isFollowUp:nextChecked});
        this.setState({alba_salary:'추후협의'});
    }
    submit_alba_post = async() => {
        console.log(this.state);
        const {post_title, post_content, post_location, alba_type, alba_salary_type, alba_salary} = this.state;
        let formdata = new FormData();
            formdata.append("post_title", post_title);
            formdata.append("post_content", post_content);
            formdata.append("post_location", post_location);
            formdata.append("alba_type", alba_type);
            formdata.append("alba_salary_type", alba_salary_type);
            formdata.append("alba_salary", alba_salary);
        await axios.post('http://10.0.2.2/api/board_write/write/b-a-3', formdata)
        .then(response=>{
            Alert.alert(
                "게시글",
                "게시글 작성 완료",
                [
                    { 
                        text: "OK", 
                        onPress: ()=> alert('Hi')
                    }
                ],
                { cancelable: false }
            );
        })
        .catch(error=>{
            alert('BYE:(')
        })

        this.props.navigation.goBack();
    }

    submit_alba_Alert= () => {
        Alert.alert(
            "알바천일국",
            "게시글을 작성하시겠습니까?",
            [
                {
                    text: "Cancel",
                    onPress: () => alert('취소했습니다.')
                },
                { 
                    text: "OK", 
                    onPress: ()=> this.submit_alba_post()
                }
            ],
            { cancelable: false }
        );
    }

    get_Image_gallary = () =>{

    }

    renderToggleButton = () => (
        <Button
            appearance='ghost'
            accessoryLeft={HeartIcon}
            onPress={()=>this.setTipVisible(true)}/>
    );

    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="글작성" alignment="center" accessoryLeft={this.BackAction} /> 
                <Divider />
                <Layout style={{flex:10}}>
                    <ScrollView>
                        <Input
                            size='medium'
                            placeholder='Input Title'
                            onChangeText ={(nextText) => {this.setState({post_title:nextText})}}
                            />
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Input
                                size='medium'
                                placeholder='Input Location'
                                onChangeText ={(nextText) => {this.setState({post_location:nextText})}}
                                />
                            <RadioGroup
                                style={{flexDirection:'row', margin : 10}}
                                selectedIndex = {this.state.alba_type}
                                onChange={(index) => { this.setState({alba_type:index})}}>
                                <Radio>단기</Radio>
                                <Radio>장기</Radio>
                            </RadioGroup>
                            <Tooltip
                                anchor={this.renderToggleButton}
                                visible={this.state.isTipVisible}
                                placement='bottom end'
                                onBackdropPress={() => this.setTipVisible(false)}>
                                3개월미만은 단기, 3개월 이상은 장기
                            </Tooltip>
                        </View>
                        <View style={{flexDirection : 'row', alignItems:'center'}}>
                            <Text style={{margin : 10}}>추후 협의</Text>
                            <CheckBox
                                style={{margin : 10}}
                                checked={this.state.isFollowUp}
                                onChange={nextChecked => this.setFollowUp(nextChecked)}>
                            </CheckBox>
                            <Select
                                style={{margin : 10, width : 100}}
                                value={this.Salary_Type[this.state.alba_salary_type]}
                                selectedIndex={this.state.alba_salary_type}
                                onSelect={(index)=>{this.setState({alba_salary_type:index})}}
                                disabled={this.state.isFollowUp}
                                >
                                <SelectItem title = '시'/>
                                <SelectItem title = '일'/>
                                <SelectItem title = '주'/>
                                <SelectItem title = '월'/>
                            </Select>

                            <Input
                                style={{margin : 10}}
                                size='medium'
                                placeholder='Input Salary'
                                disabled={this.state.isFollowUp}
                                onChangeText ={(nextText) =>  {this.setState({alba_salary:nextText})}}
                                />
                        </View>
                    <Input
                        multiline={true}
                        textStyle={{ minHeight: 500}}
                        placeholder='Input Context'
                        onChangeText ={(nextText) => {this.setState({post_content:nextText})}}
                    />
                    <Button onPress ={()=>{
                        this.get_Image_gallary();
                    }}>
                        사진추가
                    </Button>
                </ScrollView>
                </Layout>
                <View style={styles.bottomView}>
                    <Button 
                        style={styles.bottomButton}
                        onPress={()=>{this.submit_alba_post()}}>
                            글쓰기 
                    </Button>
                </View>   
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    item: {
      backgroundColor: '#f9c2ff',
      height: 150,
      justifyContent: 'center',
      marginVertical: 8,
      marginHorizontal: 16,
      padding: 20,
    },
    title: {
      fontSize: 32,
    },
    input : {
        marginVertical : 2,
        margin : 10,
        marginTop : 5,
    },
    photo: {
        justifyContent: 'center', 
        alignItems: 'center', 
        margin: 10, 
        borderWidth: 2,
        borderColor: 'grey'
    },
    bottomView: {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : 'lightgrey',
    },
    bottomButton: {
        width : "95%",
    },
});
  

export {defaultWrite, MarketWrite, AlbaWrite,GominWrite}