import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  render() {
    return (
      <div className="container">
        <section className="hero-section">
          <div className="hero-text">
            <h1>
              Collaboration made easy, fast-track projects,<br></br> no
              downloads
            </h1>
            <p>Task management tool</p>
            <Link to="/register">
              <button className="btn home-btn"> Sign up free</button>
            </Link>
          </div>
          <div>
            <img className="hero-img" src="hero-board.jpg" alt="Kanban"></img>
          </div>
        </section>
        <section className="bottom-section">
          <h2>What is Kanban?</h2>
          <p>
            EasyKan is a project management tool that gives users full
            tranaparency of work. Improve project flow and maximize efficiency
            by getting a visual representation of tasks on a kanban board, team
            members can see the state of every task at any time and plan
            accordingly.
          </p>
        </section>
      </div>
    );
  }
}
