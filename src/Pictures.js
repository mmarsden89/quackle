import React, { Component } from 'react'
import axios from 'axios'

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
      <div key={picture._id}>
        <img src={picture.url}/>
      </div>
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

export default Pictures
