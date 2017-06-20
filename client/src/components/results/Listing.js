import React, { Component } from 'react';

class Listing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonText: "More Info",
      pClasses: "desc-short"
    }
  }

  inquire(){
    var to = this.props.email;
    window.location.href = "mailto:"+to+"?subject=Subject&body=Hello, I would like to inquire about this dog";
  }

  longDesc(){
    if(this.state.buttonText === "More Info") {
      this.setState({
        buttonText: "Less Info",
        pClasses: "desc-short desc-long"
      });
    } else {
      this.setState({
        buttonText: "More Info",
        pClasses: "desc-short"
      });
    }
  }

  render() {
    return (
      <div className={this.props.classes} id='listing'>
        <div className='name-facts'>
          <h1>{this.props.name}</h1>
          <h2>{this.props.size} &#183; {this.props.gender} &#183; {this.props.breed} &#183; {this.props.age}</h2>
        </div>
        <div className='photo'>
          <img src={this.props.src} alt="doggie" />
        </div>
        <div className='dog-info'>
          <p className={this.state.pClasses} id='descShort'>{this.props.description}</p>
          <button onClick={this.longDesc.bind(this)}>{this.state.buttonText}</button>
          <div className='contact'>
            <h2>Contact Info:</h2>
            <h3 onClick={this.inquire.bind(this)}>Email: <a>{this.props.email}</a></h3>
            <h3>Phone: <a href={"tel:" + this.props.phone}>{this.props.phone}</a></h3>
            <button 
              id='sd'
              className='save-dog'
              data-id={this.props.id} 
              data-name={this.props.name} 
              onClick={this.props.saveDog}>Save to Cart</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Listing;
