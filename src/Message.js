import React, { Component } from 'react'
// import { Link, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
// import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'

import apiUrl from './apiConfig'
import axios from 'axios'

class Message extends Component {
  constructor (props) {
    super(props)

    this.state = {
      users: [],
      user: {},
      targetUser: {},
      userchats: [],
      currentMessage: {
        user1: {
          username: ''
        },
        user2: {
          username: ''
        },
        lastMessage: {
          body: ''
        }
      },
      body: ''
    }
  }

  async componentDidMount () {
    console.log(this.props)
    const userResponse = await axios(`${apiUrl}/users`)
    this.setState({ users: userResponse.data.users })
    const userChats = await axios({
      url: apiUrl + '/chats',
      method: 'GET',
      headers: { 'Authorization': `Token token=${this.props.user.token}` }
    })
    this.setState({ userchats: userChats.data.chats })
  }

  createChat = async (event, user) => {
    const userResponse = await axios(`${apiUrl}/users/${event.target.id}`)
    console.log(userResponse.data.user)
    this.setState({ targetUser: userResponse.data.user })
    console.log(this.state.targetUser)
    if (this.state.targetUser) {
      return axios({
        url: `${apiUrl}/chats`,
        method: 'POST',
        headers: { 'Authorization': 'Token token=' + this.props.user.token },
        data: {
          chat: {
            user1: this.props.user,
            user2: this.state.targetUser
          }
        }
      })
    }
  }

  handleChange = event => {
  // handle change
    const updatedField = {
      [event.target.name]: event.target.value
    }
    const body = Object.assign(this.state.body, updatedField)
    this.setState({ body: body.body })
  }

  handleClick = async event => {
    console.log(event.target.id)
    const chatResponse = await axios({
      url: apiUrl + '/chats/' + event.target.id,
      method: 'GET',
      headers: {
        'Authorization': `Token token=${this.props.user.token}`
      }
    })
    this.setState({ currentMessage: chatResponse.data.chat })
  }

  getChat = function (id) {
    return axios({
      url: apiUrl + '/chats/' + id,
      method: 'GET',
      headers: {
        'Authorization': `Token token=${this.props.user.token}`
      }
    })
  }

  createMessage = event => {
    event.preventDefault()
    return axios({
      url: `${apiUrl}/messages`,
      method: 'POST',
      headers: {
        'Authorization': `Token token=${this.props.user.token}`
      },
      data: {
        message: {
          body: this.state.body,
          chat: event.target.id
        }
      }
    })
  }

  render () {
    const userChats = this.state.userchats.map(chat => (
      <div key={chat._id} className="margin-top">
        <button id={chat._id} onClick={this.handleClick}>{chat.user1.username !== this.props.user.username ? chat.user1.username
          : chat.user2.username}</button>
      </div>
    ))
    const userHtml = this.state.users.map(users => (
      <div key={users._id} className="margin-top">
        <button id={users._id} onClick={this.createChat}>{users.username}</button>
      </div>
    ))
    const currentMessage = (
      <div>
        <p>{this.state.currentMessage ? this.state.currentMessage.user1.username : ''}</p>
        <p>{this.state.currentMessage ? this.state.currentMessage.user2.username : ''}</p>
        <p>{this.state.currentMessage ? this.state.currentMessage.lastMessage.body : ''}</p>
        {this.state.currentMessage
          ? <form id={this.state.currentMessage._id} onSubmit={this.createMessage}>
            <input
              name="body"
              placeholder="Add a message..."
              onChange={this.handleChange}
              className="form-border"
            />
            <Button type="submit" className="comment-button">Post</Button>
          </form> : ''}
      </div>
    )
    return (
      <div>
        {userChats}
        {userHtml}
        {this.state.currentMessage ? currentMessage : ''}
      </div>
    )
  }
}

export default withRouter(Message)
