import React from 'react';
import {View,SafeAreaView,Text,FlatList,StyleSheet,TouchableOpacity,StatusBar} from 'react-native';
import axios from 'axios';
import {Spinner} from '@ui-kitten/components'
import {MyTabBar} from '../../components/TopTab'
import {PostTime} from '../../components/PostTime'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const { Navigator, Screen } = createMaterialTopTabNavigator();

export class AlarmScreen extends React.Component{

    constructor(props){
        super(props)
        this.state={
            isLoading:true,
            noti:[]
        }
    }

    navigateToPost=(post_id,brd_id)=>{
        const {navigate} =this.props.navigation
        console.log(`brd_id ::: ${brd_id}`)
        switch(brd_id)
         {
            case '1':
                var content='GominContent'
                var list='Commu'
                var screen = 'Gomin'
                break;
            case '2':
                var content='MarketContent'
                var list='Commu'
                var screen='Market'
                break;
            case '3':
                var content='AlbaContent'
                var list='Commu'
                var screen='Alba'
                break;
            case '5':
                var content='IlbanContent'
                var list='Commu'
                var screen='Jau'
                break;
            case '10':
                var content='StckQueContent'
                var list ="Alt"
                var screen ="AltQueToptab"
                break;
            case '11':
                var content='StckQueContent'
                var list ="Alt"
                var screen ="AltOpqQueList"
                break;
         }
        console.log(`list : ${list} + content : ${content}`)
        // navigate(list,{screen})
        navigate(content,{post_id})
    }

    readNoti = (item) =>{
        axios.get(`http://dev.unyict.org/api/notification/read?not_id=${item.not_id}`)
        .then(res=>{
            console.log(item.not_type=='comment')
            if(item.not_type=='comment'){
                console.log(`post_id = ${item.post_id} brd_id = ${item.brd_id}`)
                this.navigateToPost(item.post_id,item.brd_id)
            }
            this.getNotiList()
        })
        .catch(err=>{
        })
    }

    renderNotis =({item,index}) => {
        return(
            <TouchableOpacity 
                key={index} 
                onPress={()=>{this.readNoti(item);}}
                style={[styles.notiContainer,{backgroundColor: item.not_read_datetime == null ? '#f4f4f4' : '#c4c4c4'}]} 
            >
                <View style={{flexDirection:"row",justifyContent:'space-evenly'}}>
                    <View style={{flex:7}}>
                        <Text>{item.not_message}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <PostTime category="p1" style={{fontSize:9, color:'#63579D'}} datetime = {item.not_datetime}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    getNotiList=()=>{
        this.setState({isLoading:true});
        axios.get('http://dev.unyict.org/api/notification')
        .then(res=>{
            this.setState({noti:res.data.view.data.list,isLoading:false})
        })
        .catch(err=>{
        })
    }
    componentDidMount(){
        this.getNotiList();
    }

    render(){
        const {isLoading} = this.state
        return(
            <View  style={styles.container} style={{flex:1}}>
                {
                 isLoading?
                     <Spinner />
                     :
                     <View>
                     <FlatList 
                     data={this.state.noti}
                     renderItem={this.renderNotis}
                     keyExtractor={(item,index)=>index.toString()}
                     style={{backgroundColor:'#ffffff'}}
                     />
                     </View>
                }
            </View>
        )
    }
}
    
  const TabNavigator = () => (
    <Navigator tabBar={props => <MyTabBar {...props} />}>
      <Screen name='AlarmPrivate' component={AlarmScreen} options={ {title:'알람'}}/>
      <Screen name='AlarmOfficail' component={AlarmScreen}  options={{title:'공지사항'}}/>
    </Navigator>
  );
  
export class AlarmToptab extends React.Component{
    
    render(){
        return (
            <SafeAreaView style={{flex:1,}}>
                <TabNavigator/>
            </SafeAreaView>
        );
        } 
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#ffffff',
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    notiContainer:{
        paddingVertical:25,
        borderRadius : 13,
        marginVertical:4.5,
        marginHorizontal:19,
        paddingHorizontal:21
    },
    indicatorStyle:{
         height:0
    },
    tabtext:{
        fontSize:15
    },
    notiocontainer:{


    },
})