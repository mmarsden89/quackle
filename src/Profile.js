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
      <div className="profile-images-container" >
        {picture}
      </div>
    )
  }
}

export default withRouter(Profile)
