export const AUTH_CHANGE_USER_INFO = 'AUTH_CHANGE_USER_INFO';
export const LOAD_IMAGES = 'LOAD_IMAGES';
export const ADD_LIKE_TO_PHOTO = 'ADD_LIKE_TO_PHOTO';
export const REMOVE_LIKE_FROM_PHOTO = 'REMOVE_LIKE_FROM_PHOTO';

export const setUserInfo = (userInfo) => ({
  type: AUTH_CHANGE_USER_INFO,
  payload: userInfo,
});

export const loadImages = (images) => ({
  type: LOAD_IMAGES,
  payload: images,
});


export const addLikeToPhoto = (image) => ({
  type: ADD_LIKE_TO_PHOTO,
  payload: image,
});

export const removeLikeFromPhoto = (image) => ({
  type: REMOVE_LIKE_FROM_PHOTO,
  payload: image,
});
