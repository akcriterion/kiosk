import React from "react";
import "./block-ui.css";

const BlockUI = props => {
  if (!props.blocking) {
    return "";
  } else {
    return (
      <div className="block-ui-container">
        <div className="block-ui-overlay" />
        <div className="block-ui-message-container">
          <div className="block-ui-message">
            <h4>{props.title}</h4>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        
      </div>
    );
  }
};
 
BlockUI.defaultProps = { 
  blocking: false,
  title: "Loading..."
};
 
export default BlockUI;
