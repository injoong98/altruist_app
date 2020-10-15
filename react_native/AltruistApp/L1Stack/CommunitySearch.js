import React,{useState} from 'react';
import {SafeAreaView, View, TextInput, StyleSheet,TouchableHighlight} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, Radio, CheckBox, Card } from '@ui-kitten/components'
import {WriteContentToptab} from '../components/WriteContentTopBar';


const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)


class CommunitySearch extends React.Component{
    constructor(props){
        super(props)
    }
    
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )

    render(){ 
        return(
            <SafeAreaView style={{flex: 1}}>
                <WriteContentToptab
                text="수수마켓"
                right='upload'
                gbckfunc={() => {this.props.navigation.goBack()}}
                gbckuse={true}
                />
                <Text>커뮤니티 검색화면</Text>
            </SafeAreaView>
        )
    }
}


export default CommunitySearch;