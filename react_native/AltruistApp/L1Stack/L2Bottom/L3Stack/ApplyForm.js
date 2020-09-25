import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DocumentPicker from 'react-native-document-picker';
import {
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Image
} from 'react-native';
import {
  Layout,
  Text,
  TopNavigation,
  Button,
  Icon,
  TopNavigationAction,
  Radio,
  CheckBox,
  Card,
  Divider,
  Select,
  SelectItem,
  RadioGroup,
  Modal,
  Popover,
  Spinner
} from '@ui-kitten/components';
import {WriteContentToptab} from '../../../components/WriteContentTopBar';
import {Signing} from '../../Context';
import axios from 'axios';
import Tag from '../../../components/tag.component'
import Camsvg from '../../../assets/icons/Icon_Cam.svg';
import Clipsvg from '../../../assets/icons/clip.svg';
const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CommonTextInput = (props) =>
(
  <TextInput 
    {...props}
    style={[styles.contentInput,props.style]}
    multiline={true}
    placeholderTextColor='#A897C2'
  />
)
class AltApplyFormScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mem_id:'',
      alt_aboutme: '',
      alt_content: '',
      alt_answertype: '',
      alt_status: 'R',
      alt_honor: '0',
      acv_type: [],
      acv_year: [],
      acv_content: [],
      acv_status: [],
      acv_open: [],
      act_id: [],
      acv_final:[],
      acv_file1:[],
      count:1,
      arrayForLoop:[],
      selectedIndex:'',
      filterModalVisible:false,
      spinnerModalVisible:false,
      actSelected:[],
      category:[],
      alt_photo:{}
    };
  }
  static contextType = Signing;
  cancleCareer= (i) =>{
    const {arrayForLoop,count,acv_open,acv_type,acv_year,acv_content,acv_final,acv_file1}=this.state;
    console.log(count);

    arrayForLoop.splice(i,1);
    acv_open.splice(i,1);
    acv_type.splice(i,1);
    acv_year.splice(i,1);
    acv_content.splice(i,1);
    acv_final.splice(i,1);
    acv_file1.splice(i,1);
    this.setState({count:count-1,arrayForLoop,acv_open,acv_type,acv_year,acv_content,acv_final,acv_file1})
    console.log(count)
  }

  arrayForLoop = () => {
    const {acv_status,acv_open,acv_type,acv_year,acv_content,acv_final,acv_file1}=this.state;

    this.setState({count:this.state.count+1});
    acv_open[this.state.count-1]=false;
    acv_type[this.state.count-1]='';
    acv_year[this.state.count-1]='';
    acv_content[this.state.count-1]='';
    acv_final[this.state.count-1]=false;
    acv_file1[this.state.count-1]=false;
    acv_status[this.state.count-1]=0;
    var arrayForLoop = []
    for(var i=0 ;i<this.state.count;i++){
      arrayForLoop[i]=''
    }
    this.setState({arrayForLoop})
  }

  RenderCareerInput = (props)=>{
    const [selectedIndex,setSelectedIndex] = React.useState();
    const {i} = props
    const {acv_open,acv_type,acv_year,acv_content,acv_final} = this.state;
    return(
          <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center'}}>
              <View style={{flex:2,alignItems:'center'}}>
                    <CheckBox
                      checked={acv_open[i]}
                      onChange={nextChk => {acv_open[i]=nextChk;this.setState({acv_open});console.log(acv_open)}}
                    />
              </View>
              <View style={{flex:3.5}}>
                <Select
                    value={ ()=>
                      <Text style={{fontSize:12}}>
                        {!acv_type[i]? '선택': acv_type[i] == 'H'? '학력':acv_type[i] == 'J'? '직장' : '기타'}
                      </Text>
                    }
                    selectedIndex={selectedIndex}
                    onSelect={index =>{
                      setSelectedIndex(index);
                      acv_type[i]=index.row==0? 'H':index.row==1? 'J':'E';
                      this.setState({selectedIndex,acv_type});
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
              <View style={{flex:5,paddingHorizontal:3}}>
                  <TextInput
                    value= {acv_year[i]}
                    onChangeText={(text)=>{acv_year[i]=text;this.setState({acv_year});}}
                    placeholder='ex)2010~'
                    style={{backgroundColor:'#ffffff',fontSize:10,padding:0}}
                    keyboardType='default'
                  />
              </View>
              <View style={{flex:14,paddingHorizontal:3}}>
                  <TextInput
                    value= {acv_content[i]}
                    onChangeText={(text)=>{acv_content[i]=text;this.setState({acv_content})}}
                    placeholder='경력내용'
                    style={{backgroundColor:'#ffffff',fontSize:10,padding:0}}
                  />
              </View>
              <View style={{flex:4,alignItems:'center',justifyContent:'space-evenly',flexDirection:'row'}}>
                <CheckBox
                  checked={acv_final[i]}
                  onChange={nextChk => {acv_final[i]=nextChk;this.setState({acv_final})}}
                />
              <TouchableHighlight style={{width:15,height:15,justifyContent:'center',backgroundColor:'#c4c4c4'}} onPress={()=>this.cancleCareer(i)}>
                <View style={{borderWidth:1}} />
              </TouchableHighlight>
              </View>
            </View>
    )
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
      this.setState({alt_photo:file})
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }
  attatchFile= async (i)=>{
    const {acv_file1} =this.state
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
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
      this.state.acv_file1[i]=file
      this.setState({acv_file1})
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
    
  }
  handleSubmit(){
    const {userForm, user} = this.props;

    if (userForm.valid) {
      // userForm.$form.valid in V1
      // submit user here
    } else {
      // show errors
    }
  }

  BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        this.props.navigation.goBack();
      }}
    />
  );

  setAltruist = async () => {
    this.setState({spinnerModalVisible:true})
    const {
        mem_id,
        alt_photo,
        alt_aboutme,
        alt_content,
        alt_answertype,
        acv_type,
        acv_year,
        acv_content,
        acv_status,
        acv_open,
        acv_file1,
        acv_final,
        actSelected,
        count
    } = this.state;

    console.log('mem_id = '+this.state.mem_id)
    let formdata = new FormData();
    formdata.append("mem_id", mem_id);
    formdata.append("alt_aboutme", alt_aboutme);
    formdata.append("alt_content", alt_content);
    formdata.append("alt_answertype", 3);
    formdata.append("alt_status", 'R');
    formdata.append("alt_honor", 0);
    formdata.append("alt_photo", {
      uri: alt_photo.uri,
      type: alt_photo.type,
      name: alt_photo.name,
    });

    for(var i=0;i<count-1;i++){
      formdata.append("acv_type[]", acv_type[i]);
      formdata.append("acv_year[]", acv_year[i]);
      formdata.append("acv_content[]", acv_content[i]);
      formdata.append("acv_status[]", acv_status[i]);
      formdata.append("acv_open[]", acv_open[i]);
      formdata.append("acv_final[]", acv_final[i]);
    }
    actSelected.map((item,index)=>{
      console.log(item,index)
      formdata.append("act_id[]", actSelected[index].act_id);
      
    })
    acv_file1.map((item) => {
      formdata.append('acv_file1[]', {
        uri: item.uri,
        type: item.type,
        name: item.name,
      });
    });
    console.log(formdata);

    await axios
      .post('http://dev.unyict.org/api/altruists/apply', formdata)
      .then((response) => {
        this.setState({spinnerModalVisible:false})
        if (response.data.status == '500') {
          Alert.alert('오류', `${response.data.message}`, [{text: 'OK'}], {
            cancelable: false,
          });
        } else {
          this.props.navigation.navigate('ApplyComplete');
        }
      })

      .catch((error) => {
        this.setState({spinnerModalVisible:false})
        console.log('error2'+JSON.stringify(error));
        alert('오류가 발생하였습니다.');
      });
  };

  getAreaCat = async () => {
    await axios
      .get('http://dev.unyict.org/api/altruists/area_category')
      .then((res) => {
        //console.log(res)
        this.setState({category: res.data.data});
        console.log(this.state.category);
      })
      .catch((err) => {
        alert(err);
      });
  };

  componentDidMount() {
    StatusBar.setBackgroundColor('#F4F4F4');
    StatusBar.setBarStyle('dark-content');
    this.getAreaCat();
    this.setState({mem_id:this.context.session_mem_id});
    this.arrayForLoop();
  }
  componentWillUnmount(){
    StatusBar.setBackgroundColor('#B09BDE');
    StatusBar.setBarStyle('default');
  }

  render() {
    const {width,height} =Dimensions.get('window')
    const {spinnerModalVisible,filterModalVisible,actSelected,alt_content,alt_aboutme,arrayForLoop,acv_open,acv_type,acv_file1,acv_year,acv_content,acv_final,selectedIndex,category,alt_photo} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <WriteContentToptab
          text='지원하기'
          gbckfunc={() => {
              this.props.navigation.goBack();
          }}
          gbckuse={true}
          style={{backgroundColor:'#f4f4f4'}}
        />
        <ScrollView style={{paddingHorizontal:"5%"}}>
          <View style={{flexDirection:'row'}}>
            <TouchableHighlight onPress={()=>this.attatchProfImg()} >
                <View >
                  <Image 
                    style={{width:100,height:100}}
                    source={{uri:!alt_photo.uri? 'http://dev.unyict.org/uploads/noimage.gif':alt_photo.uri}}/>
                  <Camsvg style={{position:'absolute',bottom:0,right:0}}/>
                </View>
              </TouchableHighlight>
            <View style={{width:(width-100)*0.9}}>
              <Text style={[styles.nameText]}>
                본명입니다
              </Text>
              <TextInput
                value={alt_aboutme}
                onChangeText={(text) => this.setState({alt_aboutme:text})}
                placeholder='자기PR (50자 이내)'
                style={[styles.contentInput,{}]}
                multiline={true}
                placeholderTextColor='#A897C2'
                textAlignVertical="top"
                />
            </View>
          </View>
          <View style={{marginTop:25}}>
            <TextInput
              value={alt_content}
              onChangeText={(text) => this.setState({alt_content: text})}
              placeholder='자기소개'
              style={[styles.contentInput,{minHeight:75}]}
              multiline={true}
              textAlignVertical='top'
              placeholderTextColor='#A897C2'
            />
          </View>
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
          {/* 경력구분 */}
          <View style={{marginTop:40,paddingLeft:10,flexDirection:'row',alignItems:'center'}}>
            <Text style={styles.fieldTitle}>경력 사항</Text>
            <Text style={[styles.fieldTitle,{fontSize:12}]}>[ 학력 | 직장 | 기타]</Text>
          </View>
          <View style={{marginTop:20}}>
            <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                <View style={{flex:2,alignItems:'center'}}>
                  <Text style={styles.careerHead}>
                  공개
                  </Text>
                </View>
                <View style={{flex:3.5,alignItems:'center'}}>
                  <Text style={styles.careerHead}>
                  구분
                  </Text>
                </View>
                <View style={{flex:5,alignItems:'center'}}>
                  <Text style={styles.careerHead}>
                  년도
                  </Text>
                </View>
                <View style={{flex:14,alignItems:'center'}}>
                  <Text style={styles.careerHead}>
                  내용
                  </Text>
                </View>
                <View style={{flex:4,alignItems:'center'}}>
                  <Text style={styles.careerHead}>
                  최종경력
                  </Text>
                </View>
            </View>
            {
              arrayForLoop.map((item,index)=>(
                <this.RenderCareerInput i={index} key={index}/>
              ))
            }
            <TouchableOpacity 
                style = {{marginTop:10,height:21,width:23,backgroundColor:'#63579D',borderRadius:7,justifyContent:'center',marginRight:10}} 
                onPress={()=>this.arrayForLoop()}
            >
                <Text style={{color:'#ffffff',fontSize:30,textAlign:'center',textAlignVertical:'center'}}>+</Text>    
            </TouchableOpacity>
          </View>

          <View style={{marginTop:40,paddingLeft:10,}}>
            <Text style={styles.fieldTitle}>경력 사항 첨부파일</Text>
            <View style={{flexDirection:'row',alignItems:'flex-end',marginTop:16}}>
              <Text>-</Text>
              <Text style={{fontWeight:'bold'}}>관리자 확인</Text>
              <Text>에만 사용되며</Text> 
              <Text style={{fontWeight:'bold'}}>동의없이 공개</Text>
              <Text>하지 않습니다</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'flex-end',marginTop:9}}>
              <Text>- </Text>
              <Text style={{fontWeight:'bold'}}>경력사항 공개</Text>
              <Text>를 원하시면 첨부파일로 인증 부탁드립니다.</Text>
            </View>

          </View>
          <View style={{marginTop:20}}>
          {
            arrayForLoop.map((item,index)=>(
             <TouchableHighlight onPress={()=>this.attatchFile(index)} key={index} >
              <View style={{flexDirection:'row',alignItems:'center'}} >
                <Clipsvg width={35} height={35}/>
                <Text style={{marginLeft:15}}>
                  {!acv_file1[index]? `첨부파일 ${index+1} 추가`:acv_file1[index].name}
                </Text>
                {
                  !acv_file1[index]?
                  null
                  :
                <TouchableHighlight 
                    style={{marginLeft:5, width:15,height:15,justifyContent:'center',backgroundColor:'#c4c4c4'}} 
                    onPress={()=>{acv_file1.splice(index,1);this.setState({acv_file1})}}>
                  <View style={{borderWidth:1}} />
                </TouchableHighlight>
                }
              </View>
             </TouchableHighlight>
            ))
          }
          </View>
          
          <View style={{alignItems:'center',justifyContent:'center',marginTop:30}}>  
          <TouchableHighlight 
            style={{alignItems:'center',justifyContent:'center',borderRadius:7.5,height:33,width:60,backgroundColor:'#63579D'}}
            onPress={() => this.setAltruist()}>
            <Text style={{fontSize:18,fontWeight:'bold',color:'#ffffff'}}>신청</Text>
          </TouchableHighlight>
          </View>
        </ScrollView>
            <Modal
                visible={filterModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({filterModalVisible:false})}
                style={{justifyContent:'center'}}
            >
                <View style={{backgroundColor:'#ffffff',borderRadius:20,width:width*0.8}}>
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Text category='h2' style={{fontSize:13,marginVertical:11,color:'#63579D'}}>필터 적용하기</Text>
                        <View style={{borderWidth:1,borderColor:'#E3E3E3',width:'90%',marginBottom:15}}></View>
                    </View>
                    <ScrollView ScrollViewstyle = {{}}>
                        <View style = {{justifyContent:'space-between',flexDirection : 'row', flexWrap: 'wrap',paddingHorizontal:'5%'}}>
                            {category.map(act => (
                                <Tag 
                                    key = {act.act_content}
                                    onPress ={()=>{
                                        if(actSelected.includes(act)){
                                            actSelected.splice(actSelected.indexOf(act),1)
                                            this.setState({actSelected})
                                        }else{
                                            this.setState({actSelected:actSelected.concat(act)})
                                        }
                                    }}
                                    style={[{padding:4},actSelected.includes(act) ? styles.tagSelected:{}]}
                                >
                                    {act.act_content}
                                    
                                </Tag>
                            ))}
                        </View>
                    </ScrollView>
                    <View style={{alignItems:'center',justifyContent:'center',marginVertical:20}}>
                        <TouchableHighlight 
                            onPress={()=>{this.setState({filterModalVisible:false})}} 
                            style={{backgroundColor:'#63579D', paddingVertical:4,paddingHorizontal:20,borderRadius:8.5}}>
                            <Text style={{fontSize:18,fontWeight:'700',color:'#ffffff'}}>적용</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={spinnerModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.7)'}}
            >
                <Spinner size='giant'/>
            </Modal>
      </SafeAreaView>
    );
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
  }
});

export default AltApplyFormScreen;
