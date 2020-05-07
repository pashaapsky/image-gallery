import React from 'react';

import camera from '../img/camera.svg';
import profile from '../img/profile-logo.png';

export default class Header extends React.PureComponent {
  render() {
    return (
      <header className="header">
        <div className="container">
          <div className="header__inner">
            <div className="header__logo">
              <a href="/" className="header__link">
                <img className="header__img" src={camera} alt="Логотип" />
              </a>

              <a href="/" className="header__link">
                <p className="header__paragraph">ImageViewApp</p>
              </a>
            </div>

            <div className="header__profile">
              <img src={profile} alt="Логотип" className="header__profile-logo" />
            </div>
          </div>
        </div>
      </header>
    );
  }
}
