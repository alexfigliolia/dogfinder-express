import React, { Component } from 'react';

export default class Header extends Component {
  render() {
    return (
      <header>
        <div>
          <div className={this.props.heartClasses} onClick={this.props.cartToggle}>{this.props.data.length}</div>
          <h1 onClick={this.props.goHome}>Dog Finder</h1>
          <div className={this.props.classes} onClick={this.props.searchToggle}></div>
        </div>
        <h2 className={this.props.backClasses} onClick={this.props.backToResults}>BACK</h2>
        <h2 className={this.props.back2Classes} onClick={this.props.compareToggle}>BACK</h2>
      </header>
    );
  }
}
