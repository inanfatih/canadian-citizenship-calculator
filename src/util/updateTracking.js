import React from 'react';
const updateTracking = () => {
  window.ga('send', 'pageview', {
    page: window.location.pathname,
  });
  return <div></div>;
};

export default updateTracking;
