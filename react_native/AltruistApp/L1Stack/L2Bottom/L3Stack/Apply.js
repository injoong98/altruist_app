import React,{useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {SafeAreaView, View, TextInput, StyleSheet, ScrollView} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, Radio, CheckBox, Card } from '@ui-kitten/components'
import { FlatList } from 'react-native-gesture-handler';


const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)


class AltApplyScreen extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            checkboxes : Array(3).fill(false),
            isChecked : Array(3).fill(false),
            allCheck : false,
            checked : Array(3).fill(false)
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
            onChange={nextChecked =>setChecked(nextChecked)}
            onClick={()=>this.handleClick(i, this.checked)}
            // onChange={()=>this.handleChange()}
            >
                {this.checked}
            {`${i}에 동의합니다.${checked}`}
            {/* {`${i}에 동의합니다.${this.nextChecked}`}
            {`${i}에 동의합니다.${this.state.isChecked[i]}`} */}
            </CheckBox>
        );
      };

    handleClick(i, checked){
        checkboxes = this.state.checkboxes.slice();
        checkboxes[i] = checked == true ? true : false
        this.setState({checkboxes : checkboxes}) 
        console.log(this.state)
    }

    goNextStep(){
        for(let j=0; this.state.checkboxes.length; j++){
            if(this.state.checkboxes[j] == false){
                console.log('동의 눌러줘')
                return false
            }else{
                return true
            }
        }
    }

    functionCombined(){
        if(this.goNextStep() == true){
            // this.props.navigation.navigate('AltApplyForm')
            this.props.navigation.navigate('AltMain')
        }else{
            this.props.navigation.navigate('AltApplyForm')
            //this.props.navigation.navigate('AltMain')
        }

    }
    
    render(){ 
        const {navigation} =this.props
        return(
            <SafeAreaView style={styles.container}>
            <TopNavigation 
            title="이타주의자" alignment="center" accessoryLeft={this.BackAction} /> 
                <ScrollView style={styles.wrapper}>
                    <View>
                        <Text style={styles.title}> 이타주의자 지원하기 </Text>
                    </View>
                    <View>
                        <Card>
                            {/* <this.CheckContent content = {`하이`} /> */}
                            <this.CheckAgrees i = {1} />
                        </Card>
                        <Card>
                            <this.CheckAgrees i = {2} />
                        </Card>
                        <Card>
                            <this.CheckAgrees i = {3} />
                        </Card>
                        <Button onPress={()=>navigation.navigate('AltApplyForm')}>지원하기</Button>
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
        padding: 10,
        backgroundColor: "#eaeaea"
      },
      title: {
        marginTop: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#B09BDE",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold"
      }
});


export default AltApplyScreen;

