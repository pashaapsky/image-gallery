import React, { useEffect } from 'react';

import {
  Route,
  Link,
  useRouteMatch,
  useParams,
} from 'react-router-dom';

// Unplash
import { toJson } from 'unsplash-js';
import fetch from 'node-fetch';

import camera from '../img/camera.png';
import likesOnPreview from '../img/like-on-preview.png';
import createdDate from '../img/created-date.png';

import { getImages, getTokens } from '../auth';

global.fetch = fetch;

const Images = (props) => {
  const {
    state, addLikeToPhoto, removeLikeFromPhoto, images, unsplash, loadImages,
  } = props;

  const match = useRouteMatch();

  function lazyLoadImages() {
    // eslint-disable-next-line no-unused-vars
    const imageObserver = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;

          lazyImage.src = lazyImage.dataset.src;
          imageObserver.unobserve(lazyImage);
        }
      });
    });

    const arr = document.querySelectorAll('img.images__photo');

    arr.forEach((v) => {
      imageObserver.observe(v);
    });
  }

  // загрузка изображений при скролле до конца
  function loadNewImagesOnScrollEnd() {
    const items = document.querySelectorAll('.images__item');

    if (items.length > 0) {
      // eslint-disable-next-line func-names
      const callback = function (entries, observer) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetImg = entry.target;

            getImages(state, unsplash, loadImages);
            observer.unobserve(targetImg);
          }
        });
      };

      const observer = new IntersectionObserver(callback);
      const target = items[items.length - 1];

      observer.observe(target);
    }
  }

  useEffect(() => {
    lazyLoadImages();
    loadNewImagesOnScrollEnd();
  });

  function onMouseOverFunction(target) {
    const parent = target.closest('.images__content');
    const maskElem = parent.getElementsByClassName('mask')[0];

    // отображаем маску
    maskElem.classList.add('show');
  }

  function onMouseOutFunction(target) {
    const parent = target.closest('.images__content');
    const maskElem = parent.getElementsByClassName('mask')[0];

    maskElem.classList.remove('show');
  }

  // оставить лайк на фото
  // eslint-disable-next-line no-shadow
  function setLikePhotoOnClick(elem, id, unsplash) {
    if (elem.classList.contains('liked')) {
      unsplash.photos.unlikePhoto(id)
      // eslint-disable-next-line consistent-return
        .then((res) => {
          if (res.status === 401) {
            // получаем токены заного
            const code = location.search.split('code=')[1];

            const UnsplashTokenObject = getTokens(code, unsplash);

            unsplash.auth.setBearerToken(UnsplashTokenObject.accessToken);

            setLikePhotoOnClick(elem, id, unsplash);
          }
          else {
            return toJson(res);
          }
        })
        .then((res) => {
          elem.classList.remove('liked');
          removeLikeFromPhoto(res);
          return res;
        })
        .catch((error) => console.log('При лайке фото возникла следующая ошибка: ', error));
    }
    else {
      unsplash.photos.likePhoto(id)
      // eslint-disable-next-line consistent-return
        .then((res) => {
          if (res.status === 401) {
            // eslint-disable-next-line no-restricted-globals
            const code = location.search.split('code=')[1];
            // console.log('получаем токены для лайка изображения');

            const UnsplashTokenObject = getTokens(code, unsplash);

            unsplash.auth.setBearerToken(UnsplashTokenObject.accessToken);
            setLikePhotoOnClick(elem, id, unsplash);
          }
          else {
            return toJson(res);
          }
        })
        .then((res) => {
          elem.classList.add('liked');
          addLikeToPhoto(res);
        })
        .catch((error) => console.log('При лайке фото возникла следующая ошибка: ', error));
    }
  }
  function setLikeBtnClassName(image) {
    if (image.liked_by_user) {
      return 'like-btn liked';
    }

    return 'like-btn';
  }

  // отменяем скролинг при открытом фото
  function onClickMask(mask) {
    const bodyParent = mask.closest('body');

    if (!mask.classList.contains('like-btn')) {
      bodyParent.classList.add('no-scroll');
    }
  }

  return (
    <section className="images">
      <div className="container">
        <ul className="images__list">
          {images.map((image) => (
            <li className="images__item" key={image.id}>
              <a href={image.user.links.html} className="images__link" rel="noopener noreferrer" target="_blank">{image.user.first_name}</a>

              <div
                className="images__content"
                onMouseOver={(event) => {
                  onMouseOverFunction(event.target);
                }}
                onFocus={(event) => {
                  onMouseOverFunction(event.target);
                }}
                onMouseOut={(event) => {
                  onMouseOutFunction(event.target);
                }}
                onBlur={(event) => {
                  onMouseOutFunction(event.target);
                }}
              >
                <Link to={`${match.path}images/${image.id}`}>
                  <div
                    className="mask"
                    onClick={(event) => {
                      onClickMask(event.target);
                    }}
                    onKeyDown={() => {}}
                    role="button"
                    tabIndex={0}
                  >

                    <button
                      type="button"
                      className={`images--like-btn ${setLikeBtnClassName(image)}`}
                      aria-label="Поставить лайк"
                      onClick={(event) => {
                        event.preventDefault();

                        setLikePhotoOnClick(event.target, image.id, unsplash);
                      }}
                    />

                  </div>
                </Link>

                <img src={camera} data-src={image.urls.small} alt="Изображение" className="images__photo" />
              </div>

              <div className="images__atr">
                <div className="images__likes">
                  <img src={likesOnPreview} alt="Иконка лайка" className="images__like-icon" />
                  {image.likes}
                </div>

                <time dateTime="2020-05-18" className="images__date">
                  <img src={createdDate} alt="Иконка даты" className="images__date-icon" />
                  {image.created_at}
                </time>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Route path={`${match.path}images/:imageId`}>
        <ImageFullView
          images={images}
          unsplash={unsplash}
          setLikePhotoOnClick={setLikePhotoOnClick}
        />
      </Route>
    </section>
  );
};

const ImageFullView = (props) => {
  const { images, unsplash, setLikePhotoOnClick } = props;

  const { imageId } = useParams();

  // получить объект image по его id
  // eslint-disable-next-line no-shadow
  function getImageUrl(images, imageId) {
    let url = {};

    images.forEach((image) => {
      if (image.id === imageId) {
        url = image;
      }
    });

    return url;
  }

  function onClickCancelBtn(btnElem) {
    const bodyParent = btnElem.closest('body');
    bodyParent.classList.remove('no-scroll');
  }

  // оставить лайк на фото
  function setLikeBtnClassName(image) {
    if (image.liked_by_user) {
      return 'like-btn liked';
    }

    return 'like-btn';
  }

  const image = getImageUrl(images, imageId); // нужный image

  try {
    return (
      <div className="image-view">
        <div className="image">
          <div className="image__heading">
            <a href={image.user.links.html} className="image__link" rel="noopener noreferrer" target="_blank">{image.user.first_name}</a>

            <button
              type="button"
              className={setLikeBtnClassName(image)}
              aria-label="Поставить лайк"
              onClick={(event) => {
                event.preventDefault();

                setLikePhotoOnClick(event.target, image.id, unsplash);
              }}
            />

            <Link to="/">
              <button
                type="button"
                className="cancel-btn"
                aria-label="Закрыть окно просмотра"
                onClick={(event) => onClickCancelBtn(event.target)}
              />
            </Link>
          </div>

          <div className="image__content">
            <img src={image.urls.full} alt="Изображение" className="image__photo" />

            <div className="image__atr">
              <div className="image__likes">
                <img src={likesOnPreview} alt="Иконка лайка" className="image__like-icon" />
                {image.likes}
              </div>

              <time dateTime="2020-05-18" className="image__date">
                <img src={createdDate} alt="Иконка даты" className="image__date-icon" />
                {image.created_at}
              </time>
            </div>
          </div>
        </div>
      </div>
    );
  }
  catch (e) {
    return <div />;
  }
};

export default Images;
