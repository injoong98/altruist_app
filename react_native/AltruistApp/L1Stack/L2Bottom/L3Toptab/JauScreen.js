import React, {Fragment} from 'react';
import {
  Root,
  StyleSheet,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Layout,
} from 'react-native';
import {
  Button,
  Card,
  List,
  Text,
  Icon,
  StyleService,
  Spinner,
  Divider,
} from '@ui-kitten/components';
import {PlusIcon} from '../../../assets/icons/icons';
import {getPostList} from './extra/getPost';
import axios from 'axios';
import {HTML} from 'react-native-render-html';
import {IGNORED_TAGS} from 'react-native-render-html/src/HTMLUtils';
import {PostTime} from '../../../components/PostTime';
import {WebView} from 'react-native-webview';

import Heartsvg from '../../../assets/icons/heart.svg';
import Viewsvg from '../../../assets/icons/view.svg';
import Commentsvg from '../../../assets/icons/comment.svg';
import Writesvg from '../../../assets/icons/write.svg';
import Sharesvg from '../../../assets/icons/share.svg';

class JauScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      lists: '',
      post_content: '',
      image_url: '/react_native/AltruistApp/assets/images/noimage_120x90.gif',
      categorys: '',
      post_category: '',
      no_post: false,
    };
  }

  ignoredTags = [...IGNORED_TAGS, 'img'];

  getPostList = async () => {
    await axios
      .get(
        `http://dev.unyict.org/api/board_post/lists/ilban?category_id=${this.state.post_category}`,
      )
      .then((response) => {
        // console.log(response);
        if (response.data.view.list.data.list == '') {
          this.setState({
            no_post: true,
            no_post_memo: '게시글의 첫 주인공이 되어주세요!',
          });
        } else {
          this.setState({
            lists: response.data.view.list.data.list,
            isLoading: false,
            no_post: false,
          });
        }
      })
      .catch((error) => {
        alert('erdsadsaror');
      });
  };

  getCategory = async () => {
    await axios
      .get(`http://dev.unyict.org/api/board_post/lists/ilban`)
      .then((res) => {
        // console.log(res)
        this.setState({
          categorys: res.data.view.list.board.category[0],
          isLoading: false,
        });
      })
      .catch((error) => {
        alert('erdsadsarorasddsa');
      });
  };

  //LIFECYCLE
  componentDidMount() {
    this.getPostList();
    this.getCategory();
  }

  componentDidUpdate() {}

  renderItem = ({item, index}) => {
    const regex = /(<([^>]+)>)|&nbsp;/gi;
    const post_remove_tags = item.post_content.replace(regex, '');
    return (
      <TouchableOpacity
        style={styles.itembox}
        onPress={() => {
          this.props.navigation.navigate('GominContent', {
            OnGoback: () => this.onRefresh(),
            post_id: item.post_id,
          });
        }}>
        {/* 헤더 */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 10,
            marginRight: 10,
          }}>
          {/*카테고리(이미지)/ 제목 / 공유*/}
          {/* */}
          <View style={{flexDirection: 'row'}}>
            <Text>{item.post_category}</Text>
            <Text>{item.post_title}</Text>
          </View>
          <Sharesvg />
        </View>
        {/* 본문 */}
        <View
          style={{
            flex: 2,
            marginTop: 20,
            marginBottom: 20,
            marginLeft: 20,
            marginRight: 20,
            alignContent: 'center',
          }}>
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            AccessibilityRole="button">
            {post_remove_tags}
          </Text>
          {item.origin_image_url ? (
            <View style={{flexDirection: 'row'}}>
              <Image
                source={{uri: 'https://dev.unyict.org' + item.origin_image_url}}
              />
            </View>
          ) : (
            <View style={{flexDirection: 'row'}}></View>
          )}
        </View>
        {/* 푸터 */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 10,
            marginRight: 10,
          }}>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <Text category="s2" style={{fontWeight: '100', marginRight: 10}}>
              {item.display_name}
            </Text>
            <PostTime datetime={item.post_datetime} />
          </View>
          <View>
            <View style={{flexDirection: 'row'}}>
              <View>
                <Heartsvg />
                <Text>{item.post_like}</Text>
              </View>
              <View>
                <Commentsvg />
                <Text>{item.post_comment_count}</Text>
              </View>
              <View>
                <Viewsvg />
                <Text>{item.post_hit}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderCategory = ({item}) => (
    <TouchableOpacity
      style={{
        alignContent: 'center',
        marginHorizontal: 4,
        borderWidth: 1,
        padding: 10,
        marginRight: 10,
        marginLeft: 10,
      }}
      onPress={() => {
        this.setState({post_category: item.bca_key}, this.getPostList);
      }}>
      <Text>{item.bca_value}</Text>
    </TouchableOpacity>
  );

  render() {
    return (
      <>
        <View
          style={{backgroundColor: 'white'}}
          refreshing={this.state.isLoading}>
          <ScrollView style={styles.category} horizontal={true}>
            <TouchableOpacity
              style={{
                alignContent: 'center',
                marginHorizontal: 4,
                borderWidth: 1,
                padding: 10,
                marginRight: 10,
                marginLeft: 10,
              }}
              onPress={() => {
                this.setState({post_category: ''}, this.getPostList);
              }}>
              <Text>{`전체`}</Text>
            </TouchableOpacity>
            <List
              style={{backgroundColor: 'white'}}
              horizontal={true}
              data={this.state.categorys}
              renderItem={this.renderCategory}
            />
          </ScrollView>
        </View>
        <SafeAreaView style={{flex: 10, backgroundColor: 'white'}}>
          {this.state.no_post ? (
            <Text
              style={{
                flex: 10,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}>
              {this.state.no_post_memo}
            </Text>
          ) : (
            <List
              style={{backgroundColor: 'white'}}
              data={this.state.lists}
              contentContainerStyle={styles.contentContainer}
              renderItem={this.renderItem}
              refreshing={this.state.isLoading}
              onRefresh={this.getPostList}
            />
          )}
          <TouchableOpacity
            style={{position: 'absolute', right: 20, bottom: 14}}
            onPress={() => {
              this.props.navigation.navigate('IlbanWrite', {
                statefunction: this.statefunction,
              });
            }}>
            <Writesvg />
          </TouchableOpacity>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  renderers: {},
  root: {
    backgroundColor: '#FFFFFF',
  },

  //ita geasipan
  itembox: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 10,
    marginVertical: 4,
  },
  itemContent: {
    marginTop: 10,
    marginBottom: 10,
  },
  category: {
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export {JauScreen};
