import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import AppContainer from './src/Container.js';
import '../startup/accounts-config.js';
 
Meteor.startup(() => {
  render(<AppContainer />, document.getElementById('root'));
});

