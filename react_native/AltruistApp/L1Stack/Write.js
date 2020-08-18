import React from 'react';
import {StyleSheet,SafeAreaView, View, Image, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, VirtualizedList,Alert,useState, NativeModules, TouchableOpacity, TextInput} from 'react-native';
import {Layout,Button,Text,TopNavigation,TopNavigationAction,Icon, Divider, Input, RadioGroup, Radio, Tooltip, CheckBox, IndexPath, Select, SelectItem} from '@ui-kitten/components'
import HTML from 'react-native-render-html';
import ImagePicker from 'react-native-image-crop-picker';
import { HeartIcon } from '../assets/icons/icons';
import axios from 'axios';
import {Picker} from '@react-native-community/picker';
import {ActionSheet, Root} from 'native-base';

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
            post_title:'title from avd',
            post_content:'content from avd 익명,카테고리 1',
            post_anoymous_yn:1,
            post_category:1,
            checked:true
            
        }
    }
    
    submitPost= async()=>{
        const {post_title,post_content,post_anoymous_yn,post_category} =this.state
        let formdata = new FormData();
            formdata.append("post_title", post_title);
            formdata.append("post_content", post_content);
            formdata.append("post_category", post_category);
            formdata.append("post_anoymous_yn", post_anoymous_yn);
        await axios.post(
            'http://10.0.2.2/api/board_write/write/b-a-1',
            formdata
            )
        .then(response=>{
            Alert.alert(
                "게시글",
                "게시글 작성 완료",
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
            alert('BYE:(')
        })    
    
    }
    filterSpamKeyword= async() => {
        const {post_title,post_content} =this.state;
        
        var formdata =new FormData();
        formdata.append("title", post_title);
        formdata.append("content", post_content);
        formdata.append("csrf_test_name", '');
        
    
        await axios.post('http://10.0.2.2/api/postact/filter_spam_keyword',formdata)
        .then(response=>{
            const {message,status}=response.data
            if(status=='500'){
                alert(message)
            }else if(status=="200"){
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
                    <Button onPress={()=>filterSpamKeyword(post_title,post_content)}>
                        validation
                    </Button>

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
            isLoading: true,
            post_title: '',
            post_content: '',
            post_location: '',
            deal_price: '',
            deal_type: 2, // 0: 직거래, 1: 배송, 2: 둘다가능
            deal_status: 1, // 0: 판매완료, 1: 판매중
            images: [],
        }
    }

    submitPost = async() => {

        console.log(this.state);
        const {post_title, post_content, post_location, deal_price, deal_type} = this.state;

        let formdata = new FormData();
            formdata.append("brd_key", 'b-a-2');
            formdata.append("post_title", post_title);
            formdata.append("post_content", post_content);
            // formdata.append("post_location", post_location);
            formdata.append("post_nickname", 'Edward');
            formdata.append("post_email", 'Edward@sogang.ac.kr');
            formdata.append("post_password", '0000');
            // formdata.append("deal_price", deal_price);
            // formdata.append("deal_type", deal_type);
            // formdata.append("deal_status", Data.deal_status);
            
        await axios.post(
            'http://10.0.2.2/api/board_write/write/b-a-2',
            formdata
        )
        .then(response=>{
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
            alert('BYE:(')
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
            console.log(image);
          });
    }

    //갤러리에서 사진 가져오기
    choosePhotoFromGallery() {
        ImagePicker.openPicker({
            multiple: true,
            includeExif: false,
        }).then(image => {
            image.map(item => this.onSelectedImage(item));
            console.log(image);
        });
    }

    //불러온 사진의 정보를 this.state에 저장
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

    render() {
        return(
            <Root>
            <SafeAreaView style={{flex:1}}>
                
                <TopNavigation title="글작성" alignment="center" accessoryLeft={this.BackAction} />
    
                <Divider />
                
                <ScrollView>
                    <Layout style={{paddingVertical:10}}>
                        <Layout style={styles.container}>
                            <Text>상품명</Text>
                            <Input
                                style={styles.input}
                                onChangeText={text => this.setState({post_title : text})}
                                // value={itemName}
                            />
                        </Layout>
                        <Layout style={{...styles.container, flexDirection:'row'}}>
                            <Layout style={{flex:1}}>
                                <Text>판매가격</Text>
                                <Input
                                    style={styles.input}   
                                    onChangeText={text => this.setState({deal_price : text})}
                                    // value={price}
                                />
                            </Layout>
                            <Layout style={{flex:1}}>
                                <Text>지역</Text>
                                <Input
                                    style={styles.input}
                                    onChangeText={text => this.setState({post_location : text})}
                                    // value={loaction}
                                />
                            </Layout>
                        </Layout>
                        <Layout style={styles.container}>
                            <Text>사진</Text>
                            <ScrollView horizontal={true} style={styles.input}>
                                <TouchableOpacity style={{width:100, height:100}} onPress={()=>this.onClickAddImage()}>
                                    <Image source={{uri : 'http://10.0.2.2/react_native/AltruistApp/assets/images/noimage_120x90.gif'}} style={{width:100,height:100}}/>
                                </TouchableOpacity>
                                {this.state.images ? this.state.images.map(item => this.renderAsset(item)) : null}
                            </ScrollView>                                                 
                        </Layout>
                        <Layout style={styles.container}>
                            <Text>거래방법</Text>
                            <Layout style={styles.deal_type}>
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
                            </Layout>
                        </Layout>
                        <Layout style={styles.container}>
                            <Text>상세정보</Text>
                            <Input
                                onChangeText={text => this.setState({post_content : text})}
                                // value={detail}
                            />
                        </Layout>
                        <Button onPress={()=>this.submitPost()}>등 록</Button>
                    </Layout>
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
            alba_type : 0,
            alba_salary_type : 0,
            alba_salary : '',
            post_image : null,
            imagesource : {},
            images : null,
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
        const {post_title, post_content, post_location, alba_type, alba_salary_type, alba_salary, post_image} = this.state;
        let formdata = new FormData();
        formdata.append("brd_key", 'b-a-3');
        formdata.append("post_title", post_title);
        formdata.append("post_content", post_content);
        formdata.append("post_nickname", 'roothyo');
        formdata.append("post_email", 'roothyo@soongsil.ac.kr');
        formdata.append("post_password", '1234');
        post_image.forEach(element => {
            console.log(element);
            formdata.append("file", element);
        });

        // formdata.append("post_location", post_location);
        // formdata.append("alba_type", alba_type);
        // formdata.append("alba_salary_type", alba_salary_type);
        // formdata.append("alba_salary", alba_salary);
        console.log(post_image);
        console.log(formdata);
        // await axios.post('http://10.0.2.2/api/board_write/write/b-a-3', formdata)
        // .then(response=>{
        //     console.log(response);
        //     Alert.alert(
        //         "게시글",
        //         "게시글 작성 완료",
        //         [
        //             { 
        //                 text: "OK", 
        //                 onPress: ()=> {this.gobackfunc()}
        //             }
        //         ],
        //         { cancelable: false }
        //     );
        // })
        // .catch(error=>{
        //     alert(error);
        // })
        await axios({
            method : 'post',
            url : 'http://localhost/api/board_write/write/b-a-3',
            data : formdata,
            header : {
                'Accept' : 'application/json',
                'Content-Type' : 'multipart/form-data',
            },
        })
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
            // console.log('removed tmp images from tmp directory');
            alert('Temporary images history cleared')
        }).catch(e => {
            alert(e);
        });
    }

    pickMultiple() {
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
        }).catch(e => alert(e));
    }

    renderImage(image) {
        return <Image style={{width: 200, height: 200, resizeMode: 'contain'}} source={image}/>
    }

    renderAsset(image) {
        if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
            return this.renderVideo(image);
        }

        return this.renderImage(image);
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
                        textStyle={{ minHeight: 300}}
                        placeholder='Input Context'
                        onChangeText ={(nextText) => {this.setState({post_content:nextText})}}
                    />
                    <View style={{flex : 1, backgroundColor : 'black'}}>
                        <ScrollView horizontal>
                            {this.state.post_image ? this.state.post_image.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                        </ScrollView>
                    </View>
                    <Button onPress ={()=>{
                        this.cleanupImages();
                        this.pickMultiple();
                    }}>
                        사진추가
                    </Button>
                </ScrollView>
                </Layout>
                <View style={styles.bottomView}>
                    <Button 
                        style={styles.bottomButton}
                        onPress={()=>{this.submit_alba_Alert()}}>
                            글쓰기 
                    </Button>
                </View>   
            </SafeAreaView>
        );
    }
}


