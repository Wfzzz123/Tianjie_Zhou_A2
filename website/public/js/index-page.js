(function () {
  var list = document.getElementById('home-list');
  var note = document.getElementById('home-note');

  note.hidden = false;
  note.textContent = 'Loading the public list...';
  note.className = 'note';

  requestJson('/api/events')
    .then(function (items) {
      if (!items.length) {
        list.innerHTML = '';
        note.hidden = false;
        note.textContent = 'No current or upcoming events are listed.';
        return;
      }
      note.hidden = true;
      list.innerHTML = items.map(buildEventRow).join('');
    })
    .catch(function () {
      list.innerHTML = '';
      note.hidden = false;
      note.className = 'note note-bad';
      note.textContent = 'The list did not load. Start the API on port 3002 and refresh.';
    });
})();
