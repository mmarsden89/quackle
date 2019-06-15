import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { animateScroll } from 'react-scroll'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

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
        messages: []
      },
      body: '',
      userMessages: [],
      userMessages2: []
    }
  }

  scrollToBottom () {
    animateScroll.scrollToBottom({
      containerId: 'chat-window'
    })
  }

  async componentDidMount () {
    const userResponse = await axios(`${apiUrl}/users`)
    this.setState({ users: userResponse.data.users })
    const userChats = await axios(`${apiUrl}/chats`)
    this.setState({ userchats: userChats.data.chats })
  }

  createChat = async (event, user) => {
    const userResponse = await axios(`${apiUrl}/users/${event.target.id}`)
    this.setState({ targetUser: userResponse.data.user })
    if (this.state.targetUser) {
      await axios({
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
    this.setState({ state: this.state })
    this.setState({ userMessages: this.state.userMessages.concat(this.state.targetUser) })
    this.componentDidMount()
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
    this.setState({ currentMessage: chatResponse.data.chat }, this.scrollToBottom)
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
    const { body, userMessages } = this.state
    const userChats = this.state.userchats.filter(chat => {
      if (chat.user1._id === this.props.user._id || chat.user2._id === this.props.user._id) {
        userMessages.push(chat.user1.username)
        userMessages.push(chat.user2.username)
      }
      return chat.user1._id === this.props.user._id || chat.user2._id === this.props.user._id
    }).map(chat => (
      <div key={chat._id} className="margin-top-5 margin-left-5">
        <span id={chat._id}><img src={chat.user1.username !== this.props.user.username
          ? chat.user1.profile
          : chat.user2.profile} className="avatar-pictures hand-hover" id={chat._id}
        onClick={this.handleClick}/>
        <p onClick={this.handleClick} id={chat._id}
          className="hand-hover chat-sidebar">{chat.user1.username !== this.props.user.username
            ? chat.user1.username
            : chat.user2.username}</p>
        <p className="chat-super-small">{chat.lastMessage ? chat.lastMessage.body.substring(0, 20) : ''}</p></span>
      </div>
    ))
    const userHtml = this.state.users.filter(user => {
      return user._id !== this.props.user._id && !userMessages.includes(user.username)
    }).map(user => (
      <div key={user._id}>
        <span>
          <img src={user.profile} id={user._id} onClick={this.createChat} className="avatar-pictures hand-hover"/>
          <p onClick={this.createChat} className="hand-hover">{user.username}</p>
          <FontAwesomeIcon className="icon-sm hand-hover" icon={faPlusCircle} onClick={this.createChat}/>
        </span>
      </div>
    ))
    const currentMessage = (
      <div>
        <div className="chat-window" id="chat-window" onLoad={this.scrollToBottom}>
          {this.state.currentMessage ? this.state.currentMessage.messages.map(message => (
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
        </div>
        {this.state.currentMessage
          ? <form id={this.state.currentMessage._id} onSubmit={this.createMessage} className="chat-input">
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
        <div className="margin-top user-list">
          {userChats}
        </div>
        <div className="margin-top not-added-list">
          {userHtml}
        </div>
        <div>
          {this.state.currentMessage ? currentMessage : ''}
        </div>
      </div>
    )
  }
}

export default withRouter(Message)
