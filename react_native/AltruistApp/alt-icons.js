import React from 'react';
import {Image} from 'react-native';

const IconProvider = (source) => ({
  toReactElement: ({animation, ...props}) => (
    <Image {...props} source={source} />
  ),
});

export const AltIconsPack = {
  name: 'alticons',
  icons: {
    altruist: IconProvider(require('./assets/icons/altruist.svg')),
    bell: IconProvider(require('./assets/icons/bell.svg')),
    community: IconProvider(require('./assets/icons/community.svg')),
    'heart-filled': IconProvider(require('./assets/icons/heart.svg')),
    home: IconProvider(require('./assets/icons/home.svg')),
    mypage: IconProvider(require('./assets/icons/mypage.svg')),
    'paper-plane': IconProvider(require('./assets/icons/paper-plane.svg')),
    'thumb-up': IconProvider(require('./assets/icons/thumb-up.svg')),
    'thumb-up-filled': IconProvider(
      require('./assets/icons/thumb-up-filled.svg'),
    ),
    upload: IconProvider(require('./assets/icons/upload.svg')),
    'view-filled': IconProvider(require('./assets/icons/view.svg')),
    write: IconProvider(require('./assets/icons/write.svg')),
    'back-arrow': IconProvider(require('./assets/icons/back-arrow.png')),
    'arrow-bended': IconProvider(require('./assets/icons/arrow-bended.png')),
    'upload-circle': IconProvider(require('./assets/icons/upload-circle.svg')),
  },
};
