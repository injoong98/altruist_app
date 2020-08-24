import React from 'react';

import {StyleSheet, SafeAreaView, Image, View, ScrollView} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, List, Card, Modal} from '@ui-kitten/components'
import { TouchableOpacity } from 'react-native-gesture-handler';
import {TopBarTune} from '../../../components/TopBarTune';
// import {Tag} from '../../../components/Tag.component';
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
            isFilterVisible : false,
        }
    }

    

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )

    renderItem = ({item, index}) => (
        <Card style = {styles.card} onPress = {()=>{this.props.navigation.navigate('AltProfile', item.name)}}>
            <View style = {{flexDirection : 'row', justifyContent:'flex-end'}}>
                <Text category = 'c2' style = {tags('#A7D4DE')}>IT개발</Text>
                <Text category = 'c2' style = {tags('#A7D4DE')}>스타트업/창업</Text>
                <Text category = 'c2' style = {tags('#EAB0B3')}>UX/UI기획</Text>
            </View>
            <View style={{flexDirection : 'row', alignItems : 'flex-end', justifyContent : 'flex-start'}}>
                <Image source = {{uri : 'http://10.0.2.2/uploads/noimage.gif'}} style = {{width : 100, height : 100, borderRadius : 30, resizeMode:'contain'}}/>
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
                    <Text category = 'c2' style = {tags('#A7D4DE', 16)}>IT개발</Text>
                    <Text category = 'c2' style = {tags('#A7D4DE', 16)}>스타트업/창업</Text>
                    <Text category = 'c2' style = {tags('#A7D4DE', 16)}>UX/UI기획</Text>
                </View>
                <Button 
                    style = {{height : 20}}
                    onPress={()=>{alert('question')}}>질문하기</Button>
            </View>
        </Card>
    );
    
    render(){
        return (
            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="이타주의자" alignment="center" accessoryLeft={this.BackAction} style={{backgroundColor : '#B09BDE'}}/>
                <ScrollView horizontal style={{marginVertical : 4}}>
                    <TouchableOpacity 
                        style = {tags('#A7D4DE')}
                        onPress = {()=>this.setState({isFilterVisible:true})}
                        >
                        <Text category = 'c2' >     +     </Text>
                    </TouchableOpacity>
                    <Text category = 'c2' style = {tags('#A7D4DE')}>IT개발</Text>
                    <Text category = 'c2' style = {tags('#A7D4DE')}>스타트업/창업</Text>
                    <Text category = 'c2' style = {tags('#EAB0B3')}>UX/UI기획</Text>
                </ScrollView>
                <List
                    contentContainerStyle={styles.contentContainer}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    />      
                <Modal
                    visible={this.state.isFilterVisible}
                    backdropStyle={{backgroundColor:'rgba(0, 0, 0, 0.5)'}}
                    onBackdropPress={() => this.setState({isFilterVisible:false})}>
                        <View style={{backgroundColor : 'white', borderRadius : 20, padding : 10, margin : 5}}>
                            <Text category='h5'>필터 적용하기</Text>
                            <Text category='h6'>직무 분야</Text>
                                <View style = {{flexDirection : 'row', flexWrap: 'wrap'}}>
                                    <Text category = 'c2' style = {tags('#A7D4DE',14,5)}>IT개발</Text>
                                    <Text category = 'c2' style = {tags('#A7D4DE',14,5)}>스타트업/창업</Text>
                                    <Text category = 'c2' style = {tags('#EAB0B3',14,5)}>UX/UI기획</Text>
                                    <Text category = 'c2' style = {tags('#A7D4DE',14,5)}>IT개발</Text>
                                    <Text category = 'c2' style = {tags('#A7D4DE',14,5)}>스타트업/창업</Text>
                                    <Text category = 'c2' style = {tags('#EAB0B3',14,5)}>UX/UI기획</Text>
                                </View>
                            <Text category='h6'>활동 분야</Text>
                                <View style = {{flexDirection : 'row', flexWrap: 'wrap'}}>
                                    <Text category = 'c2' style = {tags('#A7D4DE',14,5)}>IT개발</Text>
                                    <Text category = 'c2' style = {tags('#A7D4DE',14,5)}>스타트업/창업</Text>
                                    <Text category = 'c2' style = {tags('#EAB0B3',14,5)}>UX/UI기획</Text>
                                    <Text category = 'c2' style = {tags('#A7D4DE',14,5)}>IT개발</Text>
                                    <Text category = 'c2' style = {tags('#A7D4DE',14,5)}>스타트업/창업</Text>
                                    <Text category = 'c2' style = {tags('#EAB0B3',14,5)}>UX/UI기획</Text>
                                </View>
                            <Button onPress={()=>{this.setState({isFilterVisible:false})}}>적용하기</Button>
                        </View>
                </Modal>
            </SafeAreaView>
        );
    }
}
    
var tags = function (value='black', size=14, vertical=0) {
    return{
        backgroundColor : value,
        borderRadius : 20, 
        padding : 4, 
        marginHorizontal : 5,
        marginVertical : vertical,
        fontSize : size, 
        textAlignVertical : 'center',
        justifyContent : 'center',
    }
}

const styles = StyleSheet.create({
      contentContainer: {
        // paddingHorizontal: 8,
        // paddingVertical: 4,
        marginHorizontal: 4,
        marginVertical: 2,
      },
      card : {
        backgroundColor:'#E4E4E4',
        borderRadius : 20,
        margin : 10
      },
      tags : {

      }
});
export default AltListScreen;