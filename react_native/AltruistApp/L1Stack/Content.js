import React from 'react';
import {StyleSheet,SafeAreaView, View, Image, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView,} from 'react-native';
import {Layout,Button,Text,TopNavigation,TopNavigationAction,Icon, Divider, Input} from '@ui-kitten/components'
import {Card, CardItem} from 'native-base';
const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)


const defaultContent = ({navigation}) =>{
    
    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )
    
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} /> 
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text>글본문입니다</Text>
        </Layout>   
    </SafeAreaView>
    )
}

const MarketContent = ({route, navigation}) =>{

    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )
    
    const [value, setValue] = React.useState('');

    return(
    <SafeAreaView style={{flex:1}}>

        <TopNavigation title="수수마켓" alignment="center" accessoryLeft={BackAction} />

        <KeyboardAvoidingView behavior={'height'} style={{flex:1}}>
            <ScrollView>
            <View style={{height:394}}>
                <Image source={route.params.uri} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
            </View>
            <View style={{}}>
                <Layout>
                <Text category='h2'>{route.params.title}</Text>
                </Layout>
                <Layout>
                <Text category='h4'>{route.params.price}</Text>
                </Layout>
            </View>
            <Divider/>
            <Layout style={{height:50,flexDirection:'row'}}>
                <Layout style={{width:50}}>
                <Image source={require('../market/asset/market-image-1.jpg')} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
                </Layout>
                <Layout style={{justifyContent:'center'}}>
                <Text>{route.params.user}</Text>
                </Layout>
            </Layout>
            <Divider/>
            <Layout style={{height:200}}>
                <Text>Details</Text>
                <Text> ㅇPlace : {route.params.place}</Text>
            </Layout>
            <Divider/>
            <Layout>
                <Text>Comment</Text>
                <Layout style={styles.commentBlock}>
                    <Input
                        style={{flex:1}}
                        placeholder='Place your Text'
                        value={value}
                        multiline={true}
                        clearButtonMode='always'
                        onChangeText={nextValue => setValue(nextValue)}
                    />
                </Layout>
                <Layout style={{alignItems: "flex-end", marginHorizontal:20, marginBottom:20}}>
                    <Button style={{width:100}}>Submit</Button>
                </Layout>
            </Layout>
            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>

    )
}


const AlbaContent = ({navigation}) => {

    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )
    
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="채용정보" alignment="center" accessoryLeft={BackAction} /> 
        <Layout style={styles.container}>
            <ScrollView>
                <Card style={styles.item}>
                    <Text>2020-08-12 09:12</Text>
                    <Text category='h3'>하루 1시간씩 내가 원할 때 하는 알바, 배민커넥트 모집</Text>
                    <Layout style={{flexDirection:'row', marginBottom : 5}}>
                        <View style={{width : 100, height : 50, borderRightWidth : 0.3, justifyContent : 'center', alignItems : 'center'}}>
                            <Image style={{width : '90%', resizeMode:'contain'}} source={require('../assets/altruist_logo.png')}/>
                        </View>
                        <Text style={{margin : 10}}>배민커넥트 성남점</Text>
                    </Layout>
                    <Divider style={{borderWidth : 0.3}}/>
                    <Layout style={{flexDirection:'row', marginTop:10, marginLeft: 10}}>
                        <View style={styles.icons}>
                        <Icon
                            style={{width:32,height:32}}
                            fill='black'
                            name='star'
                        />
                        <Text>1,880,000원</Text>
                        </View>
                        <View style={styles.icons}>
                        <Icon
                            style={{width:32,height:32}}
                            fill='black'
                            name='star'
                        />
                        <Text>1~3개월</Text>
                        </View>
                        <View style={styles.icons}>
                        <Icon
                            style={{width:32,height:32}}
                            fill='black'
                            name='star'
                        />
                        <Text>월~금</Text>
                        </View>
                        <View style={styles.icons}>
                        <Icon
                            style={{width:32,height:32}}
                            fill='black'
                            name='star'
                        />
                        <Text>09:00~18:00</Text>
                        </View>
                    </Layout>
                </Card>
                <Card style={styles.item}>
                    <Text style={styles.subhead}>모집조건</Text>
                    <Layout style = {{flexDirection : 'row'}}>
                        <View style={{flex : 1, marginLeft : 5}}>
                            <Text style={styles.gathertext}>모집마감</Text>
                            <Text style={styles.gathertext}>모집인원</Text>
                            <Text style={styles.gathertext}>성별</Text>
                            <Text style={styles.gathertext}>연령</Text>
                            <Text style={styles.gathertext}>학력</Text>
                            <Text style={styles.gathertext}>기타사항</Text>
                        </View>
                        <View style={{flex : 5}}>
                            <Text style={styles.gather}>상시모집</Text>
                            <Text style={styles.gather}>00명</Text>
                            <Text style={styles.gather}>성별무관</Text>
                            <Text style={styles.gather}>20세~90세</Text>
                            <Text style={styles.gather}>학력무관</Text>
                            <Text style={styles.gather}>초보가능, 친구와 함께 근무가능</Text>
                        </View>
                    </Layout>
                </Card>
                <Card style={styles.item}>
                    <Text style={styles.subhead}>근무지역</Text>
                    <Text style={{margin : 5}}>전국 (도서산간지역, 일부지역 제외)</Text>
                </Card>
                <Card style={styles.item}>
                    <Text style={styles.subhead}>근무조건</Text>
                    <Layout style = {{flexDirection : 'row'}}>
                        <View style={{flex : 1, marginLeft : 5}}>
                            <Text style={styles.gathertext}>급여</Text>
                            <Text style={styles.gathertext}>근무기간</Text>
                            <Text style={styles.gathertext}>근무요일</Text>
                            <Text style={styles.gathertext}>근무시간</Text>
                            <Text style={styles.gathertext}>업직종</Text>
                            <Text style={styles.gathertext}>고용형태</Text>
                        </View>
                        <View style={{flex : 5}}>
                            <Text style={styles.gather}>월급</Text>
                            <Text style={styles.gather}>1~3개월</Text>
                            <Text style={styles.gather}>월~금</Text>
                            <Text style={styles.gather}>09:00~18:00</Text>
                            <Text style={styles.gather}>배달,택배 퀵서비스</Text>
                            <Text style={styles.gather}>위촉직</Text>
                        </View>
                    </Layout>
                </Card>
                <Card style={styles.item}>
                    <Text>상세내용</Text>
                </Card>
            </ScrollView>
            <View style={styles.bottom}>
                <Button style={{width : '100%'}}onPress={()=>{alert('지원하기');}}>
                    지원하기
                </Button>
            </View>
        </Layout>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    commentBlock: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginVertical:10,
    },
    container : {
        flex : 1,
    },
    icons : {
        justifyContent: 'center', 
        alignItems: 'center',
        flex : 1,
    },
    item : {
        marginVertical : 20,
        paddingVertical : 10,
        paddingHorizontal : 10,
    },
    subhead : {
        fontSize : 16,
        fontWeight:'bold',
        margin : 5,
    },
    gathertext : {
        color : 'gray',
        marginVertical : 5,
    },
    gather :{
        marginVertical : 5,
    },
    bottom: {
        width: '100%', 
        height: 50, 
        justifyContent: 'center', 
        alignItems: 'center',
    }
});


export {defaultContent, MarketContent, AlbaContent}