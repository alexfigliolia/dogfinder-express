import React, { Component } from 'react';
import jsonp from 'jsonp';

class Search extends Component {
  constructor(props){
    super(props);
    this.state={
      "firstOptionClasses" : "options",
      "foc" : true,
      "secondOptionClasses" : "options",
      "soc" : true,
      "age" : "Age",
      "gender" :  "Gender",
      "searchComplete" : []
    }
  }

  handleBreed(e){
    var b = e.target.dataset.val;
    this.refs.breed.value = b;
    this.setState({
      searchComplete: []
    });
  }

  handleBreedFocus(){
    this.refs.breed.value = "";
    this.setState({
      searchComplete: []
    });
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

  //IMPLEMENTATION OF AUTOCOMPLETE FOR DOG BREEDS
  autocomplete(){
    var input = this.refs.breed.value,
        string = input.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
        matches = [],
        self = this;
    // setInterval(function(){
      if(string !== '') {
        jsonp('https://api.petfinder.com/breed.list?animal=dog&format=json&key=30ee8287679b46176ef7acfbfee70f33', null, function(err, data){
          if(err) {
            console.log(err);
          } else {
            var breeds = data.petfinder.breeds.breed;
            for(var i = 0; i < breeds.length; i++) {
                var b = breeds[i].$t;
                if(b.toLowerCase().indexOf(string) === 0) {
                  matches.unshift(b);
                } 
                if(b.toLowerCase().indexOf(string) !== 0 && b.toLowerCase().indexOf(string) !== -1) {
                  matches.push(b);
                }
            }
            self.setState({
              searchComplete: matches
            });
          }
        });
      } else {
        self.setState({
          searchComplete: []
        });
      }
    // }, 500); 
  }

  render() {
    return (
      <div className={this.props.classes}>
        <div>
          <input ref='zipcode' placeholder="Zipcode" />
          <div className="breed-wrap">
            <input 
              ref='breed' 
              type='text' 
              placeholder="Breed" 
              onKeyPress={this.autocomplete.bind(this)}
              onChange={this.autocomplete.bind(this)}
              onFocus={this.handleBreedFocus.bind(this)} />
            {
              this.state.searchComplete.map((dog, i) => {
                if(i < 5) {
                  return (
                    <div 
                      key={dog}
                      className="search-option" 
                      data-val={dog}
                      onClick={this.handleBreed.bind(this)}>{dog}</div>
                  );
                }
              })
            }
          </div>
          <div className='select select-1' ref='age' onClick={this.firstClicked.bind(this)} data-val="Age">{this.state.age}
            <div className={this.state.firstOptionClasses} >
              <div className='option' data-val="Age">Age</div> 
              <div className='option' data-val="Baby">Baby</div>
              <div className='option' data-val="Young">Young</div>
              <div className='option' data-val="Adult">Adult</div>
              <div className='option' data-val="Senior">Senior</div>
            </div>
          </div>
          <div className='select select-2' ref='gender' onClick={this.secondClicked.bind(this)} data-val="Gender">{this.state.gender}
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