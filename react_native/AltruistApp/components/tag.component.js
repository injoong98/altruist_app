import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from '@ui-kitten/components';

const color_array = [
    '#A7D4DE', '#EAB0B3', '#B09BDE'
];
const color_press_array = [
    '#C5F2FC', '#EFBFBF', '#BF9FDF'
];

export default class Tag extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            color : null,
            checked : false,
        }
    }
    
    componentDidMount(){
        var randomNum = Math.floor(Math.random()*(3-0)+0);
        this.setState({color : randomNum});
    }

    render(){
        return(
            <TouchableOpacity style={this.props.style} onPress={this.props.onPress} disabled ={this.props.disabled}>
                <Text style={[styles.defaultStyle, {backgroundColor : (this.state.checked?color_press_array[this.state.color]:color_array[this.state.color])}, this.props.style]} category = 'c2'>
                    {this.props.children}
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    defaultStyle:{
        borderRadius : 20, 
        padding : 4, 
        marginHorizontal : 5,
        textAlignVertical : 'center',
        justifyContent : 'center',
        fontSize : 14,
    }
})


