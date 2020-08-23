import React from 'react';
import {View,StyleSheet,TouchableOpacity} from 'react-native';
import {Text,Icon} from '@ui-kitten/components'

const BellIcon =(props)=> (
    <Icon {...props} fill='#B09BDE' name="bell"/>
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
                        <Text category='h5' style={styles.toptext}>{this.props.text}</Text>
                    </View>
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
        height:50,
        display:'flex',
        flexDirection:'row'
    },
    leftside:{
        backgroundColor:"#ffffff",
        width:"55%",
        height:"100%"
    },
    leftinner:{
        borderBottomRightRadius:16,
        backgroundColor:"#B09BDE",
        width:"100%",
        height:"100%"
    },  
    rightside:{
        backgroundColor:"#B09BDE",
        width:"45%",
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
        color:"#ffffff"
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
    }
})