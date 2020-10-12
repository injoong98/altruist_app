import React from 'react';
import { StyleSheet, SafeAreaView, View, Image, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView,
  VirtualizedList,
  Alert,
  useState,
  NativeModules,
  TouchableOpacity,
  TextInput,
  Keyboard,
  StatusBar,
  Pressable,
  Platform
} from 'react-native';
import {
  Layout,
  Button,
  Text,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Divider,
  Input,
  RadioGroup,
  Radio,
  Tooltip,
  CheckBox,
  IndexPath,
  Select,
  SelectItem,
  Card,
  Modal,
  Spinner,
  Popover,
} from '@ui-kitten/components';
import HTML from 'react-native-render-html';
import ImagePicker from 'react-native-image-crop-picker';
import {HeartIcon} from '../assets/icons/icons';
import axios from 'axios';
import {ActionSheet, Root} from 'native-base';
import {TopBarTune} from '../components/TopBarTune';
import {WriteContentToptab} from '../components/WriteContentTopBar';
import Confirm from '../components/confirm.component';
import Camsvg from '../assets/icons/Icon_Cam.svg';
import Tooltipsvg from '../assets/icons/tooltip.svg';
import Noimage from '../assets/images/noimage.png';

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CloseIcon = (props) => <Icon {...props} name="close" />;
const UpIcon = (props) => <Icon {...props} name="arrow-circle-up-outline" />;

const defaultWrite = ({navigation}) => {
  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title="글작성"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={{flex: 10}}>
        <ScrollView>
          <Text>This is Write</Text>
        </ScrollView>
      </Layout>
      <View style={styles.bottomView}>
        <Button
          style={styles.bottomButton}
          onPress={() => {
            navigation.goBack();
          }}>
          글쓰기
        </Button>
      </View>
    </SafeAreaView>
  );
};
class GominWrite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      post_title:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.post_title
          : '',
      post_content:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.content
          : '',
      post_anoymous_yn: 1,
        // this.props.route.params.mode == 'edit'
        //   ? this.props.route.params.post.post_anoymous_yn
        //   : 1,
      post_category: 1,
      checked:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.post_anoymous_yn == 0
            ? false
            : true
          : true,
      modalVisible: false,
      resultVisible: false,
      spinnerVisible: false,
      resultText : '',
      modalType : 0,
    };
  }

  submitPost = async () => {
    const url =
      this.props.route.params.mode == 'edit'
        ? 'http://dev.unyict.org/api/board_write/modify'
        : 'http://dev.unyict.org/api/board_write/write/b-a-1';
    const {
      post_title,
      post_content,
      post_anoymous_yn,
      post_category,
    } = this.state;
    let formdata = new FormData();
    formdata.append('post_title', post_title);
    formdata.append('post_content', post_content);
    formdata.append('post_category', post_category);
    formdata.append('post_anoymous_yn', post_anoymous_yn);
    formdata.append('brd_key', 'b-a-1');

    this.props.route.params.mode == 'edit'
      ? formdata.append('post_id', this.props.route.params.post.post_id)
      : null;

    await axios
      .post(url, formdata)
      .then((response) => {
        const {message, status} = response.data;
        if (status == '500') {
          this.setState({spinnerVisible: false, resultVisible: true, resultText : message});
        } else if (status == '200') {
          this.setState({spinnerVisible: false, resultVisible: true, 
            resultText : (this.props.route.params.mode == 'edit'?'게시글 수정 완료':'게시글 작성 완료')});
        }
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      });
  };

  filterSpamKeyword = async () => {
    const {post_title, post_content} = this.state;

    var formdata = new FormData();
    formdata.append('title', post_title);
    formdata.append('content', post_content);
    formdata.append('csrf_test_name', '');

    //Keyboard
    Keyboard.dismiss();

    await axios
      .post('http://dev.unyict.org/api/postact/filter_spam_keyword', formdata)
      .then((response) => {
        const {message, status} = response.data;
        if (status == '500') {
          alert(message);
        } else if (status == '200') {
          this.setState({modalVisible: true, modalType:0});
        }
      })
      .catch((error) => {
        alert(`금지단어 검사에 실패 했습니다. ${error.message}`);
      });
  };

  gobackfunc = () => {
    if(Platform.OS!=='ios'){
      StatusBar.setBackgroundColor('#B09BDE');
      StatusBar.setBarStyle('default');
    }
    const {navigation, route} = this.props;
    navigation.goBack();
    route.params.statefunction();
  };

  componentDidMount = () => {
    if(Platform.OS!=='ios'){
      StatusBar.setBackgroundColor('#F4F4F4');
      StatusBar.setBarStyle('dark-content');
    }
  }

  modalList =[
    {
      text : this.props.route.params.mode == 'edit'? '게시글을 수정하시겠습니까?': '게시글을 작성하시겠습니까?',
      func : this.submitPost
    },
    {
      text : '게시글 작성을 그만하시겠습니까?',
      func : this.gobackfunc
    }
  ]
  
  render() {
    const {navigation} = this.props;
    const {post_title, post_category, post_anoymous_yn, post_content, checked, content, modalVisible,
      spinnerVisible, resultVisible, } = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <Pressable
          style={{flex: 1}}
          onPress={()=>Keyboard.dismiss()}
        >

          <WriteContentToptab text="고민 작성"
            right={this.props.route.params.mode == 'edit' ? 'edit' : 'upload'}
            func={this.filterSpamKeyword}
            gbckfunc={()=>this.setState({modalType : 1, modalVisible:true})}
            gbckuse={true}/>
          <TextInput
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 8.5,
              marginTop: 18,
              marginHorizontal: 12,
              marginBottom: 14,
              fontSize: 18,
            }}
            placeholder="제목"
            onChangeText={(nextValue) => this.setState({post_title: nextValue})}
            placeholderTextColor="#A897C2"
            value={post_title}
          />
          <TextInput
            value={post_content}
            style={{
              height: '80%',
              maxHeight: '50%',
              backgroundColor: '#ffffff',
              borderRadius: 8.5,
              marginHorizontal: 12,
              marginBottom: 14,
              fontSize: 18,
            }}
            placeholder="내용"
            onChangeText={(nextValue) => this.setState({post_content: nextValue})}
            multiline={true}
            textAlignVertical="top"
            textStyle={{minHeight: 100}}
            placeholderTextColor="#A897C2"
          />
          {/* <View style={{alignItems: 'flex-end', paddingRight: 12}}>     ------ 익명여부 체크박스
             <CheckBox
              checked={checked}
              onChange={(nextChecked) =>
                this.setState({
                  post_anoymous_yn: nextChecked ? 1 : 0,
                  checked: nextChecked,
                })
              }>
              {() => <Text category="h3">익명</Text>}
            </CheckBox>
          </View> */}
        </Pressable>

        <Modal
          visible={modalVisible}
          backdropStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          onBackdropPress={() => this.setState({modalVisible: false})}>
          <Confirm
            confirmText={this.modalList[this.state.modalType].text}
            frstText="예"
            OnFrstPress={() => {
              this.setState({modalVisible: false}, this.modalList[this.state.modalType].func);
            }}
            scndText="아니오"
            OnScndPress={() => this.setState({modalVisible: false})}
          />
        </Modal>
        <Modal
          visible={resultVisible}
          backdropStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          onBackdropPress={() => this.setState({resultVisible: false})}>
          <Confirm
            type="result"
            confirmText={this.state.resultText}
            frstText="닫기"
            OnFrstPress={() => {
              this.setState({resultVisible: false});
              this.gobackfunc();
            }}
          />
        </Modal>
        <Modal
          visible={spinnerVisible}
          backdropStyle={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
          <Spinner size="giant" />
        </Modal>
        {/* </KeyboardAvoidingView> */}
      </SafeAreaView>
    );
  }
}

