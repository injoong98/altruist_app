import {ImageSourcePropType} from 'react-native';
import React, {Component} from 'react';

export class getPostList extends Component {
  state = {
    lists: [],
  };

  //LIFECYCLE
  componentDidMount() {
    axios
      .get(`https://dev.unyict.org/api/board_post/lists/ilban`)
      .then((response) => {
        this.setState({
          lists: response.data.view.list.data.list,
          isLoading: false,
        });
      })
      .catch((error) => {
        alert('error');
      });
  }

  render() {
    <Text>
      {this.state.lists.map((list) => (
        <Text>{list.title}</Text>
      ))}
    </Text>;
  }
}
