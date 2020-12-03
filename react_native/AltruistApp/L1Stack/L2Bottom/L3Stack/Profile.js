import React from 'react';

import {SafeAreaView, StyleSheet, View, Image, ScrollView,TouchableOpacity} from 'react-native';
import {
  Layout,
  Text,
  TopNavigation,
  Button,
  Icon,
  TopNavigationAction,
  Card,
  Spinner,
} from '@ui-kitten/components';
import Tag from '../../../components/tag.component';
import Axios from 'axios';
import {WriteContentToptab} from '../../../components/WriteContentTopBar'

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

class AltProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      altruist: null,
      isLoading: true,
    };
  }

  async componentDidMount() {
    console.log(this.props.route.params);
    await this.getAltProfile(this.props.route.params);
  }
  getAltProfile = async (alt_id) => {
    let formdata = new FormData();
    formdata.append('alt_id', alt_id);
    await Axios.post('https://dev.unyict.org/api/altruists/profile', formdata)
      .then((response) => {
        this.setState({
          altruist: response.data.view.data.list[0],
          isLoading: false,
        });
        console.log(this.state.altruist);
      })
      .catch((error) => {
        alert('error : ' + error);
      });
  };

  BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        this.props.navigation.goBack();
      }}
    />
  );

  render() {
    const {altruist} = this.state;
    return this.state.isLoading ? (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Spinner size="giant" />
      </View>
    ) : (
      <SafeAreaView style={{flex: 1}}>
        <WriteContentToptab
                text="이타주의자"
                func={() => {
                    this.filterSpamKeyword();
                }}
                gbckfunc={() => {
                    this.props.navigation.goBack();
                }}
                gbckuse={true}
            />
        <ScrollView>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 10,
              margin: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <Image
                source={{uri : 'https://dev.unyict.org/'+ (altruist.alt_profile.alt_photo !=null ? altruist.alt_profile.alt_photo: 'uploads/altwink-rect.png')}}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 30,
                  resizeMode: 'cover',
                }}
              />
              <View style={{marginLeft: 10, flex: 2, marginBottom: 5,}}>
                <Text category="h1">
                  {altruist.mem_basic_info.mem_username}
                </Text>    
              </View>
                <TouchableOpacity 
                  style={{borderRadius:7, backgroundColor:'#63579D',paddingVertical:8,paddingHorizontal:16}} 
                  onPress={() =>{
                      if(!global.mem_id) {
                          this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
                      }else {
                        this.props.navigation.navigate('AltQuestionWrite',{answer_mem_id:altruist.alt_profile.mem_id,altruist})
                      }
                    }
                  }>
                    
                  <Text style={{fontSize:18,fontWeight:'bold',color:'#ffffff'}}>
                    질문하기
                  </Text>
                </TouchableOpacity>
            </View>
          </View>
          {
            altruist.alt_profile.alt_aboutme!=null&&altruist.alt_profile.alt_aboutme!=''? 
            <View
              style={styles.title}>
              <Text >"{altruist.alt_profile.alt_aboutme}"</Text>
            </View>
            :null
          }
          <View
            style={styles.title}>
            <Text category="h5" style={styles.titleText}>전문 분야</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginVertical: 5,
                flexWrap:'wrap'
              }}>
              {altruist.alt_area.map((i) => (
                <Tag style={{color:'#63579D',fontWeight:'bold'}} key={i.act_id}>{i.act_content}</Tag>
              ))}
            </View>
          </View>
          <View
            style={styles.title}>
            <Text category="h5" style={styles.titleText} >인사말</Text>
            <Text  style={{lineHeight:22}}>{altruist.alt_profile.alt_content}</Text>
          </View>

          <View
            style={styles.title}>
            <Text category="h5" style={styles.titleText}>주요 활동 및 경력</Text>
            {altruist.get_alt_cv.map((i) => (
              <Text style ={{marginBottom:10}}key={i.acv_id}>
                {
                i.acv_year ?
                  i.acv_year.trim()+') '
                :
                  null
                }
                {i.acv_content.trim()}
              </Text>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  bottomButton: {
    position: 'absolute',
    bottom: 10,
    left: '40%',
  },
  title:{
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    margin: 5,
  },
  titleText:{
    marginBottom:10
  }
});

export default AltProfileScreen;
