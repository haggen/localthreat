import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Brand from "../brand";
import Flex from "../flex";

const StyledLink = styled(Link)`
  font-size: 1.125em;
  font-weight: bolder;
  padding: 0.375rem 0.75rem;
`;

const TopBar = ({ toggleHistoryPanel }) => (
  <Flex align="center">
    <Brand />
    <Flex.Spacer />
    <StyledLink to="#">Share</StyledLink>
    <StyledLink to="/">New Report</StyledLink>
    <StyledLink to="" onClick={e => toggleHistoryPanel()}>
      History
    </StyledLink>
  </Flex>
);

export default TopBar;
