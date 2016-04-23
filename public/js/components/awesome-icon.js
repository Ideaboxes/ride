import React from 'react';

function AwesomeIcon({ icon }) {
  return <i className={`fa fa-${icon}`}></i>;
}

AwesomeIcon.propTypes = {
  icon: React.PropTypes.string,
};

export default AwesomeIcon;
