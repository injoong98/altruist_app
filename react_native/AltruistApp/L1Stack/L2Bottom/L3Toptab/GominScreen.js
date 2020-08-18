import React from 'react';
import {SafeAreaView,View,StyleSheet} from 'react-native';
import { Icon,Layout,Button,Text,ListItem,List, Divider,Card,Spinner} from '@ui-kitten/components'
import axios from 'axios'


    const  EyeIcon = (props)=>(
        <Icon style={styles.icon} fill='#8F9BB3' name="eye"/>
    )
    const CommentIcon = (props)=>(
        <Icon style={styles.icon} fill='#8F9BB3' name="message-circle"/>
    )
    const HeartIcon = (props)=>(
        <Icon style={styles.icon} fill='#8F9BB3' name="heart"/>
    )

class GominScreen extends React.Component {
    
    constructor(props) {
        super(props);
        this.state={
            isLoading : true,
            lists:'',
            refreshing:false,
            dump:'true'
        }
    }

    
    
    renderItem = ({ item, index }) => (
        <Card onPress = {()=>{this.props.navigation.navigate('GominContent',{title:`${index+1}th post_id=${item.post_id}`,post_id:item.post_id})}}>
            <Text category="h6" numberOfLines={1} ellipsizeMode="tail">{item.post_title}</Text>
            <View style={styles.subtitle}>
                <Text category="s1">{item.display_name}</Text>
                <View style={styles.infocontainer}>
                    <EyeIcon />
                    <Text category="s1">{item.post_hit}</Text>
                    <HeartIcon />
                    <Text category="s1">{item.post_like}</Text>
                    <CommentIcon />
                    <Text category="s1">{item.post_comment_count}</Text>
                </View>

            </View>
        </Card>

    );
    getPostList = async() =>{
        await axios.get('http://10.0.2.2/api/board_post/lists/b-a-1')
        .then((response)=>{
            this.setState({lists:response.data.view.list.data.list,isLoading:false})
        })
        .catch((error)=>{
            alert(`error: ${error.message}`)
        })
    }
    componentDidMount(){
        this.getPostList();
    }
    
    onRefresh= () =>{
        this.getPostList();
    }
    statefunction=(str)=>{
        this.setState({isLoading:true});
        this.componentDidMount()    }

    render(){
        return(
        this.state.isLoading ? 
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text>
                <Spinner size="giant" />
            </Text>
        </View>:
        <SafeAreaView style={{flex:1}}>
            <List
            data ={this.state.lists}
            ItemSeparatorComponent={Divider}
            renderItem={this.renderItem} 
            onRefresh={this.onRefresh}
            refreshing={this.state.refreshing}/>
            <View style ={styles.buttoncontainer}>
                <Button style={{width:"100%"}} onPress={()=>{this.props.navigation.navigate('GominWrite',{statefunction:this.statefunction})}} >
                    글쓰기
                </Button>
            </View>
        </SafeAreaView>
        )
        }

    }

export {GominScreen}

const styles = StyleSheet.create({
    buttoncontainer:{
        width:"100%",bottom:0,
        display :"flex", 
        flexDirection:"row",
        justifyContent:"center", 
        alignItems:"center"
    },
    icon:{
        width: 24,height: 24,marginLeft:5
    },
    subtitle:{
        marginTop:10, display:"flex",flexDirection:"row", justifyContent:"space-between"
    },
    infocontainer:{
        display:"flex",flexDirection:"row"
    }
})