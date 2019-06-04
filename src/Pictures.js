import apiUrl from './apiConfig'
import React, { Component } from 'react'
import axios from 'axios'
import { Link, withRouter } from 'react-router-dom'
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
    console.log(this.props.user)
    const pictures = this.state.pictures.map(picture => (
      <Card key={picture._id}>
        <Card.Header className="card-header"><p>@{picture.owner.username || 'unknown'}</p> <Link to={'/uploads/' + picture._id}>see post</Link></Card.Header>
        <Card.Img variant="top" src={picture.url} />
        <Card.Footer>
          { this.props.user ? <Card.Img className="duck-like" src="https://i.imgur.com/nWCiT5Z.png"/> : 'no' }
          <Card.Text><b>@{picture.owner.username || 'unknown'} - </b>{picture.title || picture.description}</Card.Text>
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
