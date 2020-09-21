import React from 'react';
import { View, Image, ScrollView, Dimensions, Text, StyleSheet, TouchableWithoutFeedback, Modal} from 'react-native';
import { Layout } from '@ui-kitten/components';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Icon } from '@ui-kitten/components';

// 이미지 데이터는 테그 안에 <Slider image={/*이미지데이터*/} /> 이런식으로 넣어주시면 됩니다. 'id', 'url' 키를 가진 객체로 보내주세용 />

const { width } = Dimensions.get("window");


export default class Slider extends React.Component {
    state = {
        activeDot: 0,
        modalVisible: false,
    }
    
    changeDot = ({nativeEvent}) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        if(slide !== this.state.activeDot){
            this.setState({activeDot : slide});
        }
    }
    
    modalOn = () => {
        this.setState({modalVisible: true})
    }

    render() {

        const height = this.props.height ?this.props.height :width
        const modalImages = this.props.image.map(function(item){
            var newImage = {};
            newImage['url'] = 'http://dev.unyict.org'+item.url;
            newImage['props'] = {};
            return newImage;
        })

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
                                <TouchableWithoutFeedback onPress={()=>this.modalOn()} key={item.id}>
                                    <Image
                                        style={slide_style.image}
                                        key={item.id}
                                        source={{uri : 'http://dev.unyict.org'+item.url}}
                                        style={{width, height, resizeMode: 'contain'}}
                                    />
                                </TouchableWithoutFeedback>
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
                <Modal
                    visible={this.state.modalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => this.setState({modalVisible:false})}
                    transparent={true}
                >
                    <ImageViewer
                        imageUrls={modalImages}
                        index={this.state.activeDot}
                        onSwipeDown={()=>this.setState({modalVisible:false})}
                        enableSwipeDown={true}
                        renderHeader={()=>
                            <View style={{alignItems:'flex-end', paddingTop:20, paddingRight:10}}>
                                <TouchableWithoutFeedback onPress={()=>this.setState({modalVisible:false})}>
                                    <Icon style={{width:30, height:30}} fill='#FFFFFF' name='close-outline'/>
                                </TouchableWithoutFeedback>
                            </View>
                        }
                    />
                </Modal>
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