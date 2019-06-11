import React, { Component } from 'react'
// import { Link, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
// import Image from 'react-bootstrap/Image'
// import Modal from 'react-bootstrap/Modal'

import apiUrl from './apiConfig'
import axios from 'axios'

class Message extends Component {
  constructor (props) {
    super(props)

    this.state = {
      pictures: [],
      show: false,
      users: [],
      messages: [],
      user: {},
      currentMessage: null
    }
  }

  async componentDidMount () {
    const userResponse = await axios(`${apiUrl}/users`)
    this.setState({ users: userResponse.data.users })
    const messageResponse = await axios(`${apiUrl}/messages`)
    this.setState({ messages: messageResponse.data.messages })
    this.setState({ user: this.props.user })
  }

  createNewChat = async event => {
    const { user } = this.props
    const id = event.target.id
    console.log(id)
    if (this.state.messages.some(function (message) {
      return (message.user._id !== user._id && message.user2._id !== id) ||
      (message.user._id !== id && message.user2._id !== user._id)
    })) {
      this.setState({ currentMessage: this.state.messages.find(function (message) {
        return (message.user._id === user._id && message.user2._id === id) ||
        (message.user._id === id && message.user2._id === user._id)
      }) })
      console.log('yo', this.state.currentMessage)
    } else {
      await axios({
        url: apiUrl + '/messages',
        method: 'POST',
        headers: { Authorization: 'Token token=' + this.props.user.token },
        data: {
          message: {
            'user': `${user._id}`,
            'user2': `${id}`
          }
        }
      })
    }
    this.componentDidMount()
  }

  render () {
    const userHtml = this.state.users.map(targetUser => (
      <div key={targetUser._id}>
        <p id={targetUser._id} onClick={this.createNewChat}>{targetUser.username}</p>
      </div>
    ))
    const messageHtml = (
      <div>
        <p>{this.state.currentMessage ? this.state.currentMessage.user.username : ''}</p>
        <p>{this.state.currentMessage ? this.state.currentMessage.user2.username : ''}</p>
        <p>hello</p>
      </div>
    )
    return (
      <div>
        <div className="margin-top">
          {userHtml}
        </div>
        <div className="margin-top">
          {messageHtml}
        </div>
      </div>
    )
  }
}

export default withRouter(Message)
