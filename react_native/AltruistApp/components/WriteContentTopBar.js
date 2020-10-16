import React from 'react';
import {View,StyleSheet,TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput} from 'react-native';
import {Text,Icon,Button} from '@ui-kitten/components'
import BellLargesvg from '../assets/icons/bell-large.svg'
import Uploadsvg from '../assets/icons/upload.svg'
import Backsvg from '../assets/icons/back-arrow-color.svg'
import Searchsvg from '../assets/icons/search-outline.svg';

export class WriteContentToptab extends React.Component {
    constructor(props){
        super(props)
        {this.props.right=='search'
        ?this.state={
            keyword : null
        }
        :null}
    }

    render(){
        const {right,gbckfunc,text,func, backgroundColor} = this.props
        const bckclr = !backgroundColor?(right =='upload'||right =='edit'? '#f4f4f4': '#ffffff'):backgroundColor
        return(
            <View style={[{backgroundColor:bckclr,height:49, flexDirection:'row'},this.props.style]} >
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <TouchableOpacity onPress={gbckfunc}>
                        {
                            gbckfunc==null?
                            null
                            :
                            <Backsvg width={25} height={25}/>
                        }
                    </TouchableOpacity>
                </View>
                {right=='search'
                ?
                <View>
                    <TextInput 
                        style={styles.titleInput} 
                        value={this.state.keyword} 
                        onChangeText={(text) =>{this.setState({keyword:text})}}
                        placeholder="검색어를 입력하세요"
                        placeholderTextColor='#A897C2'
                    />
                    <TouchableOpacity 
                        style={{position:"absolute",right:5,top:6}}
                        // onPress={()=>{Keyboard.dismiss(),this.getAltruistsFilteredList('keyword')}}
                    >
                        
                        <Searchsvg height={25} width={25} fill='#A9C' />
                    </TouchableOpacity>
                </View>
                :
                <View style={{flex:4, justifyContent:'center', alignItems:'center'}}>
                    <Text category='h2' style={styles.toptext}>{text}</Text>
                </View>
                }
                {/* <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                {
                    !right ?
                    null
                    :
                    right =='upload'||right =='edit' ?
                    <TouchableOpacity onPress={func} style={{paddingHorizontal:8,paddingVertical:8,marginRight:10,backgroundColor:'#63579D',borderRadius:8.5}}>
                            <Text style={{fontSize:18,fontWeight:'700',color:'#ffffff',}}>
                            {right =='upload' ? '완료' :'수정'}
                            </Text>
                    </TouchableOpacity>
                    :
                    right
                }
                </View> */}
            </View>
                /* <View style={styles.rightside}>
                    <View 
                        style={{
                            borderTopLeftRadius:16,backgroundColor:bckclr,width:"100%",height:"100%"}}
                    >
                        <View style={styles.iconcontainer}>
                                {this.props.right =='upload' ? 
                                    <TouchableOpacity onPress={this.props.func}>
                                        <Uploadsvg height={35} width={35}/>
                                    </TouchableOpacity>
                                :
                                this.props.right =='edit' ?
                                    <Button onPress={this.props.func}>
                                        수정
                                    </Button>
                                : null}
                        </View>
                    </View>
                </View> */
        )
    }
}


const styles = StyleSheet.create({
    container:{
        height:49,
        display:'flex',
        flexDirection:'row'
    },
    leftside:{
        backgroundColor:"#ffffff",
        width:"59%",
        height:"100%",

    },
    leftinner:{
        // borderBottomRightRadius:16,
        // backgroundColor:"#B09BDE",
        // width:"100%",
        // height:"100%",
        // position:'absolute'
    },  
    rightside:{
        backgroundColor:"#B09BDE",
        width:"41%",
        height:"100%"
    },
    rightinner:{
        borderTopLeftRadius:16,
        backgroundColor:"#ffffff",
        width:"100%",
        height:"100%"
    },
    toptext:{
        paddingTop: 5,
        color:"#63579D",
        fontSize:20
    },
    topicon:{
        height:35,
        width:35
    },
    iconcontainer:{
        width:30,
        backgroundColor:'#B09BDE',
        justifyContent:'center',
        alignItems:"flex-end",
        paddingRight:20
    },
    bckicon:{
        justifyContent:'center',
        alignItems:'center',
        paddingLeft:15
    },
    titleInput :{
      width:'100%',
      paddingVertical:9,
      paddingLeft:15,
      backgroundColor:'#ffffff',
      borderRadius:7,
      borderColor:"#AC95C5",
      borderWidth:2,
      fontSize:12,
      height:40,
      minWidth:'80%'
  },
})