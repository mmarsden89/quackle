import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import apiUrl from '../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faCameraRetro, faSearch } from '@fortawesome/free-solid-svg-icons'

import './Header.scss'

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      users: [],
      pictures: [],
      search: {},
      searchreturn: ''
    }
  }
  async componentDidMount () {
    const response = await axios(`${apiUrl}/uploads`)
    this.setState({ pictures: response.data.uploads })
    const userResponse = await axios(`${apiUrl}/users`)
    this.setState({ users: userResponse.data.users })
  }

  handleChange = event => {
    const updatedField = event.target.value
    const search = updatedField
    this.setState({ search: search })
    this.state.pictures.map(picture => {
      if (picture.owner.username) {
        if (picture.owner.username.includes(this.state.search)) {
          this.setState({ searchreturn: picture.owner.username })
        }
      } else if (picture.owner.email) {
        if (picture.owner.email.includes(this.state.search)) {
          this.setState({ searchreturn: picture.owner.email })
        }
      }
    })
  }

  render () {
    const search = this.state.searchreturn

    return (
      <header className="main-header">
        <div className="header-left">
          <img className='duck-header' src="https://i.imgur.com/8xwTCdE.png"/>
          <Link to="/" className="header-h1"><h1>duckPics</h1></Link>
        </div>
        <div className="searchbar-div">
          <FontAwesomeIcon className="search-icon" icon={faSearch}/>
          <input className="header-input" placeholder="Search" name="search" onChange={this.handleChange}/>
          {this.state.search.length > 0 ? <ul className="search-return"><li>{search}</li></ul> : ''}
        </div>
        <div className="header-right">
          { this.props.user
            ? <nav className="nav-right">
              <Link to="/upload"><FontAwesomeIcon className="icon" icon={faCameraRetro}/></Link>
              <Link to="/settings"><FontAwesomeIcon className="icon" icon={faCog}/></Link>
              <Link to={'/profile/' + this.props.user._id}><img className="avatar" src={this.props.user.profile}/></Link>
            </nav> : <nav className="nav-right">
              <Link to="/sign-up">Sign Up</Link>
              <Link to="/sign-in">Sign In</Link>
            </nav>}
        </div>
      </header>
    )
  }
}

export default Header
