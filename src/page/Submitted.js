import React, {Component} from 'react';
import './Home.css';
import {Radio} from 'antd';
import {deepCopyObject, formatDateTime, showAxiosError} from "../util/Helpers";
import Alert from "react-s-alert";
import {API_BASE_URL} from "../constants";
import {request} from "../util/APIUtils";
import {Link} from "react-router-dom";

class Submitted extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

        };



    }

    componentDidMount() {
    }

    render() {


        return (
            <div className="card-body">
                <p><h4>Your Quiz Submitted Successfully</h4></p>
                <Link className="resetpassword-link " to="/login"><b>You can return to Home Page by clicking here</b></Link>
            </div>
        );
    }


}



export default Submitted;