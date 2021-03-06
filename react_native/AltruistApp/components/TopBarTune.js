import React from 'react';
import {View,StyleSheet,TouchableOpacity, TouchableWithoutFeedback, Keyboard,Platform} from 'react-native';
import {Text,Icon,Button} from '@ui-kitten/components'
import BellLargesvg from '../assets/icons/bell-large.svg'
import Uploadsvg from '../assets/icons/upload.svg'
import Backsvg from '../assets/icons/back-arrow-white.svg'
import Pensvg from '../assets/icons/pencil-outline-color.svg'
import Viewsvg from '../assets/icons/view.svg'
import Searchsvg from '../assets/icons/search.svg'

export class TopBarTune extends React.Component {
    constructor(props){
        super(props)
        
    }

    render(){
        const bckclr = this.props.right =='upload'||this.props.right =='edit'? '#f4f4f4': '#ffffff'
        return(
            <View style={styles.container}>
                <View 
                    style={{backgroundColor:bckclr,width:"59%",height:"100%"}}
                >
                    <View style={styles.leftinner}>
                        <Text category='h2' style={styles.toptext}>{this.props.text}</Text>
                    </View>
                    <TouchableOpacity onPress={this.props.gbckfunc} style={this.props.gbckuse? styles.bckicon:{display:'none'}}>
                        <Backsvg width={26} height={26}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.rightside}>
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
                                <Button onPress={this.props.func} appearance='ghost'>
                                        ??????
                                    </Button>
                                : 
                                this.props.right =='opq' ?
                                <TouchableOpacity 
                                    onPress={this.props.func}
                                    style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'center',paddingLeft:20}}>
                                    <Text category='h2' style={{fontSize:15,color:'#A897C2'}}>??????????????????</Text>
                                    <Pensvg width={28} height={22}/>
                                </TouchableOpacity>
                                :
                                this.props.right =='que'?
                                <TouchableOpacity 
                                    onPress={this.props.func}
                                    style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'center',paddingLeft:20}}>
                                    <Text category='h2' style={{fontSize:15,color:'#A897C2'}}>????????????</Text>
                                    <Pensvg width={28} height={22}/>
                                </TouchableOpacity>
                                :
                                this.props.right =='alarm'?
                                <TouchableOpacity 
                                    onPress={this.props.func}
                                    style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'center',paddingLeft:20}}>
                                    <Text category='h2' style={{fontSize:13,color:'#A897C2'}}>??????????????????</Text>
                                    <Viewsvg width={28} height={22}/>
                                </TouchableOpacity>
                                :
                                this.props.right =='community'?
                                <TouchableOpacity 
                                    onPress={this.props.func}
                                    style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'flex-end',paddingLeft:20}}>
                                    <Searchsvg width={35} height={35}/>
                                </TouchableOpacity>
                                :
                                null}
                        </View>
                    </View>
                </View>
            </View>
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
        borderBottomRightRadius:16,
        backgroundColor:"#B09BDE",
        width:"100%",
        height:"100%",
        position:'absolute',
        justifyContent:'center'
    },  
    rightside:{
        backgroundColor:"#B09BDE",
        width:"41%",
        height:"100%",
        
    },
    rightinner:{
        borderTopLeftRadius:16,
        backgroundColor:"#ffffff",
        width:"100%",
        height:"100%"
    },
    toptext:{
        textAlignVertical:'center',
        textAlign:'center',
        color:"#ffffff",
    },
    topicon:{
        height:35,
        width:35
    },
    iconcontainer:{
        height:"100%",
        justifyContent:'center',
        alignItems:"flex-end",
        paddingRight:20,
    },
    bckicon:{
        position:'absolute',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
        paddingLeft:21
    }
})