import React from 'react';
import {View,Image,TextInput, SafeAreaView,StyleSheet,KeyboardAvoidingView,ScrollView,TouchableHighlight,Keyboard,TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import {Text, Modal} from '@ui-kitten/components'
import axios from 'axios'
import Camsvg from '../../../assets/icons/Icon_Cam.svg';
import {WriteContentToptab} from '../../../components/WriteContentTopBar'
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Confirm from '../../../components/confirm.component';
import {ActionSheet, Root} from 'native-base';


export class MyProfEdit extends React.Component{
    constructor(props){
        super(props)
        this.state={
            mem_info:'',
            mem_username:'',
            mem_nickname:'',
            mem_email:'',
            mem_phone:'',
            mem_birthday:'',
            mem_sex:'',
            mem_profile_content:'',
            old_mem_photo:{},
            new_mem_photo:{},
            resultText:'',
            resultModalVisible:false,
            mem_photo_del:false,
        }
    }
    
    NoString = (str) => {
        var nostring = str.replace(/\D/g, '');
        this.setState({mem_phone: nostring});
    };
    phoneSubstr = (overwrited) => {
        let phonefinal = '';
        if (13 < overwrited.length) {
          console.log('14이상', overwrited.length);
          phonefinal += overwrited.substr(0, 13);
          this.setState({mem_phone: phonefinal});
        }
        console.log('phonefinal', phonefinal);
    };
    PhoneHyphen = (phonenum) => {
        var number = phonenum.replace(/[^0-9]/g, '');
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
        this.setState({mem_phone: value});
    };
    onClickProfImage() {
        const buttons = ['기본이미지','갤러리에서 선택', '취소'];
        ActionSheet.show(
          {options: buttons, cancelButtonIndex: 2, title: 'Select a photo'},
          (buttonIndex) => {
            switch (buttonIndex) {
              case 0:
                this.chooseDefaultPhoto();
                break;
              case 1:
                this.choosePhotoFromGallery();
                break;
              default:
                break;
            }
          },
        );
      }
  // 원래 이미지로 재설정
  resetPhoto(){
      this.setState({new_mem_photo:{},mem_photo_del:false})
  }
  // 기본이미지로 변경
  chooseDefaultPhoto(){
      this.setState({new_mem_photo:{uri:'http://dev.unyict.org/uploads/altwink-rect.png'}});
      this.setState({mem_photo_del:true})
  }
  //갤러리에서 사진 가져오기
  choosePhotoFromGallery() {
    ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
    }).then((image) => {
      this.onSelectedImage(image);
      this.setState({mem_photo_del:false})
      //console.log(image);
    });
  }

  //불러온 사진의 정보를 this.state에 저장
  onSelectedImage(image) {
    console.log(image);
    let item = {
      id: Date.now(),
      uri: image.path,
      type: image.mime,
      path: image.path,
      content: image.data,
      index: this.state.Image_index,
    };
    this.setState({new_mem_photo: item});
  }
    attatchProfImg = async ()=>{
        try {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
        });
        console.log(
            'uri'+res.uri,
            'type'+res.type, // mime type
            'name'+res.name,
            'size'+res.size
        );
        const file = {
            uri:res.uri,
            type:res.type, // mime type
            name:res.name,
            size:res.size
        }
        this.setState({new_mem_photo:file})
        } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
        } else {
            throw err;
        }
        }
    }
    modify= async ()=>{
        const {mem_nickname,mem_profile_content,mem_username,mem_email,mem_phone,new_mem_photo,mem_sex,mem_photo_del} = this.state
        var formdata = new FormData();
        formdata.append('mem_username',mem_username)
        formdata.append('mem_nickname',mem_nickname)
        formdata.append('mem_email', mem_email);
        formdata.append('mem_phone', mem_phone);
        formdata.append('mem_sex', mem_sex);
        formdata.append('mem_profile_content',mem_profile_content)

        mem_photo_del?
        formdata.append("mem_photo_del",1)
        :
        new_mem_photo.uri ?
        formdata.append("mem_photo", {
            uri: new_mem_photo.uri,
            type: new_mem_photo.type,
            name: new_mem_photo.path,
          })
        :
        null
    
        await axios.post('http://dev.unyict.org/api/membermodify/modify',formdata)
        .then(res=>{    
            const regex = /(<([^>]+)>)|&nbsp;/ig;
            console.log('result_data : '+ JSON.stringify(res.data))
            var result_message='';
                result_message = res.data.status==200? 
                res.data.view.result_message.replace(regex, '\n') : res.data.message.replace(regex, '\n') ;
            this.setState({resultModalVisible:true,resultText:result_message});
        })
        .catch(err=>{
            console.log('err : '+err )
            // alert(JSON.stringify(err))
        })
    }
    checkCharNum=()=>{
        const {mem_nickname} = this.state;
       if( mem_nickname.length > 10){
           this.setState({nickLengthOver:true})
        }else{
            this.setState({nickLengthOver:false})

       }
    }
    trim=()=>{
        const {mem_nickname} = this.state;
       if( mem_nickname.length > 10){
           this.setState({mem_nickname:mem_nickname.slice(0,10)},this.checkCharNum)
        };
    }
    componentDidMount(){
        const{mem_username,mem_nickname,mem_email,mem_phone,mem_birthday,mem_sex,mem_profile_content,mem_photo}=this.props.route.params.mem_info
        this.setState({mem_username,mem_nickname,mem_email,mem_phone,mem_birthday,mem_sex,mem_profile_content,old_mem_photo:{uri:mem_photo}})
    }

    render(){
      const {mem_username,mem_nickname,mem_email,mem_phone,mem_profile_content,old_mem_photo,new_mem_photo, resultModalVisible} = this.state
      const {navigate} =this.props.navigation
        return(
            <Root>
                <SafeAreaView style={{flex:1,backgroundColor:'#f4f4f4'}}>
                    <WriteContentToptab
                        text='프로필 수정'
                        right={this.props.route.params.mode == 'edit' ? 'edit' : 'upload'}
                        func={() => {
                            Keyboard.dismiss();
                            this.modify();
                        }}
                        gbckfunc={() => {
                            this.props.navigation.goBack();
                        }}
                        gbckuse={true}
                    />
                    <ScrollView style={{paddingHorizontal:'5%'}}>
                        <View style={{alignItems:'center'}}>
                            <View>
                                <TouchableHighlight 
                                    onPress={()=>this.onClickProfImage()} 
                                    style={{}}
                                    >
                                    <>
                                    <View style={{borderRadius:62.5,width:125, height : 125,overflow:'hidden'}} >
                                    <Image 
                                        source = {{uri : new_mem_photo.uri ? new_mem_photo.uri: 'http://dev.unyict.org/'+ (old_mem_photo.uri ?'uploads/member_photo/'+ old_mem_photo.uri: 'uploads/altwink-rect.png')}} 
                                        style = {{ width : '100%', height : '100%', resizeMode:'cover'}}
                                    />
                                    </View>
                                    <Camsvg style={{position:'absolute',bottom:0,right:0}}/>
                                    </>
                                </TouchableHighlight>
                                {
                                new_mem_photo.uri ?
                                <View style={{position:'absolute',right:0}}>
                                    <TouchableWithoutFeedback 
                                        style={{backgroundColor:'#c4c4c4',borderRadius:15}}
                                        onPress={()=>{this.resetPhoto()}}
                                    >
                                        <Text style={{color:'#ffffff',fontWeight:'bold',fontSize:14}}> X </Text>
                                    </TouchableWithoutFeedback>
                                </View>
                                :null
                                }
                            </View>
                            <KeyboardAvoidingView 
                                behavior='height'
                                style={{width:'100%',marginBottom:24,paddingTop:20}}
                            > 
                                <View style={styles.inputContainer}>
                                    <View>
                                        <Text category='h1' style={{fontSize:16,color:'#63579D'}}>이름</Text>
                                    </View>
                                    <TextInput
                                        value={mem_username} 
                                        style={styles.textInput} 
                                        onChangeText={(text)=>this.setState({mem_username:text})}
                                        />
                                </View>
                                <View style={styles.inputContainer}>
                                    <View>
                                        <Text category='h1' style={{fontSize:16,color:'#63579D'}}>닉네임</Text>
                                    </View>
                                    <TextInput
                                        value={mem_nickname} 
                                        style={styles.textInput} 
                                        onChangeText={(text)=>{this.setState({mem_nickname:text},this.checkCharNum)}}
                                        onEndEditing={this.trim}
                                        />
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
                                    <Text category='s2' >*닉네임은 변경한 후 30일 동안 변경이 불가합니다.</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
                                    <Text category='s2' style={{opacity: this.state.nickLengthOver ? 1:0,color:'#DB2434'}}>닉네임은 10자 이하입니다.</Text>
                                </View>
                                <View style={[styles.inputContainer,{marginTop:0}]}>
                                    <View>
                                        <Text category='h1' style={{fontSize:16,color:'#63579D'}}>이메일</Text>
                                    </View>
                                    <TextInput
                                        value={mem_email} 
                                        style={[styles.textInput,{backgroundColor:'#c4c4c4'}]} 
                                        onChangeText={(text)=>this.setState({mem_email:text})}
                                        editable={false}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <View>
                                        <Text category='h1' style={{fontSize:16,color:'#63579D'}}>연락처</Text>
                                    </View>
                                    <TextInput
                                        value={mem_phone} 
                                        style={[styles.textInput]} 
                                        onChangeText={(mem_phone)=>{
                                            this.setState({mem_phone});
                                            this.NoString(mem_phone);
                                            this.PhoneHyphen(mem_phone);
                                        }}
                                        keyboardType='number-pad'
                                        onEndEditing={() => {
                                            this.phoneSubstr(mem_phone);
                                        }}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <View>
                                        <Text category='h1' style={{fontSize:16,color:'#63579D'}}>자기소개</Text>
                                    </View>
                                    <TextInput
                                        value={mem_profile_content!='null'? mem_profile_content:null} 
                                        style={[styles.textInput]} 
                                        onChangeText={(text)=>this.setState({mem_profile_content:text})}
                                        multiline={true}
                                    />
                                </View>
                            </KeyboardAvoidingView>
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyLeave')}} >
                        <Text style={[{textAlign:'right', color:'#ACACAC'},styles.menuItem]}>회원 탈퇴</Text>
                      </TouchableOpacity>
                    <Modal
                        visible={resultModalVisible}
                        backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                        onBackdropPress={() => this.setState({resultModalVisible:false})}
                        >
                        <Confirm 
                            type = 'result'
                            confirmText={this.state.resultText}
                            frstText="닫기"
                            OnFrstPress={() => {
                                this.setState({resultModalVisible:false})
                                this.props.route.params.onGoback();
                                this.props.navigation.goBack();
                            }}
                        />
                    </Modal>
                </SafeAreaView>
            </Root>
        )
    }
}

const styles =StyleSheet.create({
    inputContainer:{
        marginTop:15,
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
        paddingRight:'15%'
    },
    textInput:{
        fontSize:14,
        color:'#63579D',
        backgroundColor:'#ffffff',
        width:'60%',
        marginLeft:'5%',
        borderRadius:8,
        padding:3
    }
})