import React from 'react';
import {StyleSheet,SafeAreaView, View, Image, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, VirtualizedList,Alert,useState, NativeModules, TouchableOpacity, TextInput} from 'react-native';
import {Layout,Button,Text,TopNavigation,TopNavigationAction,Icon, Divider, Input, RadioGroup, Radio, Tooltip, CheckBox, IndexPath, Select, SelectItem, Card} from '@ui-kitten/components'
import HTML from 'react-native-render-html';
import ImagePicker from 'react-native-image-crop-picker';
import { HeartIcon } from '../assets/icons/icons';
import axios from 'axios';
import {Picker} from '@react-native-community/picker';
import {ActionSheet, Root} from 'native-base';
import { TopBarTune } from '../components/TopBarTune';

import Camsvg from '../assets/icons/Icon_Cam.svg'
import Tooltipsvg from '../assets/icons/tooltip.svg'

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
            post_title:this.props.route.params.mode=='edit' ? this.props.route.params.post.post_title:'',
            post_content:this.props.route.params.mode=='edit' ? this.props.route.params.content:'',
            post_anoymous_yn:this.props.route.params.mode=='edit' ? this.props.route.params.post.post_anoymous_yn:1,
            post_category:1,
            checked:this.props.route.params.mode=='edit' ? this.props.route.params.post.post_anoymous_yn==0 ? false: true :true,
        }
    }
    submitPost= async()=>{
        const url = this.props.route.params.mode=='edit' ?'http://dev.unyict.org/api/board_write/modify' :'http://dev.unyict.org/api/board_write/write/b-a-1'
        const {post_title,post_content,post_anoymous_yn,post_category} =this.state
        let formdata = new FormData();
            formdata.append("post_title", post_title);
            formdata.append("post_content", post_content);
            formdata.append("post_category", post_category);
            formdata.append("post_anoymous_yn", post_anoymous_yn);
            formdata.append("brd_key", "b-a-1");
        
            this.props.route.params.mode=='edit' ?
            formdata.append('post_id',this.props.route.params.post.post_id)            
            :
            null
        
        
        await axios.post(url,formdata)
        .then(response=>{
            Alert.alert(
                "게시글",
                this.props.route.params.mode=='edit' ?
                `"게시글 수정 완료"\n${JSON.stringify(response.data)}`
                :
                `"게시글 작성 완료"\n${JSON.stringify(response.data)}`,
                [
                    { 
                        text: "닫기", 
                        onPress: ()=> this.gobackfunc()
                    }
                ],
                { cancelable: false }
            );
        })
        .catch(error=>{
            alert(JSON.stringify(error))
        })    
    
    }
    filterSpamKeyword= async() => {
        const {post_title,post_content} =this.state;
        
        var formdata =new FormData();
        formdata.append("title", post_title);
        formdata.append("content", post_content);
        formdata.append("csrf_test_name", '');
        
    
        await axios.post('http://dev.unyict.org/api/postact/filter_spam_keyword',formdata)
        .then(response=>{
            const {message,status}=response.data
            if(status=='500'){
                alert(message)
            }else if(status=="200"){
                Alert.alert(
                    "게시글",
                    this.props.route.params.mode=='edit' ?'게시글을 수정하시겠습니까?':"게시글을 작성하시겠습니까?",
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

        })
        .catch(error=>{
            alert(`금지단어 검사에 실패 했습니다. ${error.message}`)
        })
    }
    gobackfunc = () =>{
        const {navigation,route} = this.props;
        navigation.goBack();
        route.params.statefunction();
    } 
    SubmitButton = () =>(
        <TopNavigationAction icon={UpIcon} onPress={() =>{this.filterSpamKeyword()}}/>
    )

    CloseAction = () =>(
        <TopNavigationAction icon={CloseIcon} onPress={() =>{this.props.navigation.goBack();}}/>
    )
    render(){
        const {navigation} = this.props;
        const {post_title,post_category,post_anoymous_yn,post_content,checked,content} =this.state;
        return(

            // <SafeAreaView style={{flex:1}}>
                <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
                <TopBarTune 
                    text="고민 작성" 
                    func={() =>{this.filterSpamKeyword()}} 
                    right={this.props.route.params.mode=='edit' ?'edit' : "upload"}
                    gbckfunc={()=>{navigation.goBack()}} 
                    gbckuse={true}
                />
                    {/* <TopNavigation title="글작성" alignment="center" accessoryLeft={this.CloseAction} accessoryRight={this.SubmitButton} style={styles.topbar}/>  */}
                        <TextInput
                            style={{backgroundColor:'#ffffff',borderRadius:8.5, marginTop:18,marginHorizontal:12,marginBottom:14,fontSize:18}}
                            placeholder="제목"
                            onChangeText={nextValue => this.setState({post_title:nextValue})}
                            placeholderTextColor='#A897C2'
                            value={post_title}
                        />
                        <TextInput
                            value={post_content}
                            style={{ height:'80%',maxHeight:'50%',backgroundColor:'#ffffff',borderRadius:8.5, marginHorizontal:12,marginBottom:14,fontSize:18}}
                            placeholder="내용"
                            onChangeText={nextValue => this.setState({post_content:nextValue})}
                            multiline={true}
                            textAlignVertical='top'
                            textStyle={{minHeight:100}}
                            placeholderTextColor='#A897C2'
                        />            
                        <View style={{alignItems:"flex-end",paddingRight:12}}>
                            <CheckBox 
                            checked={checked} 
                            onChange={nextChecked=>this.setState({post_anoymous_yn: nextChecked? 1 : 0,checked:nextChecked })}>
                                {()=>
                                <Text category="h3">
                                    익명
                                </Text>}
                            </CheckBox>
                        </View>
                    </KeyboardAvoidingView>
            // {/* </SafeAreaView> */}
    
        )
    }
}

class MarketWrite extends React.Component {

    constructor(props){
        super(props);
        this.state={
            isLoading: true,
            post_title: '',
            post_content: '',
            post_location: '',
            deal_price: '',
            deal_type: 2, // 0: 직거래, 1: 배송, 2: 둘다가능
            deal_status: 1, // 0: 판매완료, 1: 판매중
            images: [],
            image:''
        }
    }

    submitPost = async() => {

        console.log(this.state);
        const {post_title, post_content, post_location, deal_price, deal_type, deal_status, images, image} = this.state;

        let formdata = new FormData();
            formdata.append("brd_key", 'b-a-2');
            formdata.append("post_title", post_title);
            formdata.append("post_content", post_content);
            formdata.append("post_location", post_location);
            formdata.append("deal_price", deal_price);
            formdata.append("deal_type", deal_type);
            formdata.append("deal_status", deal_status);
            formdata.append("post_nickname", 'Edward');
            formdata.append("post_email", 'Edward@sogang.ac.kr');
            formdata.append("post_password", '0000');
            images.map(item=>{
                formdata.append('post_file[]',
                    {
                        uri:item.path,
                        type:item.mime,
                        name:'image.jpg',
                    }
                )
            })
            
        await axios.post(
            'http://dev.unyict.org/api/board_write/write/b-a-2',
            formdata
        )
        .then(response=>{
            Alert.alert(
                "게시글",
                JSON.stringify(response.data),
                [
                    { 
                        text: "OK", 
                        onPress: ()=> this.gobackfunc()
                    }
                ],
                { cancelable: false }
            );
        })
        .catch(error=>{
            console.log(error)
            alert(JSON.stringify(error))
        })    
    }
    
    gobackfunc = () =>{
        const {navigation,route} = this.props;
        navigation.goBack();
    } 
    
    //등록버튼 클릭했을 때
    onClickAddImage() {
        const buttons = ['Take Photo', 'Choose Photo from Gallery', 'Cancel'];
        ActionSheet.show(
            {options: buttons,
            cancelButtonIndex: 2,
            title: 'Select a photo'},
            buttonIndex => {
                switch (buttonIndex) {
                    case 0:
                        this.takePhotoFromCamera();
                        break;
                    case 1:
                        this.choosePhotoFromGallery();
                        break;
                    default:
                        break
                }
            }
        )
    };

    //카메라로 사진 찍기
    takePhotoFromCamera() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
          }).then(image => {
            this.onSelectedImage(image);
          //  console.log(image);
          });
    }

    //갤러리에서 사진 가져오기
    choosePhotoFromGallery() {
        ImagePicker.openPicker({
            multiple: true,
            includeExif: false,
        }).then(image => {
            image.map(item => this.onSelectedImage(item));
            //console.log(image);
        });
    }

    //불러온 사진의 정보를 this.state에 저장
    onSelectedImage(image) {
        //console.log(image);
        let newImages = this.state.images;
        const source = {uri: image.path};
        let item = {
            id: Date.now(),
            url: source,
            mime:image.mime,
            path:image.path,
            content: image.data
        };
        console.log(item)
        newImages.push(item);
        this.setState({images: newImages})
        this.setState({image: item})
    };
    
    renderImage(image) {
        //console.log(image);
        return (
            <View key={image.id}>
                <Image style={styles.market_RenderImage} source={image.url}/>
            </View>
        )
    }

    renderAsset(image) {
        if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
            return this.renderVideo(image);
        }

        return this.renderImage(image);
    }


    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    )

    render() {
        return(
            <Root>
            <SafeAreaView style={{flex:1}}>
                
                <TopNavigation title="글작성" alignment="center" accessoryLeft={this.BackAction} style={styles.topbar}/>
    
                <Divider />
                
                <ScrollView>
                    <View style={{paddingVertical:10, backgroundColor:'#F4F4F4'}}>
                        <View style={styles.container}>
                            <Text>상품명</Text>
                            <Input
                                style={styles.input}
                                onChangeText={text => this.setState({post_title : text})}
                                // value={itemName}
                            />
                        </View>
                        <View style={{...styles.container, flexDirection:'row'}}>
                            <View style={{flex:1}}>
                                <Text>판매가격</Text>
                                <Input
                                    style={styles.input}
                                    keyboardType='numeric'
                                    onChangeText={text => this.setState({deal_price : text})}
                                    // value={price}
                                />
                            </View>
                            <View style={{flex:1}}>
                                <Text>거래희망지역</Text>
                                <Input
                                    style={styles.input}
                                    onChangeText={text => this.setState({post_location : text})}
                                    // value={loaction}
                                />
                            </View>
                        </View>
                        <View style={styles.container}>
                            <Text>사진</Text>
                            <ScrollView horizontal={true} style={styles.input}>
                                <TouchableOpacity style={{width:100, height:100, backgroundColor:'white', alignItems:'center', justifyContent:'center'}} onPress={()=>this.onClickAddImage()}>
                                    <Camsvg/>
                                </TouchableOpacity>
                                {this.state.images ? this.state.images.map(item => this.renderAsset(item)) : null}
                            </ScrollView>                                                 
                        </View>
                        <View style={styles.container}>
                            <Text>거래방법</Text>
                            <View style={styles.deal_type}>
                                <TouchableWithoutFeedback onPress={()=>this.setState({deal_type : 0})}>
                                    <View style={this.state.deal_type==0? {...styles.deal_box, opacity:1.0}:styles.deal_box}>
                                        <Text style={styles.deal_type_text}>직거래</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>this.setState({deal_type : 1})}>
                                    <View style={this.state.deal_type==1? {...styles.deal_box, opacity:1.0}:styles.deal_box}>
                                        <Text style={styles.deal_type_text}>배송</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>this.setState({deal_type : 2})}>
                                    <View style={this.state.deal_type==2? {...styles.deal_box, opacity:1.0}:styles.deal_box}>
                                        <Text style={styles.deal_type_text}>둘다가능</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={styles.container}>
                            <Text>상세정보</Text>
                            <Input
                                onChangeText={text => this.setState({post_content : text})}
                                // value={detail}
                            />
                        </View>
                        <Button onPress={()=>this.submitPost()}>등 록</Button>
                        {/* <Button onPress={()=>console.log(this.state.images)}>콘솔</Button> */}
                    </View>
                </ScrollView>
            </SafeAreaView>
            </Root>
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
            post_hp : '',
            alba_type : 0,
            alba_salary_type : new IndexPath(0),
            alba_salary : '',
            post_image : [],
            imagesource : {},
            images : [],
            isTipVisible:false,
            isFollowUp:false,
            image:''
        }
    }

    Salary_Type = [
        '시',
        '일',
        '주',
        '월'
    ]

    // BackAction = () =>(
    //     <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    // )
    // SubmitButton = () =>(

    //     <TopNavigationAction icon={UpIcon} onPress={() =>{this.submit_alba_Alert()}}/>
    // )

    setTipVisible = (bool) => {this.setState({isTipVisible:bool});}
    setFollowUp = (nextChecked) => {
        this.setState({isFollowUp:nextChecked});
        this.setState({alba_salary:'추후협의'});
    }
    submit_alba_post = async() => {
        console.log(this.state);
        const {post_title, post_content, post_location, post_hp, alba_type, alba_salary_type, alba_salary,images} = this.state;
        let formdata = new FormData();
        formdata.append("brd_key", 'b-a-3');
        formdata.append("post_title", post_title);
        formdata.append("post_content", post_content);
        formdata.append("post_nickname", 'roothyo');
        formdata.append("post_email", 'roothyo@soongsil.ac.kr');
        formdata.append("post_password", '1234');
        formdata.append("post_location", post_location);
        formdata.append("post_hp", post_hp);
        formdata.append("alba_type", alba_type);
        formdata.append("alba_salary_type", alba_salary_type.row);
        formdata.append("alba_salary", alba_salary);
        images.map(item=>{
            formdata.append('post_file[]',
                {
                    uri:item.path,
                    type:item.mime,
                    name:'image.jpg',
                }
            )
        })
        console.log(formdata);
        await axios.post('http://dev.unyict.org/api/board_write/write/b-a-3', formdata)
        .then(response=>{
            console.log(response);
            Alert.alert(
                "게시글",
                "게시글 작성 완료",
                [
                    { 
                        text: "OK", 
                        onPress: ()=> {this.gobackfunc()}
                    }
                ],
                { cancelable: false }
            );
        })
        .catch(error=>{
            alert(error);
        })
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

    gobackfunc = () =>{
        this.cleanupImages();
        const {navigation,route} = this.props;
        navigation.goBack();
        route.params.statefunction();
    } 

    cleanupImages() {
        ImagePicker.clean().then(() => {
            console.log('Temporary images history cleared')
        }).catch(e => {
            console.log(e);
        });
    }

    pickMultiple() {
        ImagePicker.openPicker({
            multiple: true,
          //  includeExif: false,
        }).then(image => {
            image.map(item => this.onSelectedImage(item));
            //console.log(image);
        });
    }

      //불러온 사진의 정보를 this.state에 저장
      onSelectedImage(image) {
        //console.log(image);
        let newImages = this.state.images;
        const source = {uri: image.path};
        let item = {
            id: Date.now(),
            url: source,
            mime:image.mime,
            path:image.path,
            content: image.data
        };
        console.log(item)
        newImages.push(item);
        this.setState({images: newImages})
        this.setState({image: item})
    };
    /* pickMultiple() {
        ImagePicker.openPicker({
            multiple: true,
            // includeExif: true,
        }).then(images => {
            this.setState({
                post_image: images.map(i => {
                    console.log('received image', i);
                    return {uri: i.path, name : i.path.split('/').pop(), type : i.mime};
                })
            });
        }).catch(e => console.log(e));
    } */

   /*  renderImage(image) {
        return <Image style={{width: 150, height: 150, resizeMode: 'contain', borderWidth: 0.5, margin : 5}} source={image}/>
    } */
    renderImage(image) {
        //console.log(image);
        return (
            <View key={image.uri}>
                <Image style={styles.market_RenderImage} source={image.url}/>
            </View>
        )
    }
    renderAsset(image) {
        if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
            return this.renderVideo(image);
        }

        return this.renderImage(image);
    }

    renderToggleButton = () => (
        <TouchableOpacity style={{justifyContent : 'center', alignItems : 'center'}} onPress={()=>this.setTipVisible(true)}>
            <Tooltipsvg height={24} width={24}/>
        </TouchableOpacity>
    );

    render(){
        const {navigation} = this.props;
        return(
            <SafeAreaView style={{flex:1,}}>
                <TopBarTune 
                    text="채용 정보 작성" 
                    right={this.props.route.params.mode=='edit' ?'edit' : "upload"}
                    func={() =>{this.submit_alba_Alert()}}
                    gbckfunc={()=>{navigation.goBack()}} 
                    gbckuse={true}
                />
                {/* <TopNavigation title="글작성" alignment="center" accessoryLeft={this.BackAction} accessoryRight={this.SubmitButton} style={styles.topbar}/>  */}
                <Divider />
                <Layout style={{flex:10, backgroundColor : '#F4F4F4'}}>
                    <ScrollView>
                        <TextInput
                            style={{borderRadius : 20, marginVertical : 5, marginHorizontal : 10, marginTop : 10,
                                backgroundColor : 'white', paddingLeft : 20, fontSize : 24}}
                            placeholder='Input Title'
                            onChangeText ={(nextText) => {this.setState({post_title:nextText})}}
                        />
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <View style={{flex : 1, borderRadius : 20, marginLeft : 10,
                                backgroundColor : 'white', paddingLeft : 20, }}>
                                <View style={{flexDirection : 'row'}}>
                                    <RadioGroup
                                        style={{flexDirection:'row'}}
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
                                    <Text style={{fontSize : 16}} category='c2'>추후 협의</Text>
                                    <CheckBox
                                        style={{margin : 10}}
                                        checked={this.state.isFollowUp}
                                        onChange={nextChecked => this.setFollowUp(nextChecked)}>
                                    </CheckBox>
                                    <Select
                                        style={{margin : 5, width : 100}}
                                        value={this.Salary_Type[this.state.alba_salary_type.row]}
                                        selectedIndex={this.state.alba_salary_type}
                                        onSelect={(index)=>{this.setState({alba_salary_type:index})}}
                                        disabled={this.state.isFollowUp}
                                        >
                                        <SelectItem title = '시급'/>
                                        <SelectItem title = '일급'/>
                                        <SelectItem title = '주급'/>
                                        <SelectItem title = '월급'/>
                                    </Select>
                                </View>
                            </View>
                            <View style={{flex : 1}}>
                                <TextInput
                                    style={{flex : 1, borderRadius : 20, marginVertical : 5, marginHorizontal : 10, 
                                        backgroundColor : 'white', paddingLeft : 20, fontSize : 16}}
                                    category = 'h4'
                                    keyboardType='numeric'
                                    placeholder='Input phone number'
                                    onChangeText ={(nextText) => {this.setState({post_hp:nextText})}}
                                />
                                <TextInput
                                    style={{borderRadius : 20, marginVertical : 5, marginHorizontal : 10, 
                                        backgroundColor : 'white', paddingHorizontal : 20, fontSize : 16}}
                                    size='medium'
                                    keyboardType='numeric'
                                    placeholder='Input Salary 원'
                                    disabled={this.state.isFollowUp}
                                    onChangeText ={(nextText) =>  {this.setState({alba_salary:nextText})}}
                                />
                            </View>
                        </View>
                        <TextInput
                            style={{borderRadius : 20, marginVertical : 5, marginHorizontal : 10, 
                                    backgroundColor : 'white', paddingLeft : 20, fontSize : 20}}
                            placeholder='Input Location'
                            onChangeText ={(nextText) => {this.setState({post_location:nextText})}}
                            />
                    <TextInput
                        style={{borderRadius : 20, marginVertical : 5, marginHorizontal : 10, 
                            backgroundColor : 'white', paddingHorizontal : 20, fontSize : 20}}
                        multiline={true}
                        numberOfLines={5}
                        placeholder='Input Context'
                        textAlignVertical='top'
                        onChangeText ={(nextText) => {this.setState({post_content:nextText})}}
                    />
                    <Layout style={styles.picture}>
                        <View style={{flexDirection : 'row', flex: 1, alignItems : 'center', justifyContent : 'space-between', marginVertical : 10}}>
                            <Text category='h4'> 사진</Text>
                            <TouchableOpacity onPress={()=>this.pickMultiple()}>
                                <Camsvg/>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal style={{height : 150}}>
                            {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                        </ScrollView>
                    </Layout>
                </ScrollView>
                </Layout>   
            </SafeAreaView>
        );
    }
}


