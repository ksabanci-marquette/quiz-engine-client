import React, {Component} from 'react';
import './Home.css';
import {Radio} from 'antd';
import {deepCopyObject, formatDateTime} from "../util/Helpers";

class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            selectedQuiz: null,
            countingBack:true,
            userAnswers:[],
        };

        this.countback = this.countback.bind(this);
        this.timer = this.timer.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onValueChange = this.onValueChange.bind(this);

    }

    componentDidMount() {
        this.setState({
            selectedQuiz: this.props.location.selectedQuiz,
            countBackFrom: this.props.location.selectedQuiz && this.props.location.selectedQuiz.duration ? this.props.location.selectedQuiz.duration : 1000
        }, () => {
            this.countback(); })
    }

    async countback(){
        let self=this;
        while(self.state.countBackFrom>0 && self.state.countingBack){
            await self.timer(1000);
            self.setState({countBackFrom:self.state.countBackFrom-1});
        }
        if(self.state.countBackFrom===0)
        {
            self.setState({countingBack:false},()=>this.handleSubmit());
        }
    }

    handleSubmit(){


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
                </div>
            </div>
        );
    }


}



export default Quiz;