import { Component } from 'preact';

export default class Entity extends Component {
  render({ href, image, size, name }, {}) {
    return (
      <a href={href} class="entity" target="blank" rel="noopener noreferrer">
        <span class="entity__picture">
          <img src={image} width={size} height={size} alt={name} />
        </span>
        {name}
      </a>
    );
  }
}
