import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return addLeadingZero({ days, hours, minutes, seconds });
}

function addLeadingZero(dateObj) {
  const keys = Object.keys(dateObj);

  return keys.reduce((result, key, index) => {
    const value = dateObj[key];
    const formattedValue =
      typeof value === 'number' && value < 10
        ? value.toString().padStart(2, '0')
        : typeof value === 'string' && value.length === 1
        ? value.padStart(2, '0')
        : value;

    return { ...result, [key]: formattedValue };
  }, {});
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
  },
};
