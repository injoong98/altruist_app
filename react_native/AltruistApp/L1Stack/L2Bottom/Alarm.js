import React from 'react';
import {View,SafeAreaView,Text,List} from 'react-native';
import axios from 'axios';

export class AlarmScreen extends React.Component{

    constructor(props){
        super(props)
        this.state={
            noti=[]
        }
    }

    getAlarmiList=()=>{
        
    }
    componentDidMount(){
        
    }

    render(){
        return(
            <SafeAreaView>
                <List 
                    data={this.state}
                />
            </SafeAreaView>
        )
    }
}