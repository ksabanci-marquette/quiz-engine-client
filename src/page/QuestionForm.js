import React, {Component} from 'react';
import {request} from '../util/APIUtils';
import {Radio, Tabs} from 'antd';
import {deepCopyObject, showAxiosError, trimObject} from '../util/Helpers';
import LoadingIndicator from '../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import Alert from "react-s-alert";
import {validateComponent, validateField} from "../common/validation";
import {UncontrolledTooltip} from "reactstrap";
import Select from "react-select";
import {API_BASE_URL} from "../constants";



class QuestionForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: {},
            selectedQuestion: {
                id:null,
                creationDate:null,
                description:null,
                hardnessLevel: "MEDIUM",
                questionAnswers:[],
                questionType: "MultipleChoice",
                title:null,
                updateDate:null,
            },
            isLoading: false,
            fieldsDisabled:false,
            hardnessLevels : [
                {label: 'EASY', value: 'EASY'},
                {label: 'MEDIUM', value: 'MEDIUM'},
                {label: 'HARD', value: 'HARD'},
                {label: 'VERYHARD', value: 'VERYHARD'}],
            hardnessDefaultValue:'MEDIUM'

        };


        this.validateClass = this.validateClass.bind(this);
        this.validateComponent = this.validateComponent.bind(this);
        this.validateField = this.validateField.bind(this);
        this.validateMessage = this.validateMessage.bind(this);
        this.onChange = this.onChange.bind(this);
        this.save = this.save.bind(this);
        this.onChangeFields = this.onChangeFields.bind(this);
        this.onHardnessChange = this.onHardnessChange.bind(this);
        this.removeAnswer = this.removeAnswer.bind(this);
        this.addAnswer = this.addAnswer.bind(this);


    }


    componentDidMount() {
        this.setState({
            selectedQuestion: this.props.selectedQuestion
        });

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


    onChange(e) {
        let selectedQuestion = deepCopyObject(this.state.selectedQuestion);

        this.setState({
            selectedQuestion: {
                ...this.state.selectedQuestion,
                [e.target.name]: e.target.value.toString()
            }
        })
        console.log(selectedQuestion);

    }

    onChangeFields(e) {
        this.setState({
            [e.target.name]: e.target.value.toString()
        })
    }

    onHardnessChange(name,value){

        let selectedQuestion=deepCopyObject(this.state.selectedQuestion);

        if(value===null) {
            selectedQuestion[name] = null;
        }
        else {
            selectedQuestion[name] = value.value;
        }
        this.setState({selectedQuestion}
            ,()=>console.log(this.state.selectedQuestion));

    }

    onChangeAnswer(e,index){

        console.log(e.target.name)
        console.log(e.target.value)
        console.log(index)

        let selectedQuestion = deepCopyObject(this.state.selectedQuestion);
        let answer = deepCopyObject(this.state.selectedQuestion.questionAnswers[index]);

        if(e.target.name.includes("Description")){
            answer["answerDescription"] = e.target.value
            selectedQuestion.questionAnswers[index] = answer;

        }

        if(e.target.name.includes("nswer")){
            console.log("inside nswer")
            for(let i=0; i< selectedQuestion.questionAnswers.length ; i++){
                selectedQuestion.questionAnswers[i]["answer"]=false;
                console.log(i," : ",selectedQuestion.questionAnswers[i]["answer"])
            }
            selectedQuestion.questionAnswers[index]["answer"]=true;
        }


        this.setState({ selectedQuestion: selectedQuestion},
            () => console.log(this.state.selectedQuestion))
    }

    addAnswer(){

        let selectedQuestion = deepCopyObject(this.state.selectedQuestion);

        let answerObject=
            {id: null, questionId: selectedQuestion.id, answerDescription: null, answer: false};

        if (!selectedQuestion.questionAnswers){
            selectedQuestion.questionAnswers = [];
        }

        selectedQuestion.questionAnswers.push(answerObject);

        this.setState({ selectedQuestion: selectedQuestion},
            () => console.log(this.state.selectedQuestion))
    }

    removeAnswer(index){

        let selectedQuestion = deepCopyObject(this.state.selectedQuestion);

        selectedQuestion.questionAnswers.splice(index, 1)

        this.setState({ selectedQuestion: selectedQuestion},
            () => console.log(this.state.selectedQuestion))
    }

    save() {
        let self = this;
        let params;
        let data;
        let message;
        let validity = this.validateComponent();
        console.log("validity ",validity);


        if (this.state.selectedQuestion && validity.valid){


            let selectedQuestion = deepCopyObject(this.state.selectedQuestion);
            selectedQuestion=trimObject(selectedQuestion);
            data = selectedQuestion;
            message = 'Update/Save Successful.'


            if (!selectedQuestion.questionAnswers || selectedQuestion.questionAnswers.length === 0){

                Alert.error('Create at least one answer for the question!', {
                    position: 'top-right',
                    effect: 'stackslide',
                    timeout: 5000
                });
                return;
            }

            if (selectedQuestion.questionAnswers.filter(item=> item.answer===true).length === 0){

                Alert.error('Choose at least one of the answer options as real answer!', {
                    position: 'top-right',
                    effect: 'stackslide',
                    timeout: 5000
                });
                return;
            }

            for(let i=0; i< selectedQuestion.questionAnswers.length ; i++){
                selectedQuestion.questionAnswers[i]["questionId"]=selectedQuestion.id;
                console.log("selectedQuestion: ",selectedQuestion)
            }

            self.setState({isLoading:true});

            if (selectedQuestion.id == null){
                params = {
                    url: API_BASE_URL + "/question/save-new",
                    data: data,
                    method: 'post'
                };
            }else {
                params = {
                    url: API_BASE_URL + "/question/save",
                    data: data,
                    method: 'post'
                };
            }
            request(params).then(() => {
                Alert.success(
                    message, {
                        position: 'top-right',
                        effect: 'stackslide',
                        timeout: 5000
                    });
                self.setState({isLoading:false},
                    () => self.props.cancelProcess);

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
        if (this.state.isLoading) {
            return <LoadingIndicator/>;
        }

        if (this.state.notFound) {
            return <NotFound/>;
        }

        if (this.state.serverError) {
            return <ServerError/>;
        }

        const tabBarStyle = {
            textAlign: 'center'
        };


        return (
            <div className="personalInfo">
                {
                    <div className="card-body">
                        <div className="FormRenk col-sm-12">
                            <div className='col-sm-9 row'>
                                <div className="col-sm-3">
                                    <label>Title : </label>
                                </div>
                                <div className="col-sm-9">
                                    <div className={"form-group" + this.validateClass('tTitle')}>
                                        <input className="form-control"
                                               type="text"
                                               name="title"
                                               id="tTitle"
                                               data-vlength="1,20"
                                               onBlur={this.validateField}
                                               ref="tTitle"
                                               value={this.state.selectedQuestion && this.state.selectedQuestion.title}
                                               onChange={(e) => this.onChange(e)}
                                               disabled={this.state.fieldsDisabled}
                                        />
                                        {this.validateMessage('tTitle') !== "" &&
                                        <UncontrolledTooltip placement="right" target="tTitle" delay={0}>
                                            {this.validateMessage("tTitle")}
                                        </UncontrolledTooltip>}
                                    </div>
                                </div>
                            </div>

                            <div className='col-sm-9 row'>
                                <div className="col-sm-3">
                                    <label>Description : </label>
                                </div>
                                <div className="col-sm-9">
                                    <div className={"form-group" + this.validateClass('tDescription')}>
                                        <input className="form-control"
                                               type="text"
                                               name="description"
                                               id="tDescription"
                                               data-vlength="1,500"
                                               onBlur={this.validateField}
                                               ref="tDescription"
                                               value={this.state.selectedQuestion && this.state.selectedQuestion.description}
                                               onChange={(e) => this.onChange(e)}
                                               disabled={this.state.fieldsDisabled}
                                        />
                                        {this.validateMessage('tDescription') !== "" &&
                                        <UncontrolledTooltip placement="right" target="tDescription" delay={0}>
                                            {this.validateMessage("tDescription")}
                                        </UncontrolledTooltip>}
                                    </div>
                                </div>
                            </div>

                            <div className='col-sm-9 row'>
                                <div className="col-sm-3">
                                    <label>Hardness L. : </label>
                                </div>
                                <div className="col-sm-9">
                                    <div className={"form-group" + this.validateClass('tHardnessLevel')}>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            placeholder="Choose Hardness Level"
                                            isClearable={false}
                                            isSearchable={true}
                                            name="hardnessLevel"
                                            id="tHardnessLevel"
                                            ref="tHardnessLevel"
                                            onBlur={this.validateField}
                                            style={{width: 160, minWidth: 160, height: 30, maxHeight: 30}}
                                            inputProps={{'vdata': "required"}}
                                            options={this.state.hardnessLevels}
                                            onChange={(value) => this.onHardnessChange("hardnessLevel", value)}
                                            value={this.state.selectedQuestion
                                                ? {
                                                    label: this.state.selectedQuestion.hardnessLevel,
                                                    value: this.state.selectedQuestion.hardnessLevel
                                                }
                                                : {
                                                    label: this.state.hardnessDefaultValue,
                                                    value: this.state.hardnessDefaultValue
                                                }}
                                        />

                                        {this.validateMessage('tHardnessLevel') !== "" &&
                                        <UncontrolledTooltip placement="right" target="tHardnessLevel" delay={0}>
                                            {this.validateMessage("tHardnessLevel")}
                                        </UncontrolledTooltip>}
                                    </div>
                                </div>

                            </div>

                            <label>CHOICES</label>
                            <br/>

                            <div className="col-sm-12 row">
                                {this.state.selectedQuestion && this.state.selectedQuestion.questionAnswers && Array.isArray(this.state.selectedQuestion.questionAnswers) && this.state.selectedQuestion.questionAnswers.map((answer, index) =>
                                    <div className="col-sm-12 row">

                                        <div className={"col-sm-9 form-group" + this.validateClass("tDescription" + index)}>
                                            <input className="form-control"
                                                   type="text"
                                                   name={"tDescription" + index}
                                                   id={"tDescription" + index}
                                                   data-vlength="1,500"
                                                   onBlur={this.validateField}
                                                   ref={"tDescription" + index}
                                                   value={this.state.selectedQuestion && this.state.selectedQuestion.questionAnswers[index].answerDescription}
                                                   onChange={(e) => this.onChangeAnswer(e, index)}
                                            />
                                            {this.validateMessage("tDescription" + index) !== "" &&
                                            <UncontrolledTooltip placement="right" target={"tDescription" + index}
                                                                 delay={0}>
                                                {this.validateMessage("tDescription" + index)}
                                            </UncontrolledTooltip>}
                                        </div>
                                        <div className="col-sm-2">
                                            <input className=""
                                                   type="checkbox"
                                                   name={"isAnswer" + index}
                                                   id={"tIsAnswer" + index}
                                                   ref={"tIsAnswer" + index}
                                                   checked={this.state.selectedQuestion ? this.state.selectedQuestion.questionAnswers[index].answer===true : false}
                                                   onClick={(e) => this.onChangeAnswer(e, index)}
                                            />
                                        </div>
                                        <div className="col-sm-1">
                                            <button type="button" data-toggle="tooltip" data-placement="bottom"
                                                    style={{
                                                        float: 'right'
                                                    }}
                                                    rel="tooltip" className="add option"
                                                    onClick={() => this.removeAnswer(index)}> -
                                            </button>
                                        </div>
                                    </div>

                                )}
                                <button type="button" data-toggle="tooltip" data-placement="bottom"
                                        style={{
                                            float: 'right'
                                        }}
                                        rel="tooltip" className="add option"
                                        onClick={() => this.addAnswer()}> + Add Answer
                                </button>
                            </div>


                            <div className='col-sm-9 row'>


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
                }
            </div>
        );
    }
}

export default QuestionForm;