import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import difference from '../util/difference';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';

function Home() {
  useEffect(() => {}, []);

  const [data, setData] = useState({
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
    remainingDays: 1095,
  });

  const [isCalculated, setIsCalculated] = useState(false);

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
    // remainingDays,
  } = data;

  const handleChange = (e) => {
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

  const compareDates = (date1, date2) => {
    return moment(date1) > moment(date2) ? true : false;
  };

  const calculateCitizenshipDate = (event) => {
    event.preventDefault();

    console.log('data', data);

    if (entryDate > today) {
      window.alert("Kanada'ya giriş tarihi bugünün tarihinden sonra olamaz");
      return;
    }

    if (prDate > today) {
      window.alert(
        'UYARI: PR tarihine gelecek bir tarih girdiniz. Hesaplama buna göre yapılacak',
      );
    }
    // else if (isRefugeeClaimed && refugeeClaimDate > today) {
    //   window.alert('İltica tarihi bugünün tarihinden sonra olamaz');
    //   return;
    // } else if (isRefugeeClaimed && protectedPersonDate > today) {
    //   window.alert('Mahkemeyi geçme tarihi bugünün tarihinden sonra olamaz');
    //   return;
    // } else if (prDate > today) {
    //   window.alert('PR tarihi bugünün tarihinden sonra olamaz');
    //   return;
    // }

    if (isRefugeeClaimed && compareDates(entryDate, refugeeClaimDate)) {
      window.alert("Kanada'ya giriş tarihi iltica tarihinden sonra olamaz");
      return;
    } else if (
      isRefugeeClaimed &&
      compareDates(entryDate, protectedPersonDate)
    ) {
      window.alert(
        "Kanada'ya giriş tarihi mahkeme geçme tarihinden sonra olamaz",
      );
      return;
    } else if (
      isRefugeeClaimed &&
      compareDates(refugeeClaimDate, protectedPersonDate)
    ) {
      window.alert('İltica tarihi mahkeme geçme tarihinden sonra olamaz');
      return;
    } else if (isRefugeeClaimed && compareDates(protectedPersonDate, prDate)) {
      window.alert('Mahkemeyi geçme tarihi PR tarihinden sonra olamaz');
      return;
    } else if (isRefugeeClaimed && compareDates(refugeeClaimDate, prDate)) {
      window.alert('Refugee claim tarihi PR tarihinden sonra olamaz');
      return;
    } else if (compareDates(entryDate, prDate)) {
      window.alert("Kanada'ya giriş tarihi PR tarihinden sonra olamaz");
      return;
    } else if (istraveledAbroad) {
      let isFailed = false;
      data.travelDates.forEach((item, index) => {
        if (compareDates(entryDate, item.exit)) {
          window.alert(
            index +
              1 +
              ". sıradaki seyahatteki çıkış tarihi Kanada'ya giriş tarihinden sonra olmalı",
          );
          isFailed = true;
        } else if (compareDates(item.exit, item.entry)) {
          window.alert(
            index +
              1 +
              '. sıradaki seyahatteki giriş tarihi çıkış tarihinden sonra olmalı',
          );
          isFailed = true;
        }
      });
      if (isFailed) {
        return null;
      }
    }

    let totalDays = 0;

    console.log('today before', today);
    today = moment(prDate) > today ? moment(prDate) : today;
    console.log('today after', today);

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
    let remainedDays = 1095 - (totalDays > 1095 ? 1095 : totalDays);
    setData({
      ...data,
      citizenshipDate: today
        .add(1095 - Math.floor(totalDays), 'd')
        .format('DD-MM-YYYY'),
      passedDays: totalDays,
      remainingDays: remainedDays,
    });

    // console.log('minusTraveledDays', minusTraveledDays);
    // console.log('totaldays', totalDays);
    // console.log('data', data);
    // console.log('remainedDays', remainedDays);

    setIsCalculated(true);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div id='home'>
        <section className='ad-container'>
          <div className='ad-description'>
            <div className='text-web'>
              <span className='price'>$799</span>
              'dan başlayan fiyatlarla kişiye/şirkete özel Web Sitesi ve Web
              Uygulamalarında
            </div>
            <div className='hosting'>Yıllık Hosting: $0</div>
            {/* <div>Yıllık Hosting: $0</div> */}

            <a href='mailto:info@vatandaslik.ca' className='email'>
              info@vatandaslik.ca
            </a>
            <a href='tel:4166889555' className='phoneNumber'>
              (416) 688-9555
            </a>
          </div>

          <div className='ad-box'>
            <div className='item'>
              <i className='fas fa-cloud fa-2x' style={adIconStyle}></i>
              <div className='text'>Google Cloud Teknolojisi</div>
            </div>
            <div className='item'>
              <i className='fas fa-tools fa-2x' style={adIconStyle}></i>
              <div className='text'>Kolay admin paneli</div>
            </div>
            <div className='item'>
              <MoneyOffIcon
                style={{
                  fontSize: '2.5rem',
                  ...adIconStyle,
                  padding: '-8px',
                }}
              />
              <div className='text'>Ücretsiz Hosting</div>
            </div>
            <div className='item'>
              <i className='fas fa-mobile-alt fa-2x' style={adIconStyle}></i>
              <div className='text'>Mobil Uyumlu</div>
            </div>
            <div className='item'>
              <i className='fas fa-tasks fa-2x' style={adIconStyle}></i>
              <div className='text'>Yönetilebilir</div>
            </div>
            <div className='item '>
              <i className='fas fa-rocket fa-2x' style={adIconStyle}></i>
              <div className='text'>Hızlı</div>
            </div>
            <div className='item'>
              <i className='fab fa-react fa-2x' style={adIconStyle}></i>
              <div className='text'> React sistemi</div>
            </div>

            <div className='item'>
              <i className='fas fa-user-secret fa-2x' style={adIconStyle}></i>
              <div className='text'>Güvenli</div>
            </div>

            <div className='item'>
              <i className='fab fa-searchengin fa-2x' style={adIconStyle}></i>
              <div className='text'>SEO Destekli</div>
            </div>
          </div>
        </section>
        {isCalculated ? (
          <div className='result-container'>
            <div className='result-text-container'>
              <div className='result-text'>
                {moment(prDate) > moment() && moment(prDate) > moment()
                  ? `${moment(prDate).format('DD-MM-YYYY')} itibariyle`
                  : null}
              </div>
              <div className='result-text'>Geçen gün:</div>
              <div className='result-text'>{Math.floor(passedDays)}</div>
              <div className='result-text'>Kalan gün:</div>
              <div className='result-text'>
                {1095 - (passedDays > 1095 ? 1095 : Math.floor(passedDays))}
              </div>
              <div className='result-text'>Hak etme tarihi:</div>
              <div className='result-text'>{citizenshipDate}</div>
            </div>
            <div className='back-button'>
              <Button
                style={{
                  fontSize: '1.5rem',
                  width: '100%',
                }}
                variant='contained'
                color='primary'
                onClick={() => {
                  setIsCalculated(false);
                }}>
                <i className='fas fa-arrow-circle-left'></i> GERİ
              </Button>
            </div>
          </div>
        ) : (
          <div className='center-container'>
            <form onSubmit={calculateCitizenshipDate}>
              <Box
                style={{
                  // paddingTop: '20px',
                  paddingRight: '10px',
                }}>
                <section className='box'>
                  <div className='box-date'>
                    <div className='text'> Kanada'ya giriş tarihi</div>
                    <div className='single-date'>
                      <KeyboardDatePicker
                        required
                        autoOk
                        disableFuture
                        helperText='Gün-Ay-Yıl'
                        className='date-picker'
                        margin='normal'
                        id='date-picker-dialog'
                        label='Giriş tarihi'
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
                    </div>
                  </div>
                </section>
                <section className='box'>
                  <div className='box-radio'>
                    <div className='text'> İltica talebinde bulundunuz mu?</div>

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
                  </div>

                  <div className='multi-date'>
                    <KeyboardDatePicker
                      className='date-picker'
                      autoOk
                      required={data.isRefugeeClaimed}
                      disabled={!data.isRefugeeClaimed}
                      // disableFuture
                      margin='normal'
                      id='date-picker-dialog'
                      label='İltica tarihi'
                      format='dd-MM-yyyy'
                      value={refugeeClaimDate}
                      helperText='Sarı kağıtta yazan tarih'
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
                      required={data.isRefugeeClaimed}
                      disabled={!data.isRefugeeClaimed}
                      // disableFuture
                      className='date-picker'
                      margin='normal'
                      id='date-picker-dialog'
                      label='Mahkeme geçiş tarihi'
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
                </section>
                <section className='box'>
                  <div className='box-date'>
                    <div className='text'> PR Tarihi</div>
                    <div className='single-date'>
                      <KeyboardDatePicker
                        autoOk
                        className='date-picker'
                        margin='normal'
                        // disableFuture
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
                    </div>
                  </div>
                </section>
                <section className='box'>
                  <div className='box-radio'>
                    <div className='text'>
                      Kanada'dan yurt dışına çıktınız mı?
                    </div>

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
                  </div>

                  <div>
                    {travelDates.map((item, index) => (
                      <div key={index} className='multi-date-with-button'>
                        <Button
                          className='icon left-sil-button'
                          variant='outlined'
                          disabled={!data.istraveledAbroad}
                          onClick={() => removeTravel(index)}>
                          <RemoveCircleIcon color='secondary' />
                          SİL
                        </Button>
                        <KeyboardDatePicker
                          className='date-picker'
                          autoOk
                          // disableFuture
                          margin='normal'
                          id='date-picker-dialog'
                          label='Çıkış tarihi'
                          required={data.istraveledAbroad}
                          disabled={!data.istraveledAbroad}
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
                          // disableFuture
                          margin='normal'
                          required={data.istraveledAbroad}
                          disabled={!data.istraveledAbroad}
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
                          className='icon right-sil-button'
                          variant='outlined'
                          disabled={!data.istraveledAbroad}
                          onClick={() => removeTravel(index)}>
                          <RemoveCircleIcon
                            color='secondary'
                            style={{ paddingTop: '5px' }}
                          />
                          SİL
                        </Button>
                      </div>
                    ))}
                    <Box style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <Button
                        onClick={addTravel}
                        variant='contained'
                        disabled={!data.istraveledAbroad}
                        color='secondary'>
                        <AddCircleIcon />
                        Yenİ çıkış ekle
                      </Button>
                    </Box>
                  </div>
                </section>
              </Box>
              <Box
                style={{
                  paddingLeft: '10px',
                  margin: '20px 0',
                  display: 'flex',
                }}>
                <Button
                  style={{ marginRight: '10px', fontSize: '1.3rem' }}
                  variant='contained'
                  color='secondary'
                  onClick={() => {
                    setData({
                      ...data,
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
                      remainingDays: 1095,
                    });
                  }}
                  className='btn-hesapla'>
                  Formu Temİzle
                </Button>
                <Button
                  style={{ marginLeft: '10px', fontSize: '1.3rem' }}
                  variant='contained'
                  color='primary'
                  className='btn-hesapla'
                  type='submit'>
                  Hesapla
                </Button>
              </Box>
            </form>
          </div>
        )}
        <section className='ad-container-2'>
          <a
            href='https://nosmarket.ca/'
            target='_blank'
            rel='noopener noreferrer'>
            <img
              src={require('../images/nosmarket.jpeg')}
              className='ad-image'
              alt='ad 1'
            />
          </a>
          <a
            href='http://tuliptranslations.ca/'
            target='_blank'
            rel='noopener noreferrer'>
            <img
              src={require('../images/tercuman.png')}
              className='ad-image'
              alt='ad 2'
            />
          </a>

          <a
            href='https://alaskamedia.ca/'
            target='_blank'
            rel='noopener noreferrer'>
            <img
              src={require('../images/alaska.jpeg')}
              className='ad-image'
              alt='ad 3'
            />
          </a>

          <div className='ad1'></div>
          <div className='ad2'></div>
          <div className='ad3'></div>
        </section>
      </div>
      <div id='contact-me'>
        <div className='contact'>
          Reklam, soru ve önerileriniz için:{' '}
          <a href='mailto:info@vatandaslik.ca'>info@vatandaslik.ca</a> {' - '}
          <a href='tel:4166889555' className='phoneNumber'>
            (416) 688-9555
          </a>
        </div>
        {isCalculated && (
          <div className='contact'>
            Disclaimer: The information contained in this website is provided
            for informational purposes only, and should not be construed as
            legal advice on any matter. We do not make any warranties about the
            completeness, reliability and accuracy of this information. By using
            our website, you hereby consent to our disclaimer and agree to its
            terms.
          </div>
        )}
      </div>
      <div id='footer'></div>
    </MuiPickersUtilsProvider>
  );
}

let adIconStyle = {
  padding: '5px',
  color: '#F5D18F',
  textAlign: 'center',
  width: '100%',
};

export default Home;
