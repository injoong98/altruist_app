import React,{useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {SafeAreaView, View, TextInput, StyleSheet, ScrollView,TouchableHighlight} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, Radio, CheckBox, Card } from '@ui-kitten/components'
import { FlatList } from 'react-native-gesture-handler';
import {WriteContentToptab} from '../../../components/WriteContentTopBar';

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)


class AltApplyScreen extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            checkboxes : [false,false,false],   
        }
    }
    
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )

    CheckAgrees = ({i}) => {
        const [checked, setChecked] = useState(false);
        return (
          <CheckBox
            checked={checked}
            onChange={nextChecked =>{setChecked(nextChecked); this.handleClick(i, nextChecked)}}
            >
        </CheckBox>
        );
      };

    handleClick(i, checked){
        const checkboxes = this.state.checkboxes;
        checkboxes[i] = checked == true ? true : false
        this.setState({checkboxes : checkboxes})
    }
    
    goNextStep(){
        if(this.state.checkboxes.includes(false)){
            alert('이용 약관 동의가 필요합니다.')
        }else{
            this.props.navigation.navigate('AltApplyForm')
        }

    }
    
    render(){ 
        const {navigation} =this.props
        return(
            <SafeAreaView style={styles.container}>
            <WriteContentToptab
                text='지원하기'
                gbckfunc={() => {
                    this.props.navigation.goBack();
                }}
                gbckuse={true}
                style={{backgroundColor:'#f4f4f4'}}
            />
            <ScrollView style={styles.wrapper}>
                    <View style={styles.agrees}>
                        <View style={styles.checks}>
                            <View style={styles.checkbox}>
                                <this.CheckAgrees i = {0} />
                                <Text category='h3' style={styles.chkText}>일번</Text>
                            </View>
                            <View style={styles.checkbox}>
                                <this.CheckAgrees i = {1} />
                                <Text category='h3' style={styles.chkText}>이번</Text>
                            </View>
                            <View style={styles.checkbox}>
                                <this.CheckAgrees i = {2} />
                                <Text category='h3' style={styles.chkText}>삼번</Text>
                            </View>
                        </View>
                        <TouchableHighlight 
                            style={styles.btn}
                            onPress={()=>this.goNextStep()}
                        >
                            <Text category='h2' style={styles.btnText}>
                                다음
                            </Text>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper :{
        backgroundColor: "#f4f4f4"
    },
    agrees:{
        marginHorizontal:'5%',
    },
    checks:{
        paddingHorizontal:22,
        paddingVertical:30,
        borderRadius:17,
        backgroundColor:'#ffffff'
    },
    checkbox:{
        flexDirection:'row',
        marginVertical:6     
    },
    chkText:{
        color:'#63579D',
        fontSize:14,
        marginLeft:14

    },
    btn:{
        backgroundColor:'#63579D',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:8,
        borderRadius:8,
        marginTop:23
    },
    btnText:{
        color:'#ffffff'
    }
});


export default AltApplyScreen;

