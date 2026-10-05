(function () {
  var form = document.getElementById('find-form');
  var dateField = document.getElementById('q-date');
  var placeField = document.getElementById('q-place');
  var typeField = document.getElementById('q-type');
  var resetBtn = document.getElementById('reset-find');
  var list = document.getElementById('find-list');
  var note = document.getElementById('find-note');

  function setNote(text, isBad) {
    note.hidden = false;
    note.textContent = text;
    note.className = isBad ? 'note note-bad' : 'note';
  }

  function clearNote() {
    note.hidden = true;
    note.textContent = '';
    note.className = 'note';
  }

  function fillTypes() {
    return requestJson('/api/categories').then(function (types) {
      typeField.innerHTML = '<option value="">All types</option>';
      types.forEach(function (type) {
        var option = document.createElement('option');
        option.value = String(type.id);
        option.textContent = type.name;
        typeField.appendChild(option);
      });
    });
  }

  function runSearch() {
    var date = dateField.value.trim();
    var place = placeField.value.trim();
    var type = typeField.value.trim();

    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      list.innerHTML = '';
      setNote('Choose a real calendar date.', true);
      return;
    }

    var query = new URLSearchParams();
    if (date) {
      query.set('date', date);
    }
    if (place) {
      query.set('location', place);
    }
    if (type) {
      query.set('category', type);
    }

    var suffix = query.toString();
    var path = '/api/events/search' + (suffix ? '?' + suffix : '');

    requestJson(path)
      .then(function (items) {
        if (!items.length) {
          list.innerHTML = '';
          setNote('Nothing matched. Change a field or reset the form.', true);
          return;
        }
        clearNote();
        list.innerHTML = items.map(buildEventRow).join('');
      })
      .catch(function (err) {
        list.innerHTML = '';
        setNote(err.message || 'Search could not run. Check that the API is on port 3002.', true);
      });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    runSearch();
  });

  resetBtn.addEventListener('click', function () {
    dateField.value = '';
    placeField.value = '';
    typeField.value = '';
    list.innerHTML = '';
    clearNote();
  });

  fillTypes().catch(function () {
    setNote('Types did not load. Date and suburb search still work.', true);
  });
})();
