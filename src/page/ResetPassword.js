import React, {Component} from "react";
import {Button, Form, Input, notification} from "antd";
import {Link} from "react-router-dom";
import './Signup.css';
import {EMAIL_MAX_LENGTH} from "../constants";
import {checkEmailAvailability, resetPassword} from "../util/APIUtils";

const FormItem = Form.Item;

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: {
                value: ''
            },
            emailAvailable: false,
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    validateEmail = (email) => {
        console.log("emailAvailable",this.state.emailAvailable);
        if(!email) {
            this.setState({emailAvailable:false});
            return {
                validateStatus: 'error',
                errorMsg: 'E-mail cannot be empty.'
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!EMAIL_REGEX.test(email)) {
            this.setState({emailAvailable:false});
            return {
                validateStatus: 'error',
                errorMsg: 'Not a valid e-mail address!'
            }
        }

        if(email.length > EMAIL_MAX_LENGTH) {
            this.setState({emailAvailable:false});
            return {
                validateStatus: 'error',
                errorMsg: `Email too long, enter ( ${EMAIL_MAX_LENGTH} chars at maximum!`
            }
        }

        this.setState({emailAvailable:true});
        return {
            validateStatus: null,
            errorMsg: null
        }
    }


    validateEmailAvailability() {
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);

        if(emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
            .then(response => {
                if(response.data.available) {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'error',
                            errorMsg: 'E-mail address already registered!'
                        }
                    });
                }
            }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                email: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
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

    isFormInvalid() {
        return !(this.state.email.validateStatus === 'success');
    }

    handleSubmit(event) {
        event.preventDefault();

        const passwordResetRequest = {
            email: this.state.email.value,
        };
        resetPassword(passwordResetRequest)
            .then(response => {
                notification.success({
                    message: 'QUIZ ENGINE',
                    description: "Follow the instructions sent to you by email to reset your password. ",
                    duration:30,
                })
            }).catch(error => {
            console.log(error);
            notification.error({
                message: 'QUIZ ENGINE',
                description: 'E-mail address is not registered to the QUIZ ENGINE system!'
            });
        });
    }


    render() {
        return (
            <div className="signup-container">
                <div className="signup-content">
                    <div className="page-title"><h4>Enter Your Email Address to Reset Your Password.</h4></div>
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem
                            label="E-mail"
                            hasFeedback
                            validateStatus={this.state.email.validateStatus}
                            help={this.state.email.errorMsg}>
                            <Input
                                size="large"
                                name="email"
                                type="email"
                                autoComplete="off"
                                value={this.state.email.value}
                                onChange={(event) => this.handleInputChange(event, this.validateEmail)} />
                        </FormItem>
                        <FormItem className="center-button">
                            <Button type="primary"
                                    htmlType="submit"
                                    size="large"
                                    className="resetpassword-form-button"
                                    disabled={!(this.state.emailAvailable)}
                                    >Reset Password</Button>
                        </FormItem>
                        <FormItem>
                            <Link className="resetpassword-link " to="/Login"><b>Return Home Page</b></Link>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default ResetPassword;