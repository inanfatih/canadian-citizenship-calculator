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
import difference from '../util/difference';

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
      window.alert(
        "Kanada'ya giris tarihi Refugee Claim tarihinden sonra olamaz",
      );
    } else if (isRefugeeClaimed && entryDate > protectedPersonDate) {
      window.alert(
        "Kanada'ya giris tarihi mahkemeyi gecme tarihinden sonra olamaz",
      );
    } else if (isRefugeeClaimed && refugeeClaimDate > protectedPersonDate) {
      window.alert(
        'Refugee claim tarihi mahkemeyi gecme tarihinden sonra olamaz',
      );
    } else if (isRefugeeClaimed && protectedPersonDate > prDate) {
      window.alert('Mahkemeyi gecme tarihi PR tarihinden sonra olamaz');
    } else if (isRefugeeClaimed && refugeeClaimDate > prDate) {
      window.alert('Refugee claim tarihi PR tarihinden sonra olamaz');
    } else if (entryDate > prDate) {
      window.alert("Kanada'ya giris tarihi PR tarihinden sonra olamaz");
    } else if (istraveledAbroad) {
      data.travelDates.forEach((item, index) => {
        if (item.exit < entryDate) {
          window.alert(
            index +
              1 +
              ". siradaki seyahatteki cikis tarihi Kanada'ya ilk giris tarihinden sonra olmali",
          );
        } else if (item.entry < item.exit) {
          window.alert(
            index +
              1 +
              '. siradaki seyahatteki giris tarihi cikis tarihinden sonra olmali',
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
        <div className='container'>
          <form onSubmit={calculateCitizenshipDate}>
            <section className='section'>
              <KeyboardDatePicker
                style={{ color: 'white' }}
                required
                autoOk
                disableFuture
                className='date-picker'
                margin='normal'
                id='date-picker-dialog'
                label="Kanada'ya Giriş Tarihi"
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
            <div className='form-item flex-row'>
              <FormLabel component='legend'>Refugee Claim ettiniz mi</FormLabel>
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
                  label='Hayir'
                />
              </RadioGroup>
            </div>
            {data.isRefugeeClaimed && (
              <div>
                <KeyboardDatePicker
                  className='form-item'
                  autoOk
                  required
                  disableFuture
                  margin='normal'
                  id='date-picker-dialog'
                  label='Refugee Claim Tarihi'
                  format='dd-MM-yyyy'
                  value={refugeeClaimDate}
                  helperText='Sari kagit uzerinde yazan tarih'
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
                  className='form-item'
                  margin='normal'
                  id='date-picker-dialog'
                  label='Mahkemeyi gecis tarihi'
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
            <KeyboardDatePicker
              autoOk
              className='form-item'
              margin='normal'
              disableFuture
              id='date-picker-dialog'
              label='PR Tarihi'
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
            <br />
            <FormControl component='fieldset' className='form-item'>
              <FormLabel component='legend'>
                Yurtdisina cikis yaptiniz mi?
              </FormLabel>
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
                  label='Hayir'
                />
              </RadioGroup>
            </FormControl>
            {data.istraveledAbroad && (
              <div className='text-fields'>
                {travelDates.map((item, index) => (
                  <div key={index}>
                    <KeyboardDatePicker
                      autoOk
                      disableFuture
                      className='form-item'
                      margin='normal'
                      id='date-picker-dialog'
                      label='Cikis Tarihi'
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
                      disableFuture
                      className='form-item'
                      margin='normal'
                      required
                      id='date-picker-dialog'
                      label='Giris Tarihi'
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
                    <Button className='icon'>
                      <RemoveCircleIcon onClick={() => removeTravel(index)} />
                    </Button>
                  </div>
                ))}
                <Button onClick={addTravel}>
                  Yeni cikis ekle <AddCircleIcon />
                </Button>
              </div>
            )}
            <Button
              variant='contained'
              color='secondary'
              className='btn'
              type='submit'>
              Hesapla
            </Button>
            <div>Gecen Gun Sayisi: {passedDays}</div>
            <div>
              Kalan Gun Sayisi: {1095 - (passedDays > 1095 ? 1095 : passedDays)}
            </div>
            <div>Vatandaslik hakedis tarihi: {citizenshipDate}</div>
          </form>
        </div>
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default Home;
