import React from 'react';
import {View,StyleSheet,TouchableOpacity} from 'react-native';
import {Text,Icon} from '@ui-kitten/components'

const BellIcon =(props)=> (
    <Icon {...props} fill='#B09BDE' name="bell"/>
)
const BackIcon =(props)=> (
    <Icon {...props} fill='#ffffff' name="arrow-ios-back-outline"/>
)

export class TopBarTune extends React.Component {
    constructor(props){
        super(props)
        
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.leftside}>
                    <View style={styles.leftinner}>
                        <Text category='h2' style={styles.toptext}>{this.props.text}</Text>
                    </View>
                    <TouchableOpacity onPress={this.props.gbckfunc} style={this.props.gbckuse? styles.bckicon:{display:'none'}}>
                        <BackIcon style={{width:35,height:35}}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.rightside}>
                    <View style={styles.rightinner}>
                        <View style={styles.iconcontainer}>
                            <TouchableOpacity onPress={this.props.func}>
                                <BellIcon style={styles.topicon}/>
                            </TouchableOpacity>
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
        height:40,
        width:40
    },
    iconcontainer:{
        height:"100%",
        justifyContent:'center',
        alignItems:"flex-end",
        paddingRight:20
    },
    bckicon:{
        position:'absolute',
        top:5,
        width:35,height:35
    }
})