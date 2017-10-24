import React, { Component } from 'react';
import Dogs from './Dogs.js';

export default class List extends Component {
	render = () => {
		return(
			<div className={this.props.classes} id='list'>
				<h1>Search Results</h1>
				<Dogs dogs={this.props.dogs} showDog={this.props.showDog} />
				<div className={this.props.loaderClasses} id='loader'></div>
				<div className={this.props.errorClasses}>
					<h2>There are no listings!</h2>
					<p>If you were looking for a specific breed, please make sure it is spelled correctly! Hit the search icon and try again!</p>
				</div>
				<div className={this.props.errorClasses2}>
					<h2>There are no more listings!</h2>
				</div>
				<div className='lmc'>
					<button onClick={this.props.getMore}>Load More</button>
				</div>
			</div>
		);
	}
}
