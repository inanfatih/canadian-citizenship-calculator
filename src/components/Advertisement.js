import React from 'react';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';

function Advertisement() {
  return (
    <div className='container'>
      <section className='ad-container'>
        <div className='ad-description'>
          <div className='text-web'>Web Sitesi ve Web Uygulamalarında</div>
          <div className='hosting-mobile'>Yıllık</div>
          <div className='hosting-mobile'>Hosting: $0</div>
          <div className='hosting'>Yıllık Hosting: $0</div>
          <div className='text-web'>
            <span className='price'>$799</span>
            'dan baslayan fiyatlarla
          </div>

          <div className='phoneNumber'>(416) 688-9555</div>
        </div>

        <div className='ad-box'>
          <div className='item'>
            <i class='fas fa-cloud fa-3x' style={adIconStyle}></i>
            <div className='text'>Google Cloud Teknolojisi</div>
          </div>
          <div className='item'>
            <i class='fas fa-mobile-alt fa-3x' style={adIconStyle}></i>
            <div className='text'>Mobile Uyumlu</div>
          </div>
          <div className='item'>
            <i class='fas fa-tasks fa-3x' style={adIconStyle}></i>
            <div className='text'>A'dan Z'ye yönetilebilir</div>
          </div>
          <div className='item'>
            <i class='fas fa-tools fa-3x' style={adIconStyle}></i>
            <div className='text'>Kolay ve kişiye özel admin paneli</div>
          </div>
          <div className='item '>
            <i class='fas fa-rocket fa-3x' style={adIconStyle}></i>
            <div className='text'>Hızlı</div>
          </div>
          <div className='item'>
            <MoneyOffIcon
              style={{
                fontSize: '3.9rem',
                ...adIconStyle,
                padding: '-8px',
              }}
            />
            <div className='text'>Ücretsiz Hosting</div>
          </div>
          <div className='item'>
            <i class='fab fa-react fa-3x' style={adIconStyle}></i>
            <div className='text'> Facebook destekli React sistemi</div>
          </div>

          <div className='item'>
            <i class='fas fa-user-secret fa-3x' style={adIconStyle}></i>
            <div className='text'>Güvenli</div>
          </div>

          {/* <div className='item'>
                <i class='fab fa-searchengin fa-3x' style={adIconStyle}></i>
                <div className='text'>Search Engine</div>
              </div> */}
        </div>
      </section>
    </div>
  );
}

let adIconStyle = {
  padding: '10px',
  color: '#256EFF',
  textAlign: 'center',
  width: '100%',
};

export default Advertisement;
