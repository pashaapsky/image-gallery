// Unplash
import { toJson } from 'unsplash-js';
import fetch from 'node-fetch';

global.fetch = fetch;

// страница загрузки фото
let pageImageCounter = 1;

// получаем токены
export async function getTokens(code, unsplash) {
  // console.log('получаем токены! 8');

  const authenticationUrl = unsplash.auth.getAuthenticationUrl([
    'public',
    'write_likes',
  ]);

  // сохранить токены в localStorage
  const saveStateToLocalStorage = (data) => {
    const tokenLSName = 'ImageViewTokenLSName';

    localStorage.setItem(tokenLSName, JSON.stringify(data)); // сохраняем объект JSON в харнилище
  };

  const tokens = unsplash.auth.userAuthentication(code)
    .then((res) => {
      // если вернулся код 400 - заного авторизация
      if (res.status === 400) {
        // console.log('Вернулся код 400!', res);
        location.assign(authenticationUrl);

        return true;
        // eslint-disable-next-line brace-style
      }
      // иначе отправляем request и ждем ответ
      // console.log('Возвращаем ответ res!');
      return toJson(res);
    })
    .then((json) => {
      // сохраняем токены в LS
      saveStateToLocalStorage({
        accessToken: json.access_token,
        refreshToken: json.refresh_token,
      });

      // console.log('Токен успешно сохранен! 38');
      return { accessToken: json.access_token, refreshToken: json.refresh_token };
    });

  return tokens;
}

// получить данные о пользователе в state
export async function getUserInfo(state, setUserInfo, unsplash, UnsplashTokenObject) {
  if (Object.keys(state.userInfo).length === 0) {
    // устанавливаем токен в приложение
    // console.log('Получаем токен! 57', UnsplashTokenObject);
    // console.log('Устанавливаем токен в приложение! 81');
    unsplash.auth.setBearerToken(UnsplashTokenObject.accessToken);

    // console.log('Запрашиваем данные о пользователе! 84');
    const authInfo = unsplash.currentUser.profile()
      .then(
        (res) => toJson(res),
      )
      .then((json) => {
        // возвращаем объект
        // console.log('Возвращаем объект с информацией о пользователе!', json);

        setUserInfo(json);
        return json;
      })
      .catch((error) => console.log('Возникла следующая ошибка: ', error));

    return authInfo;
  }
  // если данные есть
  // console.log('данные о пользователе уже есть в хранилище! 114');
  return true;
}

// авторизация пользователя
export async function auth(state, unsplash, setUserInfo) {
  // объект с токенами

  // права доступа в приложении
  const authenticationUrl = unsplash.auth.getAuthenticationUrl([
    'public',
    'write_likes',
  ]);

  // Authentication
  const code = location.search.split('code=')[1];
  const imagesUrl = location.pathname.split('/')[1]; // =images

  if (code || (imagesUrl === 'images')) {
    // проверка на наличие токенов в localStorage
    // console.log('Ищем токены в хранилище! 67');
    if ((localStorage.length > 0) && (Object.keys(localStorage).includes('ImageViewTokenLSName'))) {
      // console.log('Токены найдены! 71');
      // обновляем данные по токенам
      // console.log('Обновляем данные по токенам 74');
      const UnsplashTokenObject = JSON.parse(localStorage.getItem('ImageViewTokenLSName'));
      // console.log('UnsplashTokenObject : ', UnsplashTokenObject);

      await getUserInfo(state, setUserInfo, unsplash, UnsplashTokenObject);
    }
    // если в LS нет токенов, получаем их
    else {
      // console.log('Токенов нет 117');
      const UnsplashTokenObject = await getTokens(code, unsplash);
      // console.log('UnsplashTokenObject : ', UnsplashTokenObject);
      const userInfo = await getUserInfo(state, setUserInfo, unsplash, UnsplashTokenObject);

      return userInfo;
    }
  }
  // если нет code
  else {
    // console.log('Авторизация 128');
    location.assign(authenticationUrl);
  }
  return true;
}

// получение списка фото
export function getImages(state, unsplash, loadImages) {
  // console.log('Загружаем изображения! 138');

  // let imageCounter = state.images.length + 10;

  unsplash.photos.listPhotos(pageImageCounter, 10, 'latest')
    .then((res) => {
      if (res.status === 401) {
        // console.log('Вернулся код 401!', res);

        // получаем токены заного
        const code = location.search.split('code=')[1];

        // console.log('получаем токены для загрузки изображений');
        getTokens(code, unsplash);

        getImages(state, unsplash, loadImages);
        return true;
      }
      pageImageCounter += 1;
      // console.log('pageImageCounter', pageImageCounter);
      return toJson(res);
    })
    .then((res) => loadImages(res));
}
