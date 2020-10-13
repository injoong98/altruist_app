import React from 'react';
import {SafeAreaView,View} from 'react-native';
import {Text} from '@ui-kitten/components';

class MyAltCareer extends React.Component{
    constructor(props){

    }
    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                <View style={{flex:1}}> 
                    <Text>
                        MyAltCareer Screen
                    </Text>
                </View>
            </SafeAreaView>
        )
    }
}

export default MyAltCareer