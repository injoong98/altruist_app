import React from 'react';
import {View,StyleSheet, SafeAreaView, TouchableOpacity,ScrollView,Image, Pressable} from 'react-native';
import {Input,Button,Text,Modal} from '@ui-kitten/components';
import axios from 'axios'
import Confirm from '../../../components/confirm.component'
import AsyncStorage from '@react-native-community/async-storage';
import {Signing} from '../../Context'
import MoreSvg from '../../../assets/icons/dotdotdot-large.svg'
import ThumbSvg from '../../../assets/icons/thumb-up-filled.svg'
import PencilSvg from '../../../assets/icons/pencil-outline.svg'
import MessageSvg from '../../../assets/icons/message.svg'
import AltruistSvg from '../../../assets/icons/altruist.svg'
import NoimageSvg from '../../../assets/icons/noimage.svg'
import PersonSvg from '../../../assets/icons/person.svg'
import { threshold } from 'react-native-color-matrix-image-filters';

class Mypage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mem_info:[],
            isLoading:true,
            logOutModalVisible:false,
            showGameCnt : 0,
        }
    }

    static contextType = Signing;
    
    loadMemInfo = async() => {
      await axios.get('https://dev.unyict.org/api/mypage')
      .then(res=>{
        this.setState({mem_info:res.data.myinfo,isLoading:false})
        
      })
      .catch(err=>{
        console.log(JSON.stringify(err))
      })
    }
    sessionChk = () =>{
      axios.get('https://dev.unyict.org/api/login/session_check')
      .then(res=>{
          alert(JSON.stringify(res.data))
        }
      )
      .catch(err=>{
          alert(JSON.stringify(err))
      })
    }
    onRefresh = () => {
        this.loadMemInfo();
    }
    componentDidMount(){
        this.loadMemInfo();
    }
    render(){
      const {signOut} = this.context
      const {logOutModalVisible,mem_info,showGameCnt} = this.state
      const {mem_point,mem_nickname,mem_photo,mem_profile_content} = mem_info
      const {navigate} =this.props.navigation
        return(
          <SafeAreaView style={{flex:1}}>
              <ScrollView style={{flex:1,backgroundColor:'#ffffff'}}>
                  <View style={{flexDirection:'row',margin:35,backgroundColor:'#F0F0F0',borderRadius:10}}>
                    <Pressable onPress={()=>this.setState({showGameCnt:showGameCnt+1})}>
                      <View style={{marginVertical:20,marginLeft:30,borderRadius:62.5,width:125, height : 125,overflow:'hidden'}}>
                        <Image 
                            source = {{uri : 'https://dev.unyict.org/'+ (mem_photo ?'uploads/member_photo/'+mem_photo: 'uploads/altwink-rect.png')}} 
                            style = {{ width : '100%', height : '100%', resizeMode:'cover'}}
                        />
                      </View>
                    </Pressable>
                      <View style={{maxWidth:'40%',marginHorizontal:16,marginTop:13,marginBottom:24,justifyContent:'space-between'}}>
                        <View style={{marginTop:15,display:'flex',flexDirection:'row', alignItems:'flex-end'}}>
                            <Text category='h2' style={{fontSize:20,color:'#63579D'}}>{mem_nickname}</Text>
                            {
                              mem_nickname ?
                                mem_nickname.length <6 ? 
                                  <View style={{height:'80%',marginLeft:5,alignItems:'flex-end'}}>
                                      <ThumbSvg height={20} width={20}/>          
                                  </View>
                                  :null
                                :null
                            }
                        </View>  
                        <View style={{marginVertical:10}}>
                            <Text style={{fontSize:9,maxHeight:'100%'}} numberOfLines={2}> {mem_profile_content} </Text>          
                        </View> 
                        <TouchableOpacity style={{padding:8,flexDirection:'row',backgroundColor:'#ffffff',borderRadius:10}} onPress={()=>this.props.navigation.navigate('MyPoint')}>
                              <View>
                                  <Text category='p2'style={{color:'#A897C2',fontSize:10,textAlignVertical:'bottom'}}>point{`\n`}score</Text>
                              </View>
                              <View style={{ marginVertical:3,marginLeft:4,borderColor:'#F0F0F0'}}>
                              </View>
                              <View style={{marginLeft:10}}>
                                  <Text style={{fontSize:10,lineHeight:13,color:'#63579D'}}>?????? {mem_point}{`\n`}?????? {mem_point}</Text>
                              </View>
                        </TouchableOpacity>  
                    </View>
                    {/* <TouchableOpacity onPress={()=>{alert('more')}} style={{position:'absolute',top:8,right:0 }}>
                      <MoreSvg height={19} width={19}/>
                    </TouchableOpacity >  */}
                  </View>
                  <View style={{ marginHorizontal:40}}>
                     <View style={{flexDirection:'row',alignItems:'center',marginBottom:15}}>
                       <PencilSvg height={28} width={22}/>
                       <TouchableOpacity style={{flexDirection:'row',alignItems:'center',marginBottom:15}}
                       onPress={()=>{ navigate('AboutApp') }} >
                         <AltruistSvg height={19} width={22}/>
                         <Text category='h2' style={styles.menuTitle}>"????????? ???????????? ??????????????????"?</Text>
                       </TouchableOpacity>
                     </View>

                    {/* <View>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyList',{type:'post'})}} >
                        <Text style={styles.menuItem}></Text>
                      </TouchableOpacity>
                    </View> */}
                  </View>
                  
                  {//KTGY ????????????
                  /* <View style={{ marginHorizontal:40,marginBottom:20}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginBottom:15}}>
                      <Text category='h2' style={styles.menuTitle}>KTGY!</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyWebview',{url:'https://www.ktgy.org/'})}} >
                        <Text style={styles.menuItem}>KTGY!</Text>
                      </TouchableOpacity>
                    </View>
                  </View> */}
                  <View style={{ marginHorizontal:40,marginBottom:20}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginBottom:15}}>
                      <PencilSvg height={28} width={22}/>
                      <Text category='h2' style={styles.menuTitle}>?????? ??????</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyList',{type:'post'})}} >
                        <Text style={styles.menuItem}>?????????</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyList',{type:'comment'})}}>
                        <Text style={styles.menuItem}>?????? ??????</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyList',{type:'like_post'})}}>
                        <Text style={styles.menuItem}>???????????? ???</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyList',{type:'scrap'})}}>
                        <Text style={styles.menuItem}>?????????</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* <View style={{ marginHorizontal:40,marginBottom:20}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginBottom:15}}>
                      <View style={{transform: [{ rotate: "25.69deg" }]}}>
                        <MessageSvg height={28} width={22}/>
                      </View>
                      <Text category='h2' style={styles.menuTitle}>?????????</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{alert('?????? ??????!')}} >
                        <Text style={styles.menuItem}>??????  ?????????</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{alert('?????? ??????!')}}>
                        <Text style={styles.menuItem}>?????? ?????????</Text>
                      </TouchableOpacity>
                    </View>
                  </View> */}
                  <View style={{ marginHorizontal:40,marginBottom:20}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginBottom:15}}>
                      <View>
                        <AltruistSvg height={19} width={22}/>
                      </View>
                      <Text category='h2' style={styles.menuTitle}>???????????????</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyQueList')}} >
                        <Text style={styles.menuItem}>?????????</Text>
                      </TouchableOpacity>
                    </View>
                    {
                      this.context.is_altruist ?
                      <>
                        <View>
                          <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyAltProf',{mem_info})}} >
                            <Text style={styles.menuItem}>?????? ?????????</Text>
                          </TouchableOpacity>
                        </View>
                        <View>
                          <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyAltCareer')}} >
                            <Text style={styles.menuItem}>????????????</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                      :
                      null
                    }
                  </View>
                  <View style={{ marginHorizontal:40,marginBottom:20}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginBottom:15}}>
                      <View>
                        <PersonSvg height={19} width={22}/>
                      </View>
                      <Text category='h2' style={styles.menuTitle}>??????</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyProfEdit', { mem_info:this.state.mem_info, onGoback: () => this.onRefresh() })}}>
                        <Text style={styles.menuItem}>????????? ??????</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{this.setState({logOutModalVisible:true})}} >
                        <Text style={styles.menuItem}>????????????</Text>
                      </TouchableOpacity>
                     
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyAlarmSetting');}}>
                        <Text style={styles.menuItem}>?????? ??????</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('BugWrite',{mode:'upload'});}}>
                        <Text style={styles.menuItem}>?????? ??????</Text>
                      </TouchableOpacity>
                      {
                        showGameCnt >7 ?
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyGame');this.setState({showGameCnt:0})}}>
                        <Text style={styles.menuItem}>??????????????????</Text>
                      </TouchableOpacity>
                      :null
                      }
                    </View>
                  </View>

              </ScrollView>
              <Modal
                visible={logOutModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({logOutModalVisible:false})}
            >
                <Confirm 
                    confirmText="?????? ???????????? ???????????????????"
                    frstText="???"
                    OnFrstPress={() =>{signOut()}}
                    scndText="?????????"
                    OnScndPress={() => this.setState({logOutModalVisible:false})}
                />
            </Modal>
          </SafeAreaView>
        )
    }
}

export  {Mypage};

const styles = StyleSheet.create({
  menuTitle :{
    fontSize:14,
    lineHeight:15,
    color:'#63579D'
  },
  menuContainer:{
    paddingLeft:18,
    borderBottomWidth:1,
    borderBottomColor:'#f4f4f4',
    marginTop:10,
    
  },
  menuItem:{
    fontSize:14,
    lineHeight:14,
    color:'#63579D',
    marginBottom:10
  }

})