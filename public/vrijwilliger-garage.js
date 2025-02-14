// Verbind met de externe Socket.IO-server
const socket = io('https://sufuf-socketio-server.onrender.com'); // Vervang dit door de URL van je Render-server

const okSwitch = document.getElementById('ok-switch');
const nokSwitch = document.getElementById('nok-switch');

// Laad de opgeslagen status bij het openen van de pagina
socket.on('initialStatus', (data) => {
  if (data['garage'] === 'green') {
    okSwitch.checked = true;
  } else if (data['garage'] === 'red') {
    nokSwitch.checked = true;
  }
});

// Controleer of de gebruiker is ingelogd voordat de schakelaars werken
fetch('/check-login', { method: 'GET', credentials: 'same-origin' })
  .then((response) => {
    if (!response.ok) {
      window.location.href = '/login.html'; // Redirect naar loginpagina als de gebruiker niet is ingelogd
    }
  })
  .catch((error) => {
    console.error('Error bij sessiecontrole:', error);
    window.location.href = '/login.html'; // Redirect naar loginpagina bij error
  });

// Eventlisteners voor de OK en NOK schakelaars
okSwitch.addEventListener('change', (e) => {
  if (e.target.checked) {
    nokSwitch.checked = false;
    socket.emit('updateStatus', { room: 'garage', status: 'OK' }); // Verzend 'OK', server verwacht 'green'
  } else if (!okSwitch.checked && !nokSwitch.checked) {
    socket.emit('updateStatus', { room: 'garage', status: 'OFF' });
  }
});

nokSwitch.addEventListener('change', (e) => {
  if (e.target.checked) {
    okSwitch.checked = false;
    socket.emit('updateStatus', { room: 'garage', status: 'NOK' }); // Verzend 'NOK', server verwacht 'red'
  } else if (!okSwitch.checked && !nokSwitch.checked) {
    socket.emit('updateStatus', { room: 'garage', status: 'OFF' });
  }
});