class MarketWrite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      post_title:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.post_title
          : '',
      post_content:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.post_content
          : '',
      post_location:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.post_location
          : '',
      post_hp:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.post_hp
          : '',
      deal_price:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.deal_price
          : 0,
      deal_type:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.deal_type
          : 2, // 0: 직거래, 1: 배송, 2: 둘다가능
      deal_status: 1, // 0: 판매완료, 1: 판매중
      post_thumb_use:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.post_thumb_use
          : 1, // 0: 썸네일 사용X, 1: 사용
      post_main_thumb:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.post_main_thumb
          : 0, // 썸네일 사진 index
      thumb_index_storage: 0, // 썸네일 index 임시저장
      Image_index:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.image.length
          : 0,
      images:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.image
          : [],
      image: '',
      thumbModalVisible: false,
      modalVisible: false,
      resultVisible: false,
      spinnerVisible: false,
      resultText : '',
      modalType : 0,
    };
  }

  componentDidMount() {
    if(Platform.OS!=='ios'){
      StatusBar.setBackgroundColor('#F4F4F4');
      StatusBar.setBarStyle('dark-content');
    }

  }

  submitPost = async () => {
    console.log(this.state);
    const url =
      this.props.route.params.mode == 'edit'
        ? 'http://dev.unyict.org/api/board_write/modify'
        : 'http://dev.unyict.org/api/board_write/write/b-a-2';
    const {
      post_title,
      post_content,
      post_location,
      deal_price,
      deal_type,
      deal_status,
      images,
      post_hp,
      post_thumb_use,
      post_main_thumb,
    } = this.state;

    let formdata = new FormData();
    formdata.append('brd_key', 'b-a-2');
    formdata.append('post_title', post_title);
    formdata.append('post_content', post_content);
    formdata.append('post_location', post_location);
    formdata.append('post_hp', post_hp);
    formdata.append('post_thumb_use', post_thumb_use);
    formdata.append('post_main_thumb', post_main_thumb);
    formdata.append('deal_price', deal_price);
    formdata.append('deal_type', deal_type);
    formdata.append('deal_status', deal_status);
    images.map((item) => {
      formdata.append('post_file[]', {
        uri: item.path,
        type: item.mime,
        name: 'image.jpg',
      });
    });
    
    console.log(formdata);
    
    this.props.route.params.mode == 'edit'
      ? formdata.append('post_id', this.props.route.params.post.post_id)
      : null;

    //10.0.1.1  dev.unyict.org
    await axios
      .post(url, formdata)
      .then((response) => {
        const {message, status} = response.data;
        if (status == '500') {
          this.setState({spinnerVisible: false, resultVisible: true, resultText : message});
        } else if (status == '200') {
          this.setState({spinnerVisible: false, resultVisible: true, 
            resultText : (this.props.route.params.mode == 'edit'?'게시글 수정 완료':'게시글 작성 완료')});
        }
      })
      .catch((error) => {
        this.setState({spinnerVisible: false});
        console.log(error);
        alert(JSON.stringify(error));
      });
  };

  gobackfunc = () => {
    if(Platform.OS!=='ios'){
      StatusBar.setBackgroundColor('#B09BDE');
      StatusBar.setBarStyle('default');
    }
    const {navigation, route} = this.props;
    navigation.goBack();
    route.params.statefunction();
  };

  //사진버튼 클릭했을 때
  onClickAddImage() {
    const buttons = ['카메라 촬영', '갤러리에서 선택', '취소'];
    ActionSheet.show(
      {options: buttons, cancelButtonIndex: 2, title: 'Select a photo'},
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            this.takePhotoFromCamera();
            break;
          case 1:
            this.choosePhotoFromGallery();
            break;
          default:
            break;
        }
      },
    );
  }

  //카메라로 사진 찍기
  takePhotoFromCamera() {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      this.onSelectedImage(image);
      //  console.log(image);
    });
  }

  //갤러리에서 사진 가져오기
  choosePhotoFromGallery() {
    ImagePicker.openPicker({
      multiple: true,
      includeExif: false,
    }).then((image) => {
      image.map((item) => this.onSelectedImage(item));
      //console.log(image);
    });
  }

  //불러온 사진의 정보를 this.state에 저장
  onSelectedImage(image) {
    console.log(image);
    let newImages = this.state.images;
    const source = {uri: image.path};
    let item = {
      id: Date.now(),
      url: source,
      mime: image.mime,
      path: image.path,
      content: image.data,
      index: this.state.Image_index,
    };
    console.log(item);
    this.setState({Image_index: this.state.Image_index + 1});
    newImages.push(item);
    this.setState({images: newImages});
  }

  deleteImage(index) {
    console.log(index);
    const {images, Image_index} = this.state;
    index==this.state.post_main_thumb
    ?this.setState({post_main_thumb:0})
    :null;
    images.splice(index,1);
    images.map(i => i.index>index
      ?i.index--
      :null
    );
    this.setState({images: images, Image_index:Image_index-1});
  }
  
  renderImage(image) {
    // console.log(image);
    // console.log(index);
    return (
      <View key={image.id}>
        <TouchableWithoutFeedback
          onPress={() =>
            this.setState({
              thumbModalVisible: true,
              thumb_index_storage: image.index,
            })
          }>
          <View>
            {image.index==this.state.post_main_thumb
            ?<View style={{position:'absolute', backgroundColor:'#63579D', zIndex:1, marginLeft:10, width:35, height:20, alignItems:'center', justifyContent:'center'}}>
              <Text style={{color:'white', fontSize:13}} category='c1'>대표</Text>
            </View>
            :null
            }
            <Image
              style={styles.market_RenderImage}
              source={
                image.edit
                  ? {uri: image.url}
                  : image.url
              }
            />
            <View style={{position:'absolute', right:0, zIndex:2, width:20, height:20}}>
              <TouchableWithoutFeedback onPress={()=>this.deleteImage(image.index)}>
                <Icon style={{width:20, height:20}} fill='#63579D' name='close-outline'/>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }

  BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        this.props.navigation.goBack();
      }}
    />
  );

	filterSpamKeyword = async () => {
    const {post_title, post_content} = this.state;

    var formdata = new FormData();
    formdata.append('title', post_title);
    formdata.append('content', post_content);
    formdata.append('csrf_test_name', '');

    //Keyboard
    Keyboard.dismiss();

    await axios
      .post('http://dev.unyict.org/api/postact/filter_spam_keyword', formdata)
      .then((response) => {
        const {message, status} = response.data;
        if (status == '500') {
          alert(message);
        } else if (status == '200') {
          this.setState({modalVisible: true, modalType:0});
        }
      })
      .catch((error) => {
        alert(`금지단어 검사에 실패 했습니다. ${error.message}`);
      });
  };

  modalList =[
    {
      text : this.props.route.params.mode == 'edit'? '게시글을 수정하시겠습니까?': '게시글을 작성하시겠습니까?',
      func : this.submitPost
    },
    {
      text : '게시글 작성을 그만하시겠습니까?',
      func : this.gobackfunc
    }
  ]

  render() {
    const {navigation} = this.props;
    const {
      post_title,
      post_content,
      post_location,
      post_hp,
      deal_price,
      deal_type,
      deal_status,
      post_thumb_use,
			post_main_thumb,
			modalVisible,
			spinnerVisible,
      resultVisible,
    } = this.state;

    return (
      <Root>
        <SafeAreaView style={{flex: 1}}>
          <WriteContentToptab
            text="수수마켓"
            right={this.props.route.params.mode == 'edit' ? 'edit' : 'upload'}
            func={() => {
              this.filterSpamKeyword();
            }}
            gbckfunc={() => {this.setState({modalType:1, modalVisible : true})}}
            gbckuse={true}
          />

          {/* <TopNavigation title="글작성" alignment="center" accessoryLeft={this.BackAction} style={styles.topbar}/> */}

          <Divider />

          <ScrollView>
            <View style={{paddingVertical: 10, backgroundColor: '#F4F4F4'}}>
              <View style={styles.container}>
                {/* <Text>상품명</Text> */}
                <TextInput
                  style={{...styles.input, height: 60, fontSize: 20}}
                  onChangeText={(text) => this.setState({post_title: text})}
                  value={post_title}
                  placeholder="상품명"
                />
              </View>
              <View style={{...styles.container, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  {/* <Text>판매가격</Text> */}
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    onChangeText={(text) => this.setState({deal_price: text})}
                    value={deal_price.toString()}
                    placeholder="판매가격"
                  />
                </View>
                <View style={{flex: 1}}>
                  {/* <Text>연락처</Text> */}
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    onChangeText={(text) => this.setState({post_hp: text})}
                    value={post_hp}
                    placeholder="연락처"
                  />
                </View>
              </View>
              <View style={styles.container}>
                {/* <Text>상세정보</Text> */}
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.setState({post_content: text})}
                  value={post_content}
                  placeholder="상세정보"
                  multiline={true}
                  numberOfLines={7}
                  textAlignVertical="top"
                />
              </View>
              <View style={styles.container}>
                {/* <Text>거래희망지역</Text> */}
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.setState({post_location: text})}
                  value={post_location}
                  placeholder="거래희망지역"
                />
              </View>
              <View style={{...styles.container, flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text>거래방법</Text>
                </View>
                <View style={{...styles.deal_type, flex: 3}}>
                  <TouchableWithoutFeedback
                    onPress={() => this.setState({deal_type: 0})}>
                    <View
                      style={
                        deal_type == 0
                          ? {...styles.deal_box, opacity: 1.0}
                          : styles.deal_box
                      }>
                      <Text style={styles.deal_type_text}>배송</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => this.setState({deal_type: 1})}>
                    <View
                      style={
                        deal_type == 1
                          ? {...styles.deal_box, opacity: 1.0}
                          : styles.deal_box
                      }>
                      <Text style={styles.deal_type_text}>직거래</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => this.setState({deal_type: 2})}>
                    <View
                      style={
                        deal_type == 2
                          ? {...styles.deal_box, opacity: 1.0}
                          : styles.deal_box
                      }>
                      <Text style={styles.deal_type_text}>둘다가능</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <Layout style={styles.picture}>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 10,
                  }}>
                  <Text category="h4" style={{color:'#63579D'}}> 사진</Text>
                  <TouchableOpacity onPress={() => this.onClickAddImage()}>
                    <Camsvg />
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal style={{height: 150}}>
                  {this.state.images
                    ? this.state.images.map((item) => this.renderAsset(item))
                    : null}
                </ScrollView>
              </Layout>
              {/*<View style={styles.container}>
                            <Text>사진</Text>
                            <ScrollView 
                            horizontal={true} 
                            style={{
                                marginVertical : 2,
                                margin : 10,
                                marginTop : 5,
                                backgroundColor : '#F4F4F4'
                            }}>
                                <TouchableOpacity 
                                style={{width:100, height:100, backgroundColor:'white', alignItems:'center', justifyContent:'center', borderRadius:10}} 
                                onPress={()=>this.onClickAddImage()}>
                                    <Camsvg/>
                                </TouchableOpacity>
                                {this.state.images ? this.state.images.map((item) => this.renderAsset(item)) : null}
                            </ScrollView>                                                 
                        </View> */}
              {/* <View style={{...styles.container, flexDirection:'row'}}>
                            <Text>썸네일</Text>
                            <RadioGroup
                                value={post_thumb_use}
                                style={{flexDirection:'row'}}
                                selectedIndex = {post_thumb_use}
                                onChange={(index) => { this.setState({post_thumb_use:index})}}>
                                <Radio>off</Radio>
                                <Radio>on</Radio>
                            </RadioGroup>
                        </View> */}
              {/* <Button onPress={()=>console.log(this.state.images)}>콘솔</Button> */}
            </View>
          </ScrollView>
          <Modal
            visible={this.state.thumbModalVisible}
            backdropStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
            onBackdropPress={() => this.setState({thumbModalVisible: false})}>
            <Confirm
              confirmText="대표 이미지를 변경하시겠습니까?"
              frstText="예"
              OnFrstPress={() =>
                this.setState({
                  thumbModalVisible: false,
                  post_main_thumb: this.state.thumb_index_storage,
                })
              }
              scndText="아니오"
              OnScndPress={() => this.setState({thumbModalVisible: false})}
            />
          </Modal>
					<Modal
						visible={modalVisible}
						backdropStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
						onBackdropPress={() => this.setState({modalVisible: false})}>
						<Confirm
							confirmText={this.modalList[this.state.modalType].text}
							frstText="예"
							OnFrstPress={() => {
								this.setState({modalVisible: false}, this.modalList[this.state.modalType].func);
							}}
							scndText="아니오"
							OnScndPress={() => this.setState({modalVisible: false})}
						/>
					</Modal>
					<Modal
						visible={resultVisible}
						backdropStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
						onBackdropPress={() => this.setState({resultVisible: false})}>
						<Confirm
							type="result"
							confirmText={this.state.resultText}
							frstText="닫기"
							OnFrstPress={() => {
								this.setState({resultVisible: false});
								this.gobackfunc();
							}}
						/>
					</Modal>
					<Modal
						visible={spinnerVisible}
						backdropStyle={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
						<Spinner size="giant" />
					</Modal>
        </SafeAreaView>
      </Root>
    );
  }
}

