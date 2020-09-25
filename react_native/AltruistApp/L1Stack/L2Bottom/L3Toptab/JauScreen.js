import React, {Fragment} from 'react';
import {StyleSheet,  View,  Image,  TouchableOpacity,  ActivityIndicator, SafeAreaView, ScrollView} from 'react-native';
import { Button, List,  Text,  Icon, Spinner,  } from '@ui-kitten/components';
import {PlusIcon} from '../../../assets/icons/icons';
import {getPostList} from './extra/getPost';
import axios from 'axios';
import {HTML} from 'react-native-render-html';
import {IGNORED_TAGS} from 'react-native-render-html/src/HTMLUtils';
//components
import {PostTime} from '../../../components/PostTime';
import {WebView} from 'react-native-webview';
import {Tag} from '../../../components/tag.component';
//icon
import Heartsvg from '../../../assets/icons/heart.svg';
import Viewsvg from '../../../assets/icons/view.svg';
import Commentsvg from '../../../assets/icons/comment.svg';
import Writesvg from '../../../assets/icons/write.svg';
import Sharesvg from '../../../assets/icons/share.svg';

class JauScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			lists: [],
			refreshing:false,
			current_page:1,
			isListLoading : false,
			isNoMoreData : false,
			current_category:0,
			total_rows:0,
		};
	}

	ignoredTags = [...IGNORED_TAGS, 'img'];

	category = ['전체', '아무말있어요', '게임', '지구별소식', '자료실'];

	getPostList = async () => {
		const{current_category, current_page} = this.state;
		await axios.get( `http://dev.unyict.org/api/board_post/lists/ilban?category_id=${current_category}?page=${current_page}`)
			.then((response) => {
				if(response.data.view.list.data.list.length > 0){
					this.setState({
						lists:this.state.lists.concat(response.data.view.list.data.list),
						isLoading:false,
						isListLoading:false,
					})
				}
				else{
					console.log('no page data');
					this.setState({isListLoading:false, isNoMoreData : true});
				}
			})
			.catch((error) => {
				alert(error);
			});
	};

	getPostFirst = async() => {
		await axios.get(`http://dev.unyict.org/api/board_post/lists/ilban?category_id=${this.state.current_category}`)
			.then((response)=>{
				this.setState({
				lists:response.data.view.list.data.list,
				isLoading:false,
				isListLoading:false,
				refreshing:false,
				total_rows:response.data.view.list.data.total_rows,
				})
			})
			.catch((error)=>{
				alert('error'+error);
			})
	}

	//LIFECYCLE
	componentDidMount() {
		this.getPostFirst();
	}

	onRefresh= () =>{
		this.setState({current_page:1, isNoMoreData : false, refreshing:true}, this.getPostFirst);
    }

	load_more_data = () => {
		if(this.state.total_rows < 10){
			this.setState({isNoMoreData:true});
		}
       	else if(!this.state.isNoMoreData){
			this.setState({ current_page : this.state.current_page + 1, isListLoading : true}, this.getPostList,
				console.log(this.state.current_page))
        }
    }

  	renderItem = ({item, index}) => {
		const regex = /(<([^>]+)>)|&nbsp;/gi;
		const post_remove_tags = item.post_content.replace(regex, '');
		return (
		<TouchableOpacity
			style={styles.itembox}
			onPress={() => {this.props.navigation.navigate('GominContent', {OnGoback: () => this.onRefresh(),post_id: item.post_id});}}
			>
			<View style={{flex:1, backgroundColor:'white', width:111, borderBottomRightRadius:15}}>
				<Text category='p2' style={{padding:5, flex:1}}>{'#'+this.category[item.post_category]}</Text>
			</View>
			<View style={{marginHorizontal:20}}>
				<View style={{paddingVertical:4}}>
					<Text category = 'h2' numberOfLines={1} ellipsizeMode="tail">{item.post_title}</Text>
					<Text
						category = 'h6'
						numberOfLines={3}
						ellipsizeMode="tail"
						AccessibilityRole="button">
						{post_remove_tags}
					</Text>
				</View>
				<View style={{flexDirection:'row', flex:1}}>
					<View style={{flex:2, flexDirection:'row'}}> 
						<View style={{flexDirection:'row', flex:1, alignItems:'flex-end', paddingBottom:8}}>
							<Text category="c2">{item.display_name} </Text>
							<PostTime category="c2" datetime = {item.post_datetime}/>
						</View>
					</View>
					<View style={styles.subtitle}>
						<View style={{alignItems:'center', marginHorizontal:10}}>
							<Heartsvg width = {20} height={20}/>
							<Text style={styles.infotext} category="s1">{item.post_like}</Text>
						</View>
						<View style={{alignItems:'center', marginHorizontal:10}}>
							<Commentsvg width = {24} height={24}/>
							<Text style={styles.infotext} category="s1">{item.post_comment_count}</Text>
						</View>
						<View style={{alignItems:'center', marginHorizontal:10}}>
							<Viewsvg width = {24} height={24}/>
							<Text style={styles.infotext} category="s1">{item.post_hit}</Text>
						</View>
					</View>
				</View>
			</View>
		</TouchableOpacity>
		);
	};

	renderFooter=()=>{
        return(
          this.state.isListLoading ?
          <View style = {styles.loader}>
            <ActivityIndicator size='large'/>
          </View>:null
        )
    }


	render() {
		const {current_category} = this.state
    	return (
			this.state.isLoading ? 
			<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
				<Text>
					<Spinner size="giant" />
				</Text>
			</View>
			:
			<View style={{flex:1, backgroundColor:'white'}}>
				<ScrollView horizontal={true} style={{flex:1, marginHorizontal : 20, marginVertical: 4,backgroundColor:'#B09BDE', borderRadius:10}}>
					{this.category.map((str,index) => (
					<TouchableOpacity 
						key={index}
						style={{alignItems:'center', justifyContent:'center', marginHorizontal:5}}
						onPress={async()=>{this.setState({current_category:index, current_page:1},this.getPostFirst)}}>
						<Text category='h3' key={index} style={{color:(current_category==index?'white':'black')}}> {'#'+str} </Text>
					</TouchableOpacity>))}
				</ScrollView>
				<View style={{flex:20}}>
					<List
						style={{backgroundColor: 'white'}}
						data={this.state.lists}
						contentContainerStyle={styles.contentContainer}
						renderItem={this.renderItem}
						refreshing={this.state.refreshing}
						onRefresh={this.onRefresh}
						onEndReached={this.load_more_data}
                		onEndReachedThreshold = {0.1}
						ListFooterComponent={this.renderFooter}/>
				</View>
				<TouchableOpacity
						style={{position: 'absolute', right: 20, bottom: 14}}
						onPress={() => {this.props.navigation.navigate('IlbanWrite')}}>
						<Writesvg />
				</TouchableOpacity>
			</View>
		);
  	}
}

