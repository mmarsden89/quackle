import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faCameraRetro, faSearch } from '@fortawesome/free-solid-svg-icons'

import './Header.scss'

const Header = ({ user }) => (
  <header className="main-header">
    <div className="header-left">
      <img className='duck-header' src="https://i.imgur.com/8xwTCdE.png"/>
      <Link to="/" className="header-h1"><h1>duckPics</h1></Link>
    </div>
    <div className="searchbar-div">
      <FontAwesomeIcon className="search-icon" icon={faSearch}/>
      <input className="header-input" placeholder="Search"/>
    </div>
    <div className="header-right">
      { user
        ? <nav>
          <Link to="/upload"><FontAwesomeIcon className="icon" icon={faCameraRetro}/></Link>
          <Link to="/settings"><FontAwesomeIcon className="icon" icon={faCog}/></Link>
          <Link to="/profile"><img className="avatar" src={user.profile}/></Link>
        </nav> : <nav>
          <Link to="/sign-up">Sign Up</Link>
          <Link to="/sign-in">Sign In</Link>
        </nav>}
    </div>
  </header>
)

export default Header
