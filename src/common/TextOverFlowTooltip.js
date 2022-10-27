import React, {Component} from "react" ;
import {Tooltip, UncontrolledTooltip} from "reactstrap";
import newId from '../common/newid';

class TextOverFlowTooltip extends Component {
	constructor(props) {
		super(props);

		this.state = {
			maxLength: 16,
			text: "",
			tooltipOpen: false
		};

		this.toggle = this.toggle.bind(this);

		this.id = newId();

	}

	componentWillMount() {
		this.setState({
			maxLength: this.props.maxLength || 16,
			text: this.props.text
		});
	}

	toggle() {
		this.setState({
			tooltipOpen: !this.state.tooltipOpen
		});
	}

	render() {
		return (
			<div style={{padding: 0, margin: 0, display: "inline"}}>
				{this.state.text &&
				<div id={this.id} style={{padding: 0, margin: 0, display: "inline"}}>
					{this.state.maxLength <= this.state.text.length ? (this.state.text).substring(0, this.state.maxLength - 1) + "..." : this.state.text}
				</div>
				}
				{(this.state.text && this.state.maxLength <= this.state.text.length) && !this.props.controlled &&
				<UncontrolledTooltip placement="right" target={this.id} delay={0}>
					{this.state.text}
				</UncontrolledTooltip>
				}

				{(this.state.text && this.state.maxLength <= this.state.text.length) && this.props.controlled &&
				<Tooltip placement='top' target={this.id} autohide={false} isOpen={this.state.tooltipOpen}
						 toggle={this.toggle}>
					{this.state.text}
				</Tooltip>
				}
			</div>
		);
	}
}

export default TextOverFlowTooltip;