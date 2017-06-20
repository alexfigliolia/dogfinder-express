import React, { Component } from 'react';
import Dog from './Dog.js';

class Dogs extends Component {
  render() {
    return (
      <div className='dogs' onClick={this.props.showDog}>
            { 
              this.props.dogs.map(function(dog, i, props) {
                return (
                  <Dog name={dog[0]} image={dog[1]} sex={dog[2]} age={dog[3]} key={i} index={i} />
                );
              })
            }
      </div>
    );
  }
}

export default Dogs;
