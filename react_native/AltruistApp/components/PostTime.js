import React,{Component} from 'react'
import {Text} from '@ui-kitten/components'

export const PostTime = ({category, datetime, style}) =>{
    if(datetime){

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
    else{
        return (<Text category={category?category:"s2"} style={style?style:{}}></Text> )

    }
}
export const ExpireTime = ({category, datetime, style}) =>{
    if(datetime){
        const datetimestr = datetime.replace(' ','T');
        const postdatetime = new Date(datetimestr)
        const datetimeUTC = Date.parse(datetimestr);
        const datetimenow = new Date() 
        const now = Date.now()+(1000*60*60*9);
        const timeDiff  = datetimeUTC-now;
        var res;
        if(timeDiff<0){
            res = '모집 마감'
        }else{
            if(!isNaN(postdatetime.getMonth())){
                res = `마감일 ${(postdatetime.getMonth()+1)}/${(postdatetime.getDate()-1)}`
            }else{
                res='상세참고'
            }
        }
    
        return (<Text category={category?category:"s2"} style={style?style:{}}>{`${res}`}</Text> )
    }else{
        return (<Text category={category?category:"s2"} style={style?style:{}}></Text> )

    }


}