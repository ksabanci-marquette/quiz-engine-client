import React, {Component} from 'react';
import {getUserProfile, request} from '../util/APIUtils';
import {Tabs} from 'antd';
import {deepCopyObject, showAxiosError, trimObject} from '../util/Helpers';
import LoadingIndicator from '../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import Alert from "react-s-alert";
import emailMask from "text-mask-addons/dist/emailMask";
import MaskedInput from "react-text-mask";
import {validateComponent, validateField} from "../common/validation";
import {UncontrolledTooltip} from "reactstrap";
import {API_BASE_URL} from "../constants";

const TabPane = Tabs.TabPane;

class PersonalInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: {},
            currentUser: null,
            isLoading: false,
            fieldsDisabled:false,
            currentPassword: null,
            password: null,
            rePassword: null,
            passwordsMatch: false,
        };

        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.validateClass = this.validateClass.bind(this);
        this.validateComponent = this.validateComponent.bind(this);
        this.validateField = this.validateField.bind(this);
        this.validateMessage = this.validateMessage.bind(this);
        this.onChange = this.onChange.bind(this);
        this.save = this.save.bind(this);
        this.onChangeFields = this.onChangeFields.bind(this);
        this.updatePassword = this.updatePassword.bind(this);

    }


    componentDidMount() {
        const currentUser = this.props.currentUser;
        this.loadUserProfile(currentUser.username);
    }

    validateField(e) {
        let id = e.target.id;
        let rule = e.target.dataset.vdata;
        let boundary = e.target.dataset.vlength;
        let value = e.target.value;
        let result = validateField(rule, boundary, value);
        let error = this.state.error;
        error = Object.assign(error, {[id]: result});
        this.setState({error});
    }

    validateClass(id) {
        let error = this.state.error;
        return (error[id] === undefined ? "" : (error[id].valid ? " has-success" : " has-danger"));
    }

    validateMessage(id) {
        let error = this.state.error;
        return (error[id] === undefined ? '' : (error[id].message));
    }

    validateComponent() {
        let result = validateComponent(this);
        this.setState({
            error: result.error
        });
        return result
    }

    loadUserProfile(username) {
        this.setState({isLoading: true});
        getUserProfile(username)
            .then(response => {
                this.setState({
                    currentUser: response.data,
                    isLoading: false
                });
            }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    onChange(e) {
        this.setState({
            currentUser: {
                ...this.state.currentUser,
                [e.target.name]: e.target.value.toString()
            }
        })
    }

    onChangeFields(e) {
        this.setState({
            [e.target.name]: e.target.value.toString()
        })
    }


    save() {
        let self = this;
        let params;
        let data;
        let message;
        let validity = this.validateComponent();
        console.log("currentUser: ",this.state.currentUser && this.state.currentUser);
        if (this.state.currentUser && validity.valid){
            self.setState({isLoading:true});
            let currentUser = deepCopyObject(this.state.currentUser);
            currentUser=trimObject(currentUser);
            data = currentUser;
            message = 'Update Successful.'
            params = {
                url: API_BASE_URL + "/user/update",
                data: data,
                method: 'post'
            };
            request(params).then(() => {
                Alert.success(
                    message, {
                        position: 'top-right',
                        effect: 'stackslide',
                        timeout: 5000
                    });
                self.setState({isLoading:false});

            }).catch(function (error) {
                self.setState({isLoading:false});
                showAxiosError(error);
            });
        }
        else{
            Alert.error('There are missing fields!', {
                position: 'top-right',
                effect: 'stackslide',
                timeout: 5000
            });
        }
    }


    updatePassword() {
        let self = this;
        let params;
        let data;
        let message;
        let validity = this.validateComponent();
        if( this.state.password !==  this.state.rePassword){
            Alert.error('Passwords do not match!', {
                position: 'top-right',
                effect: 'stackslide',
                timeout: 5000
            });
            return;
        }

        if ( validity.valid && this.state.currentPassword &&  this.state.password){
            self.setState({isLoading:true});
            data = {'currentPassword': this.state.currentPassword ,  'password': this.state.password};
            message = 'Update Successful.'
            params = {
                url: API_BASE_URL + "/auth/change-password-for-me",
                data: data,
                method: 'post'
            };
            request(params).then(() => {
                Alert.success(
                    message, {
                        position: 'top-right',
                        effect: 'stackslide',
                        timeout: 5000
                    });
                self.setState({isLoading:false, currentPassword:null, password:null, rePassword:null});

            }).catch(function (error) {
                self.setState({isLoading:false});
                showAxiosError(error);
            });
        }
        else{
            Alert.error('There are missing fields!', {
                position: 'top-right',
                effect: 'stackslide',
                timeout: 5000
            });
        }
    }



    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        const tabBarStyle = {
            textAlign: 'center'
        };

        return (
            <div className="personalInfo">
                {
                    this.state.currentUser ? (

                    <div className="card-body">
                        <div className="FormRenk col-sm-12">
                            <div className='col-sm-9 row'>
                                <div className="col-sm-3">
                                    <label>Name : </label>
                                </div>
                                <div className="col-sm-9">
                                    <div className={"form-group" + this.validateClass('tName')}>
                                        <input className="form-control"
                                               type="text"
                                               name="name"
                                               id="tName"
                                               data-vlength="5,20"
                                               onBlur={this.validateField}
                                               ref="tName"
                                               value={this.state.currentUser.name && this.state.currentUser.name}
                                               onChange={(e) => this.onChange(e)}
                                               disabled={this.state.fieldsDisabled}
                                        />
                                        {this.validateMessage('tName') !== "" &&
                                        <UncontrolledTooltip placement="right" target="tName" delay={0}>
                                            {this.validateMessage("tName")}
                                        </UncontrolledTooltip>}
                                    </div>
                                </div>
                            </div>

                            <div className='col-sm-9 row'>
                                <div className="col-sm-3">
                                    <label>Lastname : </label>
                                </div>
                                <div className="col-sm-9">
                                    <div className={"form-group" + this.validateClass('tSurname')}>
                                        <input className="form-control"
                                               type="text"
                                               name="surname"
                                               id="tSurname"
                                               data-vlength="5,20"
                                               onBlur={this.validateField}
                                               ref="tSurname"
                                               value={this.state.currentUser.surname && this.state.currentUser.surname}
                                               onChange={(e) => this.onChange(e)}
                                               disabled={this.state.fieldsDisabled}
                                        />
                                        {this.validateMessage('tSurname') !== "" &&
                                        <UncontrolledTooltip placement="right" target="tSurname" delay={0}>
                                            {this.validateMessage("tSurname")}
                                        </UncontrolledTooltip>}
                                    </div>
                                </div>
                            </div>


                            <div className='col-sm-9 row'>
                                <div className="col-sm-3">
                                    <label>Email : </label>
                                </div>
                                <div className="col-sm-9">
                                    <div className={"form-group" + this.validateClass('tEmail')}>
                                        <MaskedInput className="form-control"
                                                     type="text"
                                                     mask={emailMask}
                                                     name="email"
                                                     inputProps={{vdata: "email", vlength: '1,255'}}
                                                     id="tEmail"
                                                     onBlur={() => this.validateField({
                                                         target: {
                                                             id: "tEmail",
                                                             dataset: {vdata: "email", vlength: '1,255'},
                                                             value: this.state.currentUser.email
                                                         }
                                                     })}
                                                     placeholder="_________@______.___"
                                                     ref="tEmail"
                                                     value={this.state.currentUser.email}
                                                     onChange={(e) => this.onChange(e)}
                                                     disabled={this.state.fieldsDisabled}
                                        />
                                        {this.validateMessage('tEmail') !== "" &&
                                        <UncontrolledTooltip placement="right" target="tEmail" delay={0}>
                                            {this.validateMessage("tEmail")}
                                        </UncontrolledTooltip>}
                                    </div>
                                </div>
                                <div className='col-sm-12'>
                                    <button type="button" data-toggle="tooltip" data-placement="bottom"
                                            style={{
                                                background: 'linear-gradient(rgba(159, 208, 55, 0.6), #9fd037)',
                                                float: 'right', padding: '10px 54px 10px 23px'
                                            }}
                                            rel="tooltip" className="TekBtn kaydet"
                                            disabled={this.state.isLoading}
                                            onClick={() => this.save()}>{this.state.mode === 'create' ? 'Save' : 'Save'}
                                    </button>
                                </div>
                            </div>



                        </div>
                    </div>
                    ): null
                }
            </div>
        );
    }
}

export default PersonalInfo;