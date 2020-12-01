import React from 'react';
import { View, Image, ScrollView, Dimensions, Text, StyleSheet,Pressable,Linking} from 'react-native';
import { Layout , Spinner} from '@ui-kitten/components';


// 이미지 데이터는 테그 안에 <Slider image={/*이미지데이터*/} /> 이런식으로 넣어주시면 됩니다. 'id', 'url','post_id' 키를 가진 객체로 보내주세용 />

const { width } = Dimensions.get("window");


export default class Slider extends React.Component {
    state = {
        activeDot: 0
    }
    
    
    changeDot = ({nativeEvent}) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        if(slide !== this.state.activeDot){
            this.setState({activeDot : slide});
        }
    }
    
    
    render() {
        const height = this.props.height ?this.props.height :width
        return (
            <Layout>
                <View style={slide_style.container}>
                    <ScrollView 
                        style={slide_style.container}
                        pagingEnabled 
                        horizontal 
                        onScroll={this.changeDot}
                        showsHorizontalScrollIndicator={false}
                        style={{width, height}}
                    >
                        {
                            this.props.image.map((item, index) => (
                                <Pressable
                                    key={item.id}
                                    onPress={()=>console.log(item.id)}
                                >
                                    <Image
                                        style={slide_style.image}
                                        source={{uri : 'http://dev.unyict.org'+item.url}}
                                        style={{width, height, resizeMode: 'contain'}}
                                    />
                                </Pressable>
                            ))
                        }
                    </ScrollView>
                </View>
                <View style={[slide_style.pagination,this.props.dotStyle]}>
                    {
                        this.props.image.map((item, index) => (
                            <Text key={index} style={index==this.state.activeDot ? slide_style.pagingActiveText : slide_style.pagingText}>⬤</Text>
                        ))
                    }
                </View>
            </Layout>
        )
    }
}
export class MainSlider extends React.Component {
    state = {
        activeDot: 0
    }
    
    
    changeDot = ({nativeEvent}) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        if(slide !== this.state.activeDot){
            this.setState({activeDot : slide});
        }
    }
    navigateToContent= (brd_id,post_id) =>{
        var brd = brd_id == 1 ? 'GominContent' : brd_id == 2 ? 'MarketContent': brd_id == 3 ?'AlbaContent': 'IlbanContent' 
        this.props.navigation.navigate(brd,{post_id:post_id, OnGoback:() =>this.onRefresh()})
    }
    handlePress = (item) =>{
        if(item.post_id && item.post_id!=''&&item.post_id!='0'){
            if(item.brd_id!=null){
                this.navigateToContent(item.brd_id,item.post_id);
            }else{
                this.props.navigation.navigate(item.post_id);
            }
        }else if (item.ban_url){
            console.log(item.ban_url)
            Linking.openURL(item.ban_url)
        } 
        console.log(JSON.stringify(item))
    }
    
    render() {
        const height = this.props.height ?this.props.height :width
        return (
            <Layout>
                <View style={slide_style.container}>
                    <ScrollView 
                        style={slide_style.container}
                        pagingEnabled 
                        horizontal 
                        onScroll={this.changeDot}
                        showsHorizontalScrollIndicator={false}
                        style={{width, height}}
                    >
                        {
                            this.props.image.length >0 ?
                            this.props.image.map((item, index) => (
                                <Pressable
                                    key={item.ban_id}
                                    onPress={()=>{this.handlePress(item);}}
                                >
                                    <Image
                                        style={slide_style.image}
                                        source={{uri : item.ban_thumb_img}}
                                        style={{width, height, resizeMode: 'contain'}}
                                    />
                                </Pressable>
                            ))
                            :
                            <View style={{width:width,alignItems:'center',justifyContent:'center'}}>
                                <Spinner />
                            </View>
                        }
                    </ScrollView>
                </View>
                <View style={[slide_style.pagination,this.props.dotStyle]}>
                    {
                        this.props.image.map((item, index) => (
                            <Text key={index} style={index==this.state.activeDot ? slide_style.pagingActiveText : slide_style.pagingText}>⬤</Text>
                        ))
                    }
                </View>
            </Layout>
        )
    }
}

const slide_style = StyleSheet.create({
    container: { 
        width, 
    },
    image: { 
        width,  
        resizeMode:'cover' 
    },
    pagination: { 
        flexDirection:'row', 
        bottom:0, 
        alignSelf:'center' 
    },
    pagingText: { 
        fontSize : (width / 30), 
        color:'gainsboro', 
        margin:3 
    },
    pagingActiveText: { 
        fontSize : (width / 30), 
        color:'dodgerblue', 
        margin:3 
    }
})