import React from 'react';
import { SafeAreaView, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { Button, Card, List, Layout,Text} from '@ui-kitten/components'
import { ImageOverlay } from '../../../components/image-overlay.component';
import { HeartIcon, PlusIcon, ShareIcon } from '../../../assets/icons/icons';
import { Training } from './extra/data';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
const data: Training[] = [
    Training.basketball(),
    Training.running(),
    Training.workout(),
  ];


const JauScreen = ({navigation}) =>{
    return(
    <SafeAreaView style={{flex:1}}>
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            {/*   <Text>자유 화면입니다.</Text> */}
            {/* <Button onPress = {()=>{navigation.goBack()}}>뒤로가기</Button> */}
            <List
                style={styles.list}
                contentContainerStyle={styles.listContent}
                data={data}
                renderItem={renderItem}
            />
        </Layout>
     </SafeAreaView>
    )
}

const renderItemHeader = (info: ListRenderItemInfo<Training>): React.ReactElement => (
    <ImageOverlay
    style={styles.itemHeader}
    source={info.item.photo}>
    <Text
        style={styles.itemTitle}
        category='h4'
        status='control'>
        {info.item.title}
    </Text>
    </ImageOverlay>
);

const renderItemFooter = (): React.ReactElement => (
    <View style={styles.itemFooter}>
    <View style={styles.itemReactionsContainer}>
        <Button
        style={styles.iconButton}
        appearance='ghost'
        status='basic'
        icon={ShareIcon}/>
        <Button
        style={styles.iconButton}
        appearance='ghost'
        status='danger'
        icon={HeartIcon}
        />
    </View>
    <Button
        style={styles.itemAddButton}
        appearance='ghost'
        icon={PlusIcon}>
        Add Training
    </Button>
    </View>
);

const renderItem = (info: ListRenderItemInfo<Training>): React.ReactElement => (
    <Card
    style={styles.item}
    header={() => renderItemHeader(info)}
    footer={renderItemFooter}>
    <Text
        style={styles.itemDescription}
        category='s1'>
        {info.item.description}
    </Text>
    </Card>
);




const styles = StyleSheet.create({
list: {
    flex: 1,
},
listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
},
item: {
    marginVertical: 8,
},
itemHeader: {
    minHeight: 220,
},
itemTitle: {
    position: 'absolute',
    left: 24,
    bottom: 24,
},
itemDescription: {
    marginHorizontal: -8,
},
itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
},
itemReactionsContainer: {
    flexDirection: 'row',
},
itemAddButton: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 0,
},
iconButton: {
    paddingHorizontal: 0,
},
});













export {JauScreen}