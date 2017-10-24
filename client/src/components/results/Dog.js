import React, { Component } from 'react';

export default class Dog extends Component {

	componentDidMount(){
	  const m = document.getElementsByClassName('dog');
		for ( let i=0; i < m.length; i++ ) {
		    // get function in closure, so i can iterate
		    const toggleItemMove = this.toggleMove( i );
		    // reverse stagger order
		    let delay = i + 1;
		    delay *= 30;
		    // stagger transition with setTimeout
		    setTimeout( toggleItemMove, delay );
		}
	}

	toggleMove(i){
	  	const m = document.getElementsByClassName('dog');
	  	let item = m[i];
	  	return function() {
		    item.classList.add('dog-show');
		}
	}

	componentWillUnmount(){
	  	const m = document.getElementsByClassName('dog');
	  	for (let i = 0; i < m.length; i++) {
	      return function() {
	        m[i].classList.remove('dog-show');
	      }
	    }
	}

	render = () => {
		return(
			<div className="dog" data-index={this.props.index}>
				<div className='image'>
					<img src={this.props.image} alt='doggie' />
				</div>
				<div className='name'>
					<h3>{this.props.sex}</h3>
					<h2>{this.props.name}</h2>
					<h3>{this.props.age}</h3>
				</div>
			</div>
		);
	}
}