import React from 'react';
import {View,StyleSheet,Animated,TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
import {Text} from '@ui-kitten/components'

const ToggleView = ({text}) =>(
        <View style={styles.toggleView}>
            <Text category="c2" style={styles.toggelText}>
                {text}
            </Text>
        </View>
        )


class ToggleTune extends React.Component {

    state={
        position : new Animated.Value(-50),
        status: true,
        bckgrndclr: new Animated.Value(0),
    }

    leftStart = () => {
        console.log('Start');
        this.setState({status:!this.state.status});
        Animated.timing(this.state.position,{
            toValue:-50,
            duration: 500,
            useNativeDriver: false
        }).start();
        Animated.timing(this.state.bckgrndclr,{
            toValue: 0 ,
            duration: 500,
            useNativeDriver: false
        }).start();
        
    };
    
    leftEnd = () => {
        console.log('End');
        this.setState({status:!this.state.status});
        Animated.timing(this.state.position,{
            toValue:35,
            duration: 500,
            useNativeDriver: false
        }).start();
        Animated.timing(this.state.bckgrndclr,{
            toValue:1,
            duration: 500,
            useNativeDriver: false
        }).start();
    };

    render(){
        const bckgrndclrInterpolate = this.state.bckgrndclr.interpolate({
            inputRange:[0,1],
            outputRange:["rgb(234,176,179)","rgb(167,212,222)"]
        })
        return(
                <TouchableOpacity onPress={this.state.status ? this.leftEnd : this.leftStart}>
                    <View style = {styles.toggleContainer} >
                        <View style ={styles.toggleBackgroud}>
                            <Text category="c2" style={styles.toggleBackText}>HOT</Text>
                            <Text category="c2" style={styles.toggleBackText}>News</Text>
                        </View>
                        <Animated.View style = {this.toggleView,{borderRadius:20,left: this.state.position, backgroundColor: bckgrndclrInterpolate}}>
                            <ToggleView text={this.state.status ? 'HOT' : 'NEWS'} />
                        </Animated.View>
                    </View>
                </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex:1,
        alignItems:"center",
        justifyContent:"center",
    },
    toggleContainer:{
        width: 130,
        alignItems:'center'
    },
    toggleBackgroud:{
        position:'absolute',
        backgroundColor:"#c1c1c1",  
        height:36,
        borderRadius:15,
        width:"100%",
        top:2,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly'
    },
    toggleBackText:{
        fontSize:18,
        color:'#ffffff',
    },
    toggleView : {
        position:'relative',
        width:85,  
        height:40,
        display:'flex',
        flexDirection:'row',
        alignItems:"center",
        justifyContent:"center",
        borderRadius:20
    },
    toggelText:{
        flex:1,
        fontSize:20,
        color:'#ffffff',
        textAlign:"center",
        textAlignVertical:"center",
    },

})

export default ToggleTune;