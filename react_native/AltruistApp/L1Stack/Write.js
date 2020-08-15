import React from 'react';
import {StyleSheet,SafeAreaView, View, Image, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, VirtualizedList,} from 'react-native';
import {Layout,Button,Text,TopNavigation,TopNavigationAction,Icon, Divider, Input, RadioGroup, Radio, Tooltip, CheckBox, IndexPath, Select, SelectItem} from '@ui-kitten/components'
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';
import { HeartIcon } from '../assets/icons/icons';
const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)


const defaultWrite = ({navigation}) =>{
    
    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )
    
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} /> 
        <Divider />
        <Layout style={{flex:10}}>
            <ScrollView>
                <Text>This is Write</Text>
            </ScrollView>
        </Layout>
        <View style={styles.bottomView}>
            <Button 
                style={styles.bottomButton}
                onPress={()=>{navigation.goBack()}}>
                    글쓰기 
            </Button>
        </View>    
    </SafeAreaView>

    )
}

const MarketWrite = ({route, navigation}) => {

    const DATA = [
        require('../market/asset/market-image-1.jpg'),
        require('../market/asset/image-plus.jpg'),
    ];

    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )

    const getItem = (data, index) => {
        return {
            id: Math.random().toString(12).substring(0),
            title: `Item ${index+1}`,
            uri: data[index]
        }
    }
          
    const getItemCount = (data) => {
        return data.length;
    }
          
    const Item = ({ uri })=> {
        return (
            <View style={styles.photo}>
                <Image source={uri} style={{width:200, height:200}}/>
            </View>
        );
    }

    return(
        <SafeAreaView style={{flex:1}}>

            <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} />

            <Divider />
            
            <Layout>
                <Text>상품명</Text>
                <Input></Input>
            </Layout>
            <Layout style={{flexDirection:'row'}}>
                <Layout style={{flex:1}}>
                    <Text>판매가격</Text>
                    <Input></Input>
                </Layout>
                <Layout style={{flex:1}}>
                    <Text>지역</Text>
                    <Input></Input>
                </Layout>
            </Layout>
            <Layout>
                <Text>사진</Text>
                <VirtualizedList
                    data={DATA}
                    initialNumToRender={4}
                    renderItem={({ item }) => <Item uri={item.uri} />}
                    keyExtractor={item => item.id}
                    getItemCount={getItemCount}
                    getItem={getItem}
                    horizontal={true}
                />
            </Layout>
            <Layout>
                <Text>상세정보</Text>
                <Input></Input>
            </Layout>
        </SafeAreaView>
    )
}

class AlbaWrite extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            title : '',
            content : '',
            post_location : '',
            alba_type : 0,
            alba_salary_type : new IndexPath(0),
            alba_salary : '',
            isTipVisible:false,
            isFollowUp:false,
        }
    }

    Salary_Type = [
        '시',
        '일',
        '주',
        '월'
    ]
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    )

    setTipVisible = (bool) => {this.setState({isTipVisible:bool});}
    setFollowUp = (nextChecked) => {
        this.setState({isFollowUp:nextChecked});
        this.setState({alba_salary:'추후협의'});
    }
    sendContext(){
        console.log(this.state);
        this.props.navigation.goBack();
    }

    renderToggleButton = () => (
        <Button
            appearance='ghost'
            accessoryLeft={HeartIcon}
            onPress={()=>this.setTipVisible(true)}/>
    );

    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="글작성" alignment="center" accessoryLeft={this.BackAction} /> 
                <Divider />
                <Layout style={{flex:10}}>
                    <ScrollView>
                        <Input
                            size='medium'
                            placeholder='Input Title'
                            onChangeText ={(nextText) => {this.setState({title:nextText})}}
                            />
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Input
                                size='medium'
                                placeholder='Input Location'
                                onChangeText ={(nextText) => {this.setState({post_location:nextText})}}
                                />
                            <RadioGroup
                                style={{flexDirection:'row', margin : 10}}
                                selectedIndex = {this.state.alba_type}
                                onChange={(index) => { this.setState({alba_type:index})}}>
                                <Radio>단기</Radio>
                                <Radio>장기</Radio>
                            </RadioGroup>
                            <Tooltip
                                anchor={this.renderToggleButton}
                                visible={this.state.isTipVisible}
                                placement='bottom end'
                                onBackdropPress={() => this.setTipVisible(false)}>
                                3개월미만은 단기, 3개월 이상은 장기
                            </Tooltip>
                        </View>
                        <View style={{flexDirection : 'row', alignItems:'center'}}>
                            <Text style={{margin : 10}}>추후 협의</Text>
                            <CheckBox
                                style={{margin : 10}}
                                checked={this.state.isFollowUp}
                                onChange={nextChecked => this.setFollowUp(nextChecked)}>
                            </CheckBox>
                            <Select
                                style={{margin : 10, width : 100}}
                                value={this.Salary_Type[this.state.alba_salary_type]}
                                selectedIndex={this.state.alba_salary_type}
                                onSelect={(index)=>{this.setState({alba_salary_type:index})}}
                                disabled={this.state.isFollowUp}
                                >
                                <SelectItem title = '시'/>
                                <SelectItem title = '일'/>
                                <SelectItem title = '주'/>
                                <SelectItem title = '월'/>
                            </Select>

                            <Input
                                style={{margin : 10}}
                                size='medium'
                                placeholder='Input Salary'
                                disabled={this.state.isFollowUp}
                                onChangeText ={(nextText) =>  {this.setState({alba_salary:nextText})}}
                                />
                        </View>
                    <Input
                        multiline={true}
                        textStyle={{ minHeight: 500}}
                        placeholder='Input Context'
                        onChangeText ={(nextText) => {this.setState({content:nextText})}}
                    />
                    </ScrollView>
                </Layout>
                <View style={styles.bottomView}>
                    <Button 
                        style={styles.bottomButton}
                        onPress={()=>{this.sendContext()}}>
                            글쓰기 
                    </Button>
                </View>   
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    item: {
      backgroundColor: '#f9c2ff',
      height: 150,
      justifyContent: 'center',
      marginVertical: 8,
      marginHorizontal: 16,
      padding: 20,
    },
    title: {
      fontSize: 32,
    },
    input : {
        marginVertical : 2,
        margin : 10,
        marginTop : 5,
    },
    photo: {
        justifyContent: 'center', 
        alignItems: 'center', 
        margin: 10, 
        borderWidth: 2,
        borderColor: 'grey'
    },
    bottomView: {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : 'lightgrey',
    },
    bottomButton: {
        width : "95%",
    },
});
  

export {defaultWrite, MarketWrite, AlbaWrite}