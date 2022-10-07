import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
// import ReactDOM from 'react-dom';
import SignaturePad from "react-signature-canvas";
import { Button } from "react-bootstrap";

const Signature = ({
  setImageURL,
  ...props
}) => {

  // const [imageURL, setImageURL] = useState(null);

  // const [sigPad, setSigPad] = useState({});
  const sigCanvas = useRef({});

  const clear = () => {
    console.log("clear called");
    // setSigPad({});
    sigCanvas.current.clear();
  }

  const save = () => {
    // setTrimmedDataUrl(sigPad.getTrimmedCanvas().toDataURL("image/png"));
    setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <SignaturePad
            ref={sigCanvas}
            canvasProps={{
              className: "signatureCanvas"
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          {/* Button to trigger save canvas image */}
          <Button onClick={save}>Save</Button>
          <Button onClick={clear}>Clear</Button>
        </div>
      </div>
    </div>
  )
}

Signature.propTypes = {
  setImageURL: PropTypes.func.isRequired
}

export default Signature;

