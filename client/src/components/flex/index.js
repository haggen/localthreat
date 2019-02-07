// import React from "react";
import styled from "styled-components";

const Flex = styled.div`
  display: flex;
  align-items: ${props => props.align || "flex-start"};
`;

Flex.Spacer = styled.div`
  flex-grow: 1;
`;

export default Flex;
