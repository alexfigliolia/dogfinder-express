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
      // users: this.getUserData(),
      loggedIn: false
    }
  }

  componentDidMount(){
    //RESIZE TO WINDOW SIZE
    window.addEventListener("resize", resize);
    resize();
    //HISTORY API IMPLEMENTATION
    history.pushState({page: "home"}, null, '/Home');
    window.addEventListener('popstate', (e) => {
      if(e.state.page === "home") {
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
          loaderClasses : "loader"
        });
      } else if(e.state.page === "compare") {
        this.setState({
          compareToggle : false,
          compareClasses : "compare compare-show",
          iconClasses : "search-icon search-icon-animate search-icon-hide",
          backClasses : "back-to-results",
          back2Classes : "back2 back-to-results-show"
        });
      } else if(e.state.page === "results") {
        this.setState({
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
        this.setState({
          listingClasses : "listing listing-show",
          compareClasses : "compare",
          iconClasses : "search-icon search-icon-animate search-icon-hide",
          backClasses : "back-to-results back-to-results-show",
          listClasses : "result-list results-list-show results-list-hide",
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if(nextProps.id !== null) {
      this.setState({ loggedIn: true, data: nextProps.dogs });
    } else {
      this.setState({ loggedIn: false, data: nextProps.dogs });
    }
  }

  //LOGIN OR CREATE USER
  login = (e, p) => {
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
                }
              });
            }
          });
        }
      }
    });
  }
  //SAVE TO CART
  handleDogSubmit = (e) => {
    if(this.state.loggedIn === false) {
      this.setState({
        cartToggle : false,
        cartClasses : "cart cart-show",
        heartClasses : "heart heart-open"
      });
    } else {
      e.target.classList.add('save-dog-animate');
      const dogs = this.state.data;
      const id = e.target.dataset.id;
      const name = e.target.dataset.name;
      const img = this.state.dogPic;
      const desc = this.state.dogDesc;
      const size = this.state.dogSize;
      const gender = this.state.dogGender;
      const phone = this.state.contactPhone;
      const email = this.state.contactEmail;
      const gooddesc = desc.substr(0, 300);
      const descTrim = gooddesc.substr(0, Math.min(gooddesc.length, gooddesc.lastIndexOf(" ")));
      const formatted = descTrim + '...';
      const dog = {
        dog : name,
        dogsize: size,
        doggender: gender,
        dogimg: img,
        description: formatted,
        contactPhone: phone,
        contactEmail: email,
        dogid : id
      };
      const update = dogs.concat(dog);
      Meteor.call('dogs.insert', dog, (err, result) => {
        if(err) {
          console.log(err);
        } else {
          this.setState({ heartClasses : "heart heart-pulse" });
          setTimeout(() => { this.setState({ heartClasses : "heart" }); }, 700);
        }
      });
    }
  }
  //DELETE FROM CART
  handleDogDelete = (e) => {
    if(e.target.className === 'remove-dog') {
      const id = e.target.dataset.id;
      Meteor.call('dogs.remove', { dogid: id, owner: Meteor.userId() }, (err, result) => {
        if(err) {
          console.log(err);
        } else {
          this.setState({ heartClasses : "heart heart-pulse" });
          setTimeout(() => { this.setState({ heartClasses : "heart" }); }, 700);
        }
      });
    }
  }

  //NAVIGATE TO HOME PAGE
  goHome = () => {
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
    setTimeout(() => { this.setState({ loaderClasses : "loader" }); }, 600);
  }
  //TOGGLE SEARCH COMPONENT
  searchToggle = () => {
    if(this.state.searchToggle) {
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
  cartToggle = () => {
    if(this.state.cartToggle){
      this.setState({
        cartToggle : false,
        cartClasses : "cart cart-show",
        heartClasses : "heart heart-open",
      });
      if(this.state.searchToggle) {
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
  compareToggle = () => {
    const sc = this.state.scrollPos;
    if(this.state.compareToggle && this.state.listClasses === "result-list results-list-show"){
        this.setState({
          cartToggle : true,
          cartClasses : "cart",
          heartClasses : "heart"
        });
        setTimeout(() => {
          this.setState({
            listClasses : "result-list results-list-show results-list-hide"
          });
        }, 500);
        setTimeout(() => {
          this.setState({
            compareToggle : false,
            compareClasses : "compare compare-show",
            iconClasses : "search-icon search-icon-animate search-icon-hide",
            backClasses : "back-to-results",
            back2Classes : "back2 back-to-results-show"
          });
          document.body.scrollTop = 0;
        }, 750);
        history.pushState({page: "compare"}, null, '/Compare');

    } else if(this.state.compareToggle && this.state.listClasses === "result-list"){       
        this.setState({
          cartToggle : true,
          cartClasses : "cart",
          heartClasses : "heart"
        });
        setTimeout(() => {
          this.setState({
            compareToggle : false,
            compareClasses : "compare compare-show",
            iconClasses : "search-icon search-icon-animate search-icon-hide",
            backClasses : "back-to-results",
            back2Classes : "back2 back-to-results-show"
          });
        }, 500);
        setTimeout(() => { document.body.scrollTop = 0; }, 750);
        history.pushState({page: "compare"}, null, '/Compare');
    } else if(this.state.compareToggle && this.state.listClasses === "result-list results-list-show results-list-hide"){
        
        this.setState({
          cartToggle : true,
          cartClasses : "cart",
          heartClasses : "heart"
        });
        setTimeout(() => {
          this.setState({
            compareToggle : false,
            compareClasses : "compare compare-show",
            iconClasses : "search-icon search-icon-animate search-icon-hide",
            backClasses : "back-to-results",
            back2Classes : "back2 back-to-results-show"
          });
        }, 500);
        setTimeout(() => { document.body.scrollTop = 0; }, 750);
        history.pushState({page: "compare"}, null, '/Compare');

    } else if( !this.state.compareToggle
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
    } else if( !this.state.compareToggle 
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
    } else if( !this.state.compareToggle && this.state.listClasses === "result-list" ) {  
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
  narrowSearch = (zip, breed, age, gender) => {
    this.setState({
      zip: zip,
      breed : breed,
      gender : gender,
      age : age
    }, this.transitionUI);
  }
  //CLOSE SEARCH BAR AND NAVIGATE TO RESULTS PAGE
  transitionUI = () => {
    this.searchToggle();
    this.getDogs();
  }
  //NAVIGATE FROM DOG LISTING PAGE TO RESULTS PAGE
  backToResults = () => {
    const sc = this.state.scrollPos;
    this.setState({
      listingClasses : "listing",
      iconClasses : "search-icon search-icon-animate",
      backClasses : "back-to-results",
      listClasses : "result-list results-list-show"
    });
    setTimeout(() => { document.body.scrollTop = sc; }, 300);
    setTimeout(() => {
      document.getElementById('sd').innerHTML = 'Save to Cart';
      document.getElementById('sd').classList.remove('save-dog-animate');
    }, 500);
    history.pushState({page: "results"}, null, '/Search-Results');
  }

  //NAVIGATE TO INDIVIDUAL DOG LISTING PAGE
  showDog = (e) => {
    if(e.target.className === 'dog' || e.target.className === 'image' || e.target.className === 'name' || e.target.tagName === 'IMG' || e.target.tagName === 'H3' || e.target.tagName === 'H2'){
      let index, dog, dogSize, breed, i, sc, email, phone, dogBreed = '';
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
        if(dog[5].length === 0) dogBreed = 'Unknown Breed';
        if(dog[4] === "S") dogSize = "Small";
        if(dog[4] === "M")  dogSize = "Medium";
        if(dog[4] === 'L') dogSize = "Large";
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
  getDogs = () => {
    history.pushState({page: "results"}, null, '/Results');
    document.body.scrollTop = 0;
    this.setState({
      dogs : [],
      loaderClasses : "loader",
      errorClasses : "error",
      errorClasses2: "error"
    });
    setTimeout(() => {
      this.setState({
        listClasses : "result-list results-list-show",
        bannerClasses : "banner banner-hide"
      });
    }, 700);
    let zip = this.state.zip, breedUrl, genderUrl, ageUrl;
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
      ageUrl = '&age='+this.state.age;
    } else {
      ageUrl = '';
    }
    jsonp('https://api.petfinder.com/pet.find?location='+zip+'&format=json&output=full'+genderUrl+ageUrl+'&animal=dog'+breedUrl+'&offset=0&count=24&key=30ee8287679b46176ef7acfbfee70f33', null, (err, data) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(data.petfinder.pets);
        if(data.petfinder.pets.pet === undefined) {
          this.setState({
            errorClasses : "error error-show",
            loaderClasses : "loader loader-hide"
          });
        } else {
          let d = [];
          for (let i = 0; i < data.petfinder.pets.pet.length; i++) {
            let a = [], image;
            let name = data.petfinder.pets.pet[i].name.$t;
            if(data.petfinder.pets.pet[i].media.photos !== undefined){
              image = data.petfinder.pets.pet[i].media.photos.photo[2].$t;
            } else {
              image = 'no image';
            }
            const age = data.petfinder.pets.pet[i].age.$t;
            let sex = data.petfinder.pets.pet[i].sex.$t;
            const size = data.petfinder.pets.pet[i].size.$t;
            const description = data.petfinder.pets.pet[i].description.$t;
            const facts = [];
            const id = data.petfinder.pets.pet[i].id.$t;
            const breeds = [];
            const contact = [];
            const city = data.petfinder.pets.pet[i].contact.city.$t;
            const state = data.petfinder.pets.pet[i].contact.state.$t;
            const email = data.petfinder.pets.pet[i].contact.email.$t;
            const phone = data.petfinder.pets.pet[i].contact.phone.$t;
            if(data.petfinder.pets.pet[i].options.option !== undefined){
              for(let h = 0; h < data.petfinder.pets.pet[i].options.option.length; h++){
                let fact = data.petfinder.pets.pet[i].options.option[h].$t;
                facts.push(fact);
              }
            }
            for(let j = 0; j < data.petfinder.pets.pet[i].breeds.breed.length; j++){
              let breed = data.petfinder.pets.pet[i].breeds.breed[j].$t;
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
          this.setState({ dogs : d, loaderClasses : "loader loader-hide" });
        }
      }
    });
  }
  //RETURN MORE RESULTS FROM SEARCH
  moreDogs = () => {
    this.setState({
      loaderClasses : "loader"
    });
    let zip = this.state.zip, breedUrl, genderUrl, ageUrl, offset = this.state.offset;
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
      ageUrl = '&age='+this.state.age;
    } else {
      ageUrl = '';
    }
    jsonp('https://api.petfinder.com/pet.find?location='+zip+'&format=json&output=full'+genderUrl+ageUrl+'&animal=dog'+breedUrl+'&offset='+offset+'&count=24&key=30ee8287679b46176ef7acfbfee70f33', null, (err, data) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(data.petfinder.pets);
        const d = this.state.dogs;
        if(data.petfinder.pets.pet !== undefined) {
          for (let i = 0; i < data.petfinder.pets.pet.length; i++) {
            const a = [];
            let image;
            const name = data.petfinder.pets.pet[i].name.$t;
            if(data.petfinder.pets.pet[i].media.photos !== undefined){
              image = data.petfinder.pets.pet[i].media.photos.photo[2].$t;
            } else {
              image = 'no image';
            }
            const age = data.petfinder.pets.pet[i].age.$t;
            let sex = data.petfinder.pets.pet[i].sex.$t;
            const size = data.petfinder.pets.pet[i].size.$t;
            const description = data.petfinder.pets.pet[i].description.$t;
            const facts = [];
            const breeds = [];
            const contact = [];
            const city = data.petfinder.pets.pet[i].contact.city.$t;
            const state = data.petfinder.pets.pet[i].contact.state.$t;
            const email = data.petfinder.pets.pet[i].contact.email.$t;
            const phone = data.petfinder.pets.pet[i].contact.phone.$t;
            if(data.petfinder.pets.pet[i].options.option !== undefined){
              for(let h = 0; h < data.petfinder.pets.pet[i].options.option.length; h++){
                const fact = data.petfinder.pets.pet[i].options.option[h].$t;
                facts.push(fact);
              }
            }
            for(let j = 0; j < data.petfinder.pets.pet[i].breeds.breed.length; j++){
              const breed = data.petfinder.pets.pet[i].breeds.breed[j].$t;
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
          this.setState({ dogs: d, loaderClasses: "loader loader-hide", offset: offset + 24 });
        }
        if(data.petfinder.pets.pet === undefined && this.state.dogs.length !== 0) {
          this.setState({
            errorClasses2: "error error-show",
            loaderClasses : "loader loader-hide",
            offset : offset
          });
        }
        if(data.petfinder.pets.pet === undefined && this.state.dogs.length === 0) {
          this.setState({
            errorClasses: "error error-show",
            loaderClasses : "loader loader-hide",
            offset : offset
          });
        } 
      } 
    });
  }

  render() {
    return (
      <div 
        className="App" 
        id='App'
        onClick={this.handleDogDelete} >

        <Header 
          goHome={this.goHome}
          searchToggle={this.searchToggle}
          classes={this.state.iconClasses}
          toHome={this.goHome}
          backClasses={this.state.backClasses}
          back2Classes={this.state.back2Classes}
          backToResults={this.backToResults}
          heartClasses={this.state.heartClasses}
          cartToggle={this.cartToggle}
          compareToggle={this.compareToggle}
          data={this.state.data} />

        <Search 
          classes={this.state.searchClasses}
          narrowSearch={this.narrowSearch} />

        <Banner 
          classes={this.state.bannerClasses}
          searchToggle={this.searchToggle} />

        <List 
          classes={this.state.listClasses}
          dogs={this.state.dogs}
          loaderClasses={this.state.loaderClasses} 
          getMore={this.moreDogs} 
          showDog={this.showDog}
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
          saveDog={this.handleDogSubmit} />

        <Cart 
          classes={this.state.cartClasses}
          savedDogs={this.state.data}
          cartToggle={this.cartToggle}
          compareToggle={this.compareToggle}
          user={this.state.loggedIn}
          login={this.login} />

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