import React, {Component} from 'react';
import './Home.css';
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from 'recharts';
import {Col, Label, Row} from "reactstrap";
import TextOverFlowTooltip from "../common/TextOverFlowTooltip";
import {formatDateTime, showAxiosError} from "../util/Helpers";
import {API_BASE_URL} from "../constants";
import {request} from "../util/APIUtils";

class QuizStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            quizStats1: null,
            quizStats2:null,
            quizStats3:[]
        };

    }

    componentDidMount() {
        this.fetch1(this.props.location.id);
        this.fetch2(this.props.location.id);
        this.fetch3(this.props.location.id);
    }

    fetch1(itemId){
        let self = this;
        let params;

        self.setState({isLoading:true});

        let path ="/quiz/stats/"+ itemId;

        let quizStats1=null;

        params = {
            url: API_BASE_URL + path,
            method: 'get'
        };

        request(params).then((response) => {
            console.log(response.data);
            quizStats1=response.data
            self.setState({quizStats1, isLoading:false})
        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });
    }

    fetch2(itemId){
        let self = this;
        let params;

        self.setState({isLoading:true});

        let path ="/quiz/stats2/"+ itemId;

        let quizStats2=null;

        params = {
            url: API_BASE_URL + path,
            method: 'get'
        };

        request(params).then((response) => {
            console.log(response.data);
            quizStats2=response.data
            self.setState({quizStats2, isLoading:false})
        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });
    }

    fetch3(itemId){
        let self = this;
        let params;

        self.setState({isLoading:true});

        let path ="/quiz/stats3/"+ itemId;

        let quizStats3=null;

        params = {
            url: API_BASE_URL + path,
            method: 'get'
        };

        request(params).then((response) => {
            console.log(response.data);
            quizStats3=response.data
            self.setState({quizStats3, isLoading:false})
        }).catch(function (error) {
            self.setState({isLoading:false});
            showAxiosError(error);
        });
    }

    render() {
        console.log(" this.state.stats", this.state.quizStats1);
        console.log(" this.state.stats2", this.state.quizStats2);
        console.log(" this.state.stats3", this.state.quizStats3);


        return (
            <div>
                <Label style={{textAlign: "center", fontWeight:"500%", fontSize:"22px" }}>QUIZ NAME: {this.props.location.quizName}</Label>
                <br/>
                <Label style={{textAlign: "center", fontWeight:"500%", fontSize:"22px" }}>Quiz Completion Status: </Label>
                <Row className={"col-sm-12"}>
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
                                <th>Username</th>
                                <th>Name </th>
                                <th>Lastname</th>
                                <th>Grade</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.quizStats3 && Array.isArray(this.state.quizStats3) && this.state.quizStats3.map((document, index) =>
                                <tr key={index + "_" + document.username + "_"}>
                                    <td>{index + 1}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={document.username || "-"}
                                                             maxLength={30}/>}</td>
                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={ document.name && document.name || ""}
                                                             maxLength={30}/>}</td>

                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={ document.lastname && document.lastname || ""}
                                                             maxLength={30}/>}</td>

                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                        <TextOverFlowTooltip text={ document.grade && document.grade || "Not Taken"}
                                                             maxLength={30}/>}</td>

                                    <td style={{margin: "0px", textAlign: "center"}}>{
                                    }</td>

                                    <td style={{margin: "0px"}}></td>
                                </tr>
                            )}

                            </tbody>
                        </table>
                    </Col>
                </Row>

                <br/>
                <br/>

                <Row className={"col-sm-12"}>
                    <div className={"col-sm-6"}>
                        <Label style={{textAlign: "center", fontWeight:"500%", fontSize:"22px" }}>Quiz Grades By User: </Label>
                        <BarChart
                            width={500}
                            height={300}
                            data={this.state.quizStats1 ? this.state.quizStats1 : [] }
                            maxBarSize={100}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            barSize={20}
                        >
                            <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey="grade" fill="#8884d8" background={{ fill: '#eee' }} />
                        </BarChart>
                    </div>

                    <div className={"col-sm-6"}>
                        <Label style={{textAlign: "center", fontWeight:"500%", fontSize:"22px" }}>Results by Question (Correct/Wrong): </Label>
                        <BarChart
                            width={500}
                            height={300}
                            data={this.state.quizStats2 ? this.state.quizStats2 : [] }
                            maxBarSize={100}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            barSize={20}
                        >
                            <XAxis dataKey="questionId" scale="point" padding={{ left: 10, right: 10 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey="correct" stackId="a" fill="rgb(20 204 89)" />
                            <Bar dataKey="wrong" stackId="a" fill="#e4432b" />
                        </BarChart>
                    </div>
                </Row>
            </div>
        );

    }


}



export default QuizStats;