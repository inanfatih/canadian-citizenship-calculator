import React from 'react';

function Home() {
  const personObject = {
    entryDate: '2016-08-30',
    isRefugeeClaimed: true,
    refugeeClaimDate: '2016-10-30',
    protectedPersonDate: '2017-03-01',
    prDate: '2018-10-30',
    traveledOutsideCountry: false,
    travelDates: [
      { exit: '2018-12-01', entry: '2019-01-01' },
      { exit: '2018-12-01', entry: '2019-01-01' },
    ],
    citizenshipDate: '2020-12-01',
  };
  return <div></div>;
}

export default Home;
