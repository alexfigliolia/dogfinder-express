import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Dogs } from '../api/dogs.js';

Meteor.publish('userData', function() {
     var currentUser;
     currentUser = this.userId;
     if (currentUser) {
         return Meteor.users.find({
             _id: currentUser
         }, {
         fields: {
             "emails": 1
         }
      });
    } else {
      return this.ready();
  }
});



Meteor.publish('dogs', function() {
  var userId = this.userId,
      data = [
        Dogs.find( { owner: userId }, {
          fields: {
            dog : 1,
            dogsize: 1,
            doggender: 1,
            dogimg: 1,
            description: 1,
            contactPhone: 1,
            contactEmail: 1,
            dogid : 1,
            owner: 1
          }
        })
      ]; 

  if ( data ) {
    return data;
    console.log(data);
  } else {
    return this.ready();
  }
});
 
Meteor.methods({
  'dogs.insert'(object) {
    check(object, Object);
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Dogs.insert({
      dog : object.dog,
      dogsize: object.dogsize,
      doggender: object.doggender,
      dogimg: object.dogimg,
      description: object.description,
      contactPhone: object.contactPhone,
      contactEmail: object.contactEmail,
      dogid : object.dogid,
      owner: Meteor.userId()
    });
  },

  'dogs.remove'(object) {
    check(object, Object);
 
    Dogs.remove(object);
  },

  'dogs.find'(id){
    check(id, String);
    Dogs.find({owner: id});
  }
});