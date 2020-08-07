import React from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, Layout, Text} from '@ui-kitten/components';

const HomeScreen = () => (
  // eslint-disable-next-line react-native/no-inline-styles
  <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text category="h1">Hello World</Text>
  </Layout>
);

export default () => (
  <ApplicationProvider {...eva} theme={eva.dark}>
    <HomeScreen />
  </ApplicationProvider>
);
