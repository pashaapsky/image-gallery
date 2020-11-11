import React from 'react';
import { connect } from 'react-redux';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

// Unplash
import Unsplash from 'unsplash-js';
import fetch from 'node-fetch';


import Header from './components/header';
import Intro from './components/intro';
import Images from './components/images';


import {
  setUserInfo, loadImages, addLikeToPhoto, removeLikeFromPhoto,
} from './store/actions/app-actions';

// функции
import { auth, getImages } from './auth';

global.fetch = fetch;

// initialization App
const APP_ACCESS_KEY = '2ScjAOa9_lCVC1c8qrn25ixIgPC5E_5S3BT6u3kEp9A';
const APP_SECRET = 'ZOq_q-WrpLyOu9mx_x9pYYtOyJklIDSb5G3-Xf9sMEc';
const CALLBACK_URL = 'https://pashaapsky.github.io/ImageGallery/';

const unsplash = new Unsplash({
  accessKey: APP_ACCESS_KEY,
  secret: APP_SECRET,
  callbackUrl: CALLBACK_URL,
});

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  // инициализация приложения - заполняем state
  async componentDidMount() {
    // авторизация пользователя + данные о нем
    await auth(this.props.state, unsplash, this.props.setUserInfo);

    // загрузка изображений в приложение - изображения
    await getImages(this.props.state, unsplash, this.props.loadImages);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/">
            <div className="main">
              <Header />

              <main className="content">
                <Intro />
                <Images
                  state={this.props.state}
                  addLikeToPhoto={this.props.addLikeToPhoto}
                  removeLikeFromPhoto={this.props.removeLikeFromPhoto}
                  images={this.props.state.images}
                  unsplash={unsplash}
                  loadImages={this.props.loadImages}
                />
              </main>
            </div>
          </Route>
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  state,
});

// eslint-disable-next-line react-redux/mapDispatchToProps-prefer-shorthand
const mapDispatchToProps = (dispatch) => ({
  setUserInfo: (userInfo) => dispatch(setUserInfo(userInfo)),
  loadImages: (images) => dispatch(loadImages(images)),
  addLikeToPhoto: (image) => dispatch(addLikeToPhoto(image)),
  removeLikeFromPhoto: (image) => dispatch(removeLikeFromPhoto(image)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
