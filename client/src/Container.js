import { Meteor } from 'meteor/meteor';
import { Dogs } from '../../api/dogs.js';
import { createContainer } from 'meteor/react-meteor-data';
import App from './App.js';

export default AppContainer = createContainer(() => {
  const users = Meteor.subscribe('userData');
  const id = Meteor.userId();
  const user = Meteor.user();
  const userDogs = Meteor.subscribe('dogs');
  const dogsReady = userDogs.ready();
  const dogs = Dogs.find({owner: id}).fetch();
  const dogsExist = dogsReady && !!dogs;
  return {
    id,
    user,
    dogsReady,
    userDogs,
    dogsExist,
    dogs,
  };
}, App);