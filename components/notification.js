import { Component } from 'preact';

export default class Notification extends Component {
  render({ text }, {}) {
    return (
      <div class="notification">
        <figure class="notification__icon">!</figure>
        <p class="notification__text">{text}</p>
      </div>
    );
  }
}
