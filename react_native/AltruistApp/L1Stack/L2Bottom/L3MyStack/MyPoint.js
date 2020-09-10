import React from 'react';
import {View,Dimensions,SafeAreaView} from 'react-native'
import {List,Text,TopNavigation,TopNavigationAction} from '@ui-kitten/components'
import axios from 'axios';
import Backsvg from '../../../assets/icons/back-arrow-color.svg';

// const deviceWidth = Dimensions.get(window).width


const Header=(props)=>(   
    <View style={{width:'100%',flexDirection:'row',paddingVertical:8}}>
        <View style={{width:'33%'}}>
            <Text category="h5">일시</Text>
        </View>    
        <View style={{width:'33%'}}>
            <Text category="h5">내용</Text>
        </View>    
        <View style={{width:'33%'}}>
            <Text category="h5">지급포인트</Text>
        </View>    
    </View> 
)

export class MyPoint extends React.Component{
    constructor(props){
        super(props)
        this.state={
            isLoading:true,
            points: []
        }
    }
    
    BackAction = () =>(
        <TopNavigationAction icon={()=><Backsvg width={26} height={26}/>} onPress={() =>{this.props.navigation.goBack()}}/>
    )
    renderList =({item,index}) =>{
        return(
        <View style={{width:'100%',flexDirection:'row',paddingVertical:8, backgroundColor : index%2 ==0? '#ffffff':'#f4f4f4'}}>
            <View style={{width:'33%'}}><Text category="h6">{item.poi_datetime}</Text></View>    
            <View style={{width:'33%'}}><Text category="h6">{item.poi_content}</Text></View>    
            <View style={{width:'33%'}}><Text category="h6">{item.poi_point}</Text></View>    
        </View>
    )}
    getPointHistory = ()=> {
        axios.get('http://dev.unyict.org/api/mypage/point')
        .then(res=>{
            this.setState({points:res.data.view.data.list,isLoading:false})
            console.log('hi')
            console.log(JSON.stringify(res.data))
        })
        .then(err=>{
            console.log(JSON.stringify(err))
        })
    }
    componentDidMount() {
        this.getPointHistory()
    }
    render(){
        const {points,isLoading} = this.state
        return(
            isLoading ?
            <View>
                <Text>isLoading...</Text>
            </View>
            :
            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="포인트 내역" alignment="center" accessoryLeft={this.BackAction}/>
                <Header />
                <List 
                data={points}
                renderItem={this.renderList}
                />                
            </SafeAreaView>
        )
    }
}