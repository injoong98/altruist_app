import React from 'react';
import {
    SafeAreaView,
    View,
    TouchableHighlight,
    TextInput,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native'
import {
    Text,
    RadioGroup,
    Radio,
    Spinner
} from '@ui-kitten/components'
import Tag from '../../../components/tag.component'
import {WriteContentToptab} from '../../../components/WriteContentTopBar'
import Camsvg from '../../../assets/icons/Icon_Cam.svg'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {ActionSheet, Root} from 'native-base';
import { Signing } from '../../Context';
import Axios from 'axios';
import { ToggleSimpleUsageShowcase } from '../L3Toptab/CommunityScreen';

 //   TODO : 명예 여부 라디오 선택
export const RadioHonorSelection = ({setAltHonor,initial}) => {
    const [selectedIndex, setSelectedIndex] = React.useState(initial);
    
    return (
        <RadioGroup
            style={styles.radio}
            selectedIndex={selectedIndex}
            onChange={(index) => {
                setSelectedIndex(index);
                setAltHonor(index==0? true:false)
            }}>
            <Radio>
                <Text style={{color: '#63579D'}} category="p1">
                    예
                </Text>
            </Radio>
            <Radio>
                <Text style={{color: '#63579D'}} category="p1">
                    아니오
                </Text>
            </Radio>
        </RadioGroup>
    );
};

class MyAltProf extends React.Component{
    constructor(props){
        super(props)
        this.state={
            isLoading:true,
            altInfo:{},
            mem_info:{},
            alt_photo:{},
            new_alt_photo:{},
            alt_aboutme:'',
            alt_content:'',
            alt_honor:0,
            actSelected:[],
            radio:['1:1질문만','1:다 질문만','모든 질문 허용'],
            radioSelectedIndex:2,
        }
    }
    static contextType = Signing

    setAltHonor = (index)=>{
        this.setState({alt_honor:index})
    }

    onClickProfImage() {
        const buttons = ['갤러리에서 선택', '취소'];
        ActionSheet.show(
        {options: buttons, cancelButtonIndex: 1, title: 'Select a photo'},
        (buttonIndex) => {
            switch (buttonIndex) {
            case 0:
                this.choosePhotoFromGallery();
                break;
            default:
                break;
            }
        },
        );
    }

    //갤러리에서 사진 가져오기
    choosePhotoFromGallery(){
    ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
    }).then((image) => {
        this.onSelectedImage(image);
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
    this.setState({new_alt_photo: item});
    }
    getAltProf = async() =>{
        this.setState({isLoading:true})
        var formdata = new FormData();
        formdata.append('alt_id',this.context.alt_id)
        await Axios.post('http://dev.unyict.org/api/altruists/profile',formdata)
        .then(res=>{
            console.log(res.data.view.list)
            const result =res.data.view.data.list[0]
            const {alt_content,alt_aboutme,alt_honor,alt_photo} =result.alt_profile;
            this.setState({altInfo:result.alt_profile,actSelected:result.alt_area,alt_content,alt_aboutme,alt_honor,alt_photo})
            console.log(alt_photo)
            this.setState({isLoading:false})
        })
        .catch(err=>{
            alert('오류 발생');
            console.log(err)
            this.props.navigation.goBack();
        })
    }
    componentDidMount(){
        console.log(JSON.stringify(this.context.alt_id))
        this.getAltProf()
        this.setState({mem_info:this.props.route.params.mem_info})
    }

    render(){  
    const {width,height} =Dimensions.get('window')
    const {alt_content,alt_aboutme,alt_honor,alt_photo,isLoading,mem_info,new_alt_photo,radio,radioSelectedIndex,altInfo,actSelected,spinnerModalVisible,filterModalVisible,arrayForLoop,acv_open,acv_type,acv_file1,acv_year,acv_content,acv_final,selectedIndex,category,} = this.state;
     
    return(
        <Root>
                <SafeAreaView style={{flex:1}}>
                <WriteContentToptab
                    text='멘토 프로필 수정'
                    gbckfunc={() => {
                        this.props.navigation.goBack();
                    }}
                    gbckuse={true}
                    style={{backgroundColor:'#f4f4f4'}}
                />
                {
                isLoading ? 
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Spinner size='giant'/>
                    </View>
                :
                    <ScrollView style={{flex:1,padding:'5%'}}>
                        <View style={{flexDirection:'row'}}>
                            <TouchableHighlight onPress={()=>this.onClickProfImage()} >
                                <View >
                                    <Image 
                                    style={{width:100,height:100}}
                                    source={{uri:!alt_photo? !new_alt_photo.uri? new_alt_photo.uri :'http://dev.unyict.org/uploads/altwink.png':`http://dev.unyict.org/${alt_photo}`}}/>
                                    <View style={{position:'absolute',bottom:0,right:0,backgroundColor:'#ffffff',borderRadius:15}}>
                                        <Camsvg width={30} height={30}/>
                                    </View>
                                </View>
                            </TouchableHighlight>
                            <View style={{width:(width-100)*0.9}}>
                                <Text style={[styles.nameText]}>
                                {isLoading ? null : mem_info.mem_username !='' ? mem_info.mem_username : mem_info.mem_nickname}
                                </Text>
                                <TextInput
                                    value={alt_aboutme}
                                    onChangeText={(text) => this.setState({alt_aboutme:text})}
                                    placeholder='자기PR (50자 이내)'
                                    style={[styles.contentInput,{borderWidth: this.state.aboutmeIsNull ? 1:0,borderColor :this.state.aboutmeIsNull ? '#DB2434':'#ffffff'}]}
                                    multiline={true}
                                    placeholderTextColor='#A897C2'
                                    textAlignVertical="top"
                                    onBackdropPress={()=>Keyboard.dismiss()}
                                />
                                {
                                    this.state.aboutmeIsNull ? 
                                    
                                    <Text style={{marginTop:5,marginHorizontal: 10,fontSize:9,color:'#DB2434'}}>한 줄 소개는 필수값입니다.</Text>
                                    :
                                    null
                                }
                            </View>
                        </View>
                        <View style={{marginTop:25}}>
                            <TextInput
                                value={alt_content}
                                onChangeText={(text) => this.setState({alt_content: text})}
                                placeholder='자기소개'
                                style={[styles.contentInput,{minHeight:75,borderWidth: this.state.contentIsNull ? 1:0,borderColor :this.state.contentIsNull ? '#DB2434':'#ffffff'}]}
                                multiline={true}
                                textAlignVertical='top'
                                placeholderTextColor='#A897C2'
                                onBackdropPress={()=>Keyboard.dismiss()}
                            />
                        </View>
                        {
                        this.state.contentIsNull ? 
                        
                        <Text style={{marginTop:5,marginHorizontal: 10,fontSize:9,color:'#DB2434'}}>자기 소개는 필수값입니다.</Text>
                        :
                        null
                        }

                        <View style={{marginLeft:10,marginTop:40}}>
                            <Text style={styles.fieldTitle}>전문 분야</Text>
                        </View>
                        <View style={{display:'flex',flexDirection:'row',marginTop:19,marginLeft:10}}>
                                {
                                    <TouchableOpacity 
                                        style = {{height:21,width:23,backgroundColor:'#63579D',borderRadius:7,justifyContent:'center',marginRight:10}} 
                                        onPress={()=>this.setState({filterModalVisible:true})}
                                    >
                                        <Text style={{color:'#ffffff',fontSize:30,textAlign:'center',textAlignVertical:'center'}}>+</Text>    
                                    </TouchableOpacity>
                                }
                                {
                                    actSelected.length >0 ?
                                    <ScrollView horizontal={true} style={styles.areaContainer} >
                                        {actSelected.map((act,index) => (
                                        <TouchableHighlight
                                            onPress ={()=>{actSelected.splice(index,1);this.setState({actSelected})}}
                                            key = {act.act_content}
                                        >
                                            <View 
                                                style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',marginRight:3}} 
                                            >
                                                <Tag style={[styles.tagSelected,{marginRight:3}]}
                                                    key = {act.act_content}
                                                >
                                                    {act.act_content}
                                                </Tag>
                                                <View style={{backgroundColor:'#000000',opacity:0.3,borderRadius:5}}>
                                                    <Text> x </Text>
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                        ))}
                                    </ScrollView >
                                    :
                                    <View style={styles.areaContainer}>
                                        <Text style={{fontSize:12,fontWeight:'bold',color:'#63579D'}}> 전문 분야를 선택하세요</Text>
                                    </View>
                                }
                        </View>
                        <View style={{marginLeft:10,marginTop:40}}>
                            <Text style={styles.fieldTitle}>답변 유형</Text>
                        </View>
                        <View style={{flexDirection:'row',marginHorizontal:10,marginTop:20,justifyContent:'space-between'}}>
                            {
                                radio.map((item,index)=>{
                                    return(
                                    <TouchableWithoutFeedback
                                        key={index}
                                        style={index == radioSelectedIndex ?styles.radioBtnSelected :styles.radioBtn}
                                        onPress={()=>{this.setState({radioSelectedIndex:index});console.log(index)}}
                                    >
                                        <Text style={{color:'#ffffff'}}>
                                            {item}
                                        </Text>
                                    </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </View>
                        
                        <View style={{marginLeft:10,marginTop:40}}>
                            <Text style={styles.fieldTitle}>명예 여부 </Text>
                        </View>
                        <View>
                            <RadioHonorSelection initial={alt_honor? 0:1} setAltHonor={this.setAltHonor} />
                        </View>
                    </ScrollView>
                }</SafeAreaView>
            </Root>
        )
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    wrapper: {
      margin: 10,
      backgroundColor: '#eaeaea',
    },
    title: {
      marginTop: 16,
      paddingVertical: 8,
      borderWidth: 4,
      borderColor: '#20232a',
      borderRadius: 6,
      backgroundColor: '#61dafb',
      color: '#20232a',
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'bold',
    },
    titleInput: {
      backgroundColor: '#ffffff',
      borderRadius: 15,
      marginHorizontal: 10,
      marginBottom: 20,
    },
    contentInput: {
      backgroundColor: '#ffffff',
      borderRadius: 14,
      paddingLeft:14,
      marginHorizontal: 10,
      color:'#63579D',
    },
    tagSelected:{
      color:'#63579D'
    },
    nameText:{
      color:'#63579D',
      fontWeight:'bold',
      height:33,
      fontSize:18,
      backgroundColor:'#ffffff',
      paddingLeft:14,
      marginHorizontal: 10,
      marginBottom:10,
      borderRadius:14,
      textAlignVertical:'center'
    },
    areaContainer:{
      marginRight:10,
      backgroundColor:'#ffffff',
      borderRadius:5,
      paddingHorizontal:3,
      paddingVertical:2
    },
    fieldTitle:{
      color:'#63579D',
      fontSize:15,
      fontWeight:'bold'
    },
    careerHead:{
      fontSize:12,
      lineHeight:16,
      color:'#63579D'
    },
    desc:{
      color:'#000000'
    },
    radioBtn:{
        padding:5,
        borderRadius:8,
        backgroundColor:'#ACACAC'
    },
    radioBtnSelected:{
        padding:5,
        borderRadius:8,
        backgroundColor:'#63579D'
    },
    radio: {
        fontSize: 13,
        padding: 3,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
  });

  export default MyAltProf