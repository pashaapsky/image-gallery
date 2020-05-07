import React from 'react';

export default class Intro extends React.PureComponent {
  render() {
    return (
      <section className="intro">
        <div className="container intro--bg">
          <div className="intro__inner">
            <h1 className="intro__header">The Image Gallery</h1>

            <p className="intro__paragraph">The internet’s website with mostly beautiful images.</p>

            <p className="intro__paragraph">Create by people, for people.</p>
          </div>
        </div>
      </section>
    );
  }
}
