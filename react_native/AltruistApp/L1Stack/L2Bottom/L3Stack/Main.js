import React from 'react';
import {SafeAreaView, TouchableWithoutFeedback,TextInput,StyleSheet,View,TouchableOpacity} from 'react-native';
import {TopNavigation,Layout,Text,Button,Icon,Modal} from '@ui-kitten/components';
import Slider from '../../../components/slider.component'
import {TopBarTune} from '../../../components/TopBarTune'

import Searchsvg from '../../../assets/icons/search-outline.svg'
import { ScrollView } from 'react-native-gesture-handler';

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
            modalVisible:false
        }
    }
    render(){
        const {navigation} =this.props
        const {title,modalVisible} =this.state
        
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
                    <View style={{alignItems:'center'}}>
                        <View style={{padding:10,borderWidth:1,borderColor:'#35367B',borderRadius:23,margin:10}}>
                            <Text category='h1' style={{color:'#35367B'}}>더불어 성장하는</Text>
                            <Text category='h2' style={{fontSize:26,color:'#35367B'}}>이 타 주 의 자 </Text>
                        </View>
                        <View>
                            <TextInput 
                                style={styles.titleInput} 
                                value={title} 
                                onChangeText={text =>this.setState({title:text})}
                                placeholder="질문을 입력하고 이타주의자를 찾아보세요"
                                placeholderTextColor='#A897C2'
                                onEndEditing={()=>navigation.navigate('AltList',{title:title})}
                            />
                        </View>
                        <View style={{backgroundColor:'#B09BDE',borderRadius:10,marginBottom:20}} >
                            <TouchableOpacity 
                                style={{display:'flex', flexDirection:'row',padding:5}}
                                onPress={()=>navigation.navigate('AltList',{title:title})}
                            >
                                <Text category='h2' style={{color:'#ffffff'}}>이타주의자 찾기</Text>
                                <Searchsvg height={25} width={25} fill='#fff'/>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginVertical:20,flexDirection:'row',justifyContent:'space-evenly',width:'100%'}}>
                            <Button onPress={()=>navigation.navigate('AltApply')}>지원</Button>
                            <Button onPress={()=>navigation.navigate('AltList')}>멘토리스트</Button>
                            <Button onPress={()=>navigation.navigate('AltOpqQueList')}>오픈 질문</Button>
                            <Button onPress={()=>navigation.navigate('AltQueToptab')}>일대일 질문</Button>
                        </View>
                        <Slider
                            height={110} 
                            image={[
                                {id:0,url:'/uploads/6e3a7e4e1f77abb3b060_20200904100225599.jpg'},
                                {id:1,url:'/uploads/59901fc0cb0b6526dee1_20200903153758446.jpg'}    
                            ]}
                            dotStyle={{position:'absolute'}}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    titleInput :{
        width:'90%',
        padding:10,
        backgroundColor:'#ffffff',
        borderRadius:15,
        borderColor:"#A897C2",
        borderWidth:1,
        marginHorizontal:10,
        marginTop:10,
        marginBottom:5,
        fontSize:18,
        minHeight:45
    }
})

export default AltMainScreen