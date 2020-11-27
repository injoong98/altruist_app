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
    altruist: IconProvider(require('./assets/icons/alt_png.png')),
    bell: IconProvider(require('./assets/icons/bell_png.png')),
    community: IconProvider(require('./assets/icons/community.svg')),
    mypage: IconProvider(require('./assets/icons//my_png.png')),
    altruistgray: IconProvider(require('./assets/icons/alt-gray-png.png')),
    bellgray: IconProvider(require('./assets/icons/bell-gray-png.png')),
    communitygray: IconProvider(require('./assets/icons/communitygraypng.png')),
    mypagegray: IconProvider(require('./assets/icons//my_gray_png.png')),
    'heart-filled': IconProvider(require('./assets/icons/heart.svg')),
    home: IconProvider(require('./assets/icons/home.svg')),
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