class IlbanWrite extends React.Component{
    //get : 회원정보
   //post : 포스트 글 업로드
   //put : ~/{게시판이름}/:{글id}/


   constructor(props){
       super(props);
       this.state={
           isLoading: true,
           brd_key: 'ilban',
           post_title: '',
           post_content: '',
           post_nickname:'',
           post_email:'',
           images: [],
           post_category : []
       }
   }

   // constructor(props){
   //     super(props);
   //     this.state = {
   //         isLoading: true,
   //         brd_key: 'ilban',
   //         post_title:'',
   //         post_content:'',
   //         post_category:'',
   //         post_nickname:'',
   //         post_email:'',
   //         post_image: null,
   //         post_images: null,
   //         imagesource : {},
   //         image: null,
   //         images: {
   //             value: null,
   //             valid: false
   //         }
   //             //isTipVisible:false,
   //         //isFollowUp:false,
   //     }
   // }

   getCategory = async() =>{
    await axios.get( 'http://dev.unyict.org/api/board_post/lists/ilban' )
       .then(res => {
           console.log(res.data.view.list.board.category)
           this.setState({post_category:res.data.view.list.board.category})
       })
       .catch(err => {
           console.log(err)
       })
   }


   submitPost = async() => {

       console.log(this.state);
       const {post_title, post_content, post_category} = this.state;

       let formdata = new FormData();
           formdata.append("brd_key", 'ilban');
           formdata.append("post_title", post_title);
           formdata.append("post_category", '1');
           formdata.append("post_content", post_content);
           formdata.append("post_nickname", 'ryeMhi');
           formdata.append("post_email", 'yhr0901@gmail.com');
           formdata.append("post_password", '0000');
           
       await axios.post(
           'http://dev.unyict.org/api/board_write/write/ilban',
           formdata
       )
       .then(response=>{
           console.log(response)
           Alert.alert(
               "게시글",
               "게시글 작성 완료",
               [
                   { 
                       text: "OK", 
                       onPress: ()=> {this.gobackfunc()}
                   }
               ],
               { cancelable: false }
           );
       })
       .catch(error=>{
           console.log(error)
           console.error();
           //alert('')
       })    
   }

