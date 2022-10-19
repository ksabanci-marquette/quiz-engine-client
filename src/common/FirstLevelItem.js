import React, {Component} from 'react';
import {Link} from "react-router-dom";


class FirstLevelItem extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		let show = this.props.show;
		let ret =
			(
				<li className={this.props.isActive ? 'active' : ''} onClick={(e) => this.props.clicked(this.props.name, e)}>
					<Link to={`/${this.props.name}`}>
						<i className={this.props.icons} style={{color: this.props.isActive && this.props.sidebarItemColor}}/>
						<p style={{color: this.props.isActive && this.props.sidebarItemColor}}>{this.props.label}</p>
					</Link>
				</li>
			);
		return show ? ret : null;
	}
}

export default FirstLevelItem;