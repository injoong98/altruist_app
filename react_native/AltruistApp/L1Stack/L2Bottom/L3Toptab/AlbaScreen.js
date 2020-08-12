import React from 'react';
import { StyleSheet, View, Image} from 'react-native';
import { Card, List, Text, Divider} from '@ui-kitten/components';

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
    }];

export const AlbaScreen = ({navigation}) => {

  // const renderItemHeader = (headerProps, info) => (
  //   <View {...headerProps}>
        
  //   </View>
  // );

  // const renderItemFooter = (footerProps) => (
  //     <Text></Text>
  // );

  const renderItem = (info) => (
      <Card
      onPress={() => {navigation.navigate('Content');}}
      style={styles.item}
      status='basic'>
        <View style={{flexDirection : 'row'}}>
            <View style={styles.Text}>
                <Text>{info.item.overLine}</Text>
                <Text style={{fontSize : 20}}>{info.item.companyName}</Text>
                <Text style={{marginTop :5, marginBottom : 5}}>{info.item.context}</Text>
                <Divider style={{borderWidth : 0.5}}/>
                <Text>{info.item.place} <Text style={{color : 'red'}}>{info.item.period}</Text> {info.item.payment}</Text>
            </View>
            <View style={styles.image}>
                <Image source={require('../../../assets/social_kakao.png')}/>
            </View>
        </View>
    </Card>
  );

  return (
    <List
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={data}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {

  },
  contentContainer: {
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  item: {
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
});