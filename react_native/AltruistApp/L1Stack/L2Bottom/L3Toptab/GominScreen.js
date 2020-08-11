import React from 'react';
import {SafeAreaView,View,StyleSheet} from 'react-native';
import {Layout,Button,Text,ListItem,List, Divider,Card} from '@ui-kitten/components'


const sample = [
    {
        title:"first title",
        author:"Tune",
        view:"3023",
        up:"200",
        comment:"+2"
    },
    {
        title:"Second title",
        author:"Edward",
        view:"3023",
        up:"200",
        comment:"+2"
    },
    {
        title:"third title",
        author:"Roothyo",
        view:"3023",
        up:"200",
        comment:"+2"
    },
    {
        title:"third title",
        author:"Roothyo",
        view:"3023",
        up:"200",
        comment:"+2"
    },
    {
        title:"third title",
        author:"Roothyo",
        view:"3023",
        up:"200",
        comment:"+2"
    },
    {
        title:"third title",
        author:"Roothyo",
        view:"3023",
        up:"200",
        comment:"+2"
    },
    {
        title:"third title",
        author:"Roothyo",
        view:"3023",
        up:"200",
        comment:"+2"
    },
    {
        title:"third title",
        author:"Roothyo",
        view:"3023",
        up:"200",
        comment:"+2"
    },
    {
        title:"third title",
        author:"Roothyo",
        view:"3023",
        up:"200",
        comment:"+2"
    },
    {
        title:"third title",
        author:"Roothyo",
        view:"3023",
        up:"200",
        comment:"+2"
    },
    {
        title:"third title",
        author:"Roothyo",
        view:"3023",
        up:"200",
        comment:"+2"
    }
]


const GominScreen = ({navigation}) =>{
    
      const renderItem = ({ item, index }) => (
        <Card>
            
        </Card>
      );

        
        
        return(
        <SafeAreaView style={{flex:1}}>
            <List
            data ={sample}
            ItemSeparatorComponent={Divider}
            renderItem={renderItem} />
            <View style ={{ width:"100%",bottom:30,position :"absolute",display :"flex", flexDirection:"row",justifyContent:"center", alignItems:"center"}}>
                <Button onPress={()=>{navigation.navigate('Write')}} >글쓰기</Button>
            </View>
        </SafeAreaView>

        )

    }

export {GominScreen}