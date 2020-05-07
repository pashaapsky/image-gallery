import {
  AUTH_CHANGE_USER_INFO,
  LOAD_IMAGES,
  ADD_LIKE_TO_PHOTO,
  REMOVE_LIKE_FROM_PHOTO,
} from '../actions/app-actions';


const defaultState = {
  userInfo: [],
  images: [],
};

const appReducer = (state = defaultState, action) => {
  switch (action.type) {
    case AUTH_CHANGE_USER_INFO: {
      return {
        ...state,
        userInfo: action.payload,
      };
    }

    case LOAD_IMAGES: {
      const oldImages = state.images;
      // const newImages = action.payload;
      // const oldIds = [];
      // создаем массив с id
      //
      // eslint-disable-next-line no-restricted-syntax
      // for (const x of oldImages) {
      //   oldIds.push(x.id);
      // }
      // отбираем нужные изображения и добавляем в массив
      // eslint-disable-next-line no-restricted-syntax
      // for (const x of newImages) {
      //   if (!oldIds.includes(x.id)) {
      //     oldImages.push(x);
      //   }
      // }
      //
      const newImages = oldImages.concat(action.payload);
      const newImagesUniq = Array.from(new Set((newImages.map((item) => JSON.stringify(item))))).map((item) => JSON.parse(item));
      // console.log('oldImages', oldImages);
      // console.log('newImages', newImages);
      // console.log('newImageUniq', newImagesUniq);
      return {
        ...state,
        images: newImagesUniq,
      };
    }

    case ADD_LIKE_TO_PHOTO: {
      // console.log('отработала ADD_LIKE_TO_PHOTO');
      const images = []; // заготовка для нового массива изображений

      const oldImages = state.images; // старый массив изображений

      // меняем поле лайки в изображении
      oldImages.forEach((image) => {
        if (image.id !== action.payload.photo.id) {
          images.push(image);
        }
        else {
          const newImage = image;
          // изменяем нужные поля в image
          newImage.likes = action.payload.photo.likes; // меняем поле likes
          newImage.liked_by_user = action.payload.photo.liked_by_user; // меняем поле liked_by_user

          images.push(newImage);
        }
      });

      return {
        ...state,
        images,
      };
    }

    case REMOVE_LIKE_FROM_PHOTO: {
      // console.log('отработала REMOVE_LIKE_FROM_PHOTO');
      const images = []; // заготовка для нового массива изображений

      const oldImages = state.images; // старый массив изображений

      // меняем поле лайки в изображении
      oldImages.forEach((image) => {
        if (image.id !== action.payload.photo.id) {
          images.push(image);
        }
        else {
          const newImage = image;
          // изменяем нужные поля в image
          newImage.likes = action.payload.photo.likes; // меняем поле likes
          newImage.liked_by_user = action.payload.photo.liked_by_user; // меняем поле liked_by_user

          images.push(newImage);
        }
      });

      return {
        ...state,
        images,
      };
    }
    default: return state;
  }
};

export default appReducer;
