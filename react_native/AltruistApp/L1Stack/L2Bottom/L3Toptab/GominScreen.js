import React from 'react';
import {SafeAreaView,View,StyleSheet} from 'react-native';
import { Icon,Layout,Button,Text,ListItem,List, Divider,Card} from '@ui-kitten/components'


const sample = [
    {
        title:"first title 고민있어요 제목을 길게 써보면 어떻게 나올까요",
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
    const EyeIcon = (props)=>(
        <Icon style={styles.icon} fill='#8F9BB3' name="eye"/>
    )
    const CommentIcon = (props)=>(
        <Icon style={styles.icon} fill='#8F9BB3' name="message-circle"/>
    )
    const HeartIcon = (props)=>(
        <Icon style={styles.icon} fill='#8F9BB3' name="heart"/>
    )
    
    
    
    const renderItem = ({ item, index }) => (
        <Card onPress = {()=>{navigation.navigate('GominContent')}} >
            <Text category="h6" numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
            <View style={styles.subtitle}>
                <Text category="s1">{item.author}</Text>
                <View style={styles.infocontainer}>
                    <EyeIcon />
                    <Text category="s1">{item.view}</Text>
                    <HeartIcon />
                    <Text category="s1">{item.up}</Text>
                    <CommentIcon />
                    <Text category="s1">{item.comment}</Text>
                </View>

            </View>
        </Card>

      );

        
        
        return(
        <SafeAreaView style={{flex:1}}>
            <List
            data ={sample}
            ItemSeparatorComponent={Divider}
            renderItem={renderItem} />
            <View style ={styles.buttoncontainer}>
                <Button onPress={()=>{navigation.navigate('Write')}} >글쓰기</Button>
            </View>
        </SafeAreaView>

        )

    }

export {GominScreen}

const styles = StyleSheet.create({
    buttoncontainer:{
        width:"100%",bottom:30,position :"absolute",
        display :"flex", 
        flexDirection:"row",
        justifyContent:"center", 
        alignItems:"center"
    },
    icon:{
        width: 24,height: 24,marginLeft:5
    },
    subtitle:{
        marginTop:10, display:"flex",flexDirection:"row", justifyContent:"space-between"
    },
    infocontainer:{
        display:"flex",flexDirection:"row"
    }
})