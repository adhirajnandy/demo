import { Spinner } from "react-bootstrap";
import React from 'react';

const Loader = () => {
  return (
    <div
      style={{
        position: 'fixed', // Positioning the loader fixed to the viewport
        top: '50%', // Centering vertically
        left: '50%', // Centering horizontally
        transform: 'translate(-50%, -50%)', // Adjusting for centering effect
        zIndex: 9999, // Ensuring it appears on top of other content
      }}
    >
      <Spinner
        animation="border"
        role="status"
        style={{
          width: '100px',
          height: '100px',
          margin: 'auto',
          display: 'block',
        }}
      />
    </div>
  );
};

export default Loader;
