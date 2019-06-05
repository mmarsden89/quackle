import React, { Component } from 'react'
// import { Link, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
// import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'

import apiUrl from './apiConfig'
import axios from 'axios'

class Profile extends Component {
  constructor (props) {
    super(props)
    console.log('these are props', props)
    this.state = {
      pictures: []
    }
  }

  async componentDidMount () {
    const response = await axios(`${apiUrl}/uploads`)
    this.setState({ pictures: response.data.uploads })
  }

  render () {
    const user = this.props.user
    const picture = this.state.pictures.filter(function (pic) {
      return pic.owner._id === user._id
    }).map(picture => (
      <Image key={picture._id} className="profile-images" src={picture.url}/>
    ))

    return (
      <div>
        <div className="profile-header">
          <Image className="avatar" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"/>
          <h5>{user.username || user._id}</h5>
        </div>
        <div className="profile-images-container" >
          {picture}
        </div>
      </div>
    )
  }
}

export default withRouter(Profile)
