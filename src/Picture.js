import React, { Component } from 'react'
// import { Link, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

import apiUrl from './apiConfig'
import axios from 'axios'

const moment = require('moment')

class Picture extends Component {
  constructor (props) {
    super(props)
    console.log('these are props', props)
    this.state = {
      picture: null,
      deleted: false
    }
  }

  async componentDidMount () {
    const response = await axios(`${apiUrl}/uploads/${this.props.match.params.id}`)
    this.setState({ picture: response.data.upload })
    console.log(response)
    console.log(this.state.picture.url)
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
  }

  destroyPicture = async event => {
    await axios({
      url: `${apiUrl}/uploads/${this.props.match.params.id}`,
      method: 'DELETE',
      headers: { Authorization: 'Token token=' + this.props.user.token }
    })
  }

  render () {
    console.log(this.props)
    const { picture } = this.state
    console.log(picture)
    if (!picture) {
      return (
        <div>
    return <p>Loading..</p>
        </div>
      )
    }

    const pictureHtml = (
      <div>
        <Card key={picture._id} className="single-post">
          <Card.Header className="card-header"><p>@{picture.owner.username || 'unknown'}</p></Card.Header>
          <Card.Img variant="top" src={picture.url} />
          <Card.Footer>
            <Card.Text><b>@{picture.owner.username || 'unknown'} - </b>{picture.title || picture.description}</Card.Text>
            <Card.Text>#{picture.tag || 'notags'}</Card.Text>
            <small className="text-muted">Last updated {moment(picture.updatedAt).fromNow()}</small>
          </Card.Footer>
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
