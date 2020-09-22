import React from 'react';
import {View,StyleSheet,TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {Text,Icon,Button} from '@ui-kitten/components'
import BellLargesvg from '../assets/icons/bell-large.svg'
import Uploadsvg from '../assets/icons/upload.svg'
import Backsvg from '../assets/icons/back-arrow-white.svg'

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
                                        수정
                                    </Button>
                                : null}
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
        position:'absolute'
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
        textAlignVertical:'center',
        textAlign:'center',
        height:"100%",
        color:"#ffffff",
        // borderColor:'blue',
        // borderStyle:'solid',
        // borderWidth:1
    },
    topicon:{
        height:35,
        width:35
    },
    iconcontainer:{
        height:"100%",
        justifyContent:'center',
        alignItems:"flex-end",
        paddingRight:20
    },
    bckicon:{
        position:'absolute',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
        paddingLeft:21
    }
})