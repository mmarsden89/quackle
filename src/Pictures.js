import apiUrl from './apiConfig'
import React, { Component } from 'react'
import axios from 'axios'
import { Link, withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const moment = require('moment')

class Pictures extends Component {
  constructor (props) {
    super(props)

    this.state = {
      pictures: [],
      comment: '',
      liked: false,
      users: []
    }
  }

  currentUserInfo = this.props.user

  async componentDidMount () {
    const response = await axios(`${apiUrl}/uploads`)
    this.setState({ pictures: response.data.uploads })
    const userResponse = await axios(`${apiUrl}/users`)
    this.setState({ users: userResponse.data.users })
    this.setState({ comment: ' ' })
  }

  toggleLike = () => this.setState(prevState => {
    return { liked: !prevState.liked }
  })

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

  onSendToUser = async event => {
    console.log(event.target.dataset.pictureowner)
    await axios({
      url: `${apiUrl}/users/${this.props.user._id}`,
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
    this.componentDidMount()
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
      url: apiUrl + `/follow/${id}`,
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
    this.toggleLike()
    const id = event.target.id
    await axios({
      url: apiUrl + `/likes/${id}`,
      method: 'PATCH',
      headers: { Authorization: 'Token token=' + this.props.user.token },
      data: {
        upload: {
          likes: this.props.user.username || this.props.user._id
        } }
    })
    this.componentDidMount()
  }

  render () {
    const { comment } = this.state
    const currentUser = (
      <div>
        <span>
          {this.props.user ? <Link to={'/profile/' + this.props.user._id}><img src={this.props.user.profile} className="avatar-pictures"/></Link> : ''}
          {this.props.user ? <Link className="sidebar-p-span" to={'/profile/' + this.props.user._id}><p className="sidebar-p-span">&nbsp;&nbsp;&nbsp;&nbsp;{ this.props.user.username || this.props.user.email}</p></Link> : ''}
        </span>
      </div>
    )

    const users = this.state.users.reverse().map(user => (
      <div key={user._id} className="sidebar-container">
        <Link to={'/profile/' + user._id}><Card.Img src={user.profile} className="avatar-pictures"/></Link>
        <div>
          <Link to={'/profile/' + user._id}><p className="sidebar-small">{user.username || user.email}</p></Link>
          <p className="sidebar-super-small">{moment(user.updatedAt).fromNow()}</p>
        </div>
      </div>
    ))
    const pictures = this.state.pictures.filter(function (pic) {
      return pic.description !== 'Profile'
    }).reverse().map(picture => (
      <Card key={picture._id} className="card">
        <Card.Header className="card-header">
          <Link to={'/profile/' + picture.owner._id}><Card.Img src={picture.owner.profile} className="avatar-pictures"/></Link>
          <Link to={'/profile/' + picture.owner._id} className="nohover"><p className="card-picture-p">{picture.owner.username || 'unknown'}</p></Link>
          {this.props.user ? (picture.owner._id === this.props.user._id ? <Button onClick={this.deletePost} id={picture._id} className="card-header-right btn-danger">Delete</Button>
            : <Button onClick={this.handleFollow} data-id={this.props.user.username || this.props.user.email} id={picture.owner._id}
              data-pictureowner={picture.owner.username || picture.owner.email} className="card-header-right">Follow</Button>) : ''}
        </Card.Header>
        <Link to={'/uploads/' + picture._id}><Card.Img variant="top" src={picture.url} /></Link>
        <Card.Footer>
          { this.props.user ? (picture.likes.includes(this.props.user.username)
            ? <Card.Img className="duck-like" src='https://i.imgur.com/1gqZnEN.png'
              onClick={this.smashThatLike} id={picture._id}/>
            : <Card.Img className="duck-like" src="https://i.imgur.com/nWCiT5Z.png"
              onClick={this.smashThatLike} id={picture._id}/>) : '' }
          <Card.Text>liked by <b>{picture.likes.length}</b> ducks</Card.Text>
          <Card.Text className="picture-description"><b>@{picture.owner.username || 'unknown'} - </b>{picture.title || picture.description} #{picture.tag || 'notags'}</Card.Text>
          {picture.comments.map(comment =>
            <Card.Text key={comment._id} className="picture-description"><b>{comment.owner.username || comment.owner._id} - </b>{comment.text}</Card.Text>
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
            />
            <Button type="submit" className="comment-button">Post</Button>
          </form>
        </Card.Footer>
          : '' }
      </Card>
    ))

    return (
      <div>
        <div className="sidebar-user">
          {currentUser}
        </div>
        <div className={this.props.user ? 'sidebar-div' : 'sidebar-userless'}>
          <Card className="sidebar-card">
            <Card.Header>users</Card.Header>
            {users}
          </Card>
        </div>
        <div className="pictures">
          <h5>Total images: {pictures.length}</h5>
        </div>
        <ol>
          {pictures}
        </ol>
      </div>
    )
  }
}

export default withRouter(Pictures)
