import React, { Component } from 'react'
// import { Link, Redirect } from 'react-router-dom'
import { withRouter, Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'

// import apiUrl from './apiConfig'
// import axios from 'axios'

// const moment = require('moment')

class Settings extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <div className="modal-container">
        <Modal.Dialog className="modal-dialog">
          <Modal.Header>
            <Link to="/change-password"><Modal.Title className="modal-title">Change Password</Modal.Title></Link>
          </Modal.Header>

          <Modal.Header>
            <Link to="/sign-out"><Modal.Title className="modal-title">Sign Out</Modal.Title></Link>
          </Modal.Header>

          <Modal.Header>
            <Link to="/"><Modal.Title className="modal-title">Cancel</Modal.Title></Link>
          </Modal.Header>
        </Modal.Dialog>
      </div>
    )
  }
}

export default withRouter(Settings)