class AlbaWrite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post_title:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.post_title
          : '',
      post_content:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.post_content
          : '',
      post_location:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.post_location
          : '',
      post_hp:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.post_hp
          : '',
      alba_type:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.post.alba_type
          : 0,
      alba_salary_type:
        this.props.route.params.mode == 'edit'
				? this.props.route.params.post.alba_salary_type
				: 0,
      alba_salary:
        this.props.route.params.mode == 'edit'
					? this.props.route.params.post.alba_salary=='추후협의'
						? '추후협의'
						: this.props.route.params.post.alba_salary
					:'',
      images:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.file_images
          : [],
      isTipVisible: false,
			isFollowUp: 
				this.props.route.params.mode == 'edit'
					? this.props.route.params.post.alba_salary=='추후협의'
						? true
						: false
					:false,
			post_thumb_use: 
				this.props.route.params.mode == 'edit'
					? this.props.route.params.post.post_thumb_use == 0
						? true
						: false
					: false,
      salary_storage: 0,
      popoverVisible : false,
      modalVisible : false,
      resultVisible : false,
      spinnerVisible : false,
      modalType : 0,
    };
  }

  Salary_Type = ['시급', '일급', '주급', '월급'];
  
  componentDidMount() {
    if(Platform.OS!=='ios'){
      StatusBar.setBackgroundColor('#F4F4F4');
      StatusBar.setBarStyle('dark-content');
    }
  }
  
  setTipVisible = (bool) => {
    this.setState({isTipVisible: bool});
  };
  setFollowUp = (nextChecked) => {
		this.setState({isFollowUp: nextChecked});
		nextChecked==true
		? this.setState({salary_storage: this.state.alba_salary, alba_salary: '추후협의'})
		: this.setState({alba_salary: this.state.salary_storage});
  };
  setSumnailCheck = (nextChecked) => {
    this.setState({post_thumb_use: nextChecked});
  };
  submitPost = async () => {
    const url =
      this.props.route.params.mode == 'edit'
        ? 'http://dev.unyict.org/api/board_write/modify'
        : 'http://dev.unyict.org/api/board_write/write/b-a-3';

    const { post_title, post_content, post_location, post_hp, alba_type, alba_salary_type,  alba_salary, images,post_thumb_use,	isFollowUp,} = this.state;
    let formdata = new FormData();
    formdata.append('brd_key', 'b-a-3');
    formdata.append('post_title', post_title);
    formdata.append('post_content', post_content);
    formdata.append('post_location', post_location);
    formdata.append('post_hp', post_hp);
    formdata.append('alba_type', alba_type);
    formdata.append('alba_salary_type', alba_salary_type);
    formdata.append('alba_salary', alba_salary);
    console.log(post_thumb_use ? 0 : 1);
    formdata.append('post_thumb_use', post_thumb_use ? 0 : 1);

    images.map((item) => {
      formdata.append('post_file[]', {
        uri: item.path,
        type: item.mime,
        name: 'image.jpg',
      });
    });
    this.props.route.params.mode == 'edit'
      ? formdata.append('post_id', this.props.route.params.post.post_id)
      : null;

    console.log(formdata);

    await axios
      .post(url, formdata)
      .then((response) => {
        const {message, status} = response.data;
        if (status == '500') {
          this.setState({spinnerVisible: false, resultVisible: true, resultText : message});
        } else if (status == '200') {
          this.setState({spinnerVisible: false, resultVisible: true, 
            resultText : (this.props.route.params.mode == 'edit'?'게시글 수정 완료':'게시글 작성 완료')});
        }
      })
      .catch((error) => {
        this.setState({spinnerVisible: false});
        console.log(error);
        alert(error);
      });
  };

  filterSpamKeyword = async () => {
    const {post_title, post_content} = this.state;

    var formdata = new FormData();
    formdata.append('title', post_title);
    formdata.append('content', post_content);
    formdata.append('csrf_test_name', '');

    //Keyboard
    Keyboard.dismiss();

    await axios
      .post('http://dev.unyict.org/api/postact/filter_spam_keyword', formdata)
      .then((response) => {
        const {message, status} = response.data;
        if (status == '500') {
          alert(message);
        } else if (status == '200') {
          this.setState({modalVisible: true, modalType:0});
        }
      })
      .catch((error) => {
        alert(`금지단어 검사에 실패 했습니다. ${error.message}`);
      });
  };
  

  gobackfunc = () => {
    this.cleanupImages();
    if(Platform.OS!=='ios'){
      StatusBar.setBackgroundColor('#B09BDE');
      StatusBar.setBarStyle('default');
    }
    const {navigation, route} = this.props;
    navigation.goBack();
    route.params.statefunction();
  };

  cleanupImages() {
    ImagePicker.clean()
      .then(() => {
        console.log('Temporary images history cleared');
      })
      .catch((e) => {
        console.log(e);
      });
  }

  pickMultiple() {
    ImagePicker.openPicker({
      multiple: true,
      //  includeExif: false,
    }).then((image) => {
      image.map((item) => this.onSelectedImage(item));
      //console.log(image);
    });
  }

  //불러온 사진의 정보를 this.state에 저장
  onSelectedImage(image) {
    //console.log(image);
    let newImages = this.state.images;
    const source = {uri: image.path};
    let item = {
      id: Date.now(),
      url: source,
      mime: image.mime,
      path: image.path,
      content: image.data,
    };
    console.log(item);
    newImages.push(item);
    this.setState({images: newImages});
    this.setState({image: item});
  }
  /* pickMultiple() {
        ImagePicker.openPicker({
            multiple: true,
            // includeExif: true,
        }).then(images => {
            this.setState({
                post_image: images.map(i => {
                    console.log('received image', i);
                    return {uri: i.path, name : i.path.split('/').pop(), type : i.mime};
                })
            });
        }).catch(e => console.log(e));
    } */

  /*  renderImage(image) {
        return <Image style={{width: 150, height: 150, resizeMode: 'contain', borderWidth: 0.5, margin : 5}} source={image}/>
    } */


  modalList =[
    {
      text : this.props.route.params.mode == 'edit'? '게시글을 수정하시겠습니까?': '게시글을 작성하시겠습니까?',
      func : this.submitPost
    },
    {
      text : '게시글 작성을 그만하시겠습니까?',
      func : this.gobackfunc
    }
  ]

  renderImage(image) {
    //console.log(image);
    return (
      <View key={image.id}>
					<Image 
						style={styles.market_RenderImage} 
						source={
							image.edit
								? {uri : image.uri}
								: image.url} 
					/>
      </View>
    );
  }
  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }

  renderSelectItems = () => (
    <View style = {{marginVertical : 10, alignItems:'center', justifyContent:'center'}}>
        <TouchableOpacity style={{flexDirection:'row', borderRadius:10, backgroundColor:'#978DC7', paddingHorizontal:15, paddingVertical:5, justifyContent:'space-between'}} onPress={()=>this.setState({popoverVisible:true})}>    
          <Text category='h5' style={{color:'white', marginRight:5}}>
            {this.Salary_Type[this.state.alba_salary_type]}</Text>
          <Text style={{color:'white'}}>▼</Text>
        </TouchableOpacity>
    </View>
  );

  renderToggleButton = () => (
    <TouchableOpacity
      style={{justifyContent: 'center', alignItems: 'center'}}
      onPress={() => this.setTipVisible(true)}>
      <Tooltipsvg height={24} width={24} />
    </TouchableOpacity>
  );

  render() {
    const { post_title, post_content, post_location, post_hp, alba_salary, alba_salary_type,
			alba_type, isFollowUp, modalVisible, resultVisible, spinnerVisible, } = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <WriteContentToptab text="채용공고"
          right={this.props.route.params.mode == 'edit' ? 'edit' : 'upload'}
          func={this.filterSpamKeyword}
          gbckfunc={()=>this.setState({modalType : 1, modalVisible:true})}
          gbckuse={true}
        />
        <Divider />
        <Layout style={{flex: 10, backgroundColor: '#F4F4F4'}}>
          <ScrollView>
            <TextInput
              value={post_title}
              style={[styles.input,{fontSize: 18, marginTop: 10}]}
              placeholder="제목"
              onChangeText={(nextText) => {this.setState({post_title: nextText});}}
            />
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, borderRadius: 20, marginLeft: 10, backgroundColor: 'white', paddingHorizontal: 20, marginVertical: 5}}>
                <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between', flex:1}}>
                  <RadioGroup
                    style={{flexDirection: 'row'}}
                    selectedIndex={alba_type*1}
                    onChange={(index) => {this.setState({alba_type: index});}}>
                    <Radio></Radio>
                    <Text category='h5' style={{marginHorizontal:10}}>단기</Text>
                    <Radio></Radio>
                    <Text category='h5' style={{marginHorizontal:10}}>장기</Text>
                  </RadioGroup>
                  <Tooltip
                    anchor={this.renderToggleButton}
                    visible={this.state.isTipVisible}
                    placement="bottom end"
                    onBackdropPress={() => this.setTipVisible(false)}>
                    <Text category='c2' style={{color:'white'}}>3개월미만은 단기, 3개월 이상은 장기</Text>
                  </Tooltip>
                </View>
                <View style={{flexDirection: 'row', alignItems:'center', flex:1 }}>
                  <Text style={{fontSize: 16}} category="h5">
                    추후 협의
                  </Text>
                  <CheckBox
                    style={{margin: 10}}
                    checked={isFollowUp}
                    onChange={(nextChecked) => this.setFollowUp(nextChecked)}/>
                  <Popover
                    anchor={this.renderSelectItems}
                    visible={this.state.popoverVisible}
                    fullWidth={true}
                    placement='bottom start'
                    onBackdropPress={() => this.setState({popoverVisible:false})}>
                      <View style={{borderRadius:10, backgroundColor:'#B09BDE'}}>
                          {this.Salary_Type.map((val,index)=>(
                            <TouchableOpacity key = {index} onPress = {()=>this.setState({alba_salary_type:index, popoverVisible:false})}>
                              <Text category='h5' style={{color:'white', marginHorizontal : 10, marginVertical:5}}>{val}</Text>
                              {index==this.Salary_Type.length?null:<Divider/>}
                            </TouchableOpacity>
                          ))}
                      </View>
                  </Popover>
                </View>
              </View>
              <View style={{flex: 1}}>
                <TextInput
                  value={post_hp}
                  style={[styles.input, {fontSize: 16, flex:1}]}
                  category="h4"
                  keyboardType="numeric"
                  placeholder="전화번호"
                  onChangeText={(nextText) => {
                    this.setState({post_hp: nextText});
                  }}
                />
                <TextInput
                  value={alba_salary}
                  style={[styles.input, {fontSize: 16, flex:1}]}
                  size="medium"
                  keyboardType="numeric"
                  placeholder="급여(원)"
                  disabled={this.state.isFollowUp}
                  onChangeText={(nextText) => {
                    this.setState({alba_salary: nextText});
                  }}
                />
              </View>
            </View>
            <TextInput
              value={post_location}
              style={[styles.input, {fontSize: 18}]}
              placeholder="근무지"
              onChangeText={(nextText) => {
                this.setState({post_location: nextText});
              }}
            />
            <TextInput
              value={post_content}
              style={[styles.input, {fontSize: 18}]}
              multiline={true}
              numberOfLines={5}
              placeholder="내용"
              textAlignVertical="top"
              onChangeText={(nextText) => {
                this.setState({post_content: nextText});
              }}
            />
            <Layout style={styles.picture}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View style={{flexDirection:'row', alignItems:'baseline'}}>
                  <Text category='h4'> 사진 </Text>
                  <Text category='c1'>(* 맨 첫 이미지에 회사 로고를 넣어주세요.)</Text>
                </View>
                <TouchableOpacity onPress={() => this.pickMultiple()}>
                  <Camsvg />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal style={{height: 150}}>
                {this.state.images
                  ? this.state.images.map((i) => (
                      <View key={i.id}>{this.renderAsset(i)}</View>
                    ))
                  : null}
              </ScrollView>
              <View
                style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                <CheckBox
                  style={{margin: 5}}
                  checked={this.state.post_thumb_use}
                  onChange={(nextChecked) =>
                    this.setSumnailCheck(nextChecked)
                  }></CheckBox>
                <Text style={{fontSize: 12}} category="c2">
                  {' '}
                  회사 로고가 없을경우 체크해주세요.
                </Text>
              </View>
            </Layout>
          </ScrollView>
        </Layout>
        <Modal
						visible={modalVisible}
						backdropStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
						onBackdropPress={() => this.setState({modalVisible: false})}>
						<Confirm
							confirmText={this.modalList[this.state.modalType].text}
							frstText="예"
							OnFrstPress={() => {
								this.setState({modalVisible: false}, this.modalList[this.state.modalType].func);
							}}
							scndText="아니오"
							OnScndPress={() => this.setState({modalVisible: false})}
						/>
					</Modal>
					<Modal
						visible={resultVisible}
						backdropStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
						onBackdropPress={() => this.setState({resultVisible: false})}>
						<Confirm
							type="result"
							confirmText={this.state.resultText}
							frstText="닫기"
							OnFrstPress={() => {
								this.setState({resultVisible: false});
								this.gobackfunc();
							}}
						/>
					</Modal>
					<Modal
						visible={spinnerVisible}
						backdropStyle={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
						<Spinner size="giant" />
					</Modal>
      </SafeAreaView>
    );
  }
}

