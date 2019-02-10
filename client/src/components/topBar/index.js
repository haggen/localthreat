import React, { Component } from "react";
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

  nav button[disabled] {
    opacity: 0.5;
  }
`;

const Popover = styled.div`
  background-color: hsl(98, 13%, 63%);
  border-radius: 0.25rem;
  color: hsl(180, 20%, 5%);
  font-size: 0.875rem;
  margin-top: ${props => (props.isOpen ? "-0.75rem" : "-1.5rem")};
  opacity: ${props => (props.isOpen ? 1 : 0)};
  padding: 0.75rem;
  pointer-events: ${props => (props.isOpen ? "unset" : "none")};
  position: absolute;
  right: 9.5rem;
  top: 100%;
  transition: all 0.25s ease;
  width: 15rem;

  &::before {
    display: block;
    content: "";
    border: 0.5rem solid transparent;
    border-bottom-color: hsl(98, 13%, 63%);
    bottom: 100%;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
  }
`;

class TopBar extends Component {
  handleClick = e => {
    let element = e.target;
    while (element.parentElement) {
      if (element === this.refs.popover) return;
      element = element.parentElement;
    }
    this.toggleSharePopover(false);
  };

  handleKeyDown = e => {
    if (e.key === "Escape") {
      this.toggleSharePopover(false);
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isSharePopoverOpen: false
    };
  }

  toggleSharePopover(value) {
    this.setState({
      isSharePopoverOpen: !!value
    });
  }

  shareReport(disabled) {
    if (disabled) return;
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => this.toggleSharePopover(true));
  }

  componentDidUpdate() {
    if (this.state.isSharePopoverOpen) {
      document.addEventListener("click", this.handleClick);
      document.addEventListener("keydown", this.handleKeyDown);
    } else {
      document.removeEventListener("click", this.handleClick);
      document.removeEventListener("keydown", this.handleKeyDown);
    }
  }

  render() {
    return (
      <Bar>
        <h1>
          <Link to="/">
            <Brand />
            localthreat
          </Link>
        </h1>

        <nav>
          <button
            disabled={!this.props.hasReport}
            onClick={e => this.shareReport(e.target.disabled)}
          >
            Share
          </button>
          <Link to="/">New Report</Link>
          <button onClick={e => this.props.toggleHistoryPanel()}>
            History
          </button>
        </nav>

        <Popover refs="popover" isOpen={this.state.isSharePopoverOpen}>
          <strong>Copied!</strong> Just share the link with your friends.
          Changes they make to the report will appear to you in real-time.
        </Popover>
      </Bar>
    );
  }
}

export default TopBar;
