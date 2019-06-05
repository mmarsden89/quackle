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
      pictures: [],
      upload: {
        description: '',
        tag: '',
        url: '',
        owner: ''
      }
    }
  }
  profile = 'Profile'

  async componentDidMount () {
    const response = await axios(`${apiUrl}/uploads`)
    this.setState({ pictures: response.data.uploads })
  }

  onCreateSuccess = data => {
    const url = data.data.upload.url
    this.onSendToUser(url)
  }
  onCreateProfile = async event => {
    event.preventDefault()
    const formData = new FormData(event.target)
    formData.description = this.profile
    formData.tag = this.profile
    await axios({
      url: `${apiUrl}/uploads`,
      method: 'POST',
      headers: {
        Authorization: 'Token token=' + this.props.user.token
      },
      data: formData
    })
      .then(this.onCreateSuccess)
      .catch(console.log('eeyo'))
  }

  onSendToUser = async url => {
    console.log(this.props.user.token)
    const formData = new FormData(event.target)
    formData.description = this.profile
    formData.tag = this.profile
    await axios({
      url: `${apiUrl}/users/${this.props.user._id}`,
      method: 'PATCH',
      headers: {
        Authorization: 'Token token=' + this.props.user.token
      },
      data: {
        user: {
          profile: url
        }
      }
    })
      .then(console.log('yo'))
      .catch(console.log('eeyo'))
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
          <label htmlFor='single'>
            <Image className="avatar" src={user.profile}
              onMouseOver={e => (e.currentTarget.src = 'https://unclogwarrior.s3.amazonaws.com/camera.jpg')}
              onMouseLeave={e => (e.currentTarget.src = user.profile)}/>
          </label>
          <form id="create" encType="multipart/form-data" onSubmit={this.onCreateProfile} className="upload-container">
            <input type='file' name="picture" onChange={this.props.onChange} />
            <input type="hidden" name="description" value="Profile"/>
            <input id="btnCreatePicture" type="submit" className="btn btn-secondary"/>
          </form>
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