   gobackfunc = () =>{
    this.cleanupImages();
    const {navigation,route} = this.props;
    navigation.goBack();
    // route.params.statefunction();
    }
    
    cleanupImages() {
        ImagePicker.clean().then(() => {
            console.log('Temporary images history cleared')
        }).catch(e => {
            console.log(e);
        });
    }
   onClickAddImage() {
       const buttons = ['사진 촬영', '갤러리에서 사진 가져오기', '취소'];
       ActionSheet.show(
           {options: buttons,
           cancelButtonIndex: 2,
           title: '사진 선택'},
           buttonIndex => {
               switch (buttonIndex) {
                   case 0:
                       this.takePhotoFromCamera();
                       break;
                   case 1:
                       this.choosePhotoFromGallery();
                       break;
                   default:
                       break
               }
           }
       )
   };

   takePhotoFromCamera() {
       ImagePicker.openCamera({
           width: 300,
           height: 400,
           cropping: true,
         }).then(image => {
           this.onSelectedImage(image);
           console.log(image);
         });
   }

   choosePhotoFromGallery() {
       ImagePicker.openPicker({
           multiple: true,
           includeExif: false,
       }).then(image => {
           image.map(item => this.onSelectedImage(item));
           console.log(image);
       });
   }

   onSelectedImage(image) {
       console.log(image);
       let newImages = this.state.images;
       const source = {uri: image.path};
       let item = {
           id: Date.now(),
           url: source,
           content: image.data
       };
       newImages.push(item);
       this.setState({images: newImages})
   };
   