class IlbanWrite extends React.Component {
  //get : 회원정보
  //post : 포스트 글 업로드
  //put : ~/{게시판이름}/:{글id}/

  constructor(props) {
    super(props);
    const {mode, post} = this.props.route.params;
    this.state = {
      isLoading: true,
      brd_key: 'ilban',
      post_title: mode == 'edit'?post.post_title:'',
      post_content: mode == 'edit'?post.post_content:'',
      Image_index:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.image.length
          : 0,
      images:
        this.props.route.params.mode == 'edit'
          ? this.props.route.params.image
          : [],
      post_category: mode == 'edit'?post.post_category-1:0,
      popoverVisible : false,
      modalVisible : false,
      resultVisible : false,
      resultText : '',
      spinnerVisible : false,
      modalType : 0,
    };
  }

  categoryList = ['아무말있어요', '게임있어요', '소식있어요', '정보있어요'];

  submitPost = async () => {
    
    const {post_title, post_content, post_category, images} = this.state;
    const url =
      this.props.route.params.mode == 'edit'
        ? 'http://dev.unyict.org/api/board_write/modify'
        : 'http://dev.unyict.org/api/board_write/write/ilban';

    let formdata = new FormData();
    formdata.append('brd_key', 'ilban');
    formdata.append('post_title', post_title);
    formdata.append('post_category', post_category+1);
    formdata.append('post_content', post_content);
    images.map((item) => {
      formdata.append('post_file[]', {
        uri: item.props.path,
        type: item.props.mime,
        name: 'image.jpg',
      });
    });
    
    this.props.route.params.mode == 'edit'
      ? formdata.append('post_id', this.props.route.params.post.post_id)
      : null;
    
    console.log(formdata);

    await axios
      .post(url, formdata)
      .then((response) => {
        const {message, status} = response.data;
        if (status == '500') {
          this.setState({spinnerVisible: false, resultVisible: true, resultText : message});
        } else if (status == '200') {
          this.setState({spinnerVisible: false, resultVisible: true, 
            resultText : (this.props.route.params.mode == 'edit'?'게시글 수정 완료':'게시글 작성 완료')});
        }
      })
      .catch((error) => {
        this.setState({spinnerVisible: false});
        alert(JSON.stringify(error));
      });
  };

