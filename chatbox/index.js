import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const root = document.getElementById('root')
document.querySelector('body').setAttribute('style', 'margin: 0;')
root.setAttribute('style', 'height: 100vh; width: 100%;')
ReactDOM.render(<App />, root)
