import React, { Component } from 'react';

export default class Compare extends Component {
  render() {
    return (
      <div className={this.props.classes} id="compare">
        <div>
          <h1>Compare Pups</h1>
          <div className='cc'>
            {
              this.props.savedDogs.map((dog, i) => {
                return (
                  <div className='dog-to-compare' key={i}>
                    <div className="ccimage">
                      <img src={dog.dogimg} alt="dog" />
                    </div>
                    <div className='nameinfo'>
                      <h3>{dog.dogsize}</h3>
                      <h2>{dog.dog}</h2>
                      <h3>{dog.doggender}</h3>
                    </div>
                    <div className='desc-contact'>
                      <h4>Info</h4>
                      <p>{dog.description}</p>
                      <a href={"mailto:"+dog.contactEmail+"?subject=Subject&body=Hello, I would like to inquire about this dog"}>{dog.contactEmail}</a>
                      <a href={"tel:" + dog.contactPhone}>Phone: {dog.contactPhone}</a>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}
