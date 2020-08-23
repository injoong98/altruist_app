import React from 'react';

import {StyleSheet, SafeAreaView, Image, View} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, List, Card} from '@ui-kitten/components'

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

const data = new Array(8).fill({
    title: 'Item',
  });

class AltListScreen extends React.Component{

    constructor (props) {
        super(props);
        this.state={
            data : [
                {name : '홍길동'},
                {name : '김철수'},
                {name : '김영희'},
                {name : '강호동'},
            ],

        }
    }

    

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )

    renderItem = ({item, index}) => (
        <Card style = {{backgroundColor:'white', borderRadius : 20, margin : 10}}>
            <View style = {{flexDirection : 'row', justifyContent:'flex-end'}}>
                <Text style = {{backgroundColor : '#b9b5d6', borderRadius : 20, padding : 4, marginHorizontal : 5}}>IT개발</Text>
                <Text style = {{backgroundColor : '#A7D4DE', borderRadius : 20, padding : 4, marginHorizontal : 5}}>스타트업/창업</Text>
                <Text style = {{backgroundColor : '#eab0b3', borderRadius : 20, padding : 4, marginHorizontal : 5}}>UX/UI기획</Text>
            </View>
            <View style={{flexDirection : 'row', alignItems : 'flex-end', justifyContent : 'flex-start'}}>
                <Image style ={{width : 100, height : 100, resizeMode:'contain', backgroundColor:'black'}}/>
                <View style={{marginLeft : 10}}>
                    <Text category = 'h1'>{item.name}</Text>
                    <Text category = 'h6'>1줄이내로 자신을 표현해주세요</Text>
                </View>
            </View>
            <View style={{flexDirection : 'row'}}>
                <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
                <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
                <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
                <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
                <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
            </View>
            <Text category='h6' style={{fontSize : 16}}>학력 또는 직장을 입력합니다.</Text>
            <View style = {{flexDirection : 'row'}}>
                <View style = {{flexDirection : 'row', flex : 5}}>
                    <Text style = {{backgroundColor : '#eab0b3', borderRadius : 20, padding : 4, marginHorizontal : 5, fontSize : 16, textAlignVertical : 'center'}}>IT개발</Text>
                    <Text style = {{backgroundColor : '#eab0b3', borderRadius : 20, padding : 4, marginHorizontal : 5, fontSize : 16, textAlignVertical : 'center'}}>스타트업/창업</Text>
                    <Text style = {{backgroundColor : '#eab0b3', borderRadius : 20, padding : 4, marginHorizontal : 5, fontSize : 16, textAlignVertical : 'center'}}>UX/UI기획</Text>
                </View>
                <Button 
                    style = {{height : 20}}
                    onPress={()=>{alert('question')}}>지원하기</Button>
            </View>
        </Card>
    );
    
    render(){
        return (
            <SafeAreaView style={{flex:1}}>
            <TopNavigation title="이타주의자" alignment="center" accessoryLeft={this.BackAction}/> 
                
                <List
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    />      
            </SafeAreaView>
        );
    }
}
    
const styles = StyleSheet.create({
      container: {

      },
      contentContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
      },
      item: {
        marginVertical: 4,
      },
});
export default AltListScreen;