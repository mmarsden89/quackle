import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faCameraRetro } from '@fortawesome/free-solid-svg-icons'

import './Header.scss'

const Header = ({ user }) => (
  <header className="main-header">
    <img className='duck-header' src="https://i.imgur.com/8xwTCdE.png"/>
    <Link to="/"><h1>duckPics</h1></Link>
    { user
      ? <nav>
        <Link to="/upload"><FontAwesomeIcon className="icon" icon={faCameraRetro}/></Link>
        <Link to="/settings"><FontAwesomeIcon className="icon" icon={faCog}/></Link>
        <Link to="/profile"><img className="avatar" src={user.profile}/></Link>
      </nav> : <nav>
        <Link to="/sign-up">Sign Up</Link>
        <Link to="/sign-in">Sign In</Link>
      </nav>}
  </header>
)

export default Header
