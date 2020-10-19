import React from 'react';
import {SafeAreaView,View,TextInput,TouchableHighlight,StyleSheet} from 'react-native';
import {Text,Modal,CheckBox,Select,SelectItem} from '@ui-kitten/components';
import Axios from 'axios';
import {Signing} from '../../Context' 
import { FlatList } from 'react-native-gesture-handler';
import Confirm from '../../../components/confirm.component';
import Backsvg from '../../../assets/icons/back-arrow-color.svg'
import Clipsvg from '../../../assets/icons/clip.svg';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {ActionSheet, Root} from 'native-base';

class RenderCareerInput extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            selectedIndex:0,
            career:{},
            acv_open:true,
            acv_type:'',
            acv_year:'',
            acv_content:'',
            acv_final:true,
            acv_file1:{},
        }
    }
    request(){
        console.log(JSON.stringify(this.state))
    }
    attatchFileOniOS = () =>{
        const buttons = ['사진 선택','파일 선택', '취소'];
        ActionSheet.show(
          {options: buttons, cancelButtonIndex: 2, title: 'Select a photo'},
          (buttonIndex) => {
            switch (buttonIndex) {
              case 0:
                this.chooseFileFromGallery();
                break;
              case 1:
                this.attatchFile();
                break;
              default:
                break;
            }
          },
        );
      }
    
    chooseFileFromGallery(){
    ImagePicker.openPicker({
        cropping: false,
    }).then((image) => {
        let item = {
        id: Date.now(),
        uri: image.path,
        type: image.mime,
        path: image.path,
        name:image.filename,
        content: image.data,
        index: this.state.Image_index,
        };
        this.setState({acv_file1:item})
    });
    }
    attatchFile= async ()=>{
    try {
        const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        });
        console.log(
        '\nuri : '+res.uri,
        '\ntype : '+res.type, // mime type
        '\nname : '+res.name,
        '\nsize : '+res.size
        );
        const file = {
        uri:res.uri,
        type:res.type, // mime type
        name:res.name,
        size:res.size
        }
        this.setState({acv_file1:file})
    } catch (err) {
        if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        } else {
        throw err;
        }
    }
    
    }
    componentDidMount(){
        var career =this.props.item.item
        const {acv_open,acv_type,acv_year,acv_content,acv_final} = career;
        this.setState({acv_type,acv_year,acv_content,acv_contentacv_open:acv_open==1? true : false,acv_final:acv_final==1? true : false,})
        this.setState({selectedIndex:acv_type == 'H'? 0:acv_type == 'J'? 1 : 2})
    }
    render(){
        const {acv_open,acv_type,acv_year,acv_content,acv_final,acv_file1,selectedIndex} = this.state;

        return(
            <View style={{padding:'5%'}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{fontSize:15,fontWeight:'bold'}}>{`${this.props.item.index+1}) ${acv_content}`}</Text>
                    <View>
                        <Backsvg width={15} height={15}/>
                    </View>
                </View>
                <View style={[styles.row,{}]}>
                    <Text style={[styles.keyText,{marginBottom:10}]}>경력내용</Text>
                    <TextInput
                    value= {acv_content}
                    onChangeText={(text)=>{this.setState({acv_content:text})}}
                    placeholder='경력내용'
                    style={{backgroundColor:'#ffffff',fontSize:12,padding:0}}
                    />
                </View>
                
                <View style={[styles.row,{flexDirection:'row'}]}>
                    <View style={{paddingHorizontal:3,flexDirection:'row',alignItems:'center',marginRight:10}}>
                        <Text style={[styles.keyText,{}]}>연도</Text>
                        <TextInput
                            value= {acv_year}
                            onChangeText={(text)=>{this.setState({acv_year:text});}}
                            placeholder='ex)2010~'
                            style={{backgroundColor:'#ffffff',fontSize:12,padding:0}}
                            keyboardType='default'
                        />
                    </View>
                    <View style={[styles.row,{flexDirection:'row',alignItems:'center',}]}>
                        <Text style={[styles.keyText,{}]}>경력 유형</Text>
                        <Select
                            value={ ()=>
                            <Text style={{fontSize:12}}>
                                {!acv_type? '선택': acv_type == 'H'? '학력':acv_type == 'J'? '직장' : '기타'}
                            </Text>
                            }
                            selectedIndex={selectedIndex}
                            onSelect={index =>{
                            this.setState({selectedIndex,acv_type:index.row==0? 'H':index.row==1? 'J':'E'});
                            }}
                            style={{}}
                            >
                            <SelectItem 
                            title={()=>
                                <Text style={{fontSize:12}}>
                                학력
                                </Text>
                            }
                            />
                            <SelectItem 
                            title={()=>
                                <Text style={{fontSize:12}}>
                                직장
                                </Text>
                            }
                            />
                            <SelectItem 
                            title={()=>
                                <Text style={{fontSize:12}}>
                                기타
                                </Text>
                            }
                            />
                        </Select>
                    </View>
                    
                </View>
                <View style={[styles.row,{flexDirection:'row',}]}>
                    <View style={{flexDirection:'row'}}>
                        <CheckBox
                            checked={acv_open==1? true : false}
                            onChange={nextChk => {this.setState({acv_open:nextChk?1:0});}}
                            style={{marginRight:3}}
                        />
                        <Text style={[styles.keyText,{}]}>공개</Text>
                    </View>
                    
                    <View style={{flexDirection:'row'}}>
                        <CheckBox
                            checked={acv_final==1? true : false}
                            onChange={nextChk => {this.setState({acv_final:nextChk?1:0})}}
                            style={{marginRight:3}}
                        />
                        <Text style={[styles.keyText,{}]}>최종</Text>
                    </View>
                </View>
                <View style={[styles.row,{flexDirection:'row',}]}>
                    <TouchableHighlight onPress={()=>Platform.OS!=='ios'? this.attatchFile() : this.attatchFileOniOS()}>
                        <View style={{flexDirection:'row',alignItems:'center'}} >
                            <Clipsvg width={35} height={35}/>
                            <Text style={{marginLeft:15}}>
                                {!acv_file1.uri? `첨부파일 추가`:acv_file1.name}
                            </Text>
                            {
                                !acv_file1.uri?
                                null
                                :
                            <TouchableHighlight 
                                style={{marginLeft:5, width:15,height:15,justifyContent:'center',backgroundColor:'#c4c4c4'}} 
                                onPress={()=>{this.setState({acv_file1:{}})}}>
                                <View style={{borderWidth:1}} />
                            </TouchableHighlight>
                            }
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={{justifyContent:'flex-end',flexDirection:'row'}}>
                    <TouchableHighlight style={{justifyContent:'center',backgroundColor:'#63579D',padding:10,borderRadius:5}} onPress={()=>this.request()}>
                        <Text style={{color:"#ffffff"}}>수정요청</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
  }

class MyAltCareer extends React.Component{
    constructor(props){
        super(props)
        this.state={
            careers:[],
            isLoading:true,
            resultVisible:false,
            resultText:''
        }
    }
    static contextType =Signing;

    getAltCareer=()=>{
        this.setState({isLoading:true})
    var formdata = new FormData();
    formdata.append('alt_id',this.context.alt_id)
    Axios.post('http://dev.unyict.org/api/altruists/profile',formdata)
    .then(res=>{
        var careers= res.data.view.data.list[0].get_alt_cv;
        this.setState({careers,isLoading:false})
    })
    .catch(err=>{
        console.log(err)
        this.setState({resultText:err.message,resultVisible:true})
    })
    }

    componentDidMount(){
        this.getAltCareer();
    }

    render(){
        const {resultVisible,resultText,isLoading,careers} = this.state; 
        return(
            <SafeAreaView style={{flex:1}}>
                {
                    isLoading?
                    <View style={{flex:1}}> 
                        <Text>
                            MyAltCareer Screen
                        </Text>
                    </View>
                    :
                    <View>
                        <FlatList
                            data={careers}
                            renderItem={(item,index)=><RenderCareerInput item={item}/>}
                            keyExtractor={item => item.acv_id}
                        />
                    </View>

                }


                <Modal
                    visible={resultVisible}
                    backdropStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => this.setState({resultVisible: false})}
                >
                    <Confirm
                        type="result"
                        confirmText={resultText}
                        frstText="닫기"
                        OnFrstPress={() => {
                        this.setState({resultVisible: false});
                        this.props.navigation.goBack();
                        }}
                    />
                </Modal>
            </SafeAreaView>
        )
    }
}

export default MyAltCareer

const styles =StyleSheet.create({
    row:{
        marginVertical:10
    },
    keyText:{
        color:'#63579D',
        fontSize:15,
        fontWeight:'bold',
        marginRight:10
    },
})