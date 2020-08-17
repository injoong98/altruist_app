import { ImageSourcePropType } from 'react-native';

export class IlbanPost {

  constructor(readonly title: string,
              readonly description: string,
              readonly photo: ImageSourcePropType,
              readonly time: number,
              readonly styx: number) {

  }

  static basketball(): IlbanPost {
    return new IlbanPost(
      'Basketball',
      'Team sport in which two teams, most commonly of five players.',
      require('../../../../assets/images/image-training-1.jpg'),
      16,
      55,
    );
  }
}
