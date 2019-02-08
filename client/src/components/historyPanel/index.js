import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Flex from "../flex";

const Panel = styled.aside`
  background-color: hsl(138, 3%, 20%);
  bottom: 0;
  left: 100%;
  overflow: auto;
  padding: 1.5rem;
  position: absolute;
  top: 0;
  transform: translateX(${props => (props.isOpen ? -100 : 0)}%);
  transition: transform 0.375s ease;
  width: 24rem;
  z-index: 100;
`;

const Header = styled.header`
  align-items: center;
  display: flex;
  justify-content: space-between;

  h1 {
    font-size: 1.25em;
    font-weight: bolder;
  }

  button {
    background-color: transparent;
    display: block;
    font-size: 2.5em;
    height: 1em;
    line-height: 1;
    text-align: center;
    width: 1em;
  }
`;

const List = styled.ul`
  margin-top: 1.5rem;

  li {
    display: block;
  }

  li + li {
    margin-top: 0.75rem;
  }

  small,
  strong {
    display: block;
  }
`;

class HistoryPanel extends Component {
  handleClick = e => {
    if (this.props.isOpen) {
      let element = e.target;
      while (element.parentElement) {
        if (element === this.refs.panel) return;
        element = element.parentElement;
      }
      this.props.onRequestClose();
    }
  };

  handleKeyDown = e => {
    if (this.props.isOpen) {
      if (e.key === "Escape") {
        this.props.onRequestClose();
      }
    }
  };

  componentDidUpdate() {
    if (this.props.isOpen) {
      document.addEventListener("click", this.handleClick);
      document.addEventListener("keydown", this.handleKeyDown);
    } else {
      document.removeEventListener("click", this.handleClick);
      document.removeEventListener("keydown", this.handleKeyDown);
    }
  }

  render() {
    const { isOpen } = this.props;

    return (
      <Panel ref="panel" isOpen={isOpen}>
        <Header>
          <h1>History</h1>
          <button onClick={e => this.props.onRequestClose()}>&times;</button>
        </Header>
        <List>
          {this.props.history.map(report => (
            <li>
              <Link to={`/${report.id}`}>
                <strong>{report.data.join(", ").substr(0, 16)}</strong>
                <small>
                  <date datetime={report.timestamp}>
                    +{report.data.length} on {report.timestamp}
                  </date>
                </small>
              </Link>
            </li>
          ))}
        </List>
      </Panel>
    );
  }
}

export default HistoryPanel;
