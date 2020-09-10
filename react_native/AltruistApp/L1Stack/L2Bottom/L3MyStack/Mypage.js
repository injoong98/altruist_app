import React from 'react';
import {View,StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {Input,Button,Text} from '@ui-kitten/components';
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';
import {Signing} from '../../Context'
import MoreSvg from '../../../assets/icons/dotdotdot-large.svg'
import ThumbSvg from '../../../assets/icons/thumb-up-filled.svg'
import PencilSvg from '../../../assets/icons/pencil-outline.svg'
import MessageSvg from '../../../assets/icons/message.svg'
import NoimageSvg from '../../../assets/icons/noimage.svg'


class Mypage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mem_info:[],
            isLoading:true
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
      const {mem_point,mem_nickname,mem_following,mem_followed} = this.state.mem_info
      const {navigate} =this.props.navigation
        return(
          <SafeAreaView style={{flex:1}}>
              <View style={{flex:1,backgroundColor:'#ffffff'}}>
                  <View style={{flexDirection:'row',margin:35,backgroundColor:'#F0F0F0',borderRadius:10}}>
                      <View style={{marginVertical:20,marginLeft:30}}>
                          <NoimageSvg height={125} width={125}/>
                      </View>
                      <View style={{marginLeft:16,marginTop:13,marginBottom:24,justifyContent:'space-between'}}>
                          <View style={{padding:8,flexDirection:'row',backgroundColor:'#ffffff',borderRadius:10}}>
                              <View style={{}}>
                                  <Text category='p2'style={{color:'#A897C2',fontSize:10,textAlignVertical:'bottom'}}>point{`\n`}score</Text>
                              </View>
                              <View style={{ marginVertical:3,marginLeft:4,borderColor:'#F0F0F0'}}>
                              </View>
                              <View style={{marginLeft:10}}>
                                  <Text style={{fontSize:10,lineHeight:13,color:'#63579D'}}>누적 {mem_point}{`\n`}사용 {mem_point}</Text>
                              </View>
                        </View>  
                      <View style={{marginTop:15,display:'flex',flexDirection:'row', alignItems:'flex-end'}}>
                          <Text category='h2' style={{fontSize:24,color:'#63579D'}}>{mem_nickname}</Text>
                          <View style={{height:'80%',marginLeft:10,alignItems:'flex-end'}}>
                              <ThumbSvg height={24} width={24}/>          
                          </View>
                      </View>  
                      <View style={{marginTop:10}}>
                          <Text style={{fontSize:9}}>팔로워 : {mem_followed} | 팔로잉 : {mem_following}</Text>          
                      </View>  
                    </View>
                    <TouchableOpacity onPress={()=>{alert('more')}} style={{position:'absolute',top:8 }}>
                      <MoreSvg height={19} width={19}/>
                    </TouchableOpacity > 
                  </View>
                  <View style={{ marginHorizontal:40}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginBottom:23}}>
                      <PencilSvg height={28} width={22}/>
                      <Text category='h2' style={styles.menuTitle}>나의 활동</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyList',{type:'post'})}} >
                        <Text style={styles.menuItem}>작성글</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{navigate('MyList',{type:'comment'})}}>
                        <Text style={styles.menuItem}>댓글단 글</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{alert('menu!')}}>
                        <Text style={styles.menuItem}>작성 댓글</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{alert('menu!')}}>
                        <Text style={styles.menuItem}>좋아요한 글</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{alert('menu!')}}>
                        <Text style={styles.menuItem}>스크랩</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ marginHorizontal:40}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginBottom:23}}>
                      <View style={{transform: [{ rotate: "25.69deg" }]}}>
                        <MessageSvg height={28} width={22}/>
                      </View>
                      <Text category='h2' style={styles.menuTitle}>쪽지함</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{alert('menu!')}} >
                        <Text style={styles.menuItem}>받은  쪽지함</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuContainer} onPress={()=>{alert('menu!')}}>
                        <Text style={styles.menuItem}>보낸 쪽지함</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{display:'flex',flexDirection:'row',position:'relative'}}>
                      <Button onPress={()=>{signOut()}}>간단로그아웃</Button>
                      <Button onPress={()=>{this.sessionChk();}}>session chk</Button>
                  </View>
              </View>
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
    paddingLeft:14
  },
  menuItem:{
    fontSize:12,
    lineHeight:13,
    color:'#63579D',
    marginBottom:11
  }

})