import React from 'react';
import { View, Image, ScrollView, Dimensions, Text, StyleSheet} from 'react-native';
import { Layout } from '@ui-kitten/components';


// 이미지 데이터는 테그 안에 <Slider image={/*이미지데이터*/} /> 이런식으로 넣어주시면 됩니다. 'id', 'url' 키를 가진 객체로 보내주세용 />

const { width } = Dimensions.get("window");
const height = width


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
                                <Image
                                    style={slide_style.image}
                                    key={item.id}
                                    source={{uri : 'http://10.0.2.2'+item.url}}
                                    style={{width, height, resizeMode: 'cover'}}
                                />
                            ))
                        }
                    </ScrollView>
                </View>
                <View style={slide_style.pagination}>
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
        height 
    },
    image: { 
        width, 
        height, 
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