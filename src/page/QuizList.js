import React, {Component} from 'react';
import './Home.css';
import {Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import LoadingIndicator from "../common/LoadingIndicator";
import TextOverFlowTooltip from "../common/TextOverFlowTooltip";
import {request} from "../util/APIUtils";
import {formatDateTime, showAxiosError} from "../util/Helpers";
import {API_BASE_URL} from "../constants";
import QuizForm from "./QuizForm";


class QuizList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            quizList: [],
            addQuizModal: false,
            selectedQuiz: null,
        };
        this.fetchQuizList = this.fetchQuizList.bind(this);
        this.editQuiz = this.editQuiz.bind(this);
        this.cancelQuizCreation = this.cancelQuizCreation.bind(this);
        this.addNew = this.addNew.bind(this);
        this.deleteQuiz = this.deleteQuiz.bind(this);

    }

    componentDidMount() {
        this.setState({currentUser:this.props.currentUser},
            () => {
                if (this.props.isAuthenticated && this.props.currentUser.isAdmin) {
                    this.fetchQuizList();
                }
            }
        );
    }


    fetchQuizList(){
        let self = this;
        let params;
        self.setState({isLoading:true});

        let path ="/quiz";
        params = {
            url: API_BASE_URL + path,
            method: 'get'
        };

        request(params).then((response) => {
            console.log(response.data);
            self.setState({isLoading:false, quizList:response.data});

        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });
    }



    deleteQuiz(id){
        alert("DELETE FUNCTION IS NOT IMPLEMENTED FOR DATA SAFETY REASONS!");
    }

    editQuiz(id){

        let self = this;
        let params;
        self.setState({isLoading:true});

        let path ="/quiz/" + id;
        params = {
            url: API_BASE_URL + path,
            method: 'get'
        };

        request(params).then((response) => {
            self.setState({
                isLoading:false,
                selectedQuiz:response.data,
                addQuizModal:true });

        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });

    }

    cancelQuizCreation() {
        let self = this;
        self.setState({
            addQuizModal: false,
            selectedQuiz: null,
        })
    }

    addNew() {
        let self = this;
        self.setState({
            selectedQuiz: null,
            addQuizModal: true
        })
    }

    render() {

        if(!this.state.currentUser) {
            return <LoadingIndicator />;
        }


        return (
            <div className="home-container">
                <p><h4> QUIZ LIST </h4></p><br/>


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


                                    {this.state.currentUser && this.state.currentUser.isAdmin &&
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <button onClick={() => this.editQuiz(document.id)}
                                                style={{
                                                    margin: "2px",
                                                    width:"50px",
                                                    textAlign: "center",
                                                    color: 'white',
                                                    backgroundColor: 'rgb(75,117,166)',
                                                    borderRadius: "0.375em"
                                                }}>  Edit  </button>}

                                        <button onClick={() => this.deleteQuiz(document.id)}
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
                            {(this.state.quizList && this.state.quizList.length === 0) &&
                            <tr>
                                <td colSpan="8">No Quizzes Yet!</td>
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

                <div className="new-button-holder">
                    <button type="button"
                            onClick={() => this.addNew()}
                            data-toggle="tooltip" data-placement="bottom" title="Create New Quiz"
                            rel="tooltip" className="add-new"
                            style={{ background: "linear-gradient(#2b93cd, #0a66b7)",
                                height: "40px",
                                width:"150px",
                                float: "right",
                                marginRight: "20px",
                                color: "white",
                                borderRadius: "0.375em"}}>
                        Create New Quiz</button>
                </div>

                <Modal isOpen={this.state.addQuizModal} size="lg" >
                    <ModalHeader closeButton toggle={this.cancelQuizCreation}>{this.state.selectedQuiz && this.state.selectedQuiz.id ? 'Edit Quiz' : 'Create Quiz' }</ModalHeader>
                    <ModalBody>
                        <QuizForm cancelProcess={this.cancelQuizCreation}
                                      selectedQuiz={this.state.selectedQuiz}
                                      currentUser={this.props.currentUser} />
                    </ModalBody>
                </Modal>

            </div>

        );
    }


}



export default QuizList;