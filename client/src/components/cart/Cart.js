import React, { Component } from 'react';

class Cart extends Component {
  validate(){
    var e = this.refs.email.value.toLowerCase(),
        p = this.refs.password.value,
        teste = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(teste.test(e) && p !== '') {
      this.props.login(e, p);
      this.refs.email.value = '';
      this.refs.password.value = '';
    } 
    if(!teste.test(e)) {
      this.refs.email.value = '';
      this.refs.email.placeholder = 'Enter a valid email';
    }
  }
  render() {
    return (
      <div className={this.props.classes} id="cart">
          
          {
            (!this.props.user) ? 
              <div>
                <h1>Login</h1>
                <input ref='email' type='email' placeholder="Email" />
                <input id="p" ref='password' type='password' placeholder="Password" />
                <div className='bc'>
                  <button onClick={this.props.cartToggle}>Back</button>
                  <button onClick={this.validate.bind(this)} className="login-button">Login</button>
                </div>
              </div>

            : 
              <div >
                <h1>Saved Pups</h1>
                <div className="saved-dogs">
                  {
                    (this.props.savedDogs.length === 0) ?
                      <h3>Saved dogs go here</h3>
                    :
                    this.props.savedDogs.map(function(dog, i){
                      return (
                        <div className="saved-dog" key={i} data-id={dog.dogid}>
                          <img src={dog.dogimg} alt="saved dog"/>
                          <h2>{dog.dog}</h2>
                          <button data-id={dog.dogid} data-dbid={dog._id} className="remove-dog"></button>
                        </div>
                      );
                    })
                  }
                </div>
                <div className='bc'>
                  <button onClick={this.props.cartToggle}>Back</button>
                  <button onClick={this.props.compareToggle}>Saved Dogs</button>
                </div>
              </div>
          }
      </div>
    );
  }
}

export default Cart;

