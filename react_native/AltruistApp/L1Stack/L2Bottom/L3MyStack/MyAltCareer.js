import React from 'react';
import {SafeAreaView,View,TextInput,TouchableHighlight,StyleSheet,Animated, Pressable} from 'react-native';
import {Text,Modal,CheckBox,Select,SelectItem, IndexPath,Spinner} from '@ui-kitten/components';
import Axios from 'axios';
import {Signing} from '../../Context' 
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Confirm from '../../../components/confirm.component';
import {WriteContentToptab} from '../../../components/WriteContentTopBar';
import Backsvg from '../../../assets/icons/back-arrow-color.svg'
import Clipsvg from '../../../assets/icons/clip.svg';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {ActionSheet,  Footer,  Root} from 'native-base';

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
            rotate:new Animated.Value(0),
            closed:true
        }
    }
    toggle=()=>{
        const {closed} = this.state;
        Animated.timing(this.state.rotate,{
            toValue:closed ? 1 : 0,    
            duration: 500,
            useNativeDriver: false
        }).start();
        this.setState({closed:!closed});
    }
    requestInsert(){
        const {acv_open,acv_type,acv_year,acv_content,acv_final,acv_file1}=this.state;
        var insertdata={}
        
        var formdata = new FormData();
        insertdata.acv_open=acv_open;
        insertdata.acv_type=acv_type;
        insertdata.acv_year=acv_year;
        insertdata.acv_content=acv_content;
        insertdata.acv_final=acv_final;
        insertdata.acv_status=0;
        if(acv_file1.uri){
            formdata.append('acv_file1',acv_file1);
        }
        formdata.append('insertdata',JSON.stringify(insertdata));
        console.log('form data : '+JSON.stringify(formdata));
        
        Axios.post('http://dev.unyict.org/api/altruists/insert_career',formdata)
        .then(res=>{
            console.log('requestInsert success! : '+JSON.stringify(res.data));
            this.props.setRes('성공적으로 추가했습니다.');
        })
        .catch(err=>{
            console.log('requestInsert faied! : '+err)
        })
    }
    requestUpdate(){
        const career =this.props.item.item;
        const {acv_open,acv_type,acv_year,acv_content,acv_final,acv_file1}=this.state;
        var updatedata={}
        
        var formdata = new FormData();
        formdata.append('acv_id',career.acv_id);

        if(career.acv_open!=acv_open){
            updatedata.acv_open=acv_open;
            // formdata.append('acv_open',acv_open);
        }
        if(career.acv_type!=acv_type){
            updatedata.acv_type=acv_type;
            // formdata.append('acv_type',acv_type);
        }
        if(career.acv_year!=acv_year){
            updatedata.acv_year=acv_year;
            // formdata.append('acv_year',acv_year);
        }
        if(career.acv_content!=acv_content){
            updatedata.acv_content=acv_content;
            // formdata.append('acv_content',acv_content);
        }
        if(career.acv_final!=acv_final){
            updatedata.acv_final=acv_final;
            // formdata.append('acv_final',acv_final);
        }
        if(acv_file1.uri){
            formdata.append('acv_file1',acv_file1);
        }
        if(Object.keys(updatedata).length>0||acv_file1.uri){
            updatedata.acv_status=0;
            formdata.append('updatedata',JSON.stringify(updatedata));
            console.log('form data : '+JSON.stringify(formdata));
            
            Axios.post('http://dev.unyict.org/api/altruists/modify_career',formdata)
            .then(res=>{
                console.log('request success! : '+JSON.stringify(res.data));
                this.props.setRes('성공적으로 수정했습니다.');
            })
            .catch(err=>{
                console.log('request faied! : '+err)
            })
        }
    }
    textNullChk = () =>{
        const career =this.props.item.item
        const {acv_year,acv_content} = this.state
        var isNull = false
        console.log('isNull 1 : ' + isNull);
        if(acv_year==null||acv_year==''){
            console.log('isNull 2 : ' + isNull);
            this.setState({yearIsNull:true});
            isNull=true;
        }
        if(acv_content==null||acv_content==''){
            console.log('isNull 3 : ' + isNull);
            this.setState({contentIsNull:true})
            isNull=true;
        }
        if(!isNull){
            console.log('isNull 4 : ' + isNull);
            if(career.acv_id){
                this.requestUpdate();
            }else{
                this.requestInsert();
            }
        }else{
            console.log('isNull 5 : ' + isNull);
        }
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
        const career =this.props.item.item
        if(career.acv_id){
            const {acv_open,acv_type,acv_year,acv_content,acv_final} = career;
            this.setState({acv_type,acv_year,acv_content,acv_contentacv_open:acv_open==1? true : false,acv_final:acv_final==1? true : false,})
            this.setState({selectedIndex: new IndexPath( acv_type == 'H'? 0:acv_type == 'J'? 1 : 2)})
        }
    }
    render(){
        const career =this.props.item.item
        const {acv_open,acv_type,acv_year,acv_content,acv_final,acv_file1,selectedIndex} = this.state;
        const rotate = this.state.rotate.interpolate({
            inputRange:[0,1],
            outputRange:["90deg","-90deg"]
        })
        return(
            <View style={{padding:'5%',borderBottomWidth:1,borderBottomColor:'#c4c4c4'}} key={this.props.item.index}>
                <Pressable style={{flexDirection:'row',justifyContent:'space-between'}} onPress={()=>this.toggle()}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:15,fontWeight:'bold'}}>{`${this.props.item.index+1}) `}</Text>
                        <Text style={{fontSize:15,fontWeight:'bold'}}>{ acv_content?acv_content:'경력사항을 입력해주세요'}</Text>
                    </View>
                    <Animated.View style={{transform:[{rotateZ:rotate},],alignItems:'center',justifyContent:'center'}}>
                        <Backsvg width={15} height={15}/>
                    </Animated.View>
                </Pressable>
                <View style={[this.state.closed? {height:0} :{},{overflow:'hidden'}]}>
                    <View style={[styles.row,{}]}>
                        <Text style={[styles.keyText,{marginBottom:10}]}>경력내용</Text>
                        <TextInput
                        value= {acv_content}
                        onChangeText={(text)=>{this.setState({acv_content:text})}}
                        placeholder='경력내용'
                        style={[{backgroundColor:'#ffffff',fontSize:12,padding:0},{borderWidth: this.state.contentIsNull ? 1:0,borderColor :this.state.contentIsNull ? '#DB2434':'#ffffff'}]}
                        />
                        {
                            this.state.contentIsNull ? 
                            
                            <Text style={{marginTop:5,marginHorizontal: 10,fontSize:10,color:'#DB2434'}}>필수값입니다.</Text>
                            :
                            null
                        }
                    </View>
                    
                    <View style={[styles.row,{flexDirection:'row'}]}>
                        <View style={{paddingHorizontal:3,flexDirection:'row',alignItems:'center',marginRight:10}}>
                            <Text style={[styles.keyText,{}]}>연도</Text>
                            <TextInput
                                value= {acv_year}
                                onChangeText={(text)=>{this.setState({acv_year:text});}}
                                placeholder='ex)2010~'
                                style={[{backgroundColor:'#ffffff',fontSize:12,padding:0},{borderWidth: this.state.contentIsNull ? 1:0,borderColor :this.state.contentIsNull ? '#DB2434':'#ffffff'}]}
                                keyboardType='default'
                            />
                            {
                            this.state.contentIsNull ? 
                            
                            <Text style={{marginTop:5,marginHorizontal: 10,fontSize:10,color:'#DB2434'}}>필수값입니다.</Text>
                            :
                            null
                        }
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
                                this.setState({selectedIndex:index,acv_type:index.row==0? 'H':index.row==1? 'J':'E'});
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
                        <TouchableHighlight style={{justifyContent:'center',backgroundColor:'#63579D',padding:10,borderRadius:5}} onPress={()=>this.textNullChk()}>
                            <Text style={{color:"#ffffff"}}>
                            {
                                career.acv_id?
                                '수정요청'
                                :
                                '경력추가'
                            }
                            </Text>
                        </TouchableHighlight>
                    </View>
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

    setRes = (resultText) =>{
        this.setState({resultText,resultVisible:true})
    }

    Footer = () =>(
        <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:30}}>
            <TouchableWithoutFeedback 
                onPress={()=>{this.state.careers.push({});this.setState({careers:this.state.careers})}} 
                style={{paddingHorizontal:8,paddingVertical:8,marginRight:10,backgroundColor:'#63579D',borderRadius:8.5}}
            >
                <Text style={{fontSize:18,fontWeight:'700',color:'#ffffff',}}>
                  새 경력 추가
                </Text>
            </TouchableWithoutFeedback>
        </View>
    )
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
                <WriteContentToptab
                    text='경력 관리'
                    gbckfunc={() => {
                        this.props.navigation.goBack();
                    }}
                    gbckuse={true}
                   
                    style={{backgroundColor:'#f4f4f4'}}
                />
                {
                    isLoading?
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}> 
                       <Spinner size = 'giant'/>
                    </View>
                    :
                    <View
                        style={{flex:1}}
                    >
                        <FlatList
                            data={careers}
                            renderItem={(item)=><RenderCareerInput item={item} setRes={this.setRes}/>}
                            keyExtractor={item => item.index}
                            ListFooterComponent={()=><this.Footer/>}
                            
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