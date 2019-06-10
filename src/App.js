import React, { Component } from 'react'
import './App.scss'
import { Route } from 'react-router-dom'

import AuthenticatedRoute from './auth/components/AuthenticatedRoute'
import Header from './header/Header'
import SignUp from './auth/components/SignUp'
import SignIn from './auth/components/SignIn'
import SignOut from './auth/components/SignOut'
import ChangePassword from './auth/components/ChangePassword'
import Upload from './Upload'
import Pictures from './Pictures'
import Picture from './Picture'
import Profile from './Profile'
import Settings from './Settings'
import AutoDismissAlert from './AutoDismissAlert'

export class App extends Component {
  constructor () {
    super()

    this.state = {
      user: null,
      alerts: []
    }
  }

  setUser = user => this.setState({ user })

  clearUser = () => this.setState({ user: null })

  alert = (message, type) => {
    this.setState({ alerts: [...this.state.alerts, { message, type }] })
  }

  render () {
    const { alerts, user } = this.state

    return (
      <React.Fragment>
        <Header user={user} />
        {alerts.map((alert, index) => (
          <AutoDismissAlert
            key={index}
            alert={alert}
          />
        ))}
        <main className="container">
          <AuthenticatedRoute user={user} path='/settings' render={() => (
            <Settings match={this.match} user={user} />
          )} />
          <Route exact path='/' render={() => (
            <Pictures alert={this.alert} match={this.match} user={this.state.user} />
          )} />
          <Route exact path='/profile/:id' render={() => (
            <Profile alert={this.alert} match={this.match} user={this.state.user} />
          )} />
          <Route path='/uploads/:id' render={() => (
            <Picture alert={this.alert} match={this.match} user={this.state.user} />
          )} />
          <Route path='/sign-up' render={() => (
            <SignUp alert={this.alert} setUser={this.setUser} />
          )} />
          <Route path='/sign-in' render={() => (
            <SignIn alert={this.alert} setUser={this.setUser} />
          )} />
          <AuthenticatedRoute user={user} path='/sign-out' render={() => (
            <SignOut alert={this.alert} clearUser={this.clearUser} user={user} />
          )} />
          <AuthenticatedRoute user={user} path='/upload' render={() => (
            <Upload alert={this.alert} match={this.match} user={user} />
          )} />
          <AuthenticatedRoute user={user} path='/change-password' render={() => (
            <ChangePassword alert={this.alert} user={user} />
          )} />
        </main>
      </React.Fragment>
    )
  }
}

export default App
