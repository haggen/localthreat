import { Component } from 'preact';

export default class Notification extends Component {
  render({ children }, {}) {
    return (
      <div class="notification">
        <figure class="notification__icon">!</figure>
        <div class="notification__text">
          {children}
        </div>
      </div>
    );
  }
}
