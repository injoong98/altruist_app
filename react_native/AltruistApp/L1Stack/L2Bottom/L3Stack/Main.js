import React from 'react';
import {SafeAreaView} from 'react-native';
import {TopNavigation,Layout,Text,Button } from '@ui-kitten/components';
import {TopBarTune} from '../../../components/TopBarTune'
class AltMainScreen extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        const {navigation} =this.props
        return(
            <SafeAreaView style={{flex:1}}>
                {/* <TopNavigation title="메인" alignment="center"/>  */}
                <TopBarTune 
                    text="이타주의자" 
                    func={()=>navigation.navigate('Meet')} 
                    gbckfunc={()=>{navigation.goBack()}} 
                    gbckuse={false}
                />
                <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
                    <Text>이타주의자 메인</Text>
                    <Button onPress={()=>navigation.navigate('AltApply')}>지원</Button>
                    <Button onPress={()=>navigation.navigate('AltQueType')}>질문</Button>
                    <Button onPress={()=>navigation.navigate('AltList')}>멘토리스트</Button>
                    <Button onPress={()=>navigation.navigate('AltQueList')}>질문리스트</Button>
                </Layout>   
            </SafeAreaView>
        )
    }
}

export default AltMainScreen