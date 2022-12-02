import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Home extends Component {
  render() {
    return (
      <div>
        <h3>Home</h3>
        <Link to="/register"> Create an Account</Link>
      </div>
    );
  }
}
