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
      const newImages = oldImages.concat(action.payload);
      const newImagesUniq = Array.from(new Set((newImages.map((item) => JSON.stringify(item))))).map((item) => JSON.parse(item));

      return {
        ...state,
        images: newImagesUniq,
      };
    }

    case ADD_LIKE_TO_PHOTO: {
      const images = [];
      const oldImages = state.images;

      // меняем поле лайки в изображении
      oldImages.forEach((image) => {
        if (image.id !== action.payload.photo.id) {
          images.push(image);
        }
        else {
          const newImage = image;
          newImage.likes = action.payload.photo.likes;
          newImage.liked_by_user = action.payload.photo.liked_by_user;

          images.push(newImage);
        }
      });

      return {
        ...state,
        images,
      };
    }

    case REMOVE_LIKE_FROM_PHOTO: {
      const images = [];
      const oldImages = state.images;

      // меняем поле лайки в изображении
      oldImages.forEach((image) => {
        if (image.id !== action.payload.photo.id) {
          images.push(image);
        }
        else {
          const newImage = image;
          newImage.likes = action.payload.photo.likes;
          newImage.liked_by_user = action.payload.photo.liked_by_user;

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
