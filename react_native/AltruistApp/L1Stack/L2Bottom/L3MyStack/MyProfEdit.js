import React from 'react';
import {View,Text,TouchableOpacity,TextInput, SafeAreaView} from 'react-native';
import {Button} from '@ui-kitten/components'
import axios from 'axios'
import MoreSvg from '../../../assets/icons/dotdotdot-large.svg';
import ThumbSvg from '../../../assets/icons/thumb-up-filled.svg';
import NoimageSvg from '../../../assets/icons/noimage.svg';

export class MyProfEdit extends React.Component{
    constructor(props){
        super(props)
        this.state={
            mem_info:this.props.route.params.mem_info,
            mem_nickname:this.props.route.params.mem_info.mem_nickname,
            mem_profile_content:this.props.route.params.mem_info.mem_profile_content
        }
    }
    modify=()=>{
        const {mem_nickname,mem_profile_content} = this.state
        var formdata = new FormData();
        formdata.append('mem_nickname',mem_nickname)
        formdata.append('mem_profile_content',mem_profile_content)

        axios.post('http://dev.unyict.org/api/membermodify/modify',formdata)
        .then(res=>{
            alert(JSON.stringify(res))
        })
        .catch(err=>{
            alert(JSON.stringify(err))
        })
    }
    render(){
      const {mem_nickname,mem_profile_content} = this.state
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>
                <View style={{flexDirection:'row',margin:35,backgroundColor:'#F0F0F0',borderRadius:10}}>
                        <View style={{marginVertical:20,marginLeft:30}}>
                            <NoimageSvg height={125} width={125}/>
                        </View>
                        <View style={{maxWidth:'40%',marginHorizontal:16,marginTop:13,marginBottom:24,justifyContent:'space-between'}}>
                            <View style={{marginTop:15,display:'flex',flexDirection:'row', alignItems:'flex-end'}}>
                                <TextInput
                                    value={mem_nickname} 
                                    style={{fontSize:24,color:'#63579D',backgroundColor:'#ffffff'}} 
                                    onChangeText={(text)=>this.setState({mem_nickname:text})}
                                    />
                            </View>  
                            <View style={{marginVertical:10}}>
                                <TextInput
                                value={mem_profile_content} 
                                style={{fontSize:9,maxHeight:'100%',backgroundColor:'#ffffff'}} 
                                onChangeText={(text)=>this.setState({mem_profile_content:text})}
                                />        
                            </View>
                        </View>
                </View>
                <Button onPress={()=>{this.modify()}}>
                    수정하기
                </Button>
            </SafeAreaView>
        )
    }
}