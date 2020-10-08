import React, {Fragment} from 'react';
import {StyleSheet,  View,  Image,  TouchableOpacity,  ActivityIndicator, SafeAreaView, ScrollView, Dimensions} from 'react-native';
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
import {Contrast, Grayscale} from 'react-native-color-matrix-image-filters';
//icon
import Heartsvg from '../../../assets/icons/heart.svg';
import Viewsvg from '../../../assets/icons/view.svg';
import Commentsvg from '../../../assets/icons/comment.svg';
import Writesvg from '../../../assets/icons/write.svg';
import Sharesvg from '../../../assets/icons/share.svg';
import Thumbsvg from '../../../assets/icons/thumb-up.svg';

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

	// category = ['전체', '아무말있어요', '게임있어요', '소식있어요', '정보있어요'];
	category = ['전체', '자유', '게임', '소식', '정보'];


	getPostList = async () => {
		const{current_category, current_page} = this.state;
		console.log(current_page);
		await axios.get( `http://dev.unyict.org/api/board_post/lists/ilban?category_id=${current_category}&page=${current_page}`)
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
				// if (response.data.view.file_image){
				// 	this.setState({image: response.data.view.file_image.map(function(item, index){
				// 		var image_info = {};
				// 		image_info['id'] = item.pfi_id;
				// 		image_info['title'] = item.pfi_originname;
				// 		image_info['url'] = item.origin_image_url;
				// 		image_info['index'] = index;
				// 		image_info['edit'] = true;
				// 		return image_info;
				// 	})});
				// }
			})
			.catch((error)=>{
				alert('error'+error);
			})
	}

	//LIFECYCLE
	componentDidMount() {
		this.getPostFirst();
	}

    statefunction=()=>{
        this.setState({isLoading:true});
        this.componentDidMount();
    }

	onRefresh= () =>{
		this.setState({current_page:1, isNoMoreData : false, refreshing:true}, this.getPostFirst);
    }

	load_more_data = () => {
		if(this.state.total_rows < 20){
			this.setState({isNoMoreData:true});
			console.log('load_more_data isNoMoreData : '+this.state.isNoMoreData);
		}
       	else if(!this.state.isNoMoreData){
			this.setState({ current_page : this.state.current_page + 1, isListLoading : true}, this.getPostList)
        }
	}
	
	listImageData = (item) => {
		item.file
		// console.log(item.file):null;
		?item.file.filter(i=>i.pfi_type=='jpg'||i.pfi_type=='png').map(function(image,index){
			var image_info = {};
			image_info['id'] = image.pfi_id;
			image_info['url'] = image.pfi_filename;
			return image_info;
		})
		:null;
	}

	renderListImage = ({item, index}) => {
		return(
			<Image 
				source={{uri : 'http://dev.unyict.org/uploads/post/2020/09/6bac647fc03c42ecf3991917072cbf17.jpg'}}
				style={{width:'100%', height:Dimensions.get("window").width-96}}
			/>
		)
	}

  	renderItem = ({item, index}) => {
		const regex = /(<([^>]+)>)|&nbsp;/gi;
		const post_remove_tags = item.post_content.replace(regex, '');
		const imageData = item.file
			?item.file.filter(i=>i.pfi_type=='jpg'||i.pfi_type=='png').map(function(image,index){
				var image_info = {};
				image_info['id'] = image.pfi_id;
				image_info['url'] = image.origin_image_url;
				image_info['index'] = index;
				return image_info;
			})
			:null;
		return (
		<TouchableOpacity
			style={styles.itembox}
			onPress={() => {this.props.navigation.navigate('IlbanContent', {OnGoback: () => this.onRefresh(),post_id: item.post_id});}}
			>
			<View style={{flex:1, backgroundColor:'white', width:90, borderBottomRightRadius:15}}>
				<Text category='s2' style={{fontSize:12, color:'#63579D', padding:5, flex:1}}>{'#'+this.category[item.post_category]}</Text>
			</View>
			<View style={{marginHorizontal:20, marginTop:5}}>
				<View style={{paddingVertical:4, paddingLeft:5}}>
					<Text category = 'h3' numberOfLines={1} ellipsizeMode="tail">{item.post_title}</Text>
					<Text
						category = 's1'
						style={{marginVertical:8}}
						numberOfLines={3}
						ellipsizeMode="tail"
						AccessibilityRole="button">
						{post_remove_tags}
					</Text>
				</View>
				<View style={{flexDirection:'row', justifyContent:'space-between'}}>
					{imageData
					?imageData.length==1
					?imageData.map(i=>
						<Image 
							key={i.id}
							source={{uri : i.url}}
							style={{width:'100%', height:(Dimensions.get("window").width-96), borderRadius:10}}
						/>
					)
					:imageData.length==2
					?imageData.map(i=>
						<Image 
							key={i.id}
							source={{uri : i.url}}
							style={{width:'49%', height:(Dimensions.get("window").width-96)/2, borderRadius:10}}
						/>
					)
					:imageData.length>2
					?imageData.slice(0,3).map(i=>
						<Contrast 
							key={i.id}
							style={{width:'32%',height:(Dimensions.get("window").width-96)/3}}
							amount={imageData.length>3 && i.index==2?0.3:1}
						>
							<View style={{width:'100%', height:'100%'}}>
								<Image 
									key={i.id}
									source={{uri : i.url}}
									style={{width:'100%', height:'100%', borderRadius:10}}
								/>
								{imageData.length>3 && i.index==2
								?<View style={{position:'absolute', zIndex:1, width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}>
									<Text style={{color:'white', fontSize:30}} category='h3'>+{imageData.length-3}</Text>
								</View>
								:null}
							</View>
						</Contrast>
					)
					:null
					:null
					}
				</View>
				<View style={{flexDirection:'row', flex:1, marginTop:30, justifyContent:'flex-end'}}>
					<View style={{flex:2, flexDirection:'row'}}> 
						<View style={{flexDirection:'row', flex:1, alignItems:'flex-end', paddingBottom:8}}>
							<Text category="s2" style={{fontSize:12, color:'#63579D', marginRight:5}}>{item.display_name} </Text>
							<PostTime category="p1" style={{fontSize:12, color:'#63579D'}} datetime = {item.post_datetime}/>
						</View>
					</View>
					<View style={styles.subtitle}>
						<View style={{alignItems:'center', marginHorizontal:10}}>
							<Thumbsvg width = {20} height={20}/>
							<Text style={styles.infotext} category="s2">{item.post_like}</Text>
						</View>
						<View style={{alignItems:'center', marginHorizontal:10}}>
							<Commentsvg width = {20} height={20}/>
							<Text style={styles.infotext} category="s2">{item.post_comment_count}</Text>
						</View>
						<View style={{alignItems:'center', marginHorizontal:10}}>
							<Viewsvg width = {20} height={20}/>
							<Text style={styles.infotext} category="s2">{item.post_hit}</Text>
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
						<Text category='h6' key={index} style={{color:(current_category==index?'white':'#543D78')}}> {'#'+str} </Text>
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
                		onEndReachedThreshold = {0.9}
						ListFooterComponent={this.renderFooter}/>
				</View>
				<TouchableOpacity
						style={{position: 'absolute', right: 20, bottom: 14}}
						onPress={() => {this.props.navigation.navigate('IlbanWrite',{statefunction:this.statefunction})}}>
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
		flex:1, 
		flexDirection:"row", 
		alignItems:'center', 
		justifyContent:'center',
		marginTop:-20,
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
		borderRadius : 10,
		marginLeft: 20,
		marginRight: 20,
		marginVertical: 8,
		paddingBottom : 5
	},
	itemContent: {
		marginTop: 10,
		marginBottom: 10,
	},
	category: {
		paddingTop: 10,
		paddingBottom: 10,
	},
	infotext : {
		color : '#63579D',
		fontSize : 10
	}
});

export {JauScreen};
