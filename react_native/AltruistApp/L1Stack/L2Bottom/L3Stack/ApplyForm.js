import React,{useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {SafeAreaView, View, TextInput, StyleSheet} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, Radio, CheckBox, Card } from '@ui-kitten/components'
import { FlatList } from 'react-native-gesture-handler';


const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)



class AltApplyFormScreen extends React.Component{
    constructor(props){
        super(props)
    }
    
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )

    render(){ 
        return(
            <SafeAreaView style={styles.container}>
                <TopNavigation 
                title="이타주의자" alignment="center" accessoryLeft={this.BackAction} /> 
                    <Layout style={styles.wrapper}>
                        <Text> 이타주의자 지원하기 FORM </Text>
                    </Layout>
                    <View style={{flexDirection:'row'}}>
                        <Text>한줄 PR</Text>
                        <TextInput 
                        numColumns={5}
                        multiline={true}
                        ></TextInput>
                    </View>

                    <View style={{flexDirection:'row', justifyContent:'center'}}>
                        <Button style={{margin:10}}>취소</Button>
                        <Button style={{margin:10}} onPress={()=>navigation.navigate('AltApplyComplete')}>완료</Button>
                    </View>
            </SafeAreaView>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper :{
        margin: 10,
        backgroundColor: "#eaeaea"
      },
      title: {
        marginTop: 16,
        paddingVertical: 8,
        borderWidth: 4,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#61dafb",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold"
      }
});



export default AltApplyFormScreen;