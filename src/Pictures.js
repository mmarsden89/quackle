import apiUrl from './apiConfig'
import React, { Component } from 'react'
import axios from 'axios'
import { Link, withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

const moment = require('moment')

class Pictures extends Component {
  constructor (props) {
    super(props)

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      pictures: [],
      comment: '',
      users: [],
      followed: false,
      following: [],
      profilePic: '',
      show: false,
      video: ''
    }
  }

  currentUserInfo = this.props.user

  async componentDidMount () {
    const response = await axios(`${apiUrl}/uploads`)
    this.setState({ pictures: response.data.uploads })
    const userResponse = await axios(`${apiUrl}/users`)
    this.setState({ users: userResponse.data.users })
    if (this.props.user) {
      const following = await axios(`${apiUrl}/users/${this.props.user._id}`)
      this.setState({ following: following.data.user.following })
      this.setState({ profilePic: following.data.user.profile })
    }
    this.setState({ comment: '' })
  }

  handleChange = event => {
  // handle change
    const updatedField = {
      [event.target.name]: event.target.value
    }
    const comment = Object.assign(this.state.comment, updatedField)
    this.setState({ comment: comment.comment })
  }

  createComment = async event => {
    event.preventDefault()
    const id = event.target.id
    await axios({
      url: apiUrl + '/comments',
      method: 'POST',
      headers: { Authorization: 'Token token=' + this.props.user.token },
      data: {
        comment: {
          'picture': `${id}`,
          'text': `${this.state.comment}`,
          'username': `${this.props.user._id}`
        }
      }
    })
    this.componentDidMount()
  }

  handleClose = event => {
    this.setState({ show: false })
  }

  handleShow = e => {
    this.setState({ show: true, video: e.target.id })
  }

  onSendToUser = async event => {
    await axios({
      url: `${apiUrl}/following/${this.props.user._id}`,
      method: 'PATCH',
      headers: {
        Authorization: 'Token token=' + this.props.user.token
      },
      data: {
        user: {
          following: event.target.dataset.pictureowner
        }
      }
    })
    await this.componentDidMount()
  }

  deletePost = async event => {
    const id = event.target.id
    await axios({
      url: apiUrl + `/uploads/${id}`,
      method: 'DELETE',
      headers: { Authorization: 'Token token=' + this.props.user.token }
    })
    this.componentDidMount()
  }

  handleFollow = async event => {
    const id = event.target.id
    await axios({
      url: apiUrl + `/visited/${id}`,
      method: 'PATCH',
      headers: { Authorization: 'Token token=' + this.props.user.token },
      data: {
        user: {
          followers: event.target.dataset.id
        }
      }
    })
      .then(this.onSendToUser(event))
  }

  smashThatLike = async event => {
    const id = event.target.id
    await axios({
      url: apiUrl + `/likes/${id}`,
      method: 'PATCH',
      headers: { Authorization: 'Token token=' + this.props.user.token },
      data: {
        upload: {
          likes: this.props.user.username
        } }
    })
    this.componentDidMount()
  }

  render () {
    const { comment } = this.state
    const currentUser = (
      <div>
        <span>
          {this.props.user ? <Link to={'/profile/' + this.props.user._id}><img src={this.state.profilePic} className="avatar-pictures"/></Link> : ''}
          {this.props.user ? <Link className="sidebar-p-span" to={'/profile/' + this.props.user._id}><p className="sidebar-p-span">&nbsp;&nbsp;&nbsp;&nbsp;{ this.props.user.username }</p></Link> : ''}
        </span>
      </div>
    )

    const users = this.state.users.reverse().map(user => (
      <div key={user._id} className="sidebar-container">
        {this.state.pictures.filter(function (video) {
          return (video.description === 'Video' && moment(video.createdAt).add(1, 'd') > moment()) || video.description === 'VideoPass'
        }).map(video => (
          video.owner._id === user._id && video.owner.username !== 'Admin' ? <Card.Img key={video._id} src={user.profile} id={video.url} onClick={this.handleShow} className="avatar-pictures red-ring absolute"/> : (user.username !== 'Admin' ? <Card.Img key={video._id} src={user.profile} className="avatar-pictures absolute"/> : <Card.Img key={video._id} src={user.profile} className="avatar-pictures absolute no-display"/>)
        ))}
        <div>
          {user.username !== 'Admin' ? <Link to={'/profile/' + user._id}><p className="sidebar-small">{user.username}</p></Link> : ''}
          {user.username !== 'Admin' ? <p className="sidebar-super-small">{moment(user.updatedAt).fromNow()}</p> : '' }
        </div>
      </div>
    ))
    const pictures = this.state.pictures.filter(function (pic) {
      return pic.description !== 'Profile' && pic.description !== 'VideoPass' && pic.description !== 'Video'
    }).reverse().map(picture => (
      <Card key={picture._id} className="card margin-top">
        <Card.Header className="card-header">
          <Link to={'/profile/' + picture.owner._id}><Card.Img src={picture.owner.profile} className="avatar-pictures"/></Link>
          <Link to={'/profile/' + picture.owner._id} className="nohover"><p className="card-picture-p">{picture.owner.username}</p></Link>
          {this.props.user ? (picture.owner._id === this.props.user._id ? <Button onClick={this.deletePost} id={picture._id} className="right btn-danger">Delete</Button>
            : (this.state.following.includes(picture.owner.username)
              ? <Button className="right btn-secondary" onClick={this.handleFollow} data-id={this.props.user.username} id={picture.owner._id} data-pictureowner={picture.owner.username}>unfollow</Button>
              : <Button onClick={this.handleFollow} data-id={this.props.user.username} id={picture.owner._id}
                data-pictureowner={picture.owner.username} className="right btn-primary">Follow</Button>)) : ''}
        </Card.Header>
        <Link to={'/uploads/' + picture._id}><Card.Img variant="top" src={picture.url} /></Link>
        <Card.Footer className="comment-section">
          { this.props.user ? (picture.likes.includes(this.props.user.username)
            ? <Card.Img className="duck-like" src='https://i.imgur.com/1gqZnEN.png'
              onClick={this.smashThatLike} id={picture._id}/>
            : <Card.Img className="duck-like" src="https://i.imgur.com/nWCiT5Z.png"
              onClick={this.smashThatLike} id={picture._id}/>) : '' }
          <Card.Text>liked by <b>{picture.likes.length}</b> ducks</Card.Text>
          <Card.Text className="picture-description">{picture.description} #{picture.tag}</Card.Text>
          {picture.comments.map(comment =>
            <Card.Text key={comment._id} className="picture-description"><b><Link className="sidebar-p-span" to={'/profile/' + comment.owner._id}>{comment.owner.username}</Link> &nbsp;&nbsp;&nbsp;&nbsp; </b>{comment.text}</Card.Text>
          )}
          <Card.Text><small className="text-muted">{moment(picture.createdAt).fromNow()}</small></Card.Text>
        </Card.Footer>
        {this.props.user ? <Card.Footer>
          <form id={picture._id} onSubmit={this.createComment}>
            <input
              name="comment"
              placeholder="Add a comment..."
              value={comment}
              onChange={this.handleChange}
              className="form-border"
            />
            <Button type="submit" className="comment-button">Post</Button>
          </form>
        </Card.Footer>
          : '' }
      </Card>
    ))

    return (
      <div>
        <Modal className="video-body" show={this.state.show} onHide={this.handleClose}>
          <Modal.Body>
            <video src={this.state.video} autoPlay onEnded={this.handleClose}/>
          </Modal.Body>
        </Modal>
        <div className="sidebar-user">
          {currentUser}
        </div>
        <div className={this.props.user ? 'sidebar-div' : 'sidebar-userless'}>
          <Card className="sidebar-card">
            <Card.Header>users</Card.Header>
            {users}
          </Card>
        </div>
        <div className="container mt-5">
          <div className="margin-top">
            {pictures}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Pictures)
