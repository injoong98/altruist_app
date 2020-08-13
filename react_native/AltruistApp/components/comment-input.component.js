import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, Input} from '@ui-kitten/components'

export const CommentInput = () => {
    
    const [value, setValue] = React.useState('');
    
    const UproadIcon = (props) => (
        <TouchableWithoutFeedback>   {/* 아이콘 클릭했을 때 실행되는 함수를 넣으려면 이 태그에 onPress를 삽입해주세요 */}
          <Icon {...props} name='arrow-circle-up'/>
        </TouchableWithoutFeedback>
    )

    return (
        <Input
            style={{flex:1, margin:15}}    
            size='large'
            placeholder='댓글을 입력하세요.'
            value={value}
            multiline={true}
            accessoryRight={UproadIcon}
            onChangeText={nextValue => setValue(nextValue)}
        />
    )
}