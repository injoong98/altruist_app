import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true
    };
  }

  componentDidMount() {
    fetch('http://192.168.1.3/api/main')
      .then((response) => response.json())
      .then((json) => {
        this.setState({ data: json.view.board_list });
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { data, isLoading } = this.state;

    return (
      <View style={{ flex: 1, padding: 24 }}>
        {isLoading ? <ActivityIndicator/> : (
          <FlatList
            data={data}
            keyExtractor={({ brd_id }, index) => brd_id}
            renderItem={({ item }) => (
              <Text>{item.brd_name}, {item.brd_key}</Text>
            )}
          />
        )}
      </View>
    );
  }
};
