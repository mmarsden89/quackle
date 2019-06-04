import React, { Component } from 'react'
// import { Link, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import apiUrl from './apiConfig'
import axios from 'axios'

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
        <img src={picture.url}/>
        <p>{picture.title}</p>
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
