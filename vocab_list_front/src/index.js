import React from 'react'
import ReactDOM from 'react-dom'
import './css/bootstrap.min.css'
import './css/index.css'
import './css/react_tagsinput.css'
import App from './models/App'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <Router><App /></Router>
  </React.StrictMode>,
  document.getElementById('root')
)

