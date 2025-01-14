import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Authenticated from './Authenticated.jsx';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {user: ''};
    props.conf.then(x => this.setState({user: x.user}));
  };

  render() {
    return (
      <header id="desktop_header" className="row align-items-center">
        <Helmet>
          <title>{this.state.user}</title>
        </Helmet>
        <div className="col-lg-2 d-none d-lg-block logo"></div>
        <h1 className="col-lg-8"><Link to="/">{this.state.user}</Link></h1>
        <div className="col-lg-2">
          <Authenticated conf={this.props.conf} />
        </div>
      </header>
    );
  }

}

export default Header;

