import checkFiveYears from './checkFiveYears';

const difference = (date1, date2) => {
  return checkFiveYears(date1).diff(checkFiveYears(date2), 'days');
};

export default difference;
