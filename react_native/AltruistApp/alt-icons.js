import React from 'react';
import { Image } from 'react-native';

const IconProvider = (source) => ({
  toReactElement: ({ animation, ...props }) => (
    <Image {...props} source={source}/>
  ),
});

export const AltIconsPack = {
  name: 'alticons',
  icons: {
    'altruist': IconProvider(require('./assets/icons/altruist.png')),
    'bell': IconProvider(require('./assets/icons/bell.png')),
    'community': IconProvider(require('./assets/icons/community.png')),
    'heart-filled': IconProvider(require('./assets/icons/heart-filled.png')),
    'home': IconProvider(require('./assets/icons/home.png')),
    'mypage': IconProvider(require('./assets/icons/mypage.png')),
    'paper-plane': IconProvider(require('./assets/icons/paper-plane.png')),
    'thumb-up': IconProvider(require('./assets/icons/thumb-up.png')),
    'thumb-up-filled': IconProvider(require('./assets/icons/thumb-up-filled.png')),
    'upload': IconProvider(require('./assets/icons/upload.png')),
    'view-filled': IconProvider(require('./assets/icons/view-filled.png')),
    'write': IconProvider(require('./assets/icons/write.png')),
    'back-arrow': IconProvider(require('./assets/icons/back-arrow.png')),
  },
};