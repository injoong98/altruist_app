import React from 'react';
import { SafeAreaView, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { Button, Card, List, Layout,Text,Icon, StyleService} from '@ui-kitten/components'
import { ImageOverlay } from '../../../components/image-overlay.component';
import { HeartIcon, PlusIcon, ShareIcon } from '../../../assets/icons/icons';
import { Training } from './extra/data';
const data: Training[] = [
    Training.basketball(),
    Training.running(),
    Training.workout(),
  ];

//icon defines
    const AltsIcon = (props) => <Icon {...props} name="star" />;
    const ComuIcon = (props) => <Icon {...props} name="layout-outline" />;
    const MesgIcon = (props) => <Icon {...props} name="flash-outline" />;
    const MypgIcon = (props) => <Icon {...props} name="person-outline" />;

    const JauScreen = ({navigation}) =>{

        const onWriteButtonPress = (): void => {
            navigation.navigate('Write');
          };
        
        const onDetailButtonPress = (): void => {
            navigation.navigate('Content');
          };
        
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
                icon={AltsIcon}
                />
                <Button
                style={styles.iconButton}
                appearance='ghost'
                status='danger'
                icon={AltsIcon}
                />
            </View>
            
            <Button
                style={styles.itemAddButton}
                appearance='ghost'
                 onPress = {onDetailButtonPress}
                icon={PlusIcon}>
                View Detail
                
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





    return(
    <>
    <View style={{flex:10}} >
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}} >
            {/*   <Text>자유 화면입니다.</Text> */}
            {/* <Button icon={AltsIcon} onPress = {()=>{navigation.goBack()}}>뒤로가기</Button> */}
            
            <List
                style={styles.list}
                contentContainerStyle={styles.listContent}
                data={data}
                renderItem={renderItem}
            />
        </Layout>
     </View>
    <View style={{flex:1}}>
        <Layout style={{flex:1,justifyContent:"center", padding: 16, marginBottom: 20, }}>
            <Button style={styles.followButton} onPress = {onWriteButtonPress}>글작성</Button>
        </Layout>
     </View>
     </>
    )
    
    
}





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
followButton: {
    marginTop: 24,
  },
});



export {JauScreen}