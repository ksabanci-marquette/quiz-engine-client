import React, {Component} from 'react';
import {login} from '../util/APIUtils';
import './Login.css';
import {Link} from 'react-router-dom';
import {ACCESS_TOKEN} from '../constants';

import {Form, Input, Button, Icon, notification,Modal} from 'antd';
import {Col, Label, Row} from "reactstrap";

const FormItem = Form.Item;

class Login extends Component {
	render() {
		const AntWrappedLoginForm = Form.create()(LoginForm);
		return (
			<Row className='ogo-login-background' style={{  backgroundImage: 'linear-gradient(white, rgb(142 165 236))'}}>
				<Col xs='12' className="ogo-login-container">
					<Col xs='12' style={{padding: '0 0 15px 0', textAlign: 'center'}}>
						<img src={process.env.REACT_APP_CONTEXT_NAME + "/image/quizengine.png"} alt='logo' className='ogo-login-logo'/>
					</Col>
					<AntWrappedLoginForm onLogin={this.props.onLogin}/>
				</Col>
			</Row>
		);
	}
}

class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show:false,
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.showModal=this.showModal.bind(this);
		this.handleOk=this.handleOk.bind(this);

	}

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	handleOk = e => {
		this.setState({
			visible: false,
		});
	};



	handleSubmit(event) {
		event.preventDefault();
		this.props.form.validateFields((err, values) => {
			console.log("log: ", values);
			if (!err) {
				const loginRequest = Object.assign({}, values);
				login(loginRequest)
					.then(response => {
						localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);
						console.log("caling this.props.onLogin();");
						this.props.onLogin();
					}).catch(error => {
					console.log("error==>",error)
					// if (error.response.status === 401) {
					notification.error({
						message: 'QUIZ ENGINE APPLICATION',
						description: 'Username / Password mismatch. Please try again!'
					});
				});
			}
		});
	}

	render() {
		const {getFieldDecorator} = this.props.form;
		return (
			<Form onSubmit={this.handleSubmit} className="login-form">
				<FormItem>
					{getFieldDecorator('usernameOrEmail', {
						rules: [{required: true, message: 'Enter username!'}],
					})(
						<Input
							prefix={<Icon type="user"/>}
							size="large"
							name="usernameOrEmail"
							placeholder="Username"/>
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('password', {
						rules: [{required: true, message: 'Please enter password!'}],
					})(
						<Input
							prefix={<Icon type="lock"/>}
							size="large"
							name="password"
							type="password"
							placeholder="Password"/>
					)}
				</FormItem>
				<FormItem>
					<Button type="primary" htmlType="submit" size="large" className="login-form-button">Login</Button>
				</FormItem>
				{/*<div className="row col-sm-12 center" >*/}
				{/*	<Label style={{color:"white", fontWeight:"bold",fontSize:"12px"}} className="col-sm-12">...</Label>*/}
				{/*</div>*/}

				<div className="row col-sm-12 center" >
					{/*
					<a className="col whitelink" onClick={this.showModal}>Yeni Hesap Oluştur</a>
*/}
					<Link className="col-sm-12 white" to="/resetPassword">Forgot Password</Link>

				</div>

			</Form>
		);
	}
}


export default Login;