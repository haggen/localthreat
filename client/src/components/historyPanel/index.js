import React, { Component } from "react";
import styled from "styled-components";

import Flex from "../flex";

const Panel = styled.aside`
  background-color: hsl(180, 33%, 15%);
  // box-shadow: 0 0 3rem hsla(0, 0%, 0%, 0.25);
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

const CloseButton = styled.button`
  background-color: transparent;
  display: block;
  font-size: 2.5em;
  height: 1em;
  line-height: 1;
  text-align: center;
  width: 1em;
`;

const Heading = styled.h1`
  font-size: 1.25em;
  font-weight: bolder;
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
        <Flex align="center">
          <Heading>History</Heading>
          <Flex.Spacer />
          <CloseButton onClick={e => this.props.onRequestClose()}>
            &times;
          </CloseButton>
        </Flex>
      </Panel>
    );
  }
}

export default HistoryPanel;
