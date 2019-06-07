import React, { Component } from 'react'
// import { Link, Redirect } from 'react-router-dom'
import { Link, withRouter } from 'react-router-dom'
import Image from 'react-bootstrap/Image'
import Modal from 'react-bootstrap/Modal'

import apiUrl from './apiConfig'
import axios from 'axios'

class Profile extends Component {
  constructor (props) {
    super(props)

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      pictures: [],
      upload: {
        description: '',
        tag: '',
        url: '',
        owner: ''
      },
      show: false,
      user: {},
      followers: '',
      following: ''
    }
  }

  handleClose () {
    this.setState({ show: false })
  }

  handleShow () {
    this.setState({ show: true })
  }

  profile = 'Profile'

  async componentDidMount () {
    const response = await axios(`${apiUrl}/uploads`)
    this.setState({ pictures: response.data.uploads })
    const userResponse = await axios(`${apiUrl}/users/${this.props.match.params.id}`)
    this.setState({ user: userResponse.data.user })
    this.setState({ followers: this.state.user.followers.length, following: this.state.user.following.length })
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
  }

  onSendToUser = async url => {
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
  }

  render () {
    const user = this.state.user
    const picture = this.state.pictures.filter(function (pic) {
      return pic.owner._id === user._id
    }).map(picture => (
      <Link key={picture._id} to={'/uploads/' + picture._id}><Image key={picture._id} className="profile-images" src={picture.url}/></Link>
    ))

    return (
      <div>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Profile Picture</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form id="create" encType="multipart/form-data" onSubmit={this.onCreateProfile}>
              <input type='file' name="picture" onChange={this.props.onChange} />
              <input type="hidden" name="description" value="Profile"/>
              <input id="btnCreatePicture" type="submit" className="btn btn-secondary" onClick={this.handleClose}/>
            </form>
          </Modal.Body>
        </Modal>
        <div className="profile-header">
          {this.props.user ? (user._id === this.props.user._id
            ? <Image className="avatar-profile hand-hover" src={user.profile}
              onMouseOver={e => (e.currentTarget.src = 'https://unclogwarrior.s3.amazonaws.com/camera.jpg')}
              onMouseLeave={e => (e.currentTarget.src = user.profile)} onClick={this.handleShow}/>
            : '')
            : <Image className="avatar-profile" src={user.profile}/>}
          <div className="container-column">
            <h5>{user.username || user._id}</h5>
            <div className="container-row">
              <p>{picture.length} posts</p>
              <p>&nbsp;&nbsp;{this.state.followers !== 1 ? this.state.followers + ' followers' : this.state.followers + ' follower'}</p>
              <p>&nbsp;&nbsp;{this.state.following !== 1 ? this.state.following + ' following' : this.state.following + ' following'}</p>
            </div>
          </div>
        </div>
        <div className="profile-images-container" >
          {picture}
        </div>
      </div>
    )
  }
}

export default withRouter(Profile)
