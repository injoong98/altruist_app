import React,{useState} from 'react';
import {SafeAreaView, View, Image, TextInput, StyleSheet,TouchableOpacity, AsyncStorage, Keyboard} from 'react-native'
import {Layout,Text,Icon, TopNavigationAction, Modal, List, Spinner } from '@ui-kitten/components'
import {WriteContentToptab} from '../components/WriteContentTopBar';
import Axios from 'axios';
import Backsvg from '../assets/icons/back-arrow-color.svg';
import Searchsvg from '../assets/icons/search-outline.svg';
import { PostTime } from '../components/PostTime';
import Heartsvg from '../assets/icons/heart.svg'
import Viewsvg from '../assets/icons/view.svg'
import Commentsvg from '../assets/icons/comment.svg'

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
            spinnerVisible : false,
            current_category : 0,
            current_page : 1,
        }
    }

	category = ['전체', '이타게시판', '고민있어요', '수수마켓', '알바천일국'];

    navigateToContent= (brd_id,post_id) =>{
        var brd = brd_id == 1 ? 'GominContent' : brd_id == 2 ? 'MarketContent': brd_id == 3 ?'AlbaContent': 'IlbanContent' 
        this.props.navigation.navigate(brd,{post_id:post_id, OnGoback:() =>this.onRefresh()})
    }
    componentDidMount = () =>  {
        // this.getSearch();
    }

    getSearch = async() => {
        const {skeyword, current_category} = this.state;
        await Axios.get(`https://dev.unyict.org/api/search?group_id=${current_category}&sfield=post_both&skeyword=${skeyword}`)
        .then((response) =>{
            const {status, message} = response;
            if(status=='200'){
                this.setState({lists:response.data.view.data.list, isLoading:false, spinnerVisible:false});
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

    brdNm = (brd_id)=>{
        var brd = brd_id == 1 ? '고민게시판' : brd_id == 2 ? '수수마켓': brd_id == 3 ?'알바천일국': '이타게시판'  
        return brd
    }

    renderItem = ({item}) => (
        <TouchableOpacity style={styles.item} onPress={() => {this.navigateToContent(item.brd_id,item.post_id)}}>
            {item.images?
            <View style={{width:80, justifyContent:'center', alignItems:'center'}}>
                <Image 
                  source={{uri : `https://dev.unyict.org/uploads/post/${item.images.pfi_filename}`}} 
                  style={{width:70, height:70, resizeMode:'cover', borderRadius:10}}
                />
            </View>:null}
            <View style={{flex:1}}>
                <View style={{flex:1, padding:5}}>
                    <View style={{flexDirection:'row', justifyContent : 'space-between', marginHorizontal : 4}}>
                        <Text category="s2" style={{fontWeight:'bold',marginRight:5}}>{ this.brdNm(item.brd_id)}</Text>
                        <PostTime datetime = {item.post_datetime}/>
                    </View>
                    <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail" category='h4'>
                        {item.post_title}
                    </Text>
                    <View style={styles.textBottom}>
                        <Text style={{...styles.text, color:'#878787', fontSize:10}} numberOfLines={2} ellipsizeMode="tail" category='h4'>
                            {item.post_content}
                        </Text>
                    </View>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <View>
                        {/* <PostTime style={{alignItems:'center', marginLeft : 5}}datetime = {item.post_datetime}/> */}
                    </View>
                    <View style={styles.infocontainer}>
                        <View style={{alignItems:'center',}}>
                            <Heartsvg width={10} height={10}/>
                            <Text style={styles.infotext} category="c1">{item.post_like}</Text>
                        </View>
                        <View style={{alignItems:'center',}}>
                            <Commentsvg width={10} height={10}/>
                            <Text style={styles.infotext} category="c1">{item.post_comment_count}</Text>
                        </View>
                        <View style={{alignItems:'center',}}>
                            <Viewsvg width={10} height={10}/>
                            <Text style={styles.infotext} category="c1">{item.post_hit}</Text>
                        </View>
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
        const {isLoading, spinnerVisible, current_category} = this.state;
        return(
            <SafeAreaView style={{flex: 1, backgroundColor : '#FFFFFF'}}>
                <Layout style={{backgroundColor:'#ffffff',height:49, flexDirection:'row', }}>
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                            <Backsvg width={25} height={25}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:7, margin : 5, borderColor: '#A897C2', marginRight : 10}}>
                        <TextInput 
                            style={styles.titleInput} 
                            value={this.state.skeyword} 
                            onChangeText={(text) =>{this.setState({skeyword:text})}}
                            placeholder="글 제목, 내용 등 검색어를 입력하세요"
                            placeholderTextColor='#A897C2'
                            onSubmitEditing={()=>{this.setState({spinnerVisible:true}, this.getSearch)}}
                        />
                        <TouchableOpacity 
                            style={{position:"absolute",right:5,top:6}}
                            onPress={()=>{this.setState({spinnerVisible:true},Keyboard.dismiss());this.getSearch();}}>
                            <Searchsvg height={25} width={25} fill='#A9C' />
                        </TouchableOpacity>
                    </View>
                </Layout>
				<View style={{flexDirection:'row', marginHorizontal : 20, marginVertical: 4,backgroundColor:'#B09BDE', borderRadius:10}}>
					{this.category.map((str,index) => (
					<TouchableOpacity 
						key={index}
						style={{alignItems:'center', justifyContent:'center', marginHorizontal:5}}
                        // onPress={async()=>{this.setState({current_category:index, current_page:1},this.getPostFirst)}}
                        >
						<Text category='h6' key={index} style={{color:(current_category==index?'white':'#543D78')}}> {'#'+str} </Text>
					</TouchableOpacity>))}
				</View>
                <View style={{flex : 1}}>
                    {isLoading?
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            <Searchsvg height={100} width={100} fill='#A9C' />
                            <Text category = 'h1' style = {{margin : 20}}>게시판의 글을 검색해보세요</Text>
                        </View>
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
                    <Modal
                        visible={spinnerVisible}>
                        <View style={{backgroundColor: 'rgba(0,0,0,0.7)', width : 100, height :100, borderRadius:20, justifyContent: 'center', alignItems:'center'}}>
                            <Spinner size="giant" />
                        </View>
                    </Modal>
                </View>
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
    infocontainer:{
        display:"flex",flexDirection:"row",justifyContent:'space-evenly',
        borderTopLeftRadius:20,
        width:100,
        backgroundColor:"#ffffff",
        position:"relative",bottom:0,right:0,
    },
  });

export default CommunitySearch;