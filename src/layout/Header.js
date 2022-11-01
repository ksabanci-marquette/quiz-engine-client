import React, {Component} from 'react';

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
            isAdmin:false,
        };
        this.designMargin = this.designMargin.bind(this);
    }

    componentDidMount() {
        let currentUser = this.props.currentUser;
        this.setState({
            username: currentUser.username,
            name: currentUser.name, // User.firstName
            surname: currentUser.surname,
            isAdmin: currentUser.isAdmin,
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

    openDownloadRequestModal = () => {
        this.setState({downloadRequestModal: true})
    };

    closeDownloadRequestModal = () => {
        this.setState({downloadRequestModal: false})
    };

    render() {

        let right = this.state.width > 991 ? (this.props.offsetWidth === null || this.props.offsetWidth === 24) ? {
            float: 'right',
            marginRight: '17em'
        } : {
            float: 'right',
            marginRight: '3em'
        } : {float: 'right'};

        return !this.props.isAuthenticated ?
            <div></div> :
            (
                <div>
                    <div key={this.state.key} className="stylish-navbar row col-sm-12" id="merdingen">
                        <div className="navbar-wrapper">
                            <div className="navbar-toggle">
                                <button type="button" className="navbar-toggler">
                                    <span className="navbar-toggler-bar bar1"/>
                                    <span className="navbar-toggler-bar bar2"/>
                                    <span className="navbar-toggler-bar bar3"/>
                                </button>
                            </div>
                            <div className="stylish-navbar-brand col-sm-12">
                                {this.state.name} {this.state.surname} {this.state.isAdmin  ? " (ADMIN) " : "(STUDENT)" }
                            </div>
                        </div>
                    </div>
                </div>
            );
    }
}

export default Header;
