import React, { Component } from 'react';
import Header from './components/header/Header.js';
import Banner from './components/banner/Banner.js';
import Search from './components/header/Search.js';
import List from './components/results/List.js';
import Listing from './components/results/Listing.js';
import Cart from './components/cart/Cart.js';
import Compare from './components/compare/Compare.js';
import { Dogs } from '../../api/dogs.js';
import jsonp from 'jsonp';
import axios from 'axios';
import './App.scss';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      zip : "",
      breed : "",
      gender : "",
      age : "",
      offset : 24,
      searchToggle : true,
      searchClasses : "search",
      iconClasses : "search-icon search-icon-animate",
      backClasses : "back-to-results",
      back2Classes : "back2",
      listClasses : "result-list",
      bannerClasses : "banner",
      heartClasses : "heart",
      cartClasses : "cart",
      cartToggle : true,
      dogs : [],
      loaderClasses : "loader",
      listingClasses : "listing",
      compareToggle : true,
      compareClasses : "compare",
      clickedDog : [],
      dogName : "",
      dogAge : "",
      dogGender : "",
      dogBreed : [],
      dogSize : "",
      dogPic : "",
      dogDesc : "",
      contactEmail : "",
      contactPhone : "",
      id : "",
      scrollPos : 0,
      errorClasses : "error",
      errorClasses2: "error",
      data : [],
      users: this.getUserData(),
      loggedIn: false
    }
  }
  //FETCH CURRENT USER
  getUserData(){
    const self = this;
    Meteor.subscribe('userData', function(){
      if(Meteor.user() !== null) {
        const s = Meteor.user();
        self.setState({
          loggedIn: true
        })
      } else {
        console.log('must login');
      }
    });
    Meteor.subscribe('dogs' ,function(){
      self.updateDogs();
    });
    return { isAuthenticated: Meteor.userId() !== null };
  }
  //FETCH SAVED DOGS FROM USER ID
  updateDogs(){
    var d = Dogs.find({owner: Meteor.userId()}).fetch();
    this.setState({
      data: d
    });
  }
  //LOGIN OR CREATE USER
  login(e, p){
    Meteor.loginWithPassword(e, p, (err) => {
      if(err){
        console.log(err.reason);
        if(err.reason === 'Incorrect password') {
          document.getElementById('p').placeholder = "Incorrect Password";
        }
        if(err.reason === 'User not found') {
          Accounts.createUser({email: e, password: p}, (err) => {
            if(err){
              console.log(err.reason);
            } else {
              Meteor.loginWithPassword(e, p, (err) => {
                if(err) {
                  console.log(err.reason);
                } else {
                  console.log(this.state.users);
                  this.setState({
                    loggedIn: true
                  })
                }
              });
            }
          });
        }
      } else {
          this.setState({
            loggedIn: true
          })
          this.updateDogs();
      }
    });
  }
  //SAVE TO CART
  handleDogSubmit(e) {
    var self = this;
    if(self.state.loggedIn === false) {
      self.setState({
        cartToggle : false,
        cartClasses : "cart cart-show",
        heartClasses : "heart heart-open"
      });
    } else {
      e.target.innerHTML = '';
      e.target.classList.add('save-dog-animate');
      var dogs = self.state.data,
          id = e.target.dataset.id,
          name = e.target.dataset.name,
          img = self.state.dogPic,
          desc = self.state.dogDesc,
          size = self.state.dogSize,
          gender = self.state.dogGender,
          phone = self.state.contactPhone,
          email = self.state.contactEmail,
          gooddesc = desc.substr(0, 300),
          descTrim = gooddesc.substr(0, Math.min(gooddesc.length, gooddesc.lastIndexOf(" "))),
          formatted = descTrim + '...',
          dog = {
            dog : name,
            dogsize: size,
            doggender: gender,
            dogimg: img,
            description: formatted,
            contactPhone: phone,
            contactEmail: email,
            dogid : id
          },
          update = dogs.concat(dog);
      Meteor.call('dogs.insert', dog, function(err){
        if(err) {
          console.log(err);
        } else {
          self.setState({ 
            data: update,
            heartClasses : "heart heart-pulse"
          });
          setTimeout(function(){
            self.setState({
              heartClasses : "heart"
            });
          }.bind(self), 700);

        }
      });
    }
  }
  //DELETE FROM CART
  handleDogDelete(e) {
    if(e.target.className === 'remove-dog') {
      var id = e.target.dataset.id;
      var self = this;
      Meteor.call('dogs.remove', { dogid: id, owner: Meteor.userId() }, function(err){
        if(err) {
          console.log(err);
        } else {
          self.updateDogs();
          self.setState({ 
            heartClasses : "heart heart-pulse"
          });
          setTimeout(function(){
            self.setState({
              heartClasses : "heart"
            });
          }.bind(self), 700);
        }
      });
    }
  }

  componentDidMount(){
    var self = this;
    //RESIZE TO WINDOW SIZE
    window.addEventListener("resize", resize);
    resize();
    //HISTORY API IMPLEMENTATION
    history.pushState({page: "home"}, null, '/Home');
    window.addEventListener('popstate', function(e) {
      console.log(e.state.page);
      if(e.state.page === "home") {
        self.setState({
          listClasses : "result-list",
          bannerClasses : "banner",
          searchToggle : true,
          searchClasses : "search",
          iconClasses : "search-icon search-icon-animate",
          backClasses : "back-to-results",
          back2Classes : "back2",
          listingClasses : "listing",
          compareToggle : true,
          compareClasses : "compare",
          loaderClasses : "loader"
        });
      } else if(e.state.page === "compare") {
        self.setState({
          compareToggle : false,
          compareClasses : "compare compare-show",
          iconClasses : "search-icon search-icon-animate search-icon-hide",
          backClasses : "back-to-results",
          back2Classes : "back2 back-to-results-show"
        });
      } else if(e.state.page === "results") {
        self.setState({
          listClasses : "result-list results-list-show",
          bannerClasses : "banner banner-hide",
          loaderClasses : "loader loader-hide",
          compareToggle : true,
          compareClasses : "compare",
          iconClasses : "search-icon search-icon-animate",
          backClasses : "back-to-results",
          back2Classes : "back2",
          listingClasses : "listing"
        });
      } else {
        self.setState({
          listingClasses : "listing listing-show",
          compareClasses : "compare",
          iconClasses : "search-icon search-icon-animate search-icon-hide",
          backClasses : "back-to-results back-to-results-show",
          listClasses : "result-list results-list-show results-list-hide",
        });
      }
    });
  }
  //NAVIGATE TO HOME PAGE
  goHome(){
    history.pushState({page: "home"}, null, '/Home');
    this.setState({
      listClasses : "result-list",
      bannerClasses : "banner",
      searchToggle : true,
      searchClasses : "search",
      iconClasses : "search-icon search-icon-animate",
      backClasses : "back-to-results",
      back2Classes : "back2",
      listingClasses : "listing",
      compareToggle : true,
      compareClasses : "compare",
      dogs : []
    });
    setTimeout(function(){
      this.setState({
        loaderClasses : "loader"
      });
    }.bind(this), 600);
  }
  //TOGGLE SEARCH COMPONENT
  searchToggle(){
    if(this.state.searchToggle === true) {
      this.setState({
        searchToggle : false,
        searchClasses : "search search-show",
        iconClasses : "search-icon",
        heartClasses : "heart",
        cartToggle : true,
        cartClasses : "cart"
      });
    } else {
      this.setState({
        "searchToggle" : true,
        "searchClasses" : "search",
        "iconClasses" : "search-icon search-icon-animate"
      });
    }
  }
  //TOGGLE CART COMPONENT
  cartToggle(){
    if(this.state.cartToggle === true){
      this.setState({
        cartToggle : false,
        cartClasses : "cart cart-show",
        heartClasses : "heart heart-open",
      });
      if(this.state.searchToggle === false) {
        this.setState({
          searchToggle : true,
          searchClasses : "search",
          iconClasses : "search-icon search-icon-animate"
        })
      }
    } else {
      this.setState({
        cartToggle : true,
        cartClasses : "cart",
        heartClasses : "heart"
      });
    }
  }
  //NAVIGATE TO COMPARE DOGS PAGE
  compareToggle(){
    var sc = this.state.scrollPos;
    if(this.state.compareToggle === true 
    && this.state.listClasses === "result-list results-list-show"){
        
        this.setState({
          cartToggle : true,
          cartClasses : "cart",
          heartClasses : "heart"
        });
        setTimeout(function(){
          this.setState({
            listClasses : "result-list results-list-show results-list-hide"
          });
        }.bind(this), 500);
        setTimeout(function(){
          this.setState({
            compareToggle : false,
            compareClasses : "compare compare-show",
            iconClasses : "search-icon search-icon-animate search-icon-hide",
            backClasses : "back-to-results",
            back2Classes : "back2 back-to-results-show"
          });
          document.body.scrollTop = 0;
        }.bind(this), 750);
        history.pushState({page: "compare"}, null, '/Compare');

    } else if(this.state.compareToggle === true 
    && this.state.listClasses === "result-list"){
        
        this.setState({
          cartToggle : true,
          cartClasses : "cart",
          heartClasses : "heart"
        });
        setTimeout(function(){
          this.setState({
            compareToggle : false,
            compareClasses : "compare compare-show",
            iconClasses : "search-icon search-icon-animate search-icon-hide",
            backClasses : "back-to-results",
            back2Classes : "back2 back-to-results-show"
          });
        }.bind(this), 500);
        setTimeout(function(){
          document.body.scrollTop = 0;
        }, 750);
        history.pushState({page: "compare"}, null, '/Compare');

    } else if(this.state.compareToggle === true 
    && this.state.listClasses === "result-list results-list-show results-list-hide"){
        
        this.setState({
          cartToggle : true,
          cartClasses : "cart",
          heartClasses : "heart"
        });
        setTimeout(function(){
          this.setState({
            compareToggle : false,
            compareClasses : "compare compare-show",
            iconClasses : "search-icon search-icon-animate search-icon-hide",
            backClasses : "back-to-results",
            back2Classes : "back2 back-to-results-show"
          });
        }.bind(this), 500);
        setTimeout(function(){
          document.body.scrollTop = 0;
        }, 750);
        history.pushState({page: "compare"}, null, '/Compare');

    } else if( this.state.compareToggle === false 
    && this.state.listClasses === "result-list results-list-show results-list-hide" 
    && this.state.listingClasses === "listing listing-show" ) {
        
        this.setState({
          compareToggle : true,
          compareClasses : "compare",
          listClasses : "result-list results-list-show",
          iconClasses : "search-icon search-icon-animate search-icon-hide",
          backClasses : "back-to-results back-to-results-show",
          back2Classes : "back2"
        });
        document.body.scrollTop = sc;
        history.pushState({page: "results"}, null, '/Search-Results');

    } else if( this.state.compareToggle === false 
    && this.state.listClasses === "result-list results-list-show results-list-hide" ) {
        
        this.setState({
          compareToggle : true,
          compareClasses : "compare",
          listClasses : "result-list results-list-show",
          iconClasses : "search-icon search-icon-animate",
          backClasses : "back-to-results",
          back2Classes : "back2"
        });
        document.body.scrollTop = sc;
        history.pushState({page: "results"}, null, '/Search-Results');
    } else if( this.state.compareToggle === false 
    && this.state.listClasses === "result-list" ) {
        
        this.setState({
          compareToggle : true,
          compareClasses : "compare",
          iconClasses : "search-icon search-icon-animate",
          backClasses : "back-to-results",
          back2Classes : "back2"

        });
        document.body.scrollTop = sc;
        history.pushState({page: "home"}, null, '/Home');
    }
  }
  //NARROW SEARCH BY GIVEN CREDENTIALS
  narrowSearch(zip, breed, age, gender){
    this.setState({
      zip: zip,
      breed : breed,
      gender : gender,
      age : age
    }, this.transitionUI);
  }
  //CLOSE SEARCH BAR AND NAVIGATE TO RESULTS PAGE
  transitionUI(){
    this.searchToggle();
    this.getDogs();
  }
  //NAVIGATE FROM DOG LISTING PAGE TO RESULTS PAGE
  backToResults(){
    var sc = this.state.scrollPos;
    this.setState({
      listingClasses : "listing",
      iconClasses : "search-icon search-icon-animate",
      backClasses : "back-to-results",
      listClasses : "result-list results-list-show"
    });
    setTimeout(function(){
      document.body.scrollTop = sc;
    }, 300);
    setTimeout(function(){
      document.getElementById('sd').innerHTML = 'Save to Cart';
      document.getElementById('sd').classList.remove('save-dog-animate');
    }, 500);
    history.pushState({page: "results"}, null, '/Search-Results');
  }
  //NAVIGATE TO INDIVIDUAL DOG LISTING PAGE
  showDog(e){
    if(e.target.className === 'dog' || e.target.className === 'image' || e.target.className === 'name' || e.target.tagName === 'IMG' || e.target.tagName === 'H3' || e.target.tagName === 'H2'){
      var index, dog, dogSize, breed, i, sc, email, phone, dogBreed = '';
      sc = document.body.scrollTop;
      document.getElementById('listing').scrollTop = 0;
      if(e.target.tagName === 'H3' || e.target.tagName === 'H2' || e.target.tagName === 'IMG') {
        index = e.target.parentNode.parentNode.dataset.index;
        dog = this.state.dogs[index];
        if(dog[5].length > 0) {
          for(i = 0; i < dog[5].length; i++) {
            breed = dog[5][i];
            if (i === dog[5].length - 1){
              dogBreed += breed;
            } else {
              dogBreed += breed+'-';
            }
          }
        }
        if(dog[5].length === 0) {
          dogBreed = 'Unknown Breed';
        } 
        if(dog[4] === "S") {
          dogSize = "Small";
        }
        if(dog[4] === "M") {
          dogSize = "Medium";
        }
        if(dog[4] === 'L') {
          dogSize = "Large";
        }
        if(dog[10][3] === undefined) {
          phone = 'None listed';
        } else {
          phone = dog[10][3];
        }
        if(dog[10][2] === undefined) {
          email = 'None listed';
        } else {
          email = dog[10][2];
        }
        this.setState({
          listingClasses : "listing listing-show",
          clickedDog : dog,
          dogName : dog[0],
          dogAge : dog[3],
          dogGender : dog[2],
          dogBreed : dogBreed,
          dogSize : dogSize,
          dogPic : dog[1],
          dogDesc : dog[7],
          contactEmail : email,
          contactPhone : phone,
          id : dog[11],
          iconClasses : "search-icon search-icon-animate search-icon-hide",
          backClasses : "back-to-results back-to-results-show",
          listClasses : "result-list results-list-show results-list-hide",
          scrollPos : sc
        });
        history.pushState({page: dog[0]}, null, '/'+dog[0]);
      }
      if(e.target.className === 'image' || e.target.className === 'name') {
        index = e.target.parentNode.dataset.index;
        dog = this.state.dogs[index];
        if(dog[5].length > 0) {
          for(i = 0; i < dog[5].length; i++) {
            breed = dog[5][i];
            if (i === dog[5].length - 1){
              dogBreed += breed;
            } else {
              dogBreed += breed+'-';
            }
          }
        }
        if(dog[5].length === 0) {
          dogBreed = 'Unknown Breed';
        } 
        if(dog[4] === "S") {
          dogSize = "Small";
        }
        if(dog[4] === "M") {
          dogSize = "Medium";
        }
        if(dog[4] === 'L') {
          dogSize = "Large";
        }
        if(dog[10][3] === undefined) {
          phone = 'None listed';
        } else {
          phone = dog[10][3];
        }
        if(dog[10][2] === undefined) {
          email = 'None listed';
        } else {
          email = dog[10][2];
        }
        this.setState({
          listingClasses : "listing listing-show",
          clickedDog : dog,
          dogName : dog[0],
          dogAge : dog[3],
          dogGender : dog[2],
          dogBreed : dogBreed,
          dogSize : dogSize,
          dogPic : dog[1],
          dogDesc : dog[7],
          contactEmail : email,
          contactPhone : phone,
          id : dog[11],
          iconClasses : "search-icon search-icon-animate search-icon-hide",
          backClasses : "back-to-results back-to-results-show",
          listClasses : "result-list results-list-show results-list-hide",
          scrollPos : sc
        });
        history.pushState({page: dog[0]}, null, '/'+dog[0]);
      }
    }
  }
  //SEARCH DOGS AND NAVIGATE TO RESULTS PAGE
  getDogs(){
    history.pushState({page: "results"}, null, '/Results');
    document.body.scrollTop = 0;
    var self = this;
    self.setState({
      dogs : [],
      loaderClasses : "loader",
      errorClasses : "error",
      errorClasses2: "error"
    });
    setTimeout(function(){
      self.setState({
        listClasses : "result-list results-list-show",
        bannerClasses : "banner banner-hide"
      });
    }, 700);
    var zip = self.state.zip, breedUrl, genderUrl, age;
    if(this.state.breed !== null) {
      breedUrl = '&breed='+this.state.breed;
    } else {
      breedUrl = '';
    }
    if(this.state.gender !== null) {
      genderUrl = '&sex='+this.state.gender;
    } else {
      genderUrl = '';
    }
    if(this.state.age !== null) {
      age = '&age='+this.state.age;
    } else {
      age = '';
    }
    jsonp('https://api.petfinder.com/pet.find?location='+zip+'&format=json&output=full'+genderUrl+age+'&animal=dog'+breedUrl+'&offset=0&count=24&key=30ee8287679b46176ef7acfbfee70f33', null, function (err, data) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(data.petfinder.pets);
        if(data.petfinder.pets.pet === undefined) {
          self.setState({
            errorClasses : "error error-show",
            loaderClasses : "loader loader-hide"
          });
        } else {
          var d = [];
          for (var i = 0; i < data.petfinder.pets.pet.length; i++) {
            var a = [], image;
            var name = data.petfinder.pets.pet[i].name.$t;
            if(data.petfinder.pets.pet[i].media.photos !== undefined){
              image = data.petfinder.pets.pet[i].media.photos.photo[2].$t;
            } else {
              image = 'no image';
            }
            var age = data.petfinder.pets.pet[i].age.$t;
            var sex = data.petfinder.pets.pet[i].sex.$t;
            var size = data.petfinder.pets.pet[i].size.$t;
            var description = data.petfinder.pets.pet[i].description.$t;
            var facts = [];
            var id = data.petfinder.pets.pet[i].id.$t;
            var breeds = [];
            var contact = [];
            var city = data.petfinder.pets.pet[i].contact.city.$t;
            var state = data.petfinder.pets.pet[i].contact.state.$t;
            var email = data.petfinder.pets.pet[i].contact.email.$t;
            var phone = data.petfinder.pets.pet[i].contact.phone.$t;
            if(data.petfinder.pets.pet[i].options.option !== undefined){
              for(var h = 0; h < data.petfinder.pets.pet[i].options.option.length; h++){
                var fact = data.petfinder.pets.pet[i].options.option[h].$t;
                facts.push(fact);
              }
            }
            for(var j = 0; j < data.petfinder.pets.pet[i].breeds.breed.length; j++){
              var breed = data.petfinder.pets.pet[i].breeds.breed[j].$t;
              breeds.push(breed);
            }
            if(sex === 'M') {
              sex = 'Male';
            } else if(sex === 'F') {
              sex = 'Female';
            } else {
              sex = 'Unknown';
            }
            contact.push(city, state, email, phone);
            a.push(name, image, sex, age, size, breeds, facts, description, sex, age, contact, id);
            d.push(a);
          }
          self.setState({
            dogs : d,
            loaderClasses : "loader loader-hide"
          });
        }
      }
    });
  }
  //RETURN MORE RESULTS FROM SEARCH
  moreDogs(){
    var self = this;
    self.setState({
      loaderClasses : "loader"
    });
    var zip = self.state.zip, breedUrl, genderUrl, age, offset = self.state.offset;
    if(this.state.breed !== null) {
      breedUrl = '&breed='+this.state.breed;
    } else {
      breedUrl = '';
    }
    if(this.state.gender !== null) {
      genderUrl = '&sex='+this.state.gender;
    } else {
      genderUrl = '';
    }
    if(this.state.age !== null) {
      age = '&age='+this.state.age;
    } else {
      age = '';
    }
    jsonp('https://api.petfinder.com/pet.find?location='+zip+'&format=json&output=full'+genderUrl+age+'&animal=dog'+breedUrl+'&offset='+offset+'&count=24&key=30ee8287679b46176ef7acfbfee70f33', null, function (err, data) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(data.petfinder.pets);
        var d = self.state.dogs;
        if(data.petfinder.pets.pet !== undefined) {
          for (var i = 0; i < data.petfinder.pets.pet.length; i++) {
            var a = [];
            var image;
            var name = data.petfinder.pets.pet[i].name.$t;
            if(data.petfinder.pets.pet[i].media.photos !== undefined){
              image = data.petfinder.pets.pet[i].media.photos.photo[2].$t;
            } else {
              image = 'no image';
            }
            var age = data.petfinder.pets.pet[i].age.$t;
            var sex = data.petfinder.pets.pet[i].sex.$t;
            var size = data.petfinder.pets.pet[i].size.$t;
            var description = data.petfinder.pets.pet[i].description.$t;
            var facts = [];
            var breeds = [];
            var contact = [];
            var city = data.petfinder.pets.pet[i].contact.city.$t;
            var state = data.petfinder.pets.pet[i].contact.state.$t;
            var email = data.petfinder.pets.pet[i].contact.email.$t;
            var phone = data.petfinder.pets.pet[i].contact.phone.$t;
            if(data.petfinder.pets.pet[i].options.option !== undefined){
              for(var h = 0; h < data.petfinder.pets.pet[i].options.option.length; h++){
                var fact = data.petfinder.pets.pet[i].options.option[h].$t;
                facts.push(fact);
              }
            }
            for(var j = 0; j < data.petfinder.pets.pet[i].breeds.breed.length; j++){
              var breed = data.petfinder.pets.pet[i].breeds.breed[j].$t;
              breeds.push(breed);
            }
            if(sex === 'M') {
              sex = 'Male';
            } else if(sex === 'F') {
              sex = 'Female';
            } else {
              sex = 'Unknown';
            }
            contact.push(city, state, email, phone);
            a.push(name, image, sex, age, size, breeds, facts, description, sex, age, contact);
            d.push(a);
          }
          self.setState({
            dogs : d,
            loaderClasses : "loader loader-hide",
            offset : offset + 24
          });
        }
        if(data.petfinder.pets.pet === undefined && self.state.dogs.length !== 0) {
          self.setState({
            errorClasses2: "error error-show",
            loaderClasses : "loader loader-hide",
            offset : offset
          });
        } else {

        }
      }
    });
  }

  render() {
    return (
      <div 
        className="App" 
        id='App'
        onClick={this.handleDogDelete.bind(this)} >

        <Header 
          goHome={this.goHome.bind(this)}
          searchToggle={this.searchToggle.bind(this)}
          classes={this.state.iconClasses}
          toHome={this.goHome}
          backClasses={this.state.backClasses}
          back2Classes={this.state.back2Classes}
          backToResults={this.backToResults.bind(this)}
          heartClasses={this.state.heartClasses}
          cartToggle={this.cartToggle.bind(this)}
          compareToggle={this.compareToggle.bind(this)}
          data={this.state.data} />

        <Search 
          classes={this.state.searchClasses}
          narrowSearch={this.narrowSearch.bind(this)} />

        <Banner 
          classes={this.state.bannerClasses}
          searchToggle={this.searchToggle.bind(this)} />

        <List 
          classes={this.state.listClasses}
          dogs={this.state.dogs}
          loaderClasses={this.state.loaderClasses} 
          getMore={this.moreDogs.bind(this)} 
          showDog={this.showDog.bind(this)}
          errorClasses={this.state.errorClasses}
          errorClasses2={this.state.errorClasses2} />

        <Listing 
          classes={this.state.listingClasses}
          name={this.state.dogName}
          age={this.state.dogAge}
          gender={this.state.dogGender}
          breed={this.state.dogBreed}
          size={this.state.dogSize}
          src={this.state.dogPic}
          description={this.state.dogDesc}
          email={this.state.contactEmail}
          phone={this.state.contactPhone}
          id={this.state.id}
          saveDog={this.handleDogSubmit.bind(this)} />

        <Cart 
          classes={this.state.cartClasses}
          savedDogs={this.state.data}
          cartToggle={this.cartToggle.bind(this)}
          compareToggle={this.compareToggle.bind(this)}
          user={this.state.loggedIn}
          login={this.login.bind(this)} />

        <Compare 
          classes={this.state.compareClasses}
          savedDogs={this.state.data} />

      </div>
    );
  }
}

export default App;

function resize(){
    var heights = window.innerHeight;
    var widths = window.innerWidth;
    document.getElementById("App").style.height = heights + "px";
    document.getElementById("App").style.width = widths + "px";
}
//TEST FOR LOCAL STORAGE
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}