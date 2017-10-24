import React, { Component } from 'react';
import Dog from './Dog.js';

export default class Dogs extends Component {
  render = () => {
    return (
      <div className='dogs' onClick={this.props.showDog}>
        { 
          this.props.dogs.map((dog, i) => {
            return (
              <Dog 
                name={dog[0]} 
                image={dog[1]} 
                sex={dog[2]} 
                age={dog[3]} 
                key={i} 
                index={i} />
            );
          })
        }
      </div>
    );
  }
}
