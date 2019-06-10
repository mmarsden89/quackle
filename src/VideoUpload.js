import React, { Component } from 'react'
import apiUrl from './apiConfig'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

class Upload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: this.props.user,
      upload: {
        description: '',
        tag: '',
        url: '',
        owner: ''
      }
    }
  }

  handleChange = event => {
  // handle change
    const updatedField = {
      [event.target.name]: event.target.value
    }
    const uploaded = Object.assign(this.state.upload, updatedField)

    this.setState({ upload: uploaded })
  }
  success = data => {
  }

  failure = data => {
  }

  onCreatePicture = async event => {
    const { history } = this.props
    event.preventDefault()
    const metaData = this.state.upload
    const formData = new FormData(event.target)
    formData.description = metaData.description
    formData.tag = metaData.tag
    await axios({
      url: `${apiUrl}/uploads`,
      method: 'POST',
      headers: {
        Authorization: 'Token token=' + this.state.user.token
      },
      data: formData
    })
      .then(formData)
      .then(() => history.push('/'))
  }

  render () {
    return (
      <div className="upload-container">
        <form id="create" encType="multipart/form-data" onSubmit={this.onCreatePicture} className="upload-container">
          <input className="upload-input" required type="text" name="description" placeholder="description" onChange={this.handleChange} maxLength="160"/>
          <input className="upload-input" required type="text" name="tag" placeholder="#Tag" onChange={this.handleChange}/>
          <input className="file-input" required type="file" name="picture" accept="video/*" onChange={this.handleChange}/>
          <input id="btnCreatePicture" type="submit" className="upload-input btn btn-secondary"/>
        </form>
      </div>
    )
  }
}

export default withRouter(Upload)
