import React, {Component} from 'react';
import './Home.css';
import LoadingIndicator from "../common/LoadingIndicator";
import {Col, Label, Row, UncontrolledTooltip} from "reactstrap";
import TextOverFlowTooltip from "../common/TextOverFlowTooltip";
import {getUserProfile, request} from "../util/APIUtils";
import {deepCopyObject, formatDateTime, showAxiosError, trimObject} from "../util/Helpers";
import {API_BASE_URL} from "../constants";
import Alert from "react-s-alert";


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            currentUser: null,
            quizList:[]
        };
        this.RightExists=this.RightExists.bind(this);
        this.fetchQuizList = this.fetchQuizList.bind(this);
    }

    componentDidMount() {
        this.setState({currentUser:this.props.currentUser});
        this.fetchQuizList();
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

    fetchQuizList(){
        let self = this;
        let params;
        self.setState({isLoading:true});

        //let path = this.state.currentUser && this.state.currentUser.isAdmin ? "/quiz" :"/quiz/available";
        let path ="/quiz/available";
        params = {
            url: API_BASE_URL + path,
            method: 'get'
        };

        request(params).then((response) => {
            self.setState({isLoading:false, quizList:response.data});

        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });


    }

    render() {

        if(!this.state.currentUser) {
            return <LoadingIndicator />;
        }

        console.log("this.state.quizList",this.state.quizList);

        return (
            <div className="home-container">
                <p><h4>WELCOME TO QUIZ ENGINE - HERE ARE AVAILABLE QUIZZES FOR YOU</h4></p>

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
                                <th>Quiz Name</th>
                                <th>Creation Date </th>
                                <th>Max Attempts</th>
                                <th>Valid Thru</th>
                                <th width="25%">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.quizList && Array.isArray(this.state.quizList) && this.state.quizList.map((document, index) =>
                                <tr key={index + "_" + document.quizName + "_"}>
                                    <td>{index + 1}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.quizName || "-"}
                                                             maxLength={30}/>}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.creationDate && formatDateTime(document.creationDate) || "-"}
                                                             maxLength={30}/>}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={ document.maxAttempts && document.maxAttempts || "0"}
                                                             maxLength={30}/>}</td>

                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.validThru && formatDateTime(document.validThru) || "-"}
                                                             maxLength={30}/>}</td>

                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        }</td>

                                    <td style={{margin: "0px"}}></td>
                                </tr>
                            )}
                            {(this.state.quizList && this.state.quizList.length === 0) &&
                            <tr>
                                <td colSpan="8">No Quizzes For You Yet!</td>
                            </tr>
                            }

                            </tbody>
                        </table>
                    </Col>
                    <Col sm="12">
                        <p style={{float: "right"}}>
                            Total: {this.state.quizList ? this.state.quizList.length : 0}</p>
                    </Col>
                </Row>

            </div>

        );
    }


}



export default Home;