// react
import React from 'react';
import { connect } from 'react-redux';

// react роутер
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

// Unplash
import Unsplash from 'unsplash-js';
import fetch from 'node-fetch';

// импорт компонентов
import Header from './components/header';
import Intro from './components/intro';
import Images from './components/images';

// импорт actions
import {
  setUserInfo, loadImages, addLikeToPhoto, removeLikeFromPhoto,
} from './store/actions/app-actions';

// функции
import { auth, getImages } from './auth';

global.fetch = fetch;

// initialization App
const APP_ACCESS_KEY = 'HITJRO8JiW_2KYhXik9zsNFQyYdU4-2ICB815VgN8_M';
const APP_SECRET = 'ZuDrV7PEKdEpX-zy8megWYf03_2GHhFuITvIfsYRgI0';
const CALLBACK_URL = 'http://localhost:8080/';

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

// получаем state в пропсы
const mapStateToProps = (state) => ({
  state,
});

// получаем действие в пропсы
// eslint-disable-next-line react-redux/mapDispatchToProps-prefer-shorthand
const mapDispatchToProps = (dispatch) => ({
  setUserInfo: (userInfo) => dispatch(setUserInfo(userInfo)),
  loadImages: (images) => dispatch(loadImages(images)),
  addLikeToPhoto: (image) => dispatch(addLikeToPhoto(image)),
  removeLikeFromPhoto: (image) => dispatch(removeLikeFromPhoto(image)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
