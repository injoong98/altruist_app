import React from 'react';
import {View,SafeAreaView,Text,FlatList,StyleSheet,TouchableOpacity} from 'react-native';
import axios from 'axios';
import { Content } from 'native-base';
import {WriteContentToptab} from '../../components/WriteContentTopBar'
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
                var content='AltQueContent'
                var list ="Alt"
                var list ="AltQueToptab"
                break;
            case '11':
                var content='AltQueContent'
                var list ="Alt"
                var list ="AltOpqQueList"
                break;
         }
        console.log(`list : ${list} + content : ${content}`)
        navigate(list,{screen})
        navigate(content,{post_id})
    }

    readNoti = (item) =>{
        axios.get(`http://dev.unyict.org/api/notification/read/${item.not_id}`)
        .then(res=>{
            if(item.not_type=='comment'){
                console.log(`post_id = ${item.post_id} brd_id = ${item.brd_id}`)
                this.navigateToPost(item.post_id,item.brd_id)
            }
        })
        .catch(err=>{
        })
    }

    renderNotis =({item,index}) => {
        return(
            <TouchableOpacity key={index} style={styles.notiContainer} onPress={()=>{this.readNoti(item)}}>
                <View>
                    <Text>{item.not_message}</Text>
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
            <SafeAreaView style={styles.container}>
                <WriteContentToptab
                text='알림리스트'
                />
                {
                 isLoading?
                 null
                 :
                    <View>
                        <FlatList 
                            data={this.state.noti}
                            renderItem={this.renderNotis}
                            keyExtractor={(item,index)=>index.toString()}
                        />
                    </View>
                }
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#ffffff',
        flex:1
    },
    notiContainer:{
        paddingHorizontal:20,
        paddingVertical:25,
        borderBottomWidth:1

    }
})