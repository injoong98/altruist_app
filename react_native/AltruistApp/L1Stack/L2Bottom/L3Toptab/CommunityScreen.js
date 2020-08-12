import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Image,
    StatusBar,
  } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {Toggle, Layout, Button, Text, Icon, List, ListItem} from '@ui-kitten/components';
import * as eva from '@eva-design/eva'; 
import { ListAccessoriesShowcase } from '../../../ListAccessoriesShowcase';



export const ToggleSimpleUsageShowcase = () => {

  const [checked, setChecked] = React.useState(false)

  const onCheckedChange = (isChecked, hotnew) => {
    setChecked(isChecked);
  };

  return (
    <Toggle checked={checked} onChange={onCheckedChange}>
      {`${checked}`}
    </Toggle>
  );
};


// 핫게
export const Ilban = () => {
    return(
    //그림자 주기
    <View>
        <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
            <ToggleSimpleUsageShowcase />
            <Text style={styles.title}>더보기</Text>
        </View>
        <View>
          <ListAccessoriesShowcase />
        </View>
    </View>
    );
}

    

const CommunityScreen = ({navigation}) =>{
    return(
    <SafeAreaView style={{flex:1}} {...eva} theme={eva.light}> 
        <Layout>
            <ScrollView>
                <Ilban style={{alignItems:'auto'}}/>
                {/* <Gomin />
                <Market />
                <Alba /> */}
            <Text>커뮤니티 화면입니다.</Text>
            <Button onPress = {()=>{navigation.goBack()}}>뒤로가기</Button>
            <Button onPress = {()=>{navigation.navigate('Write')}}>글작성</Button>
            </ScrollView>
        </Layout>   
    </SafeAreaView>

    )
}


const styles = StyleSheet.create({
    title : {
      fontWeight: "bold",
    }, 
});

export {CommunityScreen}