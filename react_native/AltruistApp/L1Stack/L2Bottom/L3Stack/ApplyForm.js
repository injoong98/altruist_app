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
  ScrollView
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
  Modal
} from '@ui-kitten/components';
import {Signing} from '../../Context';
import axios from 'axios';
import Tag from '../../../components/tag.component'
const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

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
      actSelected:[],
      category:[],
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
          <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                      <View>
                            <CheckBox
                              checked={acv_open[i]}
                              onChange={nextChk => {acv_open[i]=nextChk;this.setState({acv_open});console.log(acv_open)}}
                            />
                      </View>
                      <View style={{width:100}}>
                      <Select
                          value={ ()=>
                            <Text>
                              {!acv_type[i]? '선택': acv_type[i] == 'H'? '학력':acv_type[i] == 'J'? '직장' : '기타'}
                            </Text>
                          }
                          selectedIndex={selectedIndex}
                          onSelect={index =>{
                            setSelectedIndex(index);
                            acv_type[i]=index.row==0? 'H':index.row==1? 'J':'E';
                            this.setState({selectedIndex,acv_type});
                          }}
                          >
                          <SelectItem title='학력'/>
                          <SelectItem title='직장'/>
                          <SelectItem title='기타'/>
                        </Select>
                      </View>
                      <View>
                          <TextInput
                            value= {acv_year[i]}
                            onChangeText={(text)=>{acv_year[i]=text;this.setState({acv_year});}}
                            placeholder='ex)2010~'
                            style={{backgroundColor:'#ffffff'}}
                            keyboardType='default'
                          />
                      </View>
                      <View>
                          <TextInput
                            value= {acv_content[i]}
                            onChangeText={(text)=>{acv_content[i]=text;this.setState({acv_content})}}
                            placeholder='경력내용'
                            style={{backgroundColor:'#ffffff'}}
                          />
                      </View>
                      <View>
                      <CheckBox
                              checked={acv_final[i]}
                              onChange={nextChk => {acv_final[i]=nextChk;this.setState({acv_final})}}
                            />
                      </View>
                      <TouchableHighlight onPress={()=>this.cancleCareer(i)}>
                        <Text>x</Text>
                      </TouchableHighlight>
            </View>
    )
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
    const {
        mem_id,
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

    let formdata = new FormData();
    formdata.append("mem_id", mem_id);
    formdata.append("alt_aboutme", alt_aboutme);
    formdata.append("alt_content", alt_content);
    formdata.append("alt_answertype", alt_answertype);
    formdata.append("alt_status", 'R');
    formdata.append("alt_honor", 0);

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
        console.log(response);
        console.log(response.data.status);
        if (response.data.status == '500') {
          Alert.alert('Error', `${response.data.message}`, [{text: 'OK'}], {
            cancelable: false,
          });
        } else {
          Alert.alert(
            '이타주의자',
            '작성 완료',
            [
              {
                text: 'OK',
              },
            ],
            {cancelable: true},
          );
        }
      })

      .catch((error) => {
        console.log(JSON.stringify(error));
        alert(error);
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
    //this.setAltruist()
    this.getAreaCat();
    this.setState({mem_id:this.context.session_mem_id});
    this.arrayForLoop();
  }

  render() {
    const {filterModalVisible,alt_content,alt_aboutme,arrayForLoop,acv_open,acv_type,acv_file1,acv_year,acv_content,acv_final,selectedIndex,category} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <TopNavigation title="이타주의자" accessoryLeft={this.BackAction} />
        <View>
          <Text> 이타주의자 지원하기 FORM </Text>
        </View>
        <ScrollView>
          <View style={{flexDirection: 'row'}}>
            <Text>자기PR</Text>
            <TextInput
              style={styles.contentInput}
              value={alt_aboutme}
              onChangeText={(text) => this.setState({alt_aboutme:text})}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text>자기소개</Text>
            <TextInput
              style={styles.contentInput}
              value={alt_content}
              onChangeText={(text) => this.setState({alt_content: text})}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text>답변대기</Text>
            
            <RadioGroup
            style={{flexDirection:'row'}}
              selectedIndex={selectedIndex}
              onChange={(index) => {
                console.log(index)
                this.setState({selectedIndex:index,alt_answertype:index});
              }}>
              <Radio>
                <Text style={{color: '#63579D'}} category="p1">
                  답변 x
                </Text>
              </Radio>
              <Radio>
                <Text style={{color: '#63579D'}} category="p1">
                  1대1 질문만
                </Text>
              </Radio>
              <Radio>
                <Text style={{color: '#63579D'}} category="p1">
                  1대다,1대1둘다
                </Text>
              </Radio>
            </RadioGroup>
          </View>
          {/* 경력구분 */}
          <Text>경력 사항</Text>
          <View>
            <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                <View>
                  <Text style={{fontSize:12,lineHeight:16}}>
                  공개
                  </Text>
                </View>
                <View>
                  <Text style={{fontSize:12,lineHeight:16}}>
                  구분
                  </Text>
                </View>
                <View>
                  <Text style={{fontSize:12,lineHeight:16}}>
                  년도
                  </Text>
                </View>
                <View>
                  <Text style={{fontSize:12,lineHeight:16}}>
                  내용
                  </Text>
                </View>
                <View>
                  <Text style={{fontSize:12,lineHeight:16}}>
                  최종 경력
                  </Text>
                </View>
            </View>
            {
              arrayForLoop.map((item,index)=>(
                <this.RenderCareerInput i={index}/>
              ))
            }
            <View style={{flexDirection:'row'}}>
              <Button onPress={()=>{this.arrayForLoop();}}>+</Button>
            </View>
          </View>
          <Text>경력 증빙 자료</Text>
          <View>
          {
            arrayForLoop.map((item,index)=>(
             <TouchableHighlight onPress={()=>this.attatchFile(index)} >
              <View style={{flexDirection:'row'}} >
                <Text>첨부파일 {index+1} 추가</Text>
                <Text>{!acv_file1[index]? null:acv_file1[index].name}</Text>
                <TouchableHighlight onPress={()=>{acv_file1.splice(index,1);this.setState({acv_file1})}}><Text>x</Text></TouchableHighlight>
              </View>
             </TouchableHighlight>
            ))
          }
          </View>
          <View style={{display:'flex',flexDirection:'row'}}>
                    {
                        <TouchableOpacity 
                            style = {{height:35,width:35,backgroundColor:'#B09BDE',borderRadius:10,justifyContent:'center'}} 
                            onPress={()=>this.setState({filterModalVisible:true})}
                        >
                            <Text category='h2' style={{color:'#ffffff',fontSize:30,textAlign:'center',textAlignVertical:'center'}}>+</Text>    
                        </TouchableOpacity>
                    }
                    {
                        this.state.actSelected.length >0 ?
                        <ScrollView horizontal={true} style={{}} >
                                {this.state.actSelected.map((act,index) => (
                                    <Tag style={{marginVertical : 5}}
                                        key = {act.act_content}
                                        onPress ={()=>{this.state.actSelected.splice(index,1);this.setState({actSelected:this.state.actSelected})}}>
                                        {act.act_content}
                                    </Tag>
                                ))}
                        </ScrollView >
                        :
                        <View>
                            <Text style={{marginVertical:9,fontSize:15}} category = 'c2'>전문 분야를 선택하세요</Text>
                        </View>

                    }
                    </View>
          <View>
            <Button onPress={()=>console.log(
              '\nacv_file1 : '+JSON.stringify(acv_file1),'\nacv_open : '+JSON.stringify(acv_open),'\nacv_type : '+JSON.stringify(acv_type),'\nacv_year : '+JSON.stringify(acv_year),'\nacv_content : '+JSON.stringify(acv_content),'\nacv_final : '+JSON.stringify( acv_final)
            )}>
              states chk
            </Button>
            <Button style={{margin: 10}}>취소</Button>
            {/* <Button style={{margin:10}} onPress={()=>navigation.navigate('AltApplyComplete')}>완료</Button> */}
            <Button style={{margin: 10}} onPress={() => this.setAltruist()}>
              완료
            </Button>
          </View>
        </ScrollView>
        <Modal
                visible={filterModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({filterModalVisible:false,cmt_id:''})}
            >
                <View style = {{flex:1,justifyContent:'space-evenly',backgroundColor:'#ffffff'}}>
                    <View style = {{flexDirection : 'row', flexWrap: 'wrap',}}>
                        {this.state.actSelected.map((act,index) => (
                            <Tag style={{marginVertical : 5}}
                                key = {act.act_content}
                                onPress ={()=>{this.state.actSelected.splice(index,1);this.setState({actSelected:this.state.actSelected})}}>
                                {act.act_content}
                            </Tag>
                        ))}
                    </View>
                    <Divider />
                    <View style = {{flexDirection : 'row', flexWrap: 'wrap',}}>
                        {category.map(act => (
                            <Tag 
                                key = {act.act_content}
                                onPress ={()=>{this.setState({actSelected:this.state.actSelected.concat(act)});console.log(this.state.actSelected)}}
                                disabled ={this.state.actSelected.includes(act) ? true: false}
                                style={this.state.actSelected.includes(act) ? styles.tagDisabled:{marginVertical : 2}}
                            >
                                {act.act_content}
                                
                            </Tag>
                        ))}
                    </View>
                    <View style={{padding:10,}}>
                        <Text category='h2' style={{fontSize:18}}>
                            !!1대다 질문은 모든 이타주의자들이 조회하고 답변할 수 있습니다.
                        </Text>
                        <Text category='h2' style={{fontSize:18}}>
                            !!분야를 선택하면 해당 이타주의자들에게 질문 등록에 대한 알림이 갑니다.
                        </Text>
                    </View>
                </View>
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
    borderRadius: 15,
    marginHorizontal: 10,
    marginBottom: 20,
    // 휴대폰 width - titleInput
    width: 350,
  },
  tagDisabled:{
    backgroundColor:'#8D8D8D',
    marginVertical : 2,
    borderRadius:20
},
});

export default AltApplyFormScreen;
