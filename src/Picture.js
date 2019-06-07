import React, { Component } from 'react'
// import { Link, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import apiUrl from './apiConfig'
import axios from 'axios'

const moment = require('moment')

class Picture extends Component {
  constructor (props) {
    super(props)
    this.state = {
      picture: null,
      comment: '',
      deleted: false,
      liked: false
    }
  }

  async componentDidMount () {
    const response = await axios(`${apiUrl}/uploads/${this.props.match.params.id}`)
    this.setState({ picture: response.data.upload })
    this.setState({ comment: ' ' })
  }

  handleChange = event => {
    const updatedField = {
      [event.target.name]: event.target.value
    }
    console.log(updatedField)
    const comment = Object.assign(this.state.comment, updatedField)
    this.setState({ comment: comment.comment })
  }

  smashThatLike = async event => {
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

  destroyPicture = async event => {
    await axios({
      url: `${apiUrl}/uploads/${this.props.match.params.id}`,
      method: 'DELETE',
      headers: { Authorization: 'Token token=' + this.props.user.token }
    })
  }

  createComment = async event => {
    event.preventDefault()
    console.log('uuuuuu', event.target)
    const id = event.target.id
    await axios({
      url: apiUrl + '/comments',
      method: 'POST',
      headers: { Authorization: 'Token token=' + this.props.user.token },
      data: {
        comment: {
          'picture': `${id}`,
          'text': `${this.state.comment}`,
          'username': `${this.props.user.username}`
        }
      }
    })
    this.componentDidMount()
  }

  render () {
    console.log(this.props)
    const { picture, comment } = this.state
    console.log(picture)
    if (!picture) {
      return (
        <div>
    return <p>Loading..</p>
        </div>
      )
    }

    const pictureHtml = (
      <div className="individual-picture-div">
        <div className="image-background">
          <img src={picture.url} className="individual-picture"/>
        </div>
        <Card key={picture._id} className="single-post">
          <Card.Header className="card-header"><p>@{picture.owner.username || 'unknown'}</p></Card.Header>
          <Card.Text><b>@{picture.owner.username || 'unknown'} - </b>{picture.title || picture.description}</Card.Text>
          <Card.Text>#{picture.tag || 'notags'}</Card.Text>
          <small className="text-muted">Last updated {moment(picture.updatedAt).fromNow()}</small>
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
          {this.props.user ? <Card.Footer className="card-footer-stick">
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
      </div>
    )

    return (
      <div>
        {pictureHtml}
      </div>
    )
  }
}

export default withRouter(Picture)
