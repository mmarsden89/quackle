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

  render () {
    const pictures = this.state.pictures.map(picture => (
      <Card key={picture._id}>
        <Card.Header className="card-header"><p>@{picture.owner.username || 'unknown'}</p></Card.Header>
        <Link to={'/uploads/' + picture._id}><Card.Img variant="top" src={picture.url} /></Link>
        <Card.Footer>
          { this.props.user ? (picture.likes.includes(this.props.user._id) ? <Card.Img className="duck-like" src='https://i.imgur.com/1gqZnEN.png' onClick={this.smashThatLike} id={picture._id}/> : <Card.Img className="duck-like" src="https://i.imgur.com/nWCiT5Z.png" onClick={this.smashThatLike} id={picture._id}/>) : 'no' }
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
