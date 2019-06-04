import React, { Component } from 'react'
import axios from 'axios'
import { Link, withRouter } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

import apiUrl from './apiConfig'

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
        <Card.Img variant="top" src={picture.url} />
        <Link to={'/uploads/' + picture._id}><p>{picture.title}</p></Link>
        <Card.Footer>
          <small className="text-muted">Last updated 3 mins ago</small>
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
