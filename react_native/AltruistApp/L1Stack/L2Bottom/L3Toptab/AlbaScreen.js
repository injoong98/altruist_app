import React from 'react';
import { StyleSheet, View, Image, Layout} from 'react-native';
import { Card, List, Text, Divider, Button, Spinner} from '@ui-kitten/components';
import axios from 'axios';
const data = [
    {
        id : 1,
        overLine : "제조업",
        companyName : "(주) 사랑",
        context : "맥콜공장알바/누구나가능/전화지원",
        place : "서울시 동작구",
        period : "시",
        payment : "8380원"
    },
    {
        id : 2,
        overLine : "IT 개발",
        companyName : "카카오",
        context : "카카오는 돈이 많습니다 여기로 오세요",
        place : "경기도 가평군",
        period : "일",
        payment : "10만원"
    },
    {
        id : 3,
        overLine : "마케팅관리",
        companyName : "다음",
        context : "다음은 카카오의 계열사 입니다. 다음와도 카카오에요.",
        place : "서울시 용산구",
        period : "월",
        payment : "40만원"
    },
    {
        id : 4,
        overLine : "마케팅관리",
        companyName : "다음",
        context : "다음은 카카오의 계열사 입니다. 다음와도 카카오에요.",
        place : "서울시 용산구",
        period : "월",
        payment : "40만원"
    },
    {
        id : 5,
        overLine : "마케팅관리",
        companyName : "다음",
        context : "다음은 카카오의 계열사 입니다. 다음와도 카카오에요.",
        place : "서울시 용산구",
        period : "월",
        payment : "40만원"
    },
    {
        id : 6,
        overLine : "마케팅관리",
        companyName : "다음",
        context : "다음은 카카오의 계열사 입니다. 다음와도 카카오에요.",
        place : "서울시 용산구",
        period : "월",
        payment : "40만원"
    }
  ];

class AlbaScreen extends React.Component {

  constructor(props){
    super(props);
    this.state={
      isLoading : true,
      lists : ''
    }
  }

  // const renderItemHeader = (headerProps, info) => (
  //   <View {...headerProps}>
        
  //   </View>
  // );

  // const renderItemFooter = (footerProps) => (
  //     <Text></Text>
  // );

  getPostList = async() =>{
    await axios.get('http://10.0.2.2/api/board_post/lists/b-a-3')
    .then((response)=>{
        this.setState({lists:response.data.view.list.data.list,isLoading:false});
    })
    .catch((error)=>{
        alert('error')
    })
  }
  componentDidMount(){
    this.getPostList();
  }

  renderItem = ({item, index}) => (
      <Card
      onPress={() => {this.props.navigation.navigate('AlbaContent', item);}}
      style={styles.carditem}
      status='basic'>
        <View style={{flexDirection : 'row'}}>
            <View style={styles.Text}>
                <Text style={{fontSize : 20}}>{item.mem_nickname}</Text>
                <Text style={{marginTop :5, marginBottom : 5}}>{item.title}</Text>
                <Divider style={{borderWidth : 0.5}}/>
                <Text>{item.post_hit} <Text style={{color : 'red'}}>{item.post_like}</Text> {item.post_datetime}</Text>
            </View>
            <View style={styles.image}>
                <Image source={require('../../../assets/social_kakao.png')}/>
            </View>
        </View>
    </Card>
  );

  render(){
    return (
      this.state.isLoading ? 
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text>
                <Spinner size="giant" />
            </Text>
        </View>:
      <>
      <View style={{flex:10}}>
        <List
          contentContainerStyle={styles.contentContainer}
          data={this.state.lists}
          renderItem={this.renderItem}/>
      </View>
      <View style={styles.bottomView}>
        <Button 
          style={styles.bottomButton}
          onPress={()=>{alert('Write')}}>
            글쓰기 
          </Button>
      </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
  },
  contentContainer: {
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  carditem: {
    marginVertical: 4,
  },
  Text : {
    flex : 2,
    marginLeft : 20,
    marginTop : 10,
    },
  image :{
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
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

export {AlbaScreen} ;