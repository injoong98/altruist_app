import React from 'react';
import {SafeAreaView,Linking,View,Text,ScrollView,Dimensions} from 'react-native'
import { WebView } from 'react-native-webview';

class MyWebview extends React.Component{
    constructor(props){
        super(props)
    }
    
    openExternalLink(req) {
        const isLocal = req.url.search('http://localhost') !== -1;
    
        if (isLocal) {
          return true;
        } else {
          Linking.openURL(req.url);
          return false;
        }
    }
    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                        <WebView
                            source={{uri: this.props.route.params.url}}
                            onShouldStartLoadWithRequest={this.openExternalLink}
                        />
            </SafeAreaView>
        )
    }
}
class WebViewInView extends React.Component{
    constructor(props){
        super(props)
        this.state={
            webViewHeight:0
        }
    }
    onMessage = (event) => {
        this.setState({webViewHeight:event.nativeEvent.data*1});
        console.log('onMessage : '+event.nativeEvent.data);
    }
    openExternalLink(req) {
        const isLocal = req.url.search('http://localhost') !== -1;
    
        if (isLocal) {
          return true;
        } else {
          Linking.openURL(req.url);
          return false;
        }
    }
    render(){
        const {webViewHeight} =this.state
        const injectedJavaScript=`
        window.ReactNativeWebView.postMessage(
            Math.max(document.body.offsetHeight, document.body.scrollHeight)
        );`;
        console.log('render : '+webViewHeight);
        return(
            <View
                style={{
                height: this.props.height ? this.props.height: webViewHeight,
                width: Dimensions.get('window').width,
                }}
            >
                <WebView
                    source={this.props.url ? {uri: this.props.url} :{html:this.props.html} }
                    onShouldStartLoadWithRequest={this.openExternalLink}
                    scrollEnabled={false}
                    onMessage={this.onMessage}
                    injectedJavaScript={injectedJavaScript}
                />
            </View>
        )
    }
}

export {WebViewInView}
export default MyWebview;