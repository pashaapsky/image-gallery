// Unplash
import { toJson } from 'unsplash-js';
import fetch from 'node-fetch';

global.fetch = fetch;

// страница загрузки фото
let pageImageCounter = 1;

// получаем токены
export async function getTokens(code, unsplash) {
  const authenticationUrl = unsplash.auth.getAuthenticationUrl([
    'public',
    'write_likes',
  ]);

  const saveStateToLocalStorage = (data) => {
    const tokenLSName = 'ImageViewTokenLSName';

    localStorage.setItem(tokenLSName, JSON.stringify(data)); // сохраняем объект JSON в харнилище
  };

  const tokens = unsplash.auth.userAuthentication(code)
    .then((res) => {
      if (res.status === 400) {
        location.assign(authenticationUrl);

        return true;
      }
      return toJson(res);
    })
    .then((json) => {
      // сохраняем токены в LS
      saveStateToLocalStorage({
        accessToken: json.access_token,
        refreshToken: json.refresh_token,
      });

      return { accessToken: json.access_token, refreshToken: json.refresh_token };
    });

  return tokens;
}

// получить данные о пользователе в state
export async function getUserInfo(state, setUserInfo, unsplash, UnsplashTokenObject) {
  if (Object.keys(state.userInfo).length === 0) {
    unsplash.auth.setBearerToken(UnsplashTokenObject.accessToken);

    const authInfo = unsplash.currentUser.profile()
      .then(
        (res) => toJson(res),
      )
      .then((json) => {
        setUserInfo(json);
        return json;
      })
      .catch((error) => console.log('Возникла следующая ошибка: ', error));

    return authInfo;
  }

  return true;
}

// авторизация пользователя
export async function auth(state, unsplash, setUserInfo) {
  const authenticationUrl = unsplash.auth.getAuthenticationUrl([
    'public',
    'write_likes',
  ]);

  // Authentication
  const code = location.search.split('code=')[1];
  const imagesUrl = location.pathname.split('/')[1]; // =images

  if (code || (imagesUrl === 'images')) {
    if ((localStorage.length > 0) && (Object.keys(localStorage).includes('ImageViewTokenLSName'))) {
      const UnsplashTokenObject = JSON.parse(localStorage.getItem('ImageViewTokenLSName'));

      await getUserInfo(state, setUserInfo, unsplash, UnsplashTokenObject);
    }
    else {
      const UnsplashTokenObject = await getTokens(code, unsplash);
      const userInfo = await getUserInfo(state, setUserInfo, unsplash, UnsplashTokenObject);

      return userInfo;
    }
  }
  else {
    location.assign(authenticationUrl);
  }
  return true;
}

// получение списка фото
export function getImages(state, unsplash, loadImages) {
  unsplash.photos.listPhotos(pageImageCounter, 10, 'latest')
    .then((res) => {
      if (res.status === 401) {
        const code = location.search.split('code=')[1];

        getTokens(code, unsplash);

        getImages(state, unsplash, loadImages);
        return true;
      }
      pageImageCounter += 1;

      return toJson(res);
    })
    .then((res) => loadImages(res));
}
