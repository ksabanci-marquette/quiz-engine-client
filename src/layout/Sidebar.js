import React, {Component} from 'react';
import {Link} from "react-router-dom";
import FirstLevelItem from "../common/FirstLevelItem";
import {Col, Row} from "reactstrap";
import {RightExists} from "../util/Helpers";
import {Button, Modal} from "antd";

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: "homePage",
			iconVisible: true,
			activeMenu: null
		};
		this.onChangeSelected = this.onChangeSelected.bind(this);
		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.RightExists=this.RightExists.bind(this);
		this.showModal=this.showModal.bind(this);
		this.handleCancel=this.handleCancel.bind(this);
	}

	RightExists( searchItem){
		let exists=false;
		const authorities=this.props.authorities;
		for (const authority of authorities)
		{
			if (authority.authority.includes(searchItem)) {
				exists=true;
			}
		}
		return exists;
	}

	onChangeSelected(selected, activeMenu, event) {
		this.setState({selected, activeMenu});
	}

	async toggleSidebar() {
		document.body.classList.toggle('sidebar-mini');
		this.props.setOffsetWidth(document.getElementById('sidebarModeButton').children[0].offsetWidth);
		this.state.iconVisible ? await this.setState({iconVisible: false}) : await this.setState({iconVisible: true});
	}

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	handleCancel = e => {
		this.setState({
			visible: false,
		});
	};

	render() {
		const selected = this.state.selected;
		return (
			<div className="sidebar">
				<div className="logo" id="sidebar" style={{margin: '0', padding: '4px 0 0 0'}}>
					{!this.state.iconVisible &&
					<Row style={{padding: '0', margin: '0 0 0 10px'}}>
						<a href="/" className="simple-text logo-mini">
							<img style={{padding: '0', margin: '0'}} className="simple-text logo-mini" src={process.env.REACT_APP_CONTEXT_NAME + "/image/quizengine.png"}/>
						</a>
					</Row>}
					{this.state.iconVisible &&
					<Row style={{padding: '0', margin: '0'}}>
						<Col xs='4'>
							<img style={{padding: '0', margin: '0'}} className=" simple-text logo-normal"
								 src={process.env.REACT_APP_CONTEXT_NAME + "/image/quizengine.png"}/>
						</Col>
						<Col xs='8' style={{margin: 'auto', padding: '0', wordBreak: 'initial'}}>
							<p style={{margin: '0', padding: '0', fontSize: '18px'}}>QUIZ ENGINE</p>
						</Col>
					</Row>}
					{/*<div className="navbar-minimize">
						<button id='sidebarModeButton' onClick={this.toggleSidebar} style={{marginTop: '10px'}}
								className=" btn btn-simple btn-icon btn-neutral btn-round">
							<i className="now-ui-icons text_align-center visible-on-sidebar-regular"/>
							<i className="now-ui-icons design_bullet-list-67 visible-on-sidebar-mini"/>
						</button>
					</div>*/}
				</div>

				<div className="sidebar-wrapper scrollbar" id="style-7" style={{paddingBottom: "44px"}}>

					<div className="user">
						<div className="photo"><img src={process.env.REACT_APP_CONTEXT_NAME + "/image/avt.png"} alt="Avatar"/></div>
						<div className="info">
							<a data-toggle="collapse" aria-expanded="false" href='#merdo'>
								<span>
									{this.props.currentUser.username && ((this.props.currentUser.username.length>21)?this.props.currentUser.username.toString().substring(0,18)+'...':this.props.currentUser.username)||
									this.props.currentUser.email && ((this.props.currentUser.email.length>21)?this.props.currentUser.email.toString().substring(0,18)+'...':this.props.currentUser.email)}

									<b className="caret"/>
								</span>
							</a>
							<div className="collapse" id='merdo'>
							<ul className="nav">
									<li onClick={(e) => this.onChangeSelected("member", "profil", e)}>
											<Link to={{pathname:'/profile'}} >
											<span style={{color: this.state.activeMenu === "Profil" && "#6BD098"}} className="sidebar-normal">Profile</span>
										</Link>
									</li>

								</ul>
							</div>
						</div>
					</div>

					<ul className="nav">
						<FirstLevelItem
							name="homePage"
							label="Home Page"
							isActive={selected === "homePage"}
							show={true}
							icons="fa fa-home fa-fw"
							sidebarItemColor="#6BD098"
							clicked={this.onChangeSelected}/>

					</ul>

					<ul className="nav">
						<FirstLevelItem
							name="quizResults"
							label="Quiz Results"
							isActive={selected === "quizResults"}
							show={true}
							icons="fa fa-question fa-fw"
							sidebarItemColor="#6BD098"
							clicked={this.onChangeSelected}/>
					</ul>

					<ul className="nav">
						<FirstLevelItem
							name="quizStats"
							label="Quiz Stats"
							isActive={selected === "quizStats"}
							show={true}
							icons="fa fa-bar-chart"
							sidebarItemColor="#6BD098"
							clicked={this.onChangeSelected}/>
					</ul>

					<ul className="nav" style={{position:"fixed", width:"260px", bottom: "0", zIndex:"100000"}}>
						<li

							// onClick={this.props.onLogout}
							onClick={this.showModal}
							style={{
								fontFamily: "Muli, Helvetica, Arial, sans-serif",
								color: "white",
								fontSize:"14px",
								textAlign: "center",
								background: "#ef767d",
								padding: "11px 0",
								cursor:"pointer"}}>
							Log Out
						</li>
					</ul>
					<Modal
						title=""
						visible={this.state.visible}
						okText="Logout"
						cancelText="Cancel"
						onOk={this.props.onLogout}
						onCancel={this.handleCancel}
						maskClosable={false}
					>
						<p><h4>Are you sure to Logout?</h4></p>

					</Modal>
				</div>
			</div>
		);
	}
}

export default Sidebar;
