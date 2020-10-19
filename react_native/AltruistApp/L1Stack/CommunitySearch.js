import React,{useState} from 'react';
import {SafeAreaView, View, Image, TextInput, StyleSheet,TouchableOpacity, AsyncStorage, Keyboard} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, Radio, CheckBox, Card, List } from '@ui-kitten/components'
import {WriteContentToptab} from '../components/WriteContentTopBar';
import Axios from 'axios';
import Backsvg from '../assets/icons/back-arrow-color.svg';
import Searchsvg from '../assets/icons/search-outline.svg';
const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)


class CommunitySearch extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            skeyword : '',
            lists : [],
            refreshing : false,
            isLoading : true,
        }
    }

    navigateToContent= (brd_id,post_id) =>{
        var brd = brd_id == 1 ? 'GominContent' : brd_id == 2 ? 'MarketContent': brd_id == 3 ?'AlbaContent': 'IlbanContent' 
        this.props.navigation.navigate(brd,{post_id:post_id, OnGoback:() =>this.onRefresh()})
    }
    componentDidMount = () =>  {
        // this.getSearch();
    }

    getSearch = async() => {
        const {skeyword} = this.state;
        await Axios.get(`https://dev.unyict.org/api/search?skeyword=${skeyword}`)
        .then((response) =>{
            const {status, message} = response;
            if(status=='200'){
                this.setState({lists:response.data.view.data.list, isLoading:false});
            }
            else{
                alert(message);
            }
        })
        .catch((err)=>{
            alert(err);
        })
    }

    load_more_data = () => {
        if(this.state.total_rows < 20){
        this.setState({isNoMoreData:true});
            }
        else if(!this.state.isNoMoreData){
          this.setState({
          current_page : this.state.current_page + 1,
          isListLoading : true},
          this.getPostList, console.log(this.state.current_page))
        }
    }

    onRefresh= () =>{
        this.getSearch();
    }

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )


    renderItem = ({item}) => (
        <TouchableOpacity style={styles.item} onPress={() => {this.navigateToContent(item.brd_id,item.post_id)}}>
            {item.images?<View style={{width:70, justifyContent:'center', alignItems:'center'}}>
                <Image 
                  source={{uri : `https://dev.unyict.org/uploads/post/${item.images.pfi_filename}`}} 
                  style={{width:60, height:60, resizeMode:'cover', borderRadius:10}}
                />
            </View>:null}
            <View style={styles.textArea}>
                <View style={{flex:1, paddingHorizontal:5}}>
                    <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail" category='h4'>
                        {item.post_title}
                    </Text>
                    <View style={styles.textBottom}>
                        <Text style={{...styles.text, color:'#878787', fontSize:10}} numberOfLines={3} ellipsizeMode="tail" category='h4'>
                            {item.post_content}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    renderFooter=()=>{
        return(
          this.state.isListLoading ?
          <View style = {styles.loader}>
            <ActivityIndicator size='large'/>
          </View>:null
        )
    }

    render(){ 
        const {isLoading} = this.state;
        return(
            <SafeAreaView style={{flex: 1, backgroundColor : '#FFFFFF'}}>
                <View style={{backgroundColor:'#ffffff',height:49, flexDirection:'row'}}>
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                                <Backsvg width={25} height={25}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:5, margin : 5, borderColor: '#A897C2'}}>
                        <TextInput 
                            style={styles.titleInput} 
                            value={this.state.skeyword} 
                            onChangeText={(text) =>{this.setState({skeyword:text})}}
                            placeholder="검색어를 입력하세요"
                            placeholderTextColor='#A897C2'
                        />
                        <TouchableOpacity 
                            style={{position:"absolute",right:5,top:6}}
                            onPress={()=>{Keyboard.dismiss();this.getSearch();}}>
                            <Searchsvg height={25} width={25} fill='#A9C' />
                        </TouchableOpacity>
                    </View>
                </View>
                {isLoading?
                <Text category = 'h4' style = {{margin : 20}}>검색어를 입력하세요</Text>
                :<List
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                    data={this.state.lists}
                    renderItem={this.renderItem}
                    refreshing={this.state.refreshing}
                    // onEndReached={this.load_more_data}
                    // onEndReachedThreshold = {0.9}
                    ListFooterComponent={this.renderFooter}
                    onRefresh={this.onRefresh}
                />}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    contentContainer: {
        paddingHorizontal: 15,
        paddingVertical: 4,
    },
    item: {
        flex:1, 
        flexDirection:'row',
        margin:5,
        backgroundColor:'#F4F4F4',
        borderRadius:10,
    },
    textArea: {
        flex: 1,
        paddingVertical: 7,
        paddingRight: 5,
        paddingLeft: 0,
    },
    textTop: {
        flex:1,
        backgroundColor:'#FFFFFF',
        borderRadius:10,
        justifyContent: 'center',
        marginTop:5
    },
    loader:{
        marginTop : 10,
        alignItems : 'center',
    },
    text: {
        margin: 4,
    },
    titleInput :{
        width:'100%',
        paddingVertical:9,
        paddingLeft:15,
        backgroundColor:'#ffffff',
        borderRadius:7,
        borderColor:"#AC95C5",
        borderWidth:2,
        fontSize:12,
        height:40,
        minWidth:'80%'
    },
  });

export default CommunitySearch;