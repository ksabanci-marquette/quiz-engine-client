import React, {Component} from 'react';
import {Col, Row, Tooltip} from "reactstrap";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
            width: window.innerWidth,
            branches: [],
            branchIndex: 0,
            key: Math.random().toString(36),
            pbTopMargin: '-26px 20px',
            pmHeight: '0',
            checkBoxState: false,
            downloadRequestModal: false,
        };
        this.designMargin = this.designMargin.bind(this);
    }

    componentDidMount() {
        let currentUser = this.props.currentUser;
        this.setState({
            username: currentUser.username,
            name: currentUser.name, // User.firstName
            surname: currentUser.surname,
        });
        window.addEventListener('resize', this.designMargin)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.designMargin)
    }

    designMargin() {

        let pmlHeight = document.getElementById('profileMenuList') ? document.getElementById('profileMenuList').offsetHeight : 0;

        let totalHeight;
        let margin;

        if (window.innerWidth < 992) {
            totalHeight = (pmlHeight + 32).toString() + 'px';
        } else {
            totalHeight = '0';
        }

        if (document.getElementById('profileMenuButton')) {
            if (document.getElementById('profileMenuButton').checked) {
                margin = (pmlHeight + 5).toString() + 'px' + ' ' + '20px';

            } else {
                margin = '-26px 20px';
            }

        } else {
            margin = '0'
        }

        return (
            this.setState({
                pmHeight: totalHeight,
                pbTopMargin: margin
            })
        )
    }

    render() {

        return (
        this.state.width > 991 ? (this.props.offsetWidth === null || this.props.offsetWidth === 24) ? {
            float: 'right',
            marginRight: '17em'
        } : {
            float: 'right',
            marginRight: '3em'
        } : {float: 'right'}
    );
    }
}

export default Header;
