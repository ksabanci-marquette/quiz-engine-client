import React, {Component} from 'react';
import './Home.css';
import LoadingIndicator from "../common/LoadingIndicator";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            currentUser: null,
            hasMembership: null,
            membershipStatus:"",
        };
        this.RightExists=this.RightExists.bind(this);
    }

    componentDidMount() {
        this.setState({currentUser:this.props.currentUser});
    }

    RightExists( searchItem){
        let exists=false;
        const authorities=this.props.authorities;
        for (const authority of authorities)
        {
            if (authority.authority.includes(searchItem)) {
                exists=true;
            }
        }
        return exists;
    }

    render() {

        if(!this.state.currentUser) {
            return <LoadingIndicator />;
        }

        return (
            <div className="home-container">QUIZ ENGINE HOMEPAGE</div>

        );
    }


}



export default Home;