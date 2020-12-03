import React from 'react';
import {SafeAreaView,Linking} from 'react-native'
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

export default MyWebview;