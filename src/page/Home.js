import React, {Component} from 'react';
import './Home.css';
import LoadingIndicator from "../common/LoadingIndicator";
import {Col, Row} from "reactstrap";
import TextOverFlowTooltip from "../common/TextOverFlowTooltip";
import {request} from "../util/APIUtils";
import {formatDateTime, showAxiosError} from "../util/Helpers";
import {API_BASE_URL} from "../constants";


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            currentUser: null,
            quizList:[],
            latestQuizResultsForUser:[]
        };
        this.fetchQuizList = this.fetchQuizList.bind(this);
        this.goToQuizStats = this.goToQuizStats.bind(this);
        this.goToQuiz = this.goToQuiz.bind(this);
        this.fetchLatest = this.fetchLatest.bind(this);
    }

    componentDidMount() {
        this.setState({currentUser:this.props.currentUser});
        if(this.props.isAuthenticated) {
            this.fetchQuizList();
            this.fetchLatest();

        }
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

    fetchLatest(){
        //""
        let self = this;
        let params;
        self.setState({isLoading:true});
        let path ="/quiz/latest";
        params = {
            url: API_BASE_URL + path,
            method: 'get'
        };

        request(params).then((response) => {
            self.setState({isLoading:false, latestQuizResultsForUser:response.data});
            console.log("response.data",response.data);

        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });
    }

    goToQuiz(itemId){
        let self = this;
        let params;
        self.setState({isLoading:true});
        let selectedQuiz = null;
        let path ="/quiz/"+ itemId;
        params = {
            url: API_BASE_URL + path,
            method: 'get'
        };

        request(params).then((response) => {
            console.log(response.data);
            self.setState({isLoading:false},
                ()=> {
                    this.props.history.push( {pathname: '/quiz', selectedQuiz:response.data, currentUser: this.state.currentUser}) });

        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });

    }

    goToQuizStats(itemId){



    }

    render() {

        if(!this.state.currentUser) {
            return <LoadingIndicator />;
        }

        //console.log("this.state.quizList",this.state.quizList);

        return (
            <div className="home-container">
                <p><h4>WELCOME TO QUIZ ENGINE </h4></p><br/>
                {this.state.currentUser && this.state.currentUser.isAdmin
                    ?
                    <p><h4>HERE IS A LIST OF ALL VALID QUIZZES</h4></p>
                    :
                    <p><h4>HERE ARE AVAILABLE QUIZZES FOR YOU</h4></p>
                }

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
                                <th>Valid Until</th>
                                <th>Duration(secs)</th>
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
                                        <TextOverFlowTooltip text={ document.duration && document.duration || "0"}
                                                             maxLength={30}/>}</td>


                                    {this.state.currentUser && !this.state.currentUser.isAdmin
                                        ?
                                        <td style={{margin: "0px", textAlign: "center"}}>{
                                            <button onClick={() => this.goToQuiz(document.id)}
                                                    style={{
                                                        margin: "0px",
                                                        textAlign: "center",
                                                        color: 'white',
                                                        backgroundColor: 'rgb(118 138 239)'
                                                    }}>
                                                Start Quiz</button>}</td>

                                        :
                                        <td style={{margin: "0px", textAlign: "center"}}>{
                                            <button onClick={() => this.goToQuizStats(document.id)}
                                                    style={{
                                                        margin: "0px",
                                                        textAlign: "center",
                                                        color: 'white',
                                                        backgroundColor: 'rgb(118 138 239)'
                                                    }}>
                                                Show Stats</button>}</td>
                                    }

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

                <br/>

                {this.state.currentUser && this.state.currentUser.isAdmin
                    ?
                    <p><h4>STUDENT PERFORMANCES (GENERAL)</h4></p>
                    :
                    <p><h4>YOUR LATEST PERFORMANCE (LATEST QUIZZES)</h4></p>
                }

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
                                <th>User</th>
                                <th>Submission Date </th>
                                <th>Grade</th>
                                <th>Attempt</th>
                                <th>Max Attempts</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.latestQuizResultsForUser && Array.isArray(this.state.latestQuizResultsForUser) && this.state.latestQuizResultsForUser.map((document, index) =>
                                <tr key={index + "_" + document.quizName + "_"}>
                                    <td>{index + 1}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.quizName || "-"}
                                                             maxLength={30}/>}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.userName || "-"}
                                                             maxLength={30}/>}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.creationDate && formatDateTime(document.creationDate) || "-"}
                                                             maxLength={30}/>}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.grade}
                                                             maxLength={30}/>}</td>

                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={ document.lastAttempt && document.lastAttempt || "-"}
                                                             maxLength={30}/>}</td>

                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={ document.maxAttempts && document.maxAttempts || "-"}
                                                             maxLength={30}/>}</td>


                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                    }</td>

                                    <td style={{margin: "0px"}}></td>
                                </tr>
                            )}
                            {(this.state.latestQuizResultsForUser && this.state.latestQuizResultsForUser.length === 0) &&
                            <tr>
                                <td colSpan="8">No Quiz Results For You Yet!</td>
                            </tr>
                            }

                            </tbody>
                        </table>
                    </Col>
                    <Col sm="12">
                        <p style={{float: "right"}}>
                            Total: {this.state.latestQuizResultsForUser ? this.state.latestQuizResultsForUser.length : 0}</p>
                    </Col>
                </Row>

            </div>

        );
    }


}



export default Home;