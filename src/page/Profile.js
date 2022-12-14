import React, {Component} from 'react';
import {getUserProfile, request} from '../util/APIUtils';
import {Avatar, Tabs} from 'antd';
import {deepCopyObject, formatDateTime, showAxiosError, trimObject} from '../util/Helpers';
import LoadingIndicator from '../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import Alert from "react-s-alert";
import {validateComponent, validateField} from "../common/validation";
import {API_BASE_URL} from "../constants";
import PersonalInfo from "./PersonalInfo";
import ChangePasswordForUser from "./ChangePasswordForUser";

const TabPane = Tabs.TabPane;

class Profile extends Component {
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
            <div className="profile">
                {
                    this.state.currentUser ? (
                        <div className="user-profile">
                            <div className="user-details">
                                <div className="user-avatar">
                                    <Avatar className="user-avatar-circle" style={{ backgroundColor: 'yellowgreen'}}>
                                        {this.state.currentUser.name && this.state.currentUser.name.toUpperCase()}
                                    </Avatar>
                                </div>
                                <div className="user-summary">
                                    <div className="full-name">{this.state.currentUser.name && this.state.currentUser.name}</div>
                                    <div className="username">@{this.state.currentUser.username && this.state.currentUser.username}</div>
                                    <div className="user-joined">
                                        Joined {this.state.currentUser.creationDate && formatDateTime(this.state.currentUser.creationDate)}
                                    </div>
                                </div>
                            </div>
                            <div className="user-poll-details">
                                <Tabs defaultActiveKey="1"
                                      animated={false}
                                      tabBarStyle={tabBarStyle}
                                      size="large"
                                      className="profile-tabs">
                                    <TabPane tab="Personal Info" key="1">

                                        <PersonalInfo currentUser={this.state.currentUser}/>

                                    </TabPane>
                                    <TabPane tab="Password"  key="2">

                                        <ChangePasswordForUser currentUser={this.state.currentUser}/>

                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    ): null
                }
            </div>
        );
    }
}

export default Profile;