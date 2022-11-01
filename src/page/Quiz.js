import React, {Component} from 'react';
import './Home.css';
import {Radio} from 'antd';
import {deepCopyObject, formatDateTime, showAxiosError} from "../util/Helpers";
import Alert from "react-s-alert";
import {API_BASE_URL} from "../constants";
import {request} from "../util/APIUtils";

class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            selectedQuiz: null,
            countingBack:true,
            currentUser:null,
            userAnswers:[],
        };

        this.countback = this.countback.bind(this);
        this.timer = this.timer.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.initializeUserAnswers = this.initializeUserAnswers.bind(this);

    }

    componentDidMount() {
        this.setState({
            currentUser : this.props.location.currentUser,
            selectedQuiz: this.props.location.selectedQuiz,
            countBackFrom: this.props.location.selectedQuiz && this.props.location.selectedQuiz.duration ? this.props.location.selectedQuiz.duration : 1000,
            userAnswers:this.initializeUserAnswers()
        }, () => {
            this.countback(); });

    }

    initializeUserAnswers(){
        let length = (this.props.location.selectedQuiz&& this.props.location.selectedQuiz.quizQuestionList) ? this.props.location.selectedQuiz.quizQuestionList.length :0;
        let userAnswers=[];
        for(let i=0;i<length;i++)
        {
            userAnswers[i] = null;
        }
        console.log("userAnswers initialized: ",userAnswers);
        return userAnswers;
    }



    async countback(){
        let self=this;
        while(self.state.countBackFrom>0 && self.state.countingBack){
            await self.timer(1000);
            self.setState({countBackFrom:self.state.countBackFrom-1});
        }
        if(self.state.countBackFrom===0)
        {
            self.setState({countingBack:false},()=>this.handleSubmit("timeout"));
        }
    }

    handleSubmit(submittedBy){
        let self = this;
        let params;
        let data;
        let message;
        if (!this.state.userAnswers || !this.state.selectedQuiz || !this.state.currentUser)
            return;

        if( submittedBy !== "timeout" && this.state.userAnswers.filter(item => item == null).length>0){
            Alert.error('You do  not seem to have answered all questions, please answer all!', {
                position: 'top-right',
                effect: 'stackslide',
                timeout: 5000
            });
            return;
        }

        self.setState({isLoading:true});
        data = {'userAnswers': this.state.userAnswers ,
            'quizId':this.state.selectedQuiz.id,
            'quizQuestionList':this.state.selectedQuiz.quizQuestionList };
        console.log("data",data);
        message = (submittedBy === "timeout") ? 'Quiz Submitted By Timeout.' :  'Quiz Submitted Successfully.'
        params = {
            url: API_BASE_URL + "/quiz/submit",
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
            self.setState({isLoading:false, userAnswers:null},
                ()=> this.props.history.push('/submitSuccessful'));

        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });

    }



    onValueChange(index1,index2){
        let self = this;
        if( index1 !== null && index2 !== null){
            let userAnswers = deepCopyObject(this.state.userAnswers);
            console.log("userAnswers",userAnswers);
            userAnswers[index1] = index2;
            console.log("userAnswers",userAnswers);
            self.setState({userAnswers }
                //, ()=> console.log(this.state.userAnswers)
            );
        }
    }


    timer(ms) {
        let self=this;
        return new Promise(res => setTimeout(res, ms));
    }

    render() {

        if(!this.state.selectedQuiz) {
            return <div>
                <p>You do not appear to come here from the homepage, please go to homepage and select a quiz to solve!</p></div>;
        }

        return (
            <div className="card-body">
                <div className="col-sm-12 row">
                    <div className="col-sm-3">
                        <div><h4>Quiz Name: </h4></div>
                        <div><h4>Maximum Attempts: </h4></div>
                        <div><h4>Available Until: </h4></div>
                    </div>
                    <div className="col-sm-6">
                        <div><h4 style={{color: 'red'}}>{this.state.selectedQuiz && this.state.selectedQuiz.quizName}</h4></div>
                        <div><h4 style={{color: 'red'}}>{this.state.selectedQuiz && this.state.selectedQuiz.maxAttempts}</h4></div>
                        <div><h4 style={{color: 'red'}}>{this.state.selectedQuiz && formatDateTime(this.state.selectedQuiz.validThru)}</h4></div>
                    </div>
                    <div className="col-sm-3">
                        <div style={{
                            margin: "0px",
                            textAlign: "center",
                            color: 'white',
                            backgroundColor: 'rgb(160,239,118)'
                        }}><h4>Time Left: {this.state.countBackFrom && this.state.countBackFrom}</h4></div>
                    </div>
                </div>
                <div className="col-sm-12 row">
                    <hr></hr>
                </div>

                <div className="card-body">
                    <div className="FormRenk col-sm-12">
                        {this.state.selectedQuiz && this.state.selectedQuiz.quizQuestionList && Array.isArray(this.state.selectedQuiz.quizQuestionList) && this.state.selectedQuiz.quizQuestionList.map((question, index) =>
                            <div className='col-sm-9 row' key={index + "_" + question.title + "_"}>
                                <div className="col-sm-9 row">
                                    <label style={{ fontWeight:'bold' }}>{(index+1)+") "} {question.title && question.title}</label>
                                </div>

                                <div className="col-sm-9 row">
                                    <label style={{ fontWeight:'normal', fontStyle:'italic' }}>{question.description && question.description}</label>
                                </div>

                                <fieldset className="col-sm-9 row">
                                    <div className="col-sm-9 row">
                                        <Radio.Group onChange={this.onChange} value={this.state.userAnswers && this.state.userAnswers[index]}>

                                            {question.questionAnswers.map((questionAnswer, index2) =>

                                                <Radio  type="radio" key={index2 + "_" + questionAnswer.answerDescription}
                                                        value={index2}
                                                        onChange={() => this.onValueChange(index,index2)}>

                                                    {questionAnswer.answerDescription && questionAnswer.answerDescription}

                                                </Radio>
                                            )}
                                        </Radio.Group>

                                    </div>
                                </fieldset>

                                <div className="col-sm-9 row">
                                    <hr></hr>
                                </div>


                            </div>
                        )}
                    </div>

                    <div className='col-sm-12'>
                        <button type="button" data-toggle="tooltip" data-placement="bottom"
                                style={{
                                    background: 'linear-gradient(rgba(159, 208, 55, 0.6), #9fd037)',
                                    float: 'right', padding: '10px 54px 10px 23px'
                                }}
                                rel="tooltip" className="TekBtn kaydet"
                                disabled={this.state.isLoading || this.state.selectedQuiz.quizQuestionList.length==0 }
                                onClick={() => this.handleSubmit("user")}>{this.state.mode === 'create' ? 'Submit Quiz' : 'Submit Quiz'}
                        </button>
                    </div>


                </div>
            </div>
        );
    }


}



export default Quiz;