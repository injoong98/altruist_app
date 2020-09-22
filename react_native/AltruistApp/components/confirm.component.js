import React from 'react';
import {View,TouchableOpacity} from 'react-native';
import {Text} from '@ui-kitten/components'

export default class Confirm extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            type : this.props.type,    // 
        }
    }

    render(){
        return(
                <View style ={{width:200,height:175,borderRadius:23,backgroundColor:'#ffffff'}}>
                    <View style={{flex:3 ,justifyContent:'center',alignItems:'center'}}>
                        <Text category='h1' style={{color:'#63579D',fontSize:13, margin:5}}>
                            {this.props.confirmText}
                        </Text>   
                    </View>
                    <View style={{flex:1,display:'flex',flexDirection:'row',alignItems:'center'}}>
                        <TouchableOpacity 
                            onPress={this.props.OnFrstPress}
                            style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#63579D',fontSize:13,fontWeight:'400'}}>
                                {this.props.frstText}
                            </Text>
                        </TouchableOpacity>
                        {this.state.type != 'result'?
                        <>
                            <View style={{borderWidth:1,height:'80%',borderColor:"#F0F0F0"}}></View>
                            <TouchableOpacity 
                                onPress={this.props.OnScndPress}
                                style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontWeight:'400',color:'#63579D',fontSize:13}}>
                                    {this.props.scndText}
                                </Text>
                            </TouchableOpacity>
                        </>
                        :null}
                    </View>
                </View>
        )
    }
}
