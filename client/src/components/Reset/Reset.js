import React from 'react'

import './Reset.css'

const Reset = ({reset}) => {
  return (
    <div>
      <button className='reset' onClick={reset}>Reset</button>
    </div>
  )
}

export default Reset