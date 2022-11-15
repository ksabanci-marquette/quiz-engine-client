import React, {Component} from 'react';
import './Home.css';
import {Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import LoadingIndicator from "../common/LoadingIndicator";
import TextOverFlowTooltip from "../common/TextOverFlowTooltip";
import {request} from "../util/APIUtils";
import {formatDateTime, showAxiosError} from "../util/Helpers";
import {API_BASE_URL} from "../constants";
import QuestionForm from "./QuestionForm";


class QuestionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            questionList: [],
            addQuestionModal: false,
            selectedUser: null,
        };
        this.fetchQuestionList = this.fetchQuestionList.bind(this);
        this.editQuestion = this.editQuestion.bind(this);
        this.cancelQuestionCreation = this.cancelQuestionCreation.bind(this);
        this.addNew = this.addNew.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);

    }

    componentDidMount() {
        this.setState({currentUser:this.props.currentUser});
        if(this.props.isAuthenticated && this.props.currentUser.isAdmin) {
            this.fetchQuestionList();
        }
    }


    fetchQuestionList(){
        let self = this;
        let params;
        self.setState({isLoading:true});

        let path ="/question/list";
        params = {
            url: API_BASE_URL + path,
            method: 'get'
        };

        request(params).then((response) => {
            console.log(response.data);
            self.setState({isLoading:false, questionList:response.data});

        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });
    }

    deleteQuestion(id){
        alert("DELETE FUNCTION IS NOT IMPLEMENTED FOR DATA SAFETY REASONS!");
    }

    editQuestion(id){

        let self = this;
        let params;
        self.setState({isLoading:true});

        let path ="/question/" + id;
        params = {
            url: API_BASE_URL + path,
            method: 'get'
        };

        request(params).then((response) => {
            self.setState({
                isLoading:false,
                selectedQuestion:response.data,
                addQuestionModal:true });

        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });

    }

    cancelQuestionCreation() {
        let self = this;
        self.setState({
            addQuestionModal: false,
            selectedQuestion: null,
        })
    }

    addNew() {
        let self = this;
        self.setState({
            selectedQuestion: null,
            addQuestionModal: true
        })
    }

    render() {

        if(!this.state.currentUser) {
            return <LoadingIndicator />;
        }


        return (
            <div className="home-container">
                <p><h4> QUESTION LIST </h4></p><br/>


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
                                <th>Title</th>
                                <th>Hardness Level</th>
                                <th>Number of Choices</th>
                                <th>Creation Date </th>
                                <th>Update Date </th>
                                <th width="25%">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.questionList && Array.isArray(this.state.questionList) && this.state.questionList.map((document, index) =>
                                <tr key={index + "_" + document.name + "_"}>
                                    <td>{index + 1}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.title || "-"}
                                                             maxLength={30}/>}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.hardnessLevel || "-"}
                                                             maxLength={30}/>}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.questionAnswers && document.questionAnswers.length || "-"}
                                                             maxLength={30}/>}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.creationDate && formatDateTime(document.creationDate) || "-"}
                                                             maxLength={30}/>}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.updateDate && formatDateTime(document.updateDate) || "-"}
                                                             maxLength={30}/>}</td>


                                    {this.state.currentUser && this.state.currentUser.isAdmin &&
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <button onClick={() => this.editQuestion(document.id)}
                                                style={{
                                                    margin: "2px",
                                                    width:"50px",
                                                    textAlign: "center",
                                                    color: 'white',
                                                    backgroundColor: 'rgb(81,166,75)',
                                                    borderRadius: "0.375em"
                                                }}>  Edit  </button>}

                                        <button onClick={() => this.deleteQuestion(document.id)}
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
                            {(this.state.questionList && this.state.questionList.length === 0) &&
                            <tr>
                                <td colSpan="8">No Questions Yet!</td>
                            </tr>
                            }

                            </tbody>
                        </table>
                    </Col>
                    <Col sm="12">
                        <p style={{float: "right"}}>
                            Total: {this.state.questionList ? this.state.questionList.length : 0}</p>
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
                        Create New Question</button>
                </div>

                <Modal isOpen={this.state.addQuestionModal} size="lg" >
                    <ModalHeader closeButton toggle={this.cancelQuestionCreation}>{this.state.selectedQuestion && this.state.selectedQuestion.id ? 'Edit Question' : 'Create Question' }</ModalHeader>
                    <ModalBody>
                        <QuestionForm cancelProcess={this.cancelQuestionCreation}
                                      selectedQuestion={this.state.selectedQuestion}
                                      currentUser={this.props.currentUser} />
                    </ModalBody>
                </Modal>

            </div>

        );
    }


}



export default QuestionList;