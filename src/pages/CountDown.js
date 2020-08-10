import React, { useState, useEffect } from 'react';

function CountDown() {
  //   let button = document.querySelector('.card__button');

  const [classes, setClasses] = useState('card__button');
  useEffect(() => {}, [classes]);

  function clicked() {
    setClasses(classes + ' card__button--triggered');

    // button.classList.add('card__button--triggered');

    var count = 100;
    var counter = setInterval(timer, 100);

    function timer() {
      count -= 1;
      if (count === -1) {
        clearInterval(counter);

        setTimeout(function () {
          count = 80;
          document.getElementById('num').innerHTML = count;

        //   setClasses('card__button');
          //   button.on('click', clicked);
        }, 800);

        return;
      }
      document.getElementById('num').innerHTML = count;
    }
  }

  return (
    <div>
      <div className='shadow'></div>
      <div className='card'>
        <div className='card__overlay'></div>
        <div className={classes} onClick={clicked}></div>
        <div className='card__counter'>
          <div id='num' className='card__counter__num'>
            1095
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountDown;
