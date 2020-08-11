import React from 'react';
import { StyleSheet, View, Image, } from 'react-native';
import { Card, CardItem, List, Text, Button, Left } from '@ui-kitten/components';

const data = [
    {
        id : 1,
        overLine : "overLine!!",
        companyName : "(주) 사랑",
        context : "맥콜은 사랑입니다."
    },
    {
        id : 2,
        overLine : "overLine2",
        companyName : "카카오",
        context : "카카오는 돈이 많습니다 여기로 오세요"
    },
    {
        id : 3,
        overLine : "overLine3",
        companyName : "다음",
        context : "다음은 카카오의 계열사 입니다. 다음와도 카카오에요."
    }];

export const AlbaScreen = () => {

  // const renderItemHeader = (headerProps, info) => (
  //   <View {...headerProps}>
        
  //   </View>
  // );

  // const renderItemFooter = (footerProps) => (

  // );

  const renderItem = (info) => (
    <Card
      style={styles.item}
      status='basic'>
        <View>
        <View style={{flexDirection : 'row'}}>
            <View style={styles.Text}>
                <Text>{info.item.overLine}</Text>
                <Text style={{fontSize : 20}}>{info.item.companyName}</Text>
                <Text style={{marginTop : 10}}>{info.item.context}</Text>
            </View>
            <View style={styles.image}>
                <Image source={require('../../../assets/social_kakao.png')}/>
            </View>
        </View>
        
        <Button style={styles.button} appearance='ghost' onPress={()=>{
                alert('detail screen');
            }}>상세정보</Button>
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
    paddingHorizontal: 8,
    paddingVertical: 4,
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
  button:{
    width : 100,
  }
});