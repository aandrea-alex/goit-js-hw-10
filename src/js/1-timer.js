import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import iconUrl from '../img/bi-x-octagon.svg';

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

const refs = {
    days: document.querySelector('.value[data-days]'),
    timer: document.querySelector('.timer'),
    hours: document.querySelector('.value[data-hours]'),
    minutes: document.querySelector('.value[data-minutes]'),
    seconds: document.querySelector('.value[data-seconds]'),
    startBtn: document.querySelector('button[data-start]'),
    picker: document.getElementById('datetime-picker'),
    stopBtn: document.querySelector('button[data-stop]'),
  };
  
  refs.startBtn.disabled = true;
  refs.stopBtn.disabled = true;
  
  refs.startBtn.addEventListener('click', onStartButtonClick);
  refs.stopBtn.addEventListener('click', onStopButtonClick);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = new Date(selectedDates[0]);
    if (date - new Date() > 0) {
      userSelectedDate = date;
      refs.startBtn.disabled = false;
    } else {
      iziToast.show({
        message: 'Please choose a date in the future',
        messageColor: '#fafafb',
        messageSize: '16px',
        backgroundColor: '#fc5a5a',
        position: 'topRight',
        closeOnEscape: true,
        close: true,
        icon: 'Icomoon',
        iconUrl: `${iconUrl}`,
        iconColor: '#fafafb',
      });
    }
  },
};

const instflatpickr = flatpickr('input#datetime-picker', options);

let userSelectedDate = null;
const interval = 1000;
let intervalId;

function onStartButtonClick() {
  updateTimer();
  intervalId = setInterval(updateTimer, interval);
  changeControlsStatus();
}

function onStopButtonClick() {
  resetTimer();
}

function updateTimer() {
  if (!userSelectedDate) return;

  const restTime = userSelectedDate - new Date();
  if (restTime <= 0) {
    resetTimer();
    return;
  }
  const formattedValues = convertMs(restTime);
  insertDataToControls(formattedValues);
}

function insertDataToControls(dateObj) {
  if (dateObj) {
    const { days, hours, minutes, seconds } = dateObj;
    if (String(days).length > 3) {
      refs.timer.classList.add('timer-shift');
    }
    refs.days.textContent = days;
    refs.hours.textContent = hours;
    refs.minutes.textContent = minutes;
    refs.seconds.textContent = seconds;
  } else {
    refs.timer.classList.remove('timer-shift');
    refs.days.textContent = '00';
    refs.hours.textContent = '00';
    refs.minutes.textContent = '00';
    refs.seconds.textContent = '00';
  }
}

function resetTimer() {
  userSelectedDate = new Date();
  intervalId && clearInterval(intervalId);
  intervalId = null;
  instflatpickr.setDate(new Date());
  insertDataToControls();
  refs.startBtn.disabled = true;
  refs.stopBtn.disabled = true;
  refs.picker.disabled = false;
}

function changeControlsStatus() {
  refs.startBtn.disabled = !refs.startBtn.disabled;
  refs.picker.disabled = !refs.picker.disabled;
  refs.stopBtn.disabled = !refs.stopBtn.disabled;
}
