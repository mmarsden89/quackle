import apiUrl from './apiConfig'
import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
const moment = require('moment')

class Pictures extends Component {
  constructor (props) {
    super(props)

    this.state = {
      pictures: []
    }
  }

  async componentDidMount () {
    const response = await axios(`${apiUrl}/uploads`)
    this.setState({ pictures: response.data.uploads })
  }

  render () {
    const pictures = this.state.pictures.map(picture => (
      <Card key={picture._id}>
        <Card.Header>@{picture.owner.username || 'unknown'}</Card.Header>
        <Card.Img variant="top" src={picture.url} />
        <Card.Footer>
          <Card.Text><span><b>@{picture.owner.username || 'unknown'} - </b><p>{picture.title || picture.description}</p></span></Card.Text>
          <Card.Text>#{picture.tag || 'notags'}</Card.Text>
          <small className="text-muted">Last updated {moment(picture.updatedAt).fromNow()}</small>
        </Card.Footer>
      </Card>
    ))

    return (
      <div>
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
