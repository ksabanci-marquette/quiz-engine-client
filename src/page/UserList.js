import React, {Component} from 'react';
import './Home.css';
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import LoadingIndicator from "../common/LoadingIndicator";
import {Col, Row} from "reactstrap";
import TextOverFlowTooltip from "../common/TextOverFlowTooltip";
import {request} from "../util/APIUtils";
import {formatDateTime, showAxiosError} from "../util/Helpers";
import {API_BASE_URL} from "../constants";
import UserForm from "./UserForm";
import {Alert} from "antd";


class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            userList: [],
            addUserModal: false,
            selectedUser: null,
        };
        this.fetchUserList = this.fetchUserList.bind(this);
        this.editUser = this.editUser.bind(this);
        this.cancelUserCreation = this.cancelUserCreation.bind(this);
        this.addNew = this.addNew.bind(this);
        this.deleteUser = this.deleteUser.bind(this);

    }

    componentDidMount() {
        this.setState({currentUser:this.props.currentUser});
        if(this.props.isAuthenticated && this.props.currentUser.isAdmin) {
            this.fetchUserList();
        }
    }


    fetchUserList(){
        let self = this;
        let params;
        self.setState({isLoading:true});

        let path ="/user/list";
        params = {
            url: API_BASE_URL + path,
            method: 'get'
        };

        request(params).then((response) => {
            self.setState({isLoading:false, userList:response.data});

        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });
    }

    deleteUser(username){
         alert("DELETE FUNCTION IS NOT IMPLEMENTED FOR DATA SAFETY REASONS!");
    }

    editUser(username){

        let self = this;
        let params;
        self.setState({isLoading:true});

        let path ="/user/" + username;
        params = {
            url: API_BASE_URL + path,
            method: 'get'
        };

        request(params).then((response) => {
            self.setState({
                isLoading:false,
                selectedUser:response.data,
                addUserModal:true });

        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });

    }

    cancelUserCreation() {
        let self = this;
        self.setState({
            addUserModal: false,
            selectedUser: null,
        })
    }

    addNew() {
        let self = this;
        self.setState({
            selectedUser: null,
            addUserModal: true
        })
    }

    render() {

        if(!this.state.currentUser) {
            return <LoadingIndicator />;
        }


        return (
            <div className="home-container">
                <p><h4>USER LIST (Non-Admin) </h4></p><br/>


                <Row>
                    <Col sm="12" style={{
                        paddingTop: "0px",
                        paddingRight: "15px",
                        paddingLeft: "15px",
                        maxHeight: '500px',
                        overflow: "auto"
                    }}>
                        <table className="" style={{textAlign: 'center', paddingBottom: "5px"}}>
                            <thead>
                            <tr style={{backgroundColor: '#ebedf0'}}>
                                <th width="5%">#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>User Name</th>
                                <th>Creation Date </th>
                                <th>Email Address</th>
                                <th>Last Password Reset</th>
                                <th width="25%">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.userList && Array.isArray(this.state.userList) && this.state.userList.map((document, index) =>
                                <tr key={index + "_" + document.name + "_"}>
                                    <td>{index + 1}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.name || "-"}
                                                             maxLength={30}/>}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.lastname || "-"}
                                                             maxLength={30}/>}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.username || "-"}
                                                             maxLength={30}/>}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.creationDate && formatDateTime(document.creationDate) || "-"}
                                                             maxLength={30}/>}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={ document.emailAddress && document.emailAddress || "0"}
                                                             maxLength={30}/>}</td>

                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.resetDate && formatDateTime(document.resetDate) || "-"}
                                                             maxLength={30}/>}</td>


                                    {this.state.currentUser && this.state.currentUser.isAdmin &&
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <button onClick={() => this.editUser(document.username)}
                                                style={{
                                                    margin: "2px",
                                                    width:"50px",
                                                    textAlign: "center",
                                                    color: 'white',
                                                    backgroundColor: 'rgb(81,166,75)',
                                                    borderRadius: "0.375em"
                                                }}>  Edit  </button>}

                                        <button onClick={() => this.deleteUser(document.username)}
                                                style={{
                                                    margin: "2px",
                                                    width:"50px",
                                                    textAlign: "center",
                                                    color: 'white',
                                                    backgroundColor: 'rgb(232,20,55)',
                                                    borderRadius: "0.375em"
                                                }}>Delete</button>
                                    </td>
                                    }
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                    }</td>

                                    <td style={{margin: "0px"}}></td>
                                </tr>
                            )}
                            {(this.state.userList && this.state.userList.length === 0) &&
                            <tr>
                                <td colSpan="8">No Users Yet!</td>
                            </tr>
                            }

                            </tbody>
                        </table>
                    </Col>
                    <Col sm="12">
                        <p style={{float: "right"}}>
                            Total: {this.state.userList ? this.state.userList.length : 0}</p>
                    </Col>
                </Row>

                <br/>

                <div className="new-button-holder">
                    <button type="button"
                            onClick={() => this.addNew()}
                            data-toggle="tooltip" data-placement="bottom" title="Create New User"
                            rel="tooltip" className="add-new"
                            style={{ background: "linear-gradient(#2b93cd, #0a66b7)",
                                height: "40px",
                                width:"150px",
                                float: "right",
                                marginRight: "20px",
                                color: "white",
                                borderRadius: "0.375em"}}>
                        Create New User</button>
                </div>

                <Modal isOpen={this.state.addUserModal} size="lg" className="ust">
                    <ModalHeader toggle={this.cancelUserCreation}>{this.state.selectedUser && this.state.selectedUser.id ? 'Edit User' : 'Create User' }</ModalHeader>
                    <ModalBody>
                        <UserForm cancelProcess={this.cancelUserCreation}
                                 selectedUser={this.state.selectedUser}
                                 currentUser={this.props.currentUser} />
                    </ModalBody>
                </Modal>

            </div>

        );
    }


}



export default UserList;