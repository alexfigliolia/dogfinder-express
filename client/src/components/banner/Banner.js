import React, { Component } from 'react';

class Banner extends Component {
  render() {
    return (
      <div className={this.props.classes} id='banner'>
      	<div className="center">
      		<h2>An easy way to find the perfect dog for you</h2>
      		<button onClick={this.props.searchToggle}></button>
      	</div>
        <div className="bottom" onClick={this.props.searchToggle}>Find a dog</div>
      </div>
    );
  }
}

export default Banner;
