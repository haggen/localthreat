import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as Brand } from "./localthreat.svg";

const Bar = styled.header`
  align-items: center;
  background-color: rgb(10, 15, 15);
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
  position: sticky;
  top: 0;
  z-index: 90;

  h1 {
    font-size: 1.75em;
    font-weight: bolder;
    text-transform: lowercase;
  }

  h1 a {
    display: block;
  }

  h1 svg {
    margin-right: 0.75rem;
  }

  nav {
    display: flex;
  }

  nav a,
  nav button {
    background-color: transparent;
    cursor: pointer;
    font-size: 1.125em;
    font-weight: bolder;
    padding: 0.375rem 0.75rem;
  }
`;

const TopBar = ({ toggleHistoryPanel }) => (
  <Bar>
    <h1>
      <Link to="/">
        <Brand />
        localthreat
      </Link>
    </h1>

    <nav>
      <button>Share</button>
      <Link to="/">New Report</Link>
      <button onClick={e => toggleHistoryPanel()}>History</button>
    </nav>
  </Bar>
);

export default TopBar;
