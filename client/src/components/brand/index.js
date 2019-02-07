import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { ReactComponent as Logo } from "./localthreat.svg";

const StyledLink = styled(Link)`
  display: block;
  font-size: 1.75em;
  font-weight: bolder;
  // text-transform: uppercase;
`;

const StyledLogo = styled(Logo)`
  margin-right: 0.75rem;
`;

const Brand = () => (
  <h1>
    <StyledLink to="/">
      <StyledLogo />
      localthreat
    </StyledLink>
  </h1>
);

export default Brand;
