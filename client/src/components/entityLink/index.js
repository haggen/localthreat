import React from "react";
import styled from "styled-components";

const getEntityUrl = (type, entity) => {
  const baseUrl = "https://zkillboard.com";
  switch (type) {
    case "character":
      return `${baseUrl}/character/${entity.id}`;
    case "corporation":
      return `${baseUrl}/corporation/${entity.id}`;
    case "alliance":
      return `${baseUrl}/alliance/${entity.id}`;
    case "ship":
      return `${baseUrl}/character/${entity.ownerId}/shipTypeID/${entity.id}`;
    default:
      return "";
  }
};

const getImageSrc = (type, entity) => {
  const baseUrl = "https://image.eveonline.com";
  switch (type) {
    case "character":
      return `${baseUrl}/Character/${entity.id}_32.jpg`;
    case "corporation":
      return `${baseUrl}/Corporation/${entity.id}_32.png`;
    case "alliance":
      return `${baseUrl}/Alliance/${entity.id}_32.png`;
    case "ship":
      return `${baseUrl}/Type/${entity.id}_32.png`;
    default:
      return "";
  }
};

const Link = styled.a`
  align-items: center;
  display: inline-flex;
  max-width: 100%;
  vertical-align: middle;

  figure {
    border-radius: 2px;
    margin-right: 0.5rem;
    overflow: hidden;
    flex: 0 0 32px;
  }

  img {
    display: block;
  }

  span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const EntityLink = ({ type, entity, imageOnly }) => {
  if (!entity || !entity.id) {
    return null;
  }

  return (
    <Link
      href={getEntityUrl(type, entity)}
      target="blank"
      rel="noopener noreferrer"
    >
      <figure>
        <img
          src={getImageSrc(type, entity)}
          width="32"
          height="32"
          alt={entity.name}
          title={entity.name}
        />
      </figure>
      <span>{imageOnly ? null : entity.name}</span>
    </Link>
  );
};

export default EntityLink;
