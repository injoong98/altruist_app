import React from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {AppNavigator} from './layout_default.component';
import {TapNavigator} from './bottom_navigation.component';

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <AppNavigator />
      <TapNavigator />
    </ApplicationProvider>
  </>
);

/*
That's it! By this guide, you learned how to create screens and perform simple navigation between them. Reload your app to review changes.
you will learned how to create screens and perform simple navigation between them. Reload your app to review changes.

Other navigation components
UI Kitten includes much more components that can be used with React Navigation:

BottomNavigation - renders the tabs at the bottom.
TabBar - renders the tabs at the top.
Drawer - renders swipeable side menu.

other navigation components.
includes much more componets that can be used with React Navigation.


*/
