import React, { Component } from 'react';
import {StyleSheet,SafeAreaView, View, Image, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity, Dimensions,Linking,} from 'react-native';
import {Card,Layout,Button,Text,TopNavigation,TopNavigationAction,Icon, Divider, Input,List,Spinner, Modal} from '@ui-kitten/components'
import Axios from 'axios';
import HTML from 'react-native-render-html';

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)
const CommentIcon = (props)=>(
    <Icon style={styles.icon} fill='#8F9BB3' name="message-circle"/>
)
const HeartIcon = (props)=>(
    <Icon style={styles.icon} fill='#8F9BB3' name="heart"/>
)
const StarIcon = (props)=>(
    <Icon style={styles.icon} fill='#8F9BB3' name="star" {...props} />
)

const defaultContent = ({navigation}) =>{
    
    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )
    
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} /> 
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text>글본문입니다</Text>
        </Layout>   
    </SafeAreaView>
    )
}

class GominContent extends React.Component{
    constructor(props){
        super(props);
        this.state={
            post:'',
            comment:'',
            value:'',
            isLoading:true,
            refreshing:false
        }
    }
    
    UproadIcon = (props) => (
        <TouchableWithoutFeedback>
          <Icon {...props} name='arrow-circle-up'/>
        </TouchableWithoutFeedback>
    )

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    )
    renderPostBody = (post)=>{
        
        const regex = /(<([^>]+)>)|&nbsp;/ig;
        const post_remove_tags = post.post_content.replace(regex, '\n');
        return (
            <View >
                <View style={{paddingLeft:15}}>
                    <Text style={{marginBottom:10}} category="h5">{post.post_title}</Text>
                    <Divider/>
                </View>
                <View style={{paddingLeft:10}}>
                    <View style={{display:"flex",paddingVertical:5,flexDirection:"row"}}>
                        <StarIcon /><Text>{`${post.display_name} | ${post.post_datetime}`} </Text>
                    </View>
                    <Divider/>
                </View>
                <View style={{padding:10}}>
                    <Text category="h6">
                    {post_remove_tags}
                    </Text>
                </View>
                <View style={{paddingRight:10,paddingVertical:5,display:"flex",flexDirection:"row",justifyContent:"flex-end"}}>
                    <HeartIcon />
                    <Text>{post.post_like}</Text>
                    <CommentIcon />
                    <Text>{post.post_comment_count}</Text>
                </View>
            </View>
        )
    }

    renderCommentsList=({item,index})=>(
        <Card>
            <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                <View style={{flexDirection:"row"}}>
                <StarIcon />
                <Text category="s2">{item.cmt_nickname}</Text>
                </View>
                <HeartIcon onPress={()=>{alert('좋아요누르겠습니다.')}} />
            </View>
            <View style={{padding:5}}>
                <Text category="s1">{item.content}</Text>
            </View>
            <View style={{display:"flex", justifyContent:"flex-start",flexDirection:"row",alignItems:"center"}}>
                <Text category="s2">{item.cmt_datetime}</Text>
                <HeartIcon style ={{width:10,heigth:10}} />
                <Text>{item.cmt_like}</Text>
            </View>
        </Card>
    )
    getCommentData = async (post_id)=>{
        await Axios.get(`http://10.0.2.2/api/comment_list/lists/${post_id}`)
        .then((response)=>{
            this.setState({comment:response.data.view.data.list})
        })
        .catch((error)=>{
            alert('error')
        })
    }
    getPostData = async (post_id)=>{
        await Axios.get(`http://10.0.2.2/api/board_post/post/${post_id}`)
        .then((response)=>{
            this.setState({post:response.data.view.post})
        })
        .catch((error)=>{
            alert('error')
        })
    }
    async componentDidMount(){
        const {post_id} = this.props.route.params
        await this.getPostData(post_id)
        .then(()=>this.getCommentData(post_id))
        .then(()=>{this.setState({isLoading:false})})

    }
     onRefresh=()=>{
        const {post_id} = this.props.route.params
        this.getCommentData(post_id)

    }

     render(){
        const {navigation,route} =this.props
        const {value,post,comment} = this.state
         return(
        this.state.isLoading ?
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text>is Loading now...</Text>
            <Spinner size="giant"/>
        </View>
        :
         <SafeAreaView style={{flex:1}}>
             <TopNavigation title="고민있어요" alignment="center" accessoryLeft={this.BackAction} /> 
             <Layout  style={{flex:1}}>
                <Layout style={{flex:8}}>
                    <Divider/>
                    <List 
                    data={comment}
                    ListHeaderComponent={this.renderPostBody(post)}
                    renderItem={this.renderCommentsList}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                    />
                </Layout>
                 <Layout level="2"  style={{flex:1}}>
                    <Layout style={styles.commentBlock}>
                        <Input
                            style={{flex:1, margin:15}}
                            size='large'
                            placeholder='댓글을 입력하세요.'
                            value={value}
                            multiline={true}
                            accessoryRight={this.UproadIcon}
                            onChangeText={nextValue => setValue(nextValue)}
                        />
                    </Layout>
                 </Layout>
               
             </Layout>
             
         </SafeAreaView>
         )
     }
}

