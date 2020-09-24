import React,{Component} from 'react'
import {Text} from '@ui-kitten/components'

export const PostTime = ({category, datetime, style}) =>{
    const datetimestr = datetime.replace(' ','T');
    const postdatetime = new Date(datetimestr)
    const datetimeUTC = Date.parse(datetimestr);
    const datetimenow = new Date() 
    const now = Date.now()+(1000*60*60*9);
    const timeDiff  = now - datetimeUTC;
    var res;
    
    if(timeDiff<(60*1000)){
        res = '방금'
    }else if(timeDiff<(60*60*1000)){
        res = `${Math.floor(timeDiff/(60*1000))}분 전`
    }else if(timeDiff<(24*60*60*1000)){
        res = `${Math.floor(timeDiff/(60*60*1000))}시간 전`
    }else if(timeDiff<(2*24*60*60*1000)){
        res = "어제"
    }else{
        res = `${(postdatetime.getMonth()+1)}/${(postdatetime.getDate()-1)}`
    }

    return (<Text category={category?category:"s2"} style={style?style:{}}>{`${res}`}</Text> )
}