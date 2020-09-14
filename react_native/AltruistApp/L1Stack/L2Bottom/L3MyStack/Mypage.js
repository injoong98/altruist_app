import React from 'react';
import {View,StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
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


class Mypage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mem_info:[],
            isLoading:true,
            logOutModalVisible:false
        }
    }

    static contextType = Signing;
    
    loadMemInfo = () => {
      axios.get('http://dev.unyict.org/api/mypage')
      .then(res=>{
        this.setState({mem_info:res.data.myinfo,isLoading:false})
        
      })
      .catch(err=>{
        console.log(JSON.stringify(err))
      })
    }
    sessionChk = () =>{
      axios.get('http://dev.unyict.org/api/login/session_check')
      .then(res=>{
          alert(JSON.stringify(res.data))
        }
      )
      .catch(err=>{
          alert(JSON.stringify(err))
      })
    }
    
    componentDidMount(){
        this.loadMemInfo();
    }
    render(){
      const {signOut} = this.context
      const {logOutModalVisible} = this.state
      const {mem_point,mem_nickname,mem_following,mem_followed,mem_profile_content} = this.state.mem_info
      const {navigate} =this.props.navigation
        return(
          <SafeAreaView style={{flex:1}}>
              <View style={{flex:1,backgroundColor:'#ffffff'}}>
                  <View style={{flexDirection:'row',margin:35,backgroundColor:'#F0F0F0',borderRadius:10}}>
                      <View style={{marginVertical:20,marginLeft:30}}>
                          <NoimageSvg height={125} width={125}/>
                      </View>
                      <View style={{maxWidth:'40%',marginHorizontal:16,marginTop:13,marginBottom:24,justifyContent:'space-between'}}>
                        <View style={{marginTop:15,display:'flex',flexDirection:'row', alignItems:'flex-end'}}>
                            <Text category='h2' style={{fontSize:24,color:'#63579D'}}>{mem_nickname}</Text>
                            <View style={{height:'80%',marginLeft:10,alignItems:'flex-end'}}>
                                <ThumbSvg height={24} width={24}/>          
                            </View>
                        </View>  
                        <View style={{marginVertical:10}}>
                            <Text style={{fontSize:9,maxHeight:'100%'}} numberOfLines={2}> {mem_profile_content} </Text>          
                        </View> 
                        <TouchableOpacity style={{padding:8,flexDirection:'row',backgroundColor:'#ffffff',borderRadius:10}} onPress={()=>this.props.navigation.navigate('MyPoint')}>
                              <View style={{}}>
                                  <Text category='p2'style={{color:'#A897C2',fontSize:10,textAlignVertical:'bottom'}}>point{`\n`}score</Text>
                              </View>
                              <View style={{ marginVertical:3,marginLeft:4,borderColor:'#F0F0F0'}}>
                              </View>
                              <View style={{marginLeft:10}}>
                                  <Text style={{fontSize:10,lineHeight:13,color:'#63579D'}}>누적 {mem_point}{`\n`}사용 {mem_point}</Text>
                              </View>
                        </TouchableOpacity>  
                    </View>
                    <TouchableOpacity onPress={()=>{alert('more')}} style={{position:'absolute',top:8,right:0 }}>
                      <MoreSvg height={19} width={19}/>
                    </TouchableOpacity > 
                  </View>
                  <View style={{ marginHorizontal:40,marginBottom:20}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginBottom:15}}>
                      <PencilSvg height={28} width={22}/>
                      <Text category='h2' style={styles.menuTitle}>나의 활동</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyList',{type:'post'})}} >
                        <Text style={styles.menuItem}>작성글</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyList',{type:'comment'})}}>
                        <Text style={styles.menuItem}>작성 댓글</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyList',{type:'like_post'})}}>
                        <Text style={styles.menuItem}>좋아요한 글</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyList',{type:'scrap'})}}>
                        <Text style={styles.menuItem}>스크랩</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ marginHorizontal:40,marginBottom:20}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginBottom:15}}>
                      <View style={{transform: [{ rotate: "25.69deg" }]}}>
                        <MessageSvg height={28} width={22}/>
                      </View>
                      <Text category='h2' style={styles.menuTitle}>쪽지함</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{alert('받은 쪽지!')}} >
                        <Text style={styles.menuItem}>받은  쪽지함</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{alert('보낸 쪽지!')}}>
                        <Text style={styles.menuItem}>보낸 쪽지함</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ marginHorizontal:40,marginBottom:20}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginBottom:15}}>
                      <View>
                        <MoreSvg height={19} width={22}/>
                      </View>
                      <Text category='h2' style={styles.menuTitle}>이타주의자</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyQueList')}} >
                        <Text style={styles.menuItem}>질문함</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ marginHorizontal:40,marginBottom:20}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginBottom:15}}>
                      <View>
                        <MoreSvg height={19} width={22}/>
                      </View>
                      <Text category='h2' style={styles.menuTitle}>계정</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>navigate('MyProfEdit',{mem_info:this.state.mem_info})} >
                        <Text style={styles.menuItem}>프로필 수정</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{this.setState({logOutModalVisible:true})}} >
                        <Text style={styles.menuItem}>로그아웃</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{()=>{this.sessionChk();}}}>
                        <Text style={styles.menuItem}>세션체크</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

              </View>
              <Modal
                visible={logOutModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({logOutModalVisible:false})}
            >
                <Confirm 
                    confirmText="정말 로그아웃 하시겠습니까?"
                    frstText="예"
                    OnFrstPress={() =>{signOut()}}
                    scndText="아니오"
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
    fontSize:12,
    lineHeight:13,
    color:'#63579D'
  },
  menuContainer:{
    paddingLeft:14,
    borderBottomWidth:1,
    borderBottomColor:'#f4f4f4',
    marginTop:10,
    marginBottom:5
  },
  menuItem:{
    fontSize:12,
    lineHeight:13,
    color:'#63579D',
    marginBottom:2
  }

})