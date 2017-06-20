import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from './src/App.js';
import '../startup/accounts-config.js';
 
Meteor.startup(() => {
  render(<App />, document.getElementById('root'));
});

