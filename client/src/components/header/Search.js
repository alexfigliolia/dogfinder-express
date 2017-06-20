import React, { Component } from 'react';

class Search extends Component {
  constructor(props){
    super(props);
    this.state={
      "firstOptionClasses" : "options",
      "foc" : true,
      "secondOptionClasses" : "options",
      "soc" : true,
      "age" : "Age",
      "gender" :  "Gender"
    }
  }
  handleInputs(){
    var reg = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    var zip = this.refs.zipcode.value;
    var breed = this.refs.breed.value;
    if(breed === "") {
      breed = null;
    }
    var age = this.state.age;
    if(age === "Age") {
      age = null;
    }
    var gender = this.state.gender;
    if(gender === "Gender") {
      gender = null;
    }
    if( reg.test(zip) === false && zip !== "" ) {
      this.refs.zipcode.placeholder = 'enter a valid zipcode';
      this.refs.zipcode.value = '';
    }
    if(zip === "") {
      zip = "US";
      this.props.narrowSearch(zip, breed, age, gender);
    } 
    if(reg.test(zip)) {
      this.props.narrowSearch(zip, breed, age, gender);
    }
  }

  firstClicked(e){
    if(this.state.foc === true) {
      this.setState({
        "firstOptionClasses" : "options options-show",
        "foc" : false
      });
    } else {
      var age = e.target.dataset.val;
      this.setState({
        "firstOptionClasses" : "options",
        "foc" : true,
        "age" : age
      });
    }
  }
  secondClicked(e){
    if(this.state.soc === true) {
      this.setState({
        "secondOptionClasses" : "options options-show",
        "soc" : false
      });
    } else {
      var gender = e.target.dataset.val;
      this.setState({
        "secondOptionClasses" : "options",
        "soc" : true,
        "gender" : gender
      });
    }
  }

  render() {
    return (
      <div className={this.props.classes}>
        <div>
          <input ref='zipcode' placeholder="Zipcode" />
          <input ref='breed' placeholder="Breed" />
          <div className='select' ref='age' onClick={this.firstClicked.bind(this)} data-val="Age">{this.state.age}
            <div className={this.state.firstOptionClasses} >
              <div className='option' data-val="Age">Age</div> 
              <div className='option' data-val="Baby">Baby</div>
              <div className='option' data-val="Young">Young</div>
              <div className='option' data-val="Adult">Adult</div>
              <div className='option' data-val="Senior">Senior</div>
            </div>
          </div>
          <div className='select' ref='gender' onClick={this.secondClicked.bind(this)} data-val="Gender">{this.state.gender}
            <div className={this.state.secondOptionClasses}>
              <div className='option' data-val="Gender">Gender</div>
              <div className='option' data-val="M">Male</div>
              <div className='option' data-val="F">Female</div>
            </div>
          </div>
          <button onClick={this.handleInputs.bind(this)}>SEARCH</button>
        </div>
      </div>
    );
  }
}

export default Search;

//{this.props.search}