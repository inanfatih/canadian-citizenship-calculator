import React from 'react';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import difference from '../util/difference';
import Advertisement from '../components/Advertisement';

function Home() {
  const [data, setData] = React.useState({
    entryDate: null,
    isRefugeeClaimed: true,
    refugeeClaimDate: null,
    protectedPersonDate: null,
    prDate: null,
    istraveledAbroad: true,
    travelDates: [
      {
        exit: null,
        entry: null,
      },
    ],
    citizenshipDate: null,
    passedDays: 0,
  });

  const {
    entryDate,
    isRefugeeClaimed,
    refugeeClaimDate,
    protectedPersonDate,
    prDate,
    istraveledAbroad,
    travelDates,
    citizenshipDate,
    passedDays,
  } = data;

  const handleChange = (e) => {
    // console.log('dateInField', e);
    // console.log('e.target.value', e.target.value);
    // console.log('e.target.id', e.target.name);
    // console.log('e.target', e.target);

    setData({
      ...data,
      [e.target.name]:
        e.target.value === 'true'
          ? true
          : e.target.value === 'false'
          ? false
          : e.target.value,
    });
  };

  const addTravel = () => {
    setData({
      ...data,
      travelDates: [
        ...travelDates,
        {
          exit: null,
          entry: null,
        },
      ],
    });
  };
  const removeTravel = (index) => {
    setData({
      ...data,
      travelDates: [
        ...travelDates.slice(0, index),
        ...travelDates.slice(index + 1),
      ],
    });
  };

  let today = moment();

  const travelMultiplier = (date) => {
    if (isRefugeeClaimed) {
      if (date < entryDate) return 0;
      else if (date < refugeeClaimDate) return 0.5;
      else if (date < protectedPersonDate) return 0;
      else if (date < prDate) return 0.5;
      else return 1;
    } else {
      if (date < entryDate) return 0;
      else if (date < prDate) return 0.5;
      else return 1;
    }
  };

  const calculateCitizenshipDate = (event) => {
    event.preventDefault();

    if (isRefugeeClaimed && entryDate > refugeeClaimDate) {
      window.alert("Kanada'ya giriş tarihi iltica tarihinden sonra olamaz");
    } else if (isRefugeeClaimed && entryDate > protectedPersonDate) {
      window.alert(
        "Kanada'ya giriş tarihi mahkemeyi geçme tarihinden sonra olamaz",
      );
    } else if (isRefugeeClaimed && refugeeClaimDate > protectedPersonDate) {
      window.alert('İltica tarihi mahkemeyi geçme tarihinden sonra olamaz');
    } else if (isRefugeeClaimed && protectedPersonDate > prDate) {
      window.alert('Mahkemeyi geçme tarihi PR tarihinden sonra olamaz');
    } else if (isRefugeeClaimed && refugeeClaimDate > prDate) {
      window.alert('Refugee claim tarihi PR tarihinden sonra olamaz');
    } else if (entryDate > prDate) {
      window.alert("Kanada'ya giriş tarihi PR tarihinden sonra olamaz");
    } else if (istraveledAbroad) {
      data.travelDates.forEach((item, index) => {
        if (item.exit < entryDate) {
          window.alert(
            index +
              1 +
              ". sıradaki seyahatteki çıkış tarihi Kanada'ya ilk giriş tarihinden sonra olmalı",
          );
        } else if (item.entry < item.exit) {
          window.alert(
            index +
              1 +
              '. sıradaki seyahatteki giriş tarihi çıkış tarihinden sonra olmalı',
          );
        }
      });
    } else {
      let totalDays = 0;

      if (isRefugeeClaimed) {
        totalDays =
          ((difference(refugeeClaimDate, entryDate) +
            difference(prDate, protectedPersonDate)) /
            2 >
          365
            ? 365
            : (difference(refugeeClaimDate, entryDate) +
                difference(prDate, protectedPersonDate)) /
              2) + difference(today, prDate);
      } else {
        totalDays =
          (difference(prDate, entryDate) / 2 > 365
            ? 365
            : difference(prDate, entryDate) / 2) + difference(today, prDate);
      }

      let minusTraveledDays = 0;

      if (istraveledAbroad) {
        data.travelDates.forEach((item) => {
          minusTraveledDays =
            minusTraveledDays +
            difference(item.entry, item.exit) * travelMultiplier(item.entry);
        });
      }

      console.log('totaldays before', totalDays);
      totalDays = totalDays - minusTraveledDays;

      setData({
        ...data,
        citizenshipDate: moment()
          .add(1095 - Math.floor(totalDays), 'd')
          .format('DD-MM-YYYY'),
        passedDays: totalDays,
      });

      console.log('minusTraveledDays', minusTraveledDays);

      console.log('totaldays', totalDays);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div id='home'>
        <Advertisement />
        <div className='container'>
          <form onSubmit={calculateCitizenshipDate}>
            <Box
              style={{
                paddingTop: '20px',
                paddingRight: '20px',
              }}>
              <section className='section box'>
                <KeyboardDatePicker
                  style={{ color: 'white' }}
                  required
                  autoOk
                  disableFuture
                  className='date-picker'
                  margin='normal'
                  id='date-picker-dialog'
                  label="Kanada'ya giriş tarihi"
                  format='dd-MM-yyyy'
                  value={entryDate}
                  onChange={(date) => {
                    if (date !== null) {
                      setData({
                        ...data,
                        entryDate: date,
                      });
                    }
                  }}
                />
              </section>
              <section className='box'>
                <div className='text'> İltica talebinde bulundunuz mu?</div>
                <div className='section'>
                  <FormControl className='form-item flex-row'>
                    <FormLabel component='legend'></FormLabel>
                    <RadioGroup
                      row
                      name='isRefugeeClaimed'
                      value={isRefugeeClaimed}
                      onChange={handleChange}>
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label='Evet'
                      />
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label='Hayır'
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div>
                  {data.isRefugeeClaimed && (
                    <div className='section'>
                      <KeyboardDatePicker
                        className='date-picker'
                        autoOk
                        required
                        disableFuture
                        margin='normal'
                        id='date-picker-dialog'
                        label='İltica tarihi'
                        format='dd-MM-yyyy'
                        value={refugeeClaimDate}
                        helperText='Sarı kağıt üzerinde yazan tarih'
                        onChange={(date) => {
                          if (date !== null) {
                            setData({
                              ...data,
                              refugeeClaimDate: date,
                            });
                          }
                        }}
                      />

                      <KeyboardDatePicker
                        autoOk
                        required
                        disableFuture
                        className='date-picker'
                        margin='normal'
                        id='date-picker-dialog'
                        label='Mahkemeyi geçiş tarihi'
                        format='dd-MM-yyyy'
                        value={protectedPersonDate}
                        helperText='Karar metnindeki tarih'
                        onChange={(date) => {
                          if (date !== null) {
                            setData({
                              ...data,
                              protectedPersonDate: date,
                            });
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </section>
              <section className='section box'>
                <KeyboardDatePicker
                  autoOk
                  className='date-picker'
                  margin='normal'
                  disableFuture
                  id='date-picker-dialog'
                  label='PR tarihi'
                  format='dd-MM-yyyy'
                  required
                  value={prDate}
                  onChange={(date) => {
                    if (date !== null) {
                      setData({
                        ...data,
                        prDate: date,
                      });
                    }
                  }}
                />
              </section>
              <section className='box'>
                <div className='text'>
                  Giriş tarihinden sonra yurt dışına hiç çıkış yaptınız mı?
                </div>
                <div className='section'>
                  <FormControl component='fieldset' className='form-item'>
                    <RadioGroup
                      row
                      name='istraveledAbroad'
                      value={istraveledAbroad}
                      onChange={handleChange}>
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label='Evet'
                      />
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label='Hayır'
                      />
                    </RadioGroup>
                  </FormControl>
                </div>

                {data.istraveledAbroad && (
                  <div className='text-fields'>
                    {travelDates.map((item, index) => (
                      <div
                        key={index}
                        className='section date-picker multi-date-picker'>
                        <KeyboardDatePicker
                          className='date-picker'
                          autoOk
                          disableFuture
                          margin='normal'
                          id='date-picker-dialog'
                          label='Çıkış tarihi'
                          required
                          format='dd-MM-yyyy'
                          value={travelDates[index].exit}
                          onChange={(date) => {
                            if (date !== null) {
                              setData({
                                ...data,
                                travelDates: [
                                  ...travelDates.slice(0, index),
                                  {
                                    ...travelDates[index],
                                    exit: date,
                                  },
                                  ...travelDates.slice(index + 1),
                                ],
                              });
                            }
                          }}
                        />
                        <KeyboardDatePicker
                          autoOk
                          className='date-picker'
                          disableFuture
                          margin='normal'
                          required
                          id='date-picker-dialog'
                          label='Giriş tarihi'
                          format='dd-MM-yyyy'
                          value={travelDates[index].entry}
                          onChange={(date) => {
                            if (date !== null) {
                              setData({
                                ...data,
                                travelDates: [
                                  ...travelDates.slice(0, index),
                                  {
                                    ...travelDates[index],
                                    entry: date,
                                  },
                                  ...travelDates.slice(index + 1),
                                ],
                              });
                            }
                          }}
                        />
                        <Button
                          className='icon'
                          variant='outlined'
                          onClick={() => removeTravel(index)}>
                          <RemoveCircleIcon
                            color='secondary'
                            className='icon'
                          />
                          SİL{' '}
                        </Button>
                      </div>
                    ))}
                    <Box style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <Button
                        onClick={addTravel}
                        variant='contained'
                        color='secondary'
                        className='exit'>
                        <AddCircleIcon />
                        Yenİ çıkış ekle
                      </Button>
                    </Box>
                  </div>
                )}
              </section>
            </Box>
            <Box
              style={{
                paddingLeft: '10px',
                paddingRight: '10px',
                margin: '20px 0',
              }}>
              <Button
                variant='contained'
                color='primary'
                className='btn-hesapla'
                type='submit'>
                Hesapla
              </Button>
            </Box>

            <div>Geçen Gün Sayısı: {passedDays}</div>
            <div>
              Kalan Gün Sayısı: {1095 - (passedDays > 1095 ? 1095 : passedDays)}
            </div>
            <div>Vatandaşlık hakediş tarihi: {citizenshipDate}</div>
          </form>
        </div>
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default Home;
