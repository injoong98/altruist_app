import React from 'react';
import {ScrollView,SafeAreaView, TouchableWithoutFeedback,TextInput,StyleSheet,View,TouchableOpacity,Dimensions,TouchableHighlight,Animated} from 'react-native';
import {TopNavigation,Layout,Text,Button,Icon,Modal} from '@ui-kitten/components';
import Slider from '../../../components/slider.component'
import {TopBarTune} from '../../../components/TopBarTune'

import LogoSvg from '../../../assets/icons/logo.svg'
import Searchsvg from '../../../assets/icons/search-outline.svg'

const {width,height} = Dimensions.get('window')


const Search = (props) =>(
    <Icon {...props} name='search-outline'/>
)
const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)
class AltMainScreen extends React.Component{
    constructor(props){
        super(props)
        this.state={
            title:'',
            modalVisible:false,
            btnContainerWidth: new Animated.Value(0),
            btnContainerCompressed:true
        }
    }
    minimizing = () => {
        console.log('minimizing');
        this.setState({btnContainerCompressed:true})
        Animated.timing(this.state.btnContainerWidth,{
            toValue: 0 ,
            duration: 500,
            useNativeDriver: false
        }).start();
        
    };
    maximizing = () =>{
        console.log('maximizing'); 
        this.setState({btnContainerCompressed:false})
        Animated.timing(this.state.btnContainerWidth,{
            toValue: 1 ,
            duration: 500,
            useNativeDriver: false
        }).start();
        
    }
    render(){
        const {navigation} =this.props
        const {title,modalVisible,btnContainerCompressed,btnContainerWidth} =this.state

        const btnContainerWidthInterpolate = btnContainerWidth.interpolate({
            inputRange:[0,1],
            outputRange:["0%","90%"]
        })
        const wdithLogo = (width*0.47);
        const heightLogo = (wdithLogo*0.57);
        return(
            <SafeAreaView style={{flex:1}}>
                {/* <TopNavigation title="메인" alignment="center"/>  */}
                {/* <TopBarTune 
                    text="이타주의자" 
                    func={()=>navigation.navigate('Meet')} 
                    gbckfunc={()=>{navigation.goBack()}} 
                    gbckuse={false}
                /> */}
                <ScrollView style={{flex:1}}>
                    <View style={{flex:1, alignItems:'center',minHeight:'100%',backgroundColor:'#ffffff'}}>
                        <Slider
                            height={100} 
                            image={[
                                {id:0,url:'/uploads/6e3a7e4e1f77abb3b060_20200904100225599.jpg'},
                                {id:1,url:'/uploads/59901fc0cb0b6526dee1_20200903153758446.jpg'}    
                            ]}
                            dotStyle={{position:'absolute'}}
                        />
                        <View style={{ alignItems:'center',justifyContent:'space-evenly'}}>
                            <View style={{marginTop:91}}>
                                <LogoSvg  width={wdithLogo} height={heightLogo}/>
                            </View>
                            <View style={{marginTop:22}}>
                                <TextInput 
                                    style={styles.titleInput} 
                                    value={title} 
                                    onChangeText={text =>this.setState({title:text})}
                                    placeholder="이타주의자들에게 질문 해보세요"
                                    placeholderTextColor='#A897C2'
                                    onEndEditing={()=>navigation.navigate('AltList',{title:title})}
                                />
                                <TouchableOpacity style={{position:"absolute",right:5,top:6}}>
                                    <Searchsvg height={25} width={25} fill='#A9C' />
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:28}} >
                                <TouchableOpacity 
                                    style={{display:'flex', flexDirection:'row',padding:5}}
                                    onPress={()=>navigation.navigate('AltList',{title:title})}
                                >
                                    <Text category='h2' style={{color:'#A897C2',fontSize:18}}>이타주의자 찾기</Text>
                                
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{marginTop:150,flexDirection:'row',width:'100%',paddingHorizontal:12}}>                        
                            <TouchableHighlight style={[styles.btn,{borderRadius:15}]} onPress={btnContainerCompressed?this.maximizing:this.minimizing}>
                                <Text category="h2" style={{color:'#ffffff'}}>
                                {btnContainerCompressed? '+' :'-'}
                                </Text>
                            </TouchableHighlight>
                            <Animated.View style={{flexDirection:'row',justifyContent:'space-evenly',overflow:'hidden',width:btnContainerWidthInterpolate}}>
                                <TouchableHighlight style={styles.btn} onPress={()=>navigation.navigate('AltApply')}>
                                    <Text category="h1" style={styles.btnText}>
                                    지원
                                    </Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={styles.btn} onPress={()=>navigation.navigate('AltList')}>
                                    <Text category="h1" style={styles.btnText}>
                                    멘토리스트
                                    </Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={styles.btn} onPress={()=>navigation.navigate('AltOpqQueList')}>
                                    <Text category="h1" style={styles.btnText}>
                                    오픈 질문
                                    </Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={styles.btn} onPress={()=>navigation.navigate('AltQueToptab')}>
                                    <Text category="h1" style={styles.btnText}>
                                    일대일 질문
                                    </Text>
                                </TouchableHighlight>
                            </Animated.View>
                        </View>
                        <View>
                            <View style={{marginVertical:20}}>    
                                <Text category='h2' style={{color:'#63579D'}}>멘토리스트</Text>
                            </View>
                            <View style={styles.mentorItem}>
                                <View>
                                    <Text>멘토 리스트 </Text>
                                </View>
                            </View>
                            <View style={styles.mentorItem}>
                                <View>
                                    <Text>멘토 리스트 </Text>
                                </View>
                            </View>
                            <View style={styles.mentorItem}>
                                <View>
                                    <Text>멘토 리스트 </Text>
                                </View>
                            </View>
                            <View style={styles.mentorItem}>
                                <View>
                                    <Text>멘토 리스트 </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    titleInput :{
        width:'90%',
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
    mentorItem:{
        borderWidth:1,
        padding:20
    },
    btn:{
        height:30,
        backgroundColor:'#A897C2',
        borderRadius:8,
        padding:8,
        alignItems:'center',
        justifyContent:'center',
        overflow:"hidden" 
    },
    btnText:{
        color:'#ffffff',
        fontSize:14,
        overflow:"hidden" 
    }
})

export default AltMainScreen