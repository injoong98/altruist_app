import React from 'react';
import { Image, SafeAreaView, ListRenderItemInfo, StyleSheet, View, Dimensions } from 'react-native';
import { Button, Card, List, Layout,Text,Icon, StyleService} from '@ui-kitten/components'
import { ImageOverlay } from '../../../components/image-overlay.component';
import { HeartIcon, PlusIcon } from '../../../assets/icons/icons';

import { IlbanPost } from './extra/jaupost';

// const data: IlbanPost[] = [
    // IlbanPost.basketball(),
    // Training.running(),
    // Training.workout(),
//   ];

  function JauHeader(){
    return (info: ListRenderItemInfo<IlbanPost>): React.ReactElement => (
        <Layout  {...info}>
            {/* 카테고리, 제목, 작성자, 시간, 공유 */}
            <View style={styles.itemHeaderTop}>
                {/*     text-overflow: ellipsis; */}
                <View>
                    <Text category='s2'>[카테고리]
                    </Text>
                    <Text category='h4'>{info.item.title}
                    </Text>
                </View>
                <Button
                        style={styles.iconButton}
                        appearance='ghost'
                        status='basic'
                        accessoryLeft={ShareIcon} 
                        />
            </View>
            <View style={styles.itemHeaderBottom}>
                <Text category='s2'>작성자1</Text>
                <Text category='s2'> | 2020-08-15 00:00</Text>
                <Text category='s2'> | 조회수 0</Text>
            </View>
        </Layout >
    );
  }

  function JauFooter(onDetailButtonPress: () => void) {
      return (): React.ReactElement => (
          <View style={styles.itemFooter}>
              <View style={styles.itemReactionsContainer}>
                  <Button
                      style={styles.iconButton}
                      appearance='ghost'
                      status='basic'
                      accessoryLeft={HeartIcon} />
                  <Button
                      style={styles.iconButton}
                      appearance='ghost'
                      status='danger'
                      accessoryLeft={AltsIcon} />
              </View>
  
              <Button
                  style={styles.itemAddButton}
                  appearance='ghost'
                  onPress={onDetailButtonPress}
                  accessoryLeft={ArrowIcon}>
                              더보기
  
              </Button>
          </View>
      );
  }
  
  function OneArticle(renderItemContent: (info: ListRenderItemInfo<IlbanPost>) => React.ReactElement, renderItemFooter: () => React.ReactElement) {
      return (info: ListRenderItemInfo<IlbanPost>): React.ReactElement => (
          <Card
              style={styles.item}
              header={() => renderItemContent(info)}
              footer={renderItemFooter}>
                <ImageOverlay
                    style={styles.itemHeader}
                    source={info.item.photo} />
                    <Text
                        style={styles.itemDescription}
                        category='s1'>
                        {info.item.description}
                    </Text>
          </Card>
      );
  }
  
  //하나의 카드
  function JauView(renderItem: (info: ListRenderItemInfo<IlbanPost>) => React.ReactElement, onWriteButtonPress: () => void) {
      const newLocal = (
          <>
              <View style={{ flex: 10 }}>
                  <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                      <List
                          style={styles.list}
                          contentContainerStyle={styles.listContent}
                          data={data}
                          renderItem={renderItem} />
                  </Layout>
              </View>
              <View style={{ flex: 1 }}>
                  <Layout style={{ flex: 1, justifyContent: "center", padding: 16, marginBottom: 20, }}>
                      <Button style={styles.followButton} onPress={onWriteButtonPress}>글작성</Button>
                  </Layout>
              </View>
          </>
      );
      return newLocal;
  }
  
  //icon defines
    const AltsIcon = (props) => <Icon {...props} name="star" />;
    const ShareIcon = (props) => <Icon {...props} name="share-outline" />;
    const ArrowIcon = (props) => <Icon {...props} name="arrow-forward-outline" />;

      
      //네비게이션 (이동방향)
    const JauScreen = ({navigation}) =>{
          
          const onWriteButtonPress = (): void => {
              navigation.navigate('Write');
          };
          
          const onDetailButtonPress = (): void => {
              navigation.navigate('Content');
          };
          
          const renderItemHeader = JauHeader();
        //   const renderItemContent = JauContent();
          const renderItemFooter = JauFooter(onDetailButtonPress);
          const renderItem = OneArticle(renderItemHeader, renderItemFooter);
  
          return JauView(renderItem, onWriteButtonPress);    
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
    itemHeaderTop: {
        marginLeft : 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemHeaderBottom: {
        marginRight : 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
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
    })
  
export {JauScreen}
  

