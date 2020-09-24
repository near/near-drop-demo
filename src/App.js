import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import nearlogo from './assets/gray_near_logo.svg';
import Drops from './Drops'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      currentUser: window.currentUser,
    }
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  async componentDidMount() {
    let loggedIn = this.props.wallet.isSignedIn();
    if (loggedIn) {
      this.signedInFlow();
    } else {
      this.signedOutFlow();
    }
    this.setState({ currentUser: window.currentUser })
  }

  async signedInFlow() {
    this.setState({
      login: true,
    })
    const accountId = await this.props.wallet.getAccountId()
    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
  }

  async requestSignIn() {
    const appTitle = 'NEAR Drop Example';
    await this.props.wallet.requestSignIn(
      window.nearConfig.contractName,
      appTitle
    )
  }

  async updateUser() {
    await window.getCurrentUser()
    this.setState({ currentUser: window.currentUser })
  }

  requestSignOut() {
    this.props.wallet.signOut();
    setTimeout(this.signedOutFlow, 500);
    console.log("after sign out", this.props.wallet.isSignedIn())
  }

  signedOutFlow() {
    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
    this.setState({
      login: false,
      currentUser: null,
    })
  }

  render() {

    const {
      state,
      updateUser
    } = this
    const {
      currentUser
    } = state

    console.log(state)

    return (
      <div className="App-header">
        <div className="image-wrapper">
          <img className="logo" src={nearlogo} alt="NEAR logo" />
          
        </div>
        <div>
          { currentUser && <Drops {...{currentUser, updateUser}} />}
        </div>
        <div className="login">
          {this.state.login ? 
            <div>
              <button onClick={this.requestSignOut}>Log out</button>
            </div>
            : <button onClick={this.requestSignIn}>Log in with NEAR</button>}
        </div>
      </div>
    )
  }

}

export default App;
