import React, { Component } from 'react';

class DogItem extends Component {
  render() {
    return (
      <div className="saved-dog" key={this.props.key} data-id={this.props.dataid}>
  		<button onClick={this.props.removeDog}>X</button>
  		<h2>{this.props.name}</h2>
  	 </div>
    );
  }
}

export default DogItem;