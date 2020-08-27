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
    }
    
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )

    

    CheckAgrees = ({num}) => {

        const [checked, setChecked] = useState(false);
        
        return (
          <CheckBox
            checked={checked}
            onChange={nextChecked => setChecked(nextChecked)}>
            {`${num}에 동의합니다.${checked}`}
            </CheckBox>
        );
      };
    
      CheckContent = ({content}) => {

        return (
                <Text>{`${content}`}</Text>
        );
      };
    
      ifCheckeer = () =>{
        
      }

      componentDidUpdate(){
       console.log('hye');
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
                            <Text>이타주의자 활동은 이렇게 이렇게 진행이 됩니다. 일대일로도 질문을 받을 수 있고 일대다로도 질문을 받을 수 있습니다. 둘중 택일 하면 됩니다. 원한다면 두개다 선택하여도 좋습니다. 다만, 질문받지 않을 수는 없습니다.이타주의자 활동은 이렇게 이렇게 진행이 됩니다. 일대일로도 질문을 받을 수 있고 일대다로도 질문을 받을 수 있습니다. 둘중 택일 하면 됩니다. 원한다면 두개다 선택하여도 좋습니다. 다만, 질문받지 않을 수는 없습니다.이타주의자 활동은 이렇게 이렇게 진행이 됩니다. 일대일로도 질문을 받을 수 있고 일대다로도 질문을 받을 수 있습니다. 둘중 택일 하면 됩니다. 원한다면 두개다 선택하여도 좋습니다. 다만, 질문받지 않을 수는 없습니다.이타주의자 활동은 이렇게 이렇게 진행이 됩니다. 일대일로도 질문을 받을 수 있고 일대다로도 질문을 받을 수 있습니다. 둘중 택일 하면 됩니다. 원한다면 두개다 선택하여도 좋습니다. 다만, 질문받지 않을 수는 없습니다.이타주의자 활동은 이렇게 이렇게 진행이 됩니다. 일대일로도 질문을 받을 수 있고 일대다로도 질문을 받을 수 있습니다. 둘중 택일 하면 됩니다. 원한다면 두개다 선택하여도 좋습니다. 다만, 질문받지 않을 수는 없습니다.</Text>
                            <this.CheckAgrees num={1}/>
                        </Card>
                        <Card>
                            <this.CheckContent content = {`하이`} />
                            <this.CheckAgrees num={2}/>
                        </Card>
                        <Card>
                            <this.CheckContent content = {`하이`} />
                            <this.CheckAgrees num={3}/>
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
        borderWidth: 4,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#61dafb",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold"
      }
});

export default AltApplyScreen;

