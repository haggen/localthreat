const getEntityURL = (type, id) => {
  switch (type) {
    case 'char':
      return `https://zkillboard.com/character/${id}`;
    case 'ally':
      return `https://zkillboard.com/alliance/${id}`;
    case 'corp':
      return `https://zkillboard.com/corporation/${id}`;
    case 'type':
      return `https://zkillboard.com/ship/${id}`;
  }
};

const getImageSrc = (type, id) => {
  switch (type) {
    case 'char':
      return `https://image.eveonline.com/Character/${id}_32.jpg`;
    case 'ally':
      return `https://image.eveonline.com/Alliance/${id}_32.png`;
    case 'corp':
      return `https://image.eveonline.com/Corporation/${id}_32.png`;
    case 'type':
      return `https://image.eveonline.com/Type/${id}_32.png`;
  }
};

export const Entity = ({ type, id, name }) => {
  return (
    <a href={getEntityURL(type, id)} class="entity" target="blank" rel="noopener noreferrer">
      <figure class="entity__picture">
        <img src={getImageSrc(type, id)} width="32" height="32" alt={name} title={name} />
      </figure>
      {type === 'type' ? '' : (<span class="entity__name">
        {name}
      </span>)}
    </a>
  );
};
