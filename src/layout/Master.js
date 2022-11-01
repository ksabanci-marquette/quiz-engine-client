import React, {Component} from 'react';
import Sidebar from "./Sidebar";
import Header from "./Header";

import Footer from "./Footer";
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import {getCurrentUser, request} from "../util/APIUtils";
import {ACCESS_TOKEN, API_BASE_URL} from "../constants";
import Login from "../page/Login";
import NotFound from "../common/NotFound";

import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/scale.css';
import 'react-s-alert/dist/s-alert-css-effects/genie.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';
import Home from "../page/Home";
import ResetPassword from "../page/ResetPassword";
import ChangePassword from "../page/ChangePassword";

import {Modal} from "antd";
import IdleTimer from 'react-idle-timer';

import {showAxiosError} from "../util/Helpers";
import Profile from "../page/Profile";
import Quiz from "../page/Quiz";
import Submitted from "../page/Submitted";

class Master extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentUser: null,
			authorities:[],
			isAuthenticated: false,
			isLoading: false,
			key: Math.random(),
			offsetWidth: 0,
			countBackFrom:30,
			countingBack:false,
			maxIdleTimeout:15,
		};
		console.log("inside Master constructor");
		this.loadCurrentUser = this.loadCurrentUser.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.updateSidebarMenus = this.updateSidebarMenus.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.countback = this.countback.bind(this);
		this.setOffsetWidth = this.setOffsetWidth.bind(this);


	}

	componentWillMount() {
		console.log("inside Master componentWillMount");
		this.loadCurrentUser();
	}

	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			window.scrollTo(0, 0)
		}
	}

	updateSidebarMenus(menuList) {
		let {currentUser} = this.state;
		currentUser.sidebarMenus = menuList;
		this.setState({currentUser})
	}

	loadCurrentUser() {
		let self = this;
		console.log("inside Master loadCurrentUser()");
		const curLocation= this.props.location.pathname;
		console.log("curLocation: ",curLocation);
		this.setState({isLoading: true});
		console.log("getCurrentUser()");
		getCurrentUser()
			.then(response => {
				console.log("=> then response,",response.data);
				let currentUser = response.data;
				self.setState({
					currentUser: currentUser,
					isAuthenticated: true,
					isLoading: false
				},()=> {
					console.log("=> then response==> callback");
					self.props.history.push((curLocation !== "/login") ? curLocation : "/homePage");
					console.log("currentUser:",currentUser);

				});
			}).catch(error => {
			if (curLocation === "/resetPassword" ||
				curLocation.toString().startsWith("/changePassword")) {

				self.setState({
					isLoading: false,
					currentUser: null,
					isAuthenticated: false,
				});
			}
			else {
				self.setState({
					isLoading: false,
					currentUser: null,
					isAuthenticated: false,
				}, () => {
					self.props.history.push("/login")
				});
			}

		});
	}

	handleLogout() {
		localStorage.removeItem(ACCESS_TOKEN);
		this.setState({
			currentUser: null,
			isAuthenticated: false,
			visible:false,
			countingBack:false,
			countBackFrom:30,
			isLoading:false,
		},()=>this.props.history.push('/login'));
	}

	handleLogin() {
		this.loadCurrentUser();
	}

	handleCancel () {
		let self=this;
		self.setState({visible: false,countingBack:false, countBackFrom:30});
	};

	setOffsetWidth(value) {
		let self = this;
		self.setState({offsetWidth: value});
	}

	_onAction(e) {

	}

	_onActive(e) {

	}

	_onIdle(e) {
		let self=this;
		self.showModal();
	}

	async showModal(){
		let self=this;
		self.setState({
			visible: true,
			countingBack:true,
		},()=>self.countback());


	};

	async countback(){
		let self=this;
		while(self.state.countBackFrom>0 && self.state.countingBack){
			await self.timer(1000);
			self.setState({countBackFrom:self.state.countBackFrom-1});
		}
		if(self.state.countBackFrom===0)
		{
			self.setState({visible:false,countBackFrom:30,countingBack:false},()=>this.handleLogout());
			return;
		}

	}

	timer(ms) {
		let self=this;
		//console.log("called timer",self.state.countBackFrom);
		return new Promise(res => setTimeout(res, ms));
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	rightExists(searchItem){
		let exists = false;
		const authorities=this.state.authorities;
		for (const authority of authorities)
		{
			if (authority.authority.includes(searchItem)) {
				exists = true;
			}
		}
		return exists;
	}

	render() {
		let siteContent = this.siteContent();
		if (this.state.isLoading)
			return <div>Loading...</div>;
		return (
			<div>
				{this.state.isAuthenticated
					?
					siteContent
					:
					(
						<Switch>
							<Route exact path="/login"
								   render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
							<Route path="/resetPassword"
								   render={(props) => <ResetPassword {...props} />}/>
							<Route path="/changePassword/:resetKey"
								   render={(props) => <ChangePassword {...props} />}/>
							<Route exact path="/homePage"
								   render={(props) => <Home {...props} />}/>
							<Redirect path="/" to="/login"/>
							<Route component={NotFound}></Route>
						</Switch>

					)
				}
				<Alert stack={{limit: 3}} html={true} offset={45}/>
			</div>
		);
	}

	siteContent() {
		return (
			<div>
				<IdleTimer
					ref={ref => { this.idleTimer = ref }}
					element={document}
					onActive={this.onActive}
					onIdle={this.onIdle}
					onAction={this.onAction}
					debounce={250}
					timeout={1000 * 60 * this.state.maxIdleTimeout} />
				<div className="wrapper">
					<Sidebar isAuthenticated={this.state.isAuthenticated}
							 currentUser={this.state.currentUser}
							 authorities={this.state.authorities}
							 history={this.props.history}
							 setOffsetWidth={this.setOffsetWidth}
							 onLogout={this.handleLogout}
					/>
					<div className="main-panel">
						<Header isAuthenticated={this.state.isAuthenticated}
								currentUser={this.state.currentUser}
								location={this.props.location.pathname}
								onLogout={this.handleLogout}
								offsetWidth={this.state.offsetWidth}/>
						<div className="content main-container" key={this.state.key}>
							<Switch currentUser={this.state.currentUser}>
								<Route exact path="/" render={(props) =>
									<Home isAuthenticated={this.state.isAuthenticated}  currentUser={this.state.currentUser} authorities={this.state.authorities} {...props}  />}/>

								<Route path="/homePage" render={(props) => <Home isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} authorities={this.state.authorities} handleLogout={this.handleLogout} {...props}/>}/>

								<Route path="/profile" render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} authorities={this.state.authorities} handleLogout={this.handleLogout} {...props}/>}/>

								<Route path="/quiz" render={(props) => <Quiz isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} authorities={this.state.authorities} handleLogout={this.handleLogout} {...props}/>}/>

								<Route path="/submitSuccessful" render={(props) => <Submitted isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} authorities={this.state.authorities} handleLogout={this.handleLogout} {...props}/>}/>




								<Redirect exact path="/login" to="/"/>
								<Route component={NotFound}/>
							</Switch>
						</div>
						<Footer/>
					</div>
				</div>
				<Modal
					title="Your Session Will Be Ended"
					visible={this.state.visible}
					okText="End Now"
					cancelText="Abort and Continue"
					onOk={this.handleLogout}
					onCancel={this.handleCancel}
					maskClosable={false}
				>
					<p><h4>You did not have any activity on this window for {this.state.maxIdleTimeout}  minutes.
						Your Session will be ended in {this.state.countBackFrom}  seconds !</h4></p>

				</Modal>
			</div>
		)
	}
}

export default withRouter(Master);
