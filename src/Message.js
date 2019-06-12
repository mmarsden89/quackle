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
        lastMessage: []
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

  getChat = async id => {
    const chatResponse = await axios({
      url: apiUrl + '/chats/' + id,
      method: 'GET',
      headers: {
        'Authorization': `Token token=${this.props.user.token}`
      }
    })
    console.log(chatResponse)
    this.setState({ currentMessage: chatResponse.data.chat, lastMessage: chatResponse.data.messages })
  }

  createMessage = async event => {
    event.preventDefault()
    event.persist()
    await axios({
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
    this.setState({ body: '' })
    return this.getChat(event.target.id)
  }

  render () {
    const { body } = this.state
    const userChats = this.state.userchats.filter(chat => {
      console.log('...', chat)
      return chat.user1._id !== this.props.user._id || chat.user2._id !== this.props.user._id
    }).map(chat => (
      <div key={chat._id}>
        <button id={chat._id} onClick={this.handleClick}>{chat.user1.username !== this.props.user.username ? chat.user1.username
          : chat.user2.username}</button>
      </div>
    ))
    const userHtml = this.state.users.filter(user => {
      return user._id !== this.props.user._id
    }).map(user => (
      <div key={user._id}>
        <button id={user._id} onClick={this.createChat}>{user.username}</button>
      </div>
    ))
    const currentMessage = (
      <div>
        {this.state.currentMessage ? this.state.currentMessage.lastMessage.map(message => (
          <div key={message.id}>
            {message.owner._id === this.props.user._id ? <span className="message-right">
              <p className="yellow">{message.body}</p>
              <img src={message.owner.profile} className="avatar-pictures"/>
            </span> : <span className="message-left">
              <img src={message.owner.profile} className="avatar-pictures"/>
              <p className="grey">{message.body}</p>
            </span>}
          </div>
        )) : ''}
        {this.state.currentMessage
          ? <form id={this.state.currentMessage._id} onSubmit={this.createMessage}>
            <input
              name="body"
              value={body}
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
        <div className="margin-top">
          {userChats}
        </div>
        <div className="margin-top">
          {userHtml}
        </div>
        {this.state.currentMessage ? currentMessage : ''}
      </div>
    )
  }
}

export default withRouter(Message)
