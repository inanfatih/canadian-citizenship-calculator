import moment from 'moment';

const checkFiveYears = (date) => {
  const fiveYearsAgo = moment().subtract(5, 'years');
  if (fiveYearsAgo < moment(date)) return moment(date);
  else return fiveYearsAgo;
};

export default checkFiveYears;