   renderImage(image) {
       console.log(image);
       return (
           <View key={image.uri}>
               <Image style={styles.market_RenderImage} source={image.url}/>
           </View>
       )
   }

   renderAsset(image) {
       if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
           return this.renderVideo(image);
       }

       return this.renderImage(image);
   }

   BackAction = () =>(
       <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
   )
   
   SubmitButtom = () =>(
       <Button 
       style={{width:100}}
       onPress={()=>this.submitPost()}
       >글작성</Button>
   )

   SelectItems = (props) => {
        return(
            <Select
            style={{flex:1, width:10}}
           // value={this.props.post_category.bca_id}
          //  selectedIndex={this.props.post_category.bca_id}
            //onSelect={(index)=>{this.setState({post_category:index})}}
            placeholder='게시판 선택'
            //selectedIndex={selectedIndex}
            //onSelect={index => setSelectedIndex(index)}
            >
                {/* <SelectItem title={evaProps => <Text {...evaProps}>{this.props.post_category.bca_value}</Text>} />  */}
                {/* <SelectItem title={evaProps => <Text {...evaProps}>option</Text>} />  */}
            </Select>
        )
   }

   componentDidMount(){
    this.getCategory()
   }


   //end: header
   render(){
       const {post_category} = this.state
    console.log(`ㅇ라ㅣㅁㄴㅇㄹ` + this.state.post_category)
       return(
           <Root>
           <SafeAreaView style={{flex:4}}>
               <TopNavigation title="이타게시판" alignment="center" accessoryLeft={this.BackAction} 
               accessoryRight={this.SubmitButtom} 
               /> 
                <Divider />
                <View style={{flex:4}}>
                   <View style={{flexDirection: 'row'}} >
                       {/* 카테고리 */}
                       {/* <this.SelectItems /> */}
                        {/* <Select>
                            <SelectItem><Text>HIcd</Text></SelectItem>
                            <SelectItem><Text>HI</Text></SelectItem>
                        </Select> */}
                       {/* 제목 */}
                      
                       <Input style={{ flex:1, width:90}}
                       placeholder='제목'
                       onChangeText = {post_title=>this.setState({post_title:post_title})}/>
                   </View>
                   <View style={{ flex: 2}}>
                       {/* 본문 */}
                       <Input
                           style={{padding:0}}
                           multiline={true}
                           textStyle={{ minHeight: 350 }}
                           placeholder='본문'
                           onChangeText = {post_content=>this.setState({post_content:post_content})}
                           />
                   </View>
                   <Divider />
                   {/* <View style={{flex:1, justifyContent: "center"}}> */}
                       {/* 사진 */}
                    <Layout>
                        <Text>사진</Text>
                        <ScrollView horizontal={true} style={styles.input}>
                            <TouchableOpacity style={{width:100, height:100}} onPress={()=>this.onClickAddImage()}>
                                <Image source={{uri : 'http://dev.unyict.org/react_native/AltruistApp/assets/images/noimage_120x90.gif'}} style={{width:100,height:100}}/>
                            </TouchableOpacity>
                            {this.state.images ? this.state.images.map(item => this.renderAsset(item)) : null}
                        </ScrollView>                                   
                    </Layout>
                </View>
           </SafeAreaView>
        </Root>
       )
   }
}

const styles = StyleSheet.create({
    container: {
      marginHorizontal : 5,
      padding : 5
    },
    topbar :{
        backgroundColor : '#B09BDE',
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
        backgroundColor : 'white'
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
    deal_type : {
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
        marginTop : 10
    },
    deal_box : {
        width : '30%',
        height : 50,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : 'gray',
        opacity : 0.5,
        borderColor : 'gray',
        borderRadius : 10,
        borderWidth: 1,
    },
    select: {
        flex: 1,
        margin: 2,
    },
    deal_type_text : {
        color : 'white'
    },
    market_RenderImage : {
        marginLeft : 10, 
        width: 100, 
        height: 100, 
        resizeMode: 'cover',
    },
    picture : {
        borderRadius : 20,
        margin : 10,
        paddingHorizontal : 10,
        marginVertical : 10,
    }
});
 

export {defaultWrite, MarketWrite, AlbaWrite, GominWrite, IlbanWrite}