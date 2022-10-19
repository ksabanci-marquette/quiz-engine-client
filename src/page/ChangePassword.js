import React, {Component} from 'react';
import {changePassword} from '../util/APIUtils';
import './Signup.css';
import {PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH} from '../constants';
import {Button, Form, Input, notification} from 'antd';
import {Label} from "reactstrap";

const FormItem = Form.Item;

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: {
                value: ''
            },

            rePassword: {
                value: ''
            },

            match: {
                params: this.props.match
            } ,
            passwordsMatch: false,

    }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const changePasswordRequest = {
            key:this.props.match.params.resetKey,
            password: this.state.password.value
        };
        console.log(changePasswordRequest);
        changePassword(changePasswordRequest)
        .then(response => {
            this.props.history.push("/login");
            notification.success({
                message: 'QUIZ ENGINE',
                description: "Password Change Successful!",
                duration:30,
            })
        }).catch(error => {
            console.log(error);
            notification.error({
                message: 'QUIZ ENGINE',
                description: 'Something Went Wrong!'
            });
        });
    }

    render() {

        ///console.log("params.resetKey",this.state.params.resetKey);
        return (
            <div className="signup-container">
                <h3 className="page-title">QUIZ ENGINE CHANGE PASSWORD PAGE</h3>
                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">

                        <FormItem 
                            label="New Password"
                            validateStatus={this.state.password.validateStatus}
                            help={this.state.password.errorMsg}>
                            <Input 
                                size="large"
                                name="password" 
                                type="password"
                                autoComplete="off"
                                placeholder="Length must be between 6-20."
                                value={this.state.password.value} 
                                onChange={(event) => this.handleInputChange(event, this.validatePassword)} />    
                        </FormItem>
                        <FormItem
                            label="New Password (Repeat)"
                            validateStatus={this.state.rePassword.validateStatus}
                            help={this.state.rePassword.errorMsg}>
                            <Input
                                size="large"
                                name="rePassword"
                                type="password"
                                autoComplete="off"
                                placeholder="Length must be between 6-20."
                                value={this.state.rePassword.value}
                                onChange={(event) => this.handleInputChange(event, this.validatePassword)} />
                        </FormItem>
                        <Label className="errorMessage-red">{(this.state.password.value===this.state.rePassword.value)?"":"*Password mismatch!"}</Label>
                        <FormItem>
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="signup-form-button"
                                disabled={!((this.state.password.value===this.state.rePassword.value)&&(this.state.password.errorMsg===null)&&(this.state.rePassword.errorMsg===null))}>Change Password</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }


    validatePassword = (password) => {
        if(password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Password entered is too short. Min-length must be ${PASSWORD_MIN_LENGTH} !`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Password entered is too long. Max-length must be ${PASSWORD_MAX_LENGTH} !`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };            
        }
    }
}

export default ChangePassword;