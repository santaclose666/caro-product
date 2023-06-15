import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import './Alert.css'

const Alert = (props) => {
  const msg = props.msg
  
  const handleClose = () => {
    props.onClose()
  };

  return (
    <div>
      <div className="modal">
        <div className="modal-content">
          <h2 className="actionGame">Warning!</h2>
          <div className="msgAlert">
            {msg}
          </div>
          <button onClick={handleClose} className="close-modal">
            <AiOutlineCloseCircle />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
