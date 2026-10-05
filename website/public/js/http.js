function requestJson(path) {
  return fetch(API_BASE + path).then(function (response) {
    return response.json().then(function (body) {
      if (!response.ok) {
        var error = new Error(body.error || 'Request failed');
        error.status = response.status;
        throw error;
      }
      return body;
    });
  });
}

function formatWhen(iso) {
  return new Date(iso).toLocaleString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function dateParts(iso) {
  var date = new Date(iso);
  return {
    day: String(date.getDate()),
    month: date.toLocaleDateString('en-AU', { month: 'short' }).toUpperCase(),
    time: date.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })
  };
}

function ticketLabel(price) {
  var amount = Number(price);
  return amount === 0 ? 'Free entry' : 'A$' + amount.toFixed(0);
}

function aud(amount) {
  return 'A$' + Number(amount).toLocaleString('en-AU', {
    maximumFractionDigits: 0
  });
}

function raisedShare(currentAmount, goalAmount) {
  var goal = Number(goalAmount);
  if (goal <= 0) {
    return 0;
  }
  var share = Math.round((Number(currentAmount) / goal) * 100);
  return Math.max(0, Math.min(100, share));
}

function buildEventRow(item) {
  var parts = dateParts(item.event_date);
  var status = item.status === 'past' ? 'Past' : 'Upcoming';

  return (
    '<article class="tile">' +
      '<div class="tile-date">' +
        '<strong>' + parts.day + '</strong>' +
        '<span>' + parts.month + '</span>' +
        '<em>' + parts.time + '</em>' +
      '</div>' +
      '<div class="tile-body">' +
        '<p class="tile-meta">' + item.category_name + '</p>' +
        '<h3>' + item.name + '</h3>' +
        '<p>' + item.location + '</p>' +
        '<p class="tile-blurb">' + item.short_description + '</p>' +
        '<div class="tile-foot">' +
          '<span class="pill pill-' + item.status + '">' + status + '</span>' +
          '<a href="event.html?id=' + item.id + '">See event</a>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
}
