import axios from 'axios'
import React, { Component } from 'react'

export class IlbanPost extends Component{
    state = { 
        loading: false,
        lists: []
     };

    getPostList = async() =>{
        await axios.get('http://10.0.2.2/api/board_post/lists/ilban')
        .then((response)=>{
            this.setState({
                lists : response.data.view.list.data.list,
                isLoading : false
            })
        })
        .catch((error)=>{
            // this.setState({  
            //     loading: false
            //   });
            alert('error')
        })
    }

    componentDidMount(){
        this.getPostList();
    }

    render() {
        return () => {
            const { lists } = this.state;
            console.log(lists);
        }
    }

}