const styles = StyleSheet.create({
	contentContainer: {
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	renderers: {},
	root: {
		backgroundColor: '#FFFFFF',
	},
	category : {
		alignContent: 'center',
		marginHorizontal: 4,
		borderWidth: 1,
		padding: 10,
		marginRight: 10,
		marginLeft: 10,
	},
	container:{
        backgroundColor:"#F4F4F4",
        borderRadius : 10,
        marginVertical:4.5,
        marginHorizontal:19,
        padding:0,
        paddingLeft:21
    },
	subtitle:{
		flex:1, flexDirection:"row", alignItems:'center', justifyContent:'center',
	},
	infocontainer:{
        flexDirection:"row",justifyContent:'space-evenly',
        borderTopLeftRadius:23,
        width:116,
        backgroundColor:"#ffffff",
        position:"relative",bottom:0,right:0,
        paddingTop:5,
        paddingLeft:20,
        paddingRight:10
    },
	//ita geasipan
	itembox: {
		flex: 1,
		backgroundColor: '#F4F4F4',
		borderRadius : 20,
		marginLeft: 20,
		marginRight: 20,
		marginVertical: 4,
	},
	itemContent: {
		marginTop: 10,
		marginBottom: 10,
	},
	category: {
		paddingTop: 10,
		paddingBottom: 10,
	},
});

export {JauScreen};