  filterSpamKeyword = async () => {
    const {post_title, post_content} = this.state;

    var formdata = new FormData();
    formdata.append('title', post_title);
    formdata.append('content', post_content);
    formdata.append('csrf_test_name', '');

    //Keyboard
    Keyboard.dismiss();

    await axios
      .post('http://dev.unyict.org/api/postact/filter_spam_keyword', formdata)
      .then((response) => {
        const {message, status} = response.data;
        if (status == '500') {
          alert(message);
        } else if (status == '200') {
          this.setState({modalVisible: true, modalType:0});
        }
      })
      .catch((error) => {
        alert(`금지단어 검사에 실패 했습니다. ${error.message}`);
      });
  };

  gobackfunc = () => {
    this.cleanupImages();
    if(Platform.OS!=='ios'){
      StatusBar.setBackgroundColor('#B09BDE');
      StatusBar.setBarStyle('default');
    }

    const {navigation, route} = this.props;
    navigation.goBack();
    route.params.statefunction();
  };

  cleanupImages() {
    ImagePicker.clean()
      .then(() => {
        console.log('Temporary images history cleared');
      })
      .catch((e) => {
        console.log(e);
      });
  }

  //사진버튼 클릭했을 때
  onClickAddImage() {
    const buttons = ['카메라 촬영', '갤러리에서 선택', '취소'];
    ActionSheet.show(
      {options: buttons, cancelButtonIndex: 2, title: 'Select a photo'},
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            this.takePhotoFromCamera();
            break;
          case 1:
            this.choosePhotoFromGallery();
            break;
          default:
            break;
        }
      },
    );
  }

  //카메라로 사진 찍기
  takePhotoFromCamera() {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      this.onSelectedImage(image);
      //  console.log(image);
    });
  }

  //갤러리에서 사진 가져오기
  choosePhotoFromGallery() {
    ImagePicker.openPicker({
      multiple: true,
      includeExif: false,
    }).then((image) => {
      image.map((item) => this.onSelectedImage(item));
      //console.log(image);
    });
  }

  //불러온 사진의 정보를 this.state에 저장
  onSelectedImage(image) {
    console.log(image);
    let newImages = this.state.images;
    const source = {uri: image.path};
    let item = {
      url: source,
      props : {
        id: Date.now(),
        edit : false, 
        index: this.state.Image_index,
        mime: image.mime,
        path: image.path,
        content: image.data,
      },
    };
    console.log(item);
    this.setState({Image_index: this.state.Image_index + 1});
    newImages.push(item);
    this.setState({images: newImages});
  }
  
  deleteImage(index) {
    const {images, Image_index} = this.state;
    images.splice(index,1);
    images.map(i => i.props.index>index
      ?i.props.index--
      :null
    );
    this.setState({images: images, Image_index:Image_index-1});
  }
  

  renderImage(image) {
    //console.log(image);
    // console.log(index);
    return (
      <View key={image.props.id}>
        <Image
          style={styles.market_RenderImage}
          source={
            image.props.edit
              ? {uri: image.url}
              : image.url
          }
        />
        <View style={{position:'absolute', right:0, zIndex:2, width:20, height:20}}>
          <TouchableWithoutFeedback onPress={()=>this.deleteImage(image.props.index)}>
            <Icon style={{width:20, height:20}} fill='#63579D' name='close-outline'/>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }


  renderSelectItems = () => (
    <View style = {{marginLeft : 12, marginVertical : 10, alignItems:'center', justifyContent:'center'}}>
        <TouchableOpacity style={{flexDirection:'row', borderRadius:10, backgroundColor:'#978DC7', padding:15, width:130, justifyContent:'space-between'}} onPress={()=>this.setState({popoverVisible:true})}>    
          <Text category='h5' style={{color:'white'}}>
            {this.categoryList[this.state.post_category]}</Text>
          <Text style={{color:'white'}}>▼</Text>
        </TouchableOpacity>
    </View>
  );

  componentDidMount() {
    if(Platform.OS!=='ios'){
      StatusBar.setBackgroundColor('#F4F4F4');
      StatusBar.setBarStyle('dark-content');
    }
  }

  modalList =[
    {
      text : this.props.route.params.mode == 'edit'? '게시글을 수정하시겠습니까?': '게시글을 작성하시겠습니까?',
      func : this.submitPost
    },
    {
      text : '게시글 작성을 그만하시겠습니까?',
      func : this.gobackfunc
    }
  ]

  //end: header
	render() {
		const {navigation} = this.props;
		const {post_title, post_content, post_category, resultVisible, modalVisible, spinnerVisible, resultText} = this.state;
		return (
      <Root>
        <SafeAreaView  style={{flex: 1}} >
          <Pressable
            style={{flex: 1}}
            onPress={()=>Keyboard.dismiss()}
          >
            <WriteContentToptab
                text="이타게시판"
                right={this.props.route.params.mode == 'edit' ? 'edit' : 'upload'}
                func={this.filterSpamKeyword}
                gbckfunc={()=>this.setState({modalType : 1, modalVisible:true})}
                gbckuse={true}
              />
            <View style = {{flexDirection:'row'}}>
              <Popover
                anchor={this.renderSelectItems}
                visible={this.state.popoverVisible}
                fullWidth={true}
                placement='bottom start'
                onBackdropPress={() => this.setState({popoverVisible:false})}>
                  <View style={{borderRadius:10, backgroundColor:'#B09BDE'}}>
                      {this.categoryList.map((val,index)=>(
                        <TouchableOpacity key = {index} onPress = {()=>this.setState({post_category:index, popoverVisible:false})}>
                          <Text category='h5' style={{color:'white', margin : 10}}>{val}</Text>
                          {index==this.categoryList.length?null:<Divider/>}
                        </TouchableOpacity>
                      ))}
                  </View>
              </Popover>
              <TextInput
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 8.5,
                  marginTop: 18,
                  marginHorizontal: 12,
                  marginBottom: 14,
                  fontSize: 18,
                  flex : 1,
                  paddingHorizontal : 10
                }}
                placeholder="제목"
                onChangeText={(nextValue) => this.setState({post_title: nextValue})}
                placeholderTextColor="#A897C2"
                value={post_title}
              />
            </View>
            <TextInput
              value={post_content}
              style={{
                height: '80%',
                maxHeight: '50%',
                backgroundColor: '#ffffff',
                borderRadius: 8.5,
                marginHorizontal: 12,
                marginBottom: 14,
                fontSize: 18,
                paddingHorizontal : 10
              }}
              placeholder="내용"
              onChangeText={(nextValue) => this.setState({post_content: nextValue})}
              multiline={true}
              textAlignVertical="top"
              textStyle={{minHeight: 100}}
              placeholderTextColor="#A897C2"
            />
            <Layout style={{...styles.picture, flex:1}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <Text category="h4" style={{color:'#63579D', fontSize:18}}> 사진</Text>
                <TouchableOpacity onPress={() => this.onClickAddImage()}>
                  <Camsvg />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal style={{height: 150}}>
                {this.state.images
                  ? this.state.images.map((item) => this.renderAsset(item))
                  : null}
              </ScrollView>
            </Layout>
          </Pressable>
          <Modal
            visible={modalVisible}
            backdropStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
            onBackdropPress={() => this.setState({modalVisible: false})}>
            <Confirm
              confirmText={this.modalList[this.state.modalType].text}
              frstText="예"
              OnFrstPress={() => {
                this.setState({modalVisible: false}, this.modalList[this.state.modalType].func);
              }}
              scndText="아니오"
              OnScndPress={() => this.setState({modalVisible: false})}
            />
          </Modal>
          <Modal
            visible={resultVisible}
            backdropStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
            onBackdropPress={() => this.setState({resultVisible: false})}>
            <Confirm
              type="result"
              confirmText={this.state.resultText}
              frstText="닫기"
              OnFrstPress={() => {
                this.setState({resultVisible: false});
                this.gobackfunc();
              }}
            />
          </Modal>
          <Modal
            visible={spinnerVisible}
            backdropStyle={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
            <Spinner size="giant" />
          </Modal>
        </SafeAreaView>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    padding: 5,
  },
  topbar: {
    backgroundColor: '#B09BDE',
  },
  item: {
    backgroundColor: '#f9c2ff',
    height: 150,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  title: {
    fontSize: 32,
  },
  input: {
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: 'white',
    paddingLeft: 20,
  },
  photo: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderWidth: 2,
    borderColor: 'grey',
  },
  bottomView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  bottomButton: {
    width: '95%',
  },
  deal_type: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  deal_box: {
    width: '30%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    opacity: 0.5,
    borderColor: 'gray',
    borderRadius: 20,
    borderWidth: 1,
  },
  select: {
    flex: 1,
    margin: 2,
  },
  deal_type_text: {
    color: 'white',
  },
  market_RenderImage: {
    marginLeft: 10,
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  picture: {
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    },
});

export {defaultWrite, MarketWrite, AlbaWrite, GominWrite, IlbanWrite};