class MarketContent extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={
            post : {} ,
            image : '/react_native/AltruistApp/assets/images/noimage_120x90.gif',
            isLoading : true,
            comment : '',
        }
    }

    async componentDidMount(){
        const post_id = this.props.route.params;
        await this.getPostData(post_id)
        .then(()=>{this.setState({isLoading:false})})
    }

    getPostData = async(post_id)=>{
        await Axios.get(`http://10.0.2.2/api/board_post/post/${post_id}`)
        .then((response)=>{
            this.setState({post:response.data.view.post})
            if (response.data.view.file_image){
                this.setState({image: response.data.view.file_image.shift().origin_image_url});
            }
        })
        .catch((error)=>{
            alert(error)
        })
    }

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    )

    UproadIcon = (props) => (
        <TouchableWithoutFeedback>
          <Icon {...props} name='arrow-circle-up'/>
        </TouchableWithoutFeedback>
    )

    render(){
        const {post} = this.state;
        return(
            <SafeAreaView style={{flex:1}}>
        
                <TopNavigation title="수수마켓" alignment="center" accessoryLeft={this.BackAction} />
        
                <KeyboardAvoidingView behavior={'height'} style={{flex:1}}>
                    <ScrollView>
                    <View style={{height:394}}>
                        <Image source={{uri : post.image}} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
                    </View>
                    <View style={{}}>
                        <Layout>
                        <Text category='h2'>{post.post_title}</Text>
                        </Layout>
                        <Layout>
                        <Text category='h4'>{post.deal_price}</Text>
                        </Layout>
                    </View>
                    <Divider/>
                    <Layout style={{height:50,flexDirection:'row'}}>
                        <Layout style={{width:50}}>
                        <Image source={require('../market/asset/basic_user.png')} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
                        </Layout>
                        <Layout style={{justifyContent:'center'}}>
                        <Text>{post.post_username}</Text>
                        </Layout>
                    </Layout>
                    <Divider/>
                    <Layout style={{height:200}}>
                        <Text>Details</Text>
                        <Text> Place : {post.post_place}</Text>
                    </Layout>
                    <Divider/>
                    <Layout>
                        <Text>Comment</Text>
                            <Input
                                style={{flex:1, margin:15}}
                                size='large'
                                placeholder='댓글을 입력하세요.'
                                value={this.state.comment}
                                multiline={true}
                                accessoryRight={this.UproadIcon}
                                onChangeText={nextValue => this.setState({comment : nextValue})}
                            />
                        <Layout style={{alignItems: "flex-end", marginHorizontal:20, marginBottom:20}}>
                        </Layout>
                    </Layout>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        
            )
    }

}



