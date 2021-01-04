import React from 'react';
import {View,TouchableOpacity} from 'react-native';
import {Text,Modal} from '@ui-kitten/components';

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

const ModalButton = ({text,func}) =>{
    return(
        <TouchableOpacity 
            onPress={func}
            style={{flex:1,justifyContent:'center',alignItems:'center',height:'100%'}}>
            <Text style={{color:'#63579D',fontSize:13,fontWeight:'400'}}>
                {text}
            </Text>
        </TouchableOpacity>
    )
}

export class ResultModal extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            type : this.props.type, 
            buttons:[],
        }
    }
    componentDidMount(){
        }
    render(){
        const regex = /(<([^>]+)>)|&nbsp;/ig;
        const modalText =this.props.modalText.replace(regex, '');
        const buttons = this.state.buttons.concat(this.props.buttons);
        const {modalVisible,onBackdropPress} = this.props
        return(
            <Modal
                visible={modalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={onBackdropPress}>
                    <View style ={{width:200,height:175,borderRadius:23,backgroundColor:'#ffffff'}}>
                        <View style={{flex:3 ,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#63579D',fontSize:15, margin:5,textAlign:'center',lineHeight:22}}>
                                {modalText}
                            </Text>   
                        </View>
                        <View style={{borderWidth:1,borderColor:'#F0F0F0',width:'90%',marginHorizontal:'5%'}}></View>
                        <View style={{flex:1,display:'flex',flexDirection:'row',alignItems:'center'}}>
                            {
                                buttons.map((item,index)=>{
                                    return (
                                        <>
                                        {index !=0 ? 
                                        <View style={{borderWidth:1,height:'80%',borderColor:"#F0F0F0"}}></View>
                                        : null
                                        }
                                        <ModalButton
                                            text={item.text?item.text:null}
                                            func={item.onPress?item.onPress:null}
                                        />
                                        </>            
                                    )
                                })
                            }
                        </View>
                    </View>
            </Modal>
        )
    }
}