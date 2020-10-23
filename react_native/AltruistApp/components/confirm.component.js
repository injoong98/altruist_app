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
        const regex = /(<([^>]+)>)|&nbsp;/ig;
        const confirmText_remove_tags =this.props.confirmText.replace(regex, '');
        
        return(
                <View style ={{width:200,height:175,borderRadius:23,backgroundColor:'#ffffff'}}>
                    <View style={{flex:3 ,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#63579D',fontSize:15, margin:5,textAlign:'center',lineHeight:22}}>
                            {confirmText_remove_tags}
                        </Text>   
                    </View>
                    <View style={{borderWidth:1,borderColor:'#F0F0F0',width:'90%',marginHorizontal:'5%'}}></View>
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