class AlbaContent extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            visible : false,
            post : {} ,
            image : '/react_native/AltruistApp/assets/images/noimage_120x90.gif',
            phoneNumber : '01099999999',
            isLoading : true,
            image_height : 0,
        }
    }

    async componentDidMount(){
        const post_id = this.props.route.params;
        console.log(post_id);
        await this.getPostData(post_id)
        .then(()=>{this.setState({isLoading:false})})
    }

    getPostData = async(post_id)=>{
        await Axios.get(`http://10.0.2.2/api/board_post/post/${post_id}`)
        .then((response)=>{
            this.setState({post:response.data.view.post})
            if (response.data.view.file_image){
                this.setState({image: response.data.view.file_image.shift().origin_image_url});
            }
        })
        .catch((error)=>{
            alert(error)
        })
    }
    
    setVisible(bool){
        this.setState({visible : bool});
    }

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    )

    // getImageSize (uri, passProps) {
    //     const img_url = "http://10.0.2.2"+uri;
    //     const imagesMaxWidth = Dimensions.get('window').width;
    //     Image.getSize(img_url,(originalWidth, originalHeight) => {
    //             const optimalWidth = imagesMaxWidth <= originalWidth ? imagesMaxWidth : originalWidth;
    //             const optimalHeight = (optimalWidth * originalHeight) / originalWidth;
    //             this.setState({image_height:optimalHeight});
    //             console.log(this.state.image_height, optimalHeight);
    //         }
    //     );
    //     return <Image key={passProps.key} style={{width : '100%', height : this.state.image_height, resizeMode: 'contain'}} source={{ uri:img_url }}/>;
    // }

    render(){
        const {post} = this.state;
        // const defaultRenderer ={
        //     renderers:{
        //         img : (htmlAttribs, children, convertedCSSStyles, passProps) => this.img_return(htmlAttribs, passProps)
        //     }
        // }
        console.log(post.post_content);
        return(
            this.state.isLoading?
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text>is Loading now...</Text>
                <Spinner size="giant"/>
            </View>
            :
            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="채용정보" alignment="center" accessoryLeft={this.BackAction} /> 
                <Layout style={styles.container}>
                    <ScrollView style={{backgroundColor : 'lightgrey'}}>
                        <Card style={styles.item}>
                            <Text>{post.post_datetime}</Text>
                            <Text category='h3'>{post.post_title}</Text>
                            <Layout style={{flexDirection:'row', marginBottom : 5}}>
                                <View style={{width : 100, height : 50, borderRightWidth : 0.3, justifyContent : 'center', alignItems : 'center'}}>
                                    <Image style={{flex:1, width : '100%', resizeMode:'contain'}} source={{uri:'http://10.0.2.2'+this.state.image}}/>
                                </View>
                                <Text style={{margin : 15}}>{post.post_nickname}</Text>
                            </Layout>
                            <Divider style={{borderWidth : 0.3}}/>
                            <Layout style={{flexDirection:'row', marginTop:10}}>
                                <View style={styles.icons}>
                                <Icon
                                    style={{width:32,height:32}}
                                    fill='black'
                                    name='star'
                                />
                                <Text>post.alba_salary</Text>
                                </View>
                                <View style={styles.icons}>
                                <Icon
                                    style={{width:32,height:32}}
                                    fill='black'
                                    name='eye'
                                />
                                <Text>post.alba_type</Text>
                                </View>
                                <View style={{flex : 2, justifyContent : 'center', alignItems : 'center'}}>
                                <Icon
                                    style={{width:32,height:32}}
                                    fill='black'
                                    name='share-outline'
                                />
                                <Text>post.post_location</Text>
                                </View>
                            </Layout>
                        </Card>
                        
                        <Card style={styles.item}>
                            <Text style={styles.subhead}>근무지역</Text>
                            <Text style={{margin : 5}}>post.post_location</Text>
                        </Card>
                        <Card style={styles.item}>
                            <Text style={styles.subhead}>근무조건</Text>
                            <Layout style = {{flexDirection : 'row'}}>
                                <View style={{flex : 1, marginLeft : 5}}>
                                    <Text style={styles.gathertext}>급여</Text>
                                </View>
                                <View style={{flex : 5}}>
                                    <Text style={styles.gather}>post.alba_salary_type post.alba_salary</Text>
                                </View>
                            </Layout>
                            <Layout style = {{flexDirection : 'row'}}>
                                <View style={{flex : 1, marginLeft : 5}}>
                                    <Text style={styles.gathertext}>근무기간</Text>
                                </View>
                                <View style={{flex : 5}}>
                                    <Text style={styles.gather}>post.alba_type</Text>
                                </View>
                            </Layout>
                        </Card>
                        <Card>    
                            <HTML
                                html = {post.post_content}
                                imagesMaxWidth={Dimensions.get('window').width}
                                imagesInitialDimensions={{width:400, height : 400}}
                                />
                        </Card>
                    </ScrollView>
                    <View style={styles.bottom}>
                        <Button style={{width : '100%'}} onPress={()=>this.setVisible(true)}>
                            지원하기
                        </Button>
                        <Modal
                            visible={this.state.visible}
                            backdropStyle={{backgroundColor:'rgba(0, 0, 0, 0.5)'}}
                            onBackdropPress={() => this.setVisible(false)}>
                                <Card disabled={true}>
                                    <Layout style={{flexDirection:'row'}}>
                                        <View style={styles.modal_icons}>
                                            <Button
                                                appearance='ghost'
                                                accessoryLeft={HeartIcon}
                                                onPress={()=>{Linking.openURL(`tel:${this.state.phoneNumber}`)}}/>
                                            <Text>전화</Text>
                                        </View>
                                            <View style={styles.modal_icons}>
                                            <Button
                                                appearance='ghost'
                                                accessoryLeft={CommentIcon}
                                                onPress={()=>{Linking.openURL(`sms:${this.state.phoneNumber}`)}}/>
                                            <Text>메시지</Text>
                                        </View>
                                        <View style={styles.modal_icons}>
                                        <Button
                                                appearance='ghost'
                                                accessoryLeft={HeartIcon}
                                                onPress={()=>{Linking.openURL(`mailto:${post.post_email}`)}}/>
                                            <Text>이메일</Text>
                                        </View>
                                    </Layout>
                                    <Button onPress={()=>this.setVisible(false)} appearance='ghost' >
                                        취소
                                    </Button>
                                </Card>
                        </Modal>
                    </View>
                </Layout>
            </SafeAreaView>
            )
    }
}

const styles = StyleSheet.create({
    commentBlock: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginVertical:10,
    },
    container : {
        flex : 1,
    },
    icons : {
        justifyContent: 'center', 
        alignItems: 'center',
        flex : 1,
    },
    modal_icons : {
        justifyContent: 'center', 
        alignItems: 'center',
        margin : 10,
    },
    item : {
        marginVertical : 5,
        paddingVertical : 10,
        paddingHorizontal : 10,
    },
    subhead : {
        fontSize : 16,
        fontWeight:'bold',
        margin : 5,
    },
    gathertext : {
        color : 'gray',
        marginVertical : 5,
    },
    gather :{
        marginVertical : 5,
    },
    bottom: {
        width: '100%', 
        height: 50, 
        justifyContent: 'center', 
        alignItems: 'center',
    },icon:{
        width: 20,height: 20
    }
});


export {defaultContent, MarketContent, AlbaContent, GominContent}