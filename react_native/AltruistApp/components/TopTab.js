import React from 'react';
import {View,StyleSheet} from 'react-native';
import {Text} from '@ui-kitten/components';

export class TopTab extends React.Component{

    constructor(props){
        super(props)
    }
    render(){
        var {thisindex,selected,abovectgry,abovetext,belowctgry,belowtext} = this.props
        return(
        <View style={styles.tabcontainer}>
            <Text style={thisindex==selected ?styles.borderselected : styles.border} category={abovectgry}>{abovetext}</Text>
            <Text style={thisindex==selected ?styles.borderselected : styles.border} category={belowctgry}>{belowtext}</Text>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    tabcontainer:{
        paddingBottom:18,
        paddingTop:16
    },
    border :{
        lineHeight:20,
        color:"#B09BDE",
        textAlignVertical:'bottom',
        padding:0,
        // borderWidth:1,
        // borderStyle:'solid',
        // borderColor:'blue',
    },
    borderselected :{
        lineHeight:20,
        color:"#35367B",
        textAlignVertical:'bottom',
        padding:0,
        // borderWidth:1,
        // borderStyle:'solid',
        // borderColor:'blue',
    }
}) 