class IlbanWrite extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isLoading: true,
            post_title: '',
            post_content: '',
            post_location: '',
            images: [],
            image_url : '/react_native/AltruistApp/assets/images/noimage_120x90.gif',
            
        }
    }    

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

    choosePhotoFromGallery() {
        ImagePicker.openPicker({
            multiple: true,
            includeExif: false,
        }).then(image => {
            image.map(item => this.onSelectedImage(item));
            console.log(image);
        });
    }


    cleanupImages() {
        ImagePicker.clean().then(() => {
            // console.log('removed tmp images from tmp directory');
            alert('Temporary images history cleared')
        }).catch(e => {
            alert(e);
        });
    }

    pickMultiple() {
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
        }).catch(e => alert(e));
    }

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    )
    
    SubmitButtom = () =>(
        <Button 
        style={{width:100}}
        onPress={()=>this.onClickAddImage()}
        >Photo</Button>
    )

    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="일반게시판" alignment="center" accessoryLeft={this.BackAction} 
                accessoryRight={this.SubmitButtom} 
                /> 
                    <Divider />
                   
                    <View style={{flexDirection: 'row'}} >
                        {/* 카테고리 */}
                        <Select
                        style={{flex:1, width:10}}
                        placeholder='Default'
                        // selectedIndex={selectedIndex}
                        // onSelect={index => setSelectedIndex(index)}
                        >
                            <SelectItem title={evaProps => <Text {...evaProps}>Option 1</Text>} />
                        </Select>
                        {/* 제목 */}
                        <Input style={{ flex:1, width:90}}/>
                    </View>
                    <View style={{ flex: 2}}>
                        {/* 본문 */}
                        <Input
                            style={{ flex: 2, minHeight: 200}}
                            multiline={true}
                            textStyle={{ minHeight: 400 }}
                            />
                    </View>
                    <Divider />
                    <View style={{flex:1, justifyContent: "center"}}>
                        {/* 사진 */}
                        <Layout style={styles.container}>
                            <Text>사진</Text>
                            <ScrollView horizontal={true}>
                                <TouchableOpacity style={{width:100, height:100}}>
                                    <Image source={{uri : 'http://10.0.2.2/react_native/AltruistApp/assets/images/noimage_120x90.gif'}} style={{width:100,height:100}}/>
                                </TouchableOpacity>
                                {this.state.images ? this.state.images.map(item => this.renderAsset(item)) : null}
                            </ScrollView>         
                            <Button onPress ={()=>{
                                this.cleanupImages();
                                this.pickMultiple();
                            }}>
                                사진추가
                            </Button>                                        
                        </Layout>
                    </View>   
                    <Button 
                    onPress={()=>{this.props.navigation.navigate('IlbanWrite')}}
                    >글쓰기</Button>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      marginHorizontal : 5,
      padding : 5
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
});
  

export {defaultWrite, MarketWrite, AlbaWrite, GominWrite, IlbanWrite}