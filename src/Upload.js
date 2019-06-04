import React, { Component } from 'react'
import apiUrl from './apiConfig'
import axios from 'axios'

class Upload extends Component {
  constructor (props) {
    super(props)
    console.log('&&&&&&')
    console.log(props)
    this.state = {
      user: this.props.user,
      upload: {
        title: '',
        url: '',
        owner: ''
      },
      createdPictureId: null
    }
  }

  // const onCreatePicture = (event) => {
  // event.preventDefault()
  // const metaData = getFormFields(event.target)
  // const formData = new FormData(event.target)
  // formData.title = metaData.title
  // formData.tag = metaData.tag
  // // console.log('formdata', formData)
  // $.ajax({
  //   url: config.apiUrl + '/pictures',
  //   data: formData,
  //   contentType: false,
  //   processData: false,
  //   type: 'POST',
  //   headers: {
  //     Authorization: 'Token token=' + store.user.token
  //   }
  // })
  //   .then(ui.onCreatePictureSuccess)
  //   .then(getPictures)
  //   .catch(ui.createPictureFailure)

  // export const signOut = user => {
  //   return axios({
  //     url: apiUrl + '/sign-out',
  //     method: 'DELETE',
  //     headers: {
  //       'Authorization': `Token token=${user.token}`
  //     }
  //   })
  // }

  handleChange = event => {
  // handle change
    const updatedField = {
      [event.target.name]: event.target.value
    }
    const uploaded = Object.assign(this.state.upload, updatedField)

    this.setState({ upload: uploaded })
  }
  success = data => {
    console.log(data)
  }

  failure = data => {
    console.log(data)
  }

  onCreatePicture = async event => {
    event.preventDefault()
    const metaData = this.state.upload
    const formData = new FormData(event.target)
    formData.title = metaData.title
    formData.tag = metaData.tag
    console.log(this.state.user.token)
    // console.log('formdata', formData)
    await axios({
      url: `${apiUrl}/uploads`,
      method: 'POST',
      headers: {
        Authorization: 'Token token=' + this.state.user.token
      },
      data: formData
    })
      .then(formData)
      .catch(console.log('eeyo'))
  }

  render () {
    return (
      <div>
        <form id="create" encType="multipart/form-data" onSubmit={this.onCreatePicture}>
          <input required type="text" name="title" placeholder="Title" onChange={this.handleChange}/>
          <input type="text" name="tag" placeholder="Tag" onChange={this.handleChange}/>
          <input required type="file" name="picture" onChange={this.handleChange}/>
          <input id="btnCreatePicture" type="submit" className="btn btn-secondary"/>
        </form>
      </div>
    )
  }
}

export default Upload
