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

  destroyPicture = async (id) => {
    await axios.delete(`${apiUrl}/uploads/${id}`)
    this.setState({ deleted: true })
  }

  render () {
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
            <Card.Text><span><b>@{picture.owner.username || 'unknown'} - </b><p>{picture.title || picture.description}</p></span></Card.Text>
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
