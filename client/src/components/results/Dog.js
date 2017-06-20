import React, { Component } from 'react';

class Dog extends Component {
	componentDidMount(){
	  	var m = document.getElementsByClassName('dog');
		for ( var i=0; i < m.length; i++ ) {
		    // get function in closure, so i can iterate
		    var toggleItemMove = this.toggleMove( i );
		    // reverse stagger order
		    var delay = i + 1;
		    delay *= 30;
		    // stagger transition with setTimeout
		    setTimeout( toggleItemMove, delay );
		}
	}

	toggleMove(i){
	  	var m = document.getElementsByClassName('dog');
	  	var item = m[i];
	  	return function() {
		    item.classList.add('dog-show');
		}
	}

	componentWillUnmount(){
	  	var m = document.getElementsByClassName('dog');
	  	for (var i = 0; i < m.length; i++) {
	      return function() {
	        m[i].classList.remove('dog-show');
	      }
	    }
	}

	render() {
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

export default Dog;