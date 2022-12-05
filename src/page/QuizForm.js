import React, {Component} from 'react';
import {request} from '../util/APIUtils';
import {DatePicker} from 'antd';
import {deepCopyObject, formatDateTime, showAxiosError, trimObject} from '../util/Helpers';
import LoadingIndicator from '../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import Alert from "react-s-alert";
import {validateComponent, validateField} from "../common/validation";
import {Col, Row, UncontrolledTooltip} from "reactstrap";
import {API_BASE_URL} from "../constants";
import moment from "moment";
import locale from 'antd/es/date-picker/locale/en_US';
import Select from "react-select";
import TextOverFlowTooltip from "../common/TextOverFlowTooltip";


class QuizForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: {},
            selectedQuiz: {
                id:null,
                quizName:null,
                creationDate:null,
                created_by: null,
                maxAttempts:1,
                validThru: null,
                quizQuestionList: []
            },
            isLoading: false,
            fieldsDisabled:false,
            questionList: [],
        };


        this.validateClass = this.validateClass.bind(this);
        this.validateComponent = this.validateComponent.bind(this);
        this.validateField = this.validateField.bind(this);
        this.validateMessage = this.validateMessage.bind(this);
        this.onChange = this.onChange.bind(this);
        this.save = this.save.bind(this);
        this.onChangeFields = this.onChangeFields.bind(this);
        this.onHardnessChange = this.onHardnessChange.bind(this);
        this.onChangeQuestionList = this.onChangeQuestionList.bind(this);
        this.onChangeDateString = this.onChangeDateString.bind(this);
        this.fetchQuiz = this.fetchQuiz.bind(this);
        this.fetchQuestionList = this.fetchQuestionList.bind(this);

    }


    componentDidMount() {
        this.fetchQuiz(this.props.selectedQuiz);
        this.fetchQuestionList();
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

    fetchQuiz(selectedQuiz){
        if(!selectedQuiz){
            return;
        }
        let self = this;
        let params;
        self.setState({isLoading:true});

        let path ="/quiz/" + selectedQuiz.id;
        params = {
            url: API_BASE_URL + path,
            method: 'get'
        };

        request(params).then((response) => {
            console.log(response.data);
            self.setState({isLoading:false, selectedQuiz:response.data});

        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });
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
            console.log("questionList ",response.data);
            self.setState({isLoading:false, questionList:response.data});

        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });
    }


    onChange(e) {
        let selectedQuiz = deepCopyObject(this.state.selectedQuiz);
        let value = e.target.value.toString();

        if (e.target.name === "maxAttempts" || e.target.name === "duration"){
            value = value.replace(/\D/g,'');
        }

        this.setState({
            selectedQuiz: {
                ...this.state.selectedQuiz,
                [e.target.name]: value
            }
        })
        console.log(selectedQuiz);
    }



    onChangeFields(e) {
        this.setState({
            [e.target.name]: e.target.value.toString()
        })
    }

    onHardnessChange(name,value){

        let selectedQuiz=deepCopyObject(this.state.selectedQuiz);

        if(value===null) {
            selectedQuiz[name] = null;
        }
        else {
            selectedQuiz[name] = value.value;
        }
        this.setState({selectedQuiz}
            ,()=>console.log(this.state.selectedQuiz));

    }

    onChangeQuestionList(e,index){

        console.log(e.target.name)
        console.log(e.target.value)
        console.log(e.target.checked)
        console.log(index)

        if(!this.state.selectedQuiz || !this.state.questionList){
            return;
        }

        let questionList = deepCopyObject(this.state.questionList);
        let selectedQuiz = deepCopyObject(this.state.selectedQuiz);
        let quizQuestionList = deepCopyObject(selectedQuiz.quizQuestionList);

        if(e.target.checked){

            quizQuestionList.push(questionList.filter(item=> item.id === index)[0])

        }else{
            console.log("remove question at index: ",quizQuestionList.findIndex(item=> item.id === index))
            quizQuestionList.splice(quizQuestionList.findIndex(item=> item.id === index),1)
        }

        selectedQuiz.quizQuestionList = quizQuestionList;
        //
        this.setState({ selectedQuiz},
            () => console.log(this.state.selectedQuiz))
    }

    save() {
        let self = this;
        let params;
        let data;
        let message;
        let validity = this.validateComponent();
        console.log("validity ",validity);


        if (this.state.selectedQuiz && validity.valid){


            let selectedQuiz = deepCopyObject(this.state.selectedQuiz);
            selectedQuiz=trimObject(selectedQuiz);
            data = selectedQuiz;
            message = 'Update/Save Successful.'

            self.setState({isLoading:true});

            // if (selectedQuiz.id == null){
            //     params = {
            //         url: API_BASE_URL + "/question/save-new",
            //         data: data,
            //         method: 'post'
            //     };
            // }else {
            //     params = {
            //         url: API_BASE_URL + "/question/save",
            //         data: data,
            //         method: 'post'
            //     };
            // }

            params = {
                url: API_BASE_URL + "/quiz/save-with-questions",
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


    onChangeDateString(name,value) {

        console.log("name,value ",name,value);

        if(value===""){
            value=null;
        }
        if (value!==null){
            let splitted = value.split(".");
            value=splitted[2]+"-"+splitted[0]+"-"+splitted[1];
        }

        let selectedQuiz= deepCopyObject(this.state.selectedQuiz);

        selectedQuiz[name]=value;

        console.log("value ",name,value);

        this.setState({ selectedQuiz });

    }

    options = [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
    ];

    logChange(val) {
        console.log("Selected: " + val);
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


        let throughDate = this.state.selectedQuiz && this.state.selectedQuiz.validThru ? {value: moment(this.state.selectedQuiz.validThru,"YYYY-MM-DD")} : {};
        console.log("this.state.selectedQuiz ",this.state.selectedQuiz&&this.state.selectedQuiz);



        return (
            <div className="personalInfo">
                {
                    <div className="card-body">
                        <div className="FormRenk col-sm-12">
                            <div className='col-sm-8 row'>
                                <div className="col-sm-4">
                                    <label>Quiz Name : </label>
                                </div>
                                <div className="col-sm-8">
                                    <div className={"form-group" + this.validateClass('tQuizName')}>
                                        <input className="form-control"
                                               type="text"
                                               name="quizName"
                                               id="tQuizName"
                                               data-vlength="1,20"
                                               onBlur={this.validateField}
                                               ref="tQuizName"
                                               value={this.state.selectedQuiz && this.state.selectedQuiz.quizName}
                                               onChange={(e) => this.onChange(e)}
                                               disabled={this.state.fieldsDisabled}
                                        />
                                        {this.validateMessage('tQuizName') !== "" &&
                                        <UncontrolledTooltip placement="right" target="tQuizName" delay={0}>
                                            {this.validateMessage("tQuizName")}
                                        </UncontrolledTooltip>}
                                    </div>
                                </div>
                            </div>

                            <div className='col-sm-8 row'>
                                <div className="col-sm-4">
                                    <label>Max.Attempts : </label>
                                </div>
                                <div className="col-sm-8">
                                    <div className={"form-group" + this.validateClass('tMaxAttempts')}>
                                        <input className="form-control"
                                               type="text"
                                               name="maxAttempts"
                                               id="tMaxAttempts"
                                               data-vlength="1,2"
                                               onBlur={this.validateField}
                                               ref="tMaxAttempts"
                                               value={this.state.selectedQuiz && this.state.selectedQuiz.maxAttempts}
                                               onChange={(e) => this.onChange(e)}
                                               disabled={this.state.fieldsDisabled}
                                        />
                                        {this.validateMessage('tMaxAttempts') !== "" &&
                                        <UncontrolledTooltip placement="right" target="tMaxAttempts" delay={0}>
                                            {this.validateMessage("tMaxAttempts")}
                                        </UncontrolledTooltip>}
                                    </div>
                                </div>
                            </div>

                            <div className='col-sm-8 row'>
                                <div className="col-sm-4">
                                    <label>Duration : </label>
                                </div>
                                <div className="col-sm-8">
                                    <div className={"form-group" + this.validateClass('tDuration')}>
                                        <input className="form-control"
                                               type="text"
                                               name="duration"
                                               id="tDuration"
                                               data-vlength="1,3"
                                               onBlur={this.validateField}
                                               ref="tMaxAttempts"
                                               value={this.state.selectedQuiz && this.state.selectedQuiz.duration}
                                               onChange={(e) => this.onChange(e)}
                                               disabled={this.state.fieldsDisabled}
                                        />
                                        {this.validateMessage('tDuration') !== "" &&
                                        <UncontrolledTooltip placement="right" target="tDuration" delay={0}>
                                            {this.validateMessage("tDuration")}
                                        </UncontrolledTooltip>}
                                    </div>
                                </div>
                            </div>

                            <div className='col-sm-8 row'>
                                <div className="col-sm-4">
                                    <label>Valid Through : </label>
                                </div>
                                <div className="col-sm-8">
                                    <div className={"form-group" + this.validateClass('tValidThru')}>
                                        <DatePicker {...throughDate}
                                                    locale={locale}
                                                    className="basic-single"
                                                    placeholder="Choose a through date"
                                                    disabled={this.state.fieldsDisabled}
                                                    classNamePrefix="select"
                                                    format= "MM.DD.YYYY"
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    name="validThru"
                                                    id="tValidThru"
                                                    ref="tValidThru"
                                                    style={{ width: 160 }}
                                                    inputProps={{'vdata': "required"}}
                                                    onChange={(date,dateString)=>this.onChangeDateString("validThru",dateString)}/>
                                        {this.validateMessage('tValidThru') !== "" &&
                                        <UncontrolledTooltip placement="right" target="tValidThru" delay={0}>
                                            {this.validateMessage("tValidThru")}
                                        </UncontrolledTooltip>}
                                    </div>
                                </div>
                            </div>

                            {/*<div className='col-sm-8 row'>*/}
                            {/*    <div className="col-sm-4">*/}
                            {/*        <label>Questions : </label>*/}
                            {/*    </div>*/}
                            {/*    <div className="col-sm-8">*/}
                            {/*        <div className={"form-group" + this.validateClass('tValidThru')}>*/}
                            {/*            <Select     value={this.state.selectedQuiz.quizQuestionList}*/}
                            {/*                        className="basic-single"*/}
                            {/*                        placeholder="Choose a through date"*/}
                            {/*                        multi={true}*/}
                            {/*                        name="validThru"*/}
                            {/*                        id="tValidThru"*/}
                            {/*                        ref="tValidThru"*/}
                            {/*                        style={{ width: 160 }}*/}
                            {/*                        inputProps={{'vdata': "required"}}*/}
                            {/*                        onChange={(date,dateString)=>this.onChangeDateString("validThru",dateString)}/>*/}
                            {/*            {this.validateMessage('tValidThru') !== "" &&*/}
                            {/*            <UncontrolledTooltip placement="right" target="tValidThru" delay={0}>*/}
                            {/*                {this.validateMessage("tValidThru")}*/}
                            {/*            </UncontrolledTooltip>}*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}



                            <label>QUESTIONS</label>
                            <br/>

                            <Row className="col-sm-12">
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
                                            <th>Description </th>
                                            <th>Hardnesss Level</th>
                                            <th>Creation Date</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.questionList && Array.isArray(this.state.questionList) && this.state.questionList.map((document, index) =>
                                            <tr key={index + "_" + document.title + "_"}>
                                                <td>
                                                    <input className=""
                                                           type="checkbox"
                                                           name={"questionIndex" + index}
                                                           id={"questionIndex" + index}
                                                           ref={"questionIndex" + index}
                                                           checked={this.state.selectedQuiz && Array.isArray(this.state.selectedQuiz.quizQuestionList) &&
                                                           this.state.selectedQuiz.quizQuestionList.filter(item=> item.id===document.id).length === 1}
                                                           onClick={(e) => this.onChangeQuestionList(e, document.id)}
                                                    />

                                                </td>
                                                <td style={{margin: "0px", textAlign: "center"}}>{
                                                    <TextOverFlowTooltip text={document.title || "-"}
                                                                         maxLength={10}/>}</td>
                                                <td style={{margin: "0px", textAlign: "center"}}>{
                                                    <TextOverFlowTooltip text={document.description || "-"}
                                                                         maxLength={20}/>}</td>
                                                <td style={{margin: "0px", textAlign: "center"}}>{
                                                    <TextOverFlowTooltip text={document.hardnessLevel || "-"}
                                                                         maxLength={10}/>}</td>

                                                <td style={{margin: "0px", textAlign: "center"}}>{
                                                    <TextOverFlowTooltip text={document.creationDate && document.creationDate || "-"}
                                                                         maxLength={15}/>}</td>

                                                <td style={{margin: "0px", textAlign: "center"}}>{
                                                }</td>

                                                <td style={{margin: "0px"}}></td>
                                            </tr>
                                        )}
                                        {(this.state.questionList && this.state.questionList.length === 0) &&
                                        <tr>
                                            <td colSpan="8">No Quizzes Yet!</td>
                                        </tr>
                                        }

                                        </tbody>
                                    </table>
                                </Col>
                                <Col sm="12">
                                    <p style={{float: "right"}}>
                                        Total Selected: {this.state.selectedQuiz ? this.state.selectedQuiz.quizQuestionList.length : 0}</p>
                                </Col>
                            </Row>


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

export default QuizForm;