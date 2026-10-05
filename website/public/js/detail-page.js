(function () {
  var article = document.getElementById('detail-body');
  var signup = document.getElementById('signup-box');
  var dialog = document.getElementById('hold-dialog');
  var id = new URLSearchParams(window.location.search).get('id');

  function showBlank(title, text) {
    article.innerHTML =
      '<section class="blank">' +
        '<h1>' + title + '</h1>' +
        '<p>' + text + '</p>' +
        '<p><a href="index.html">Return home</a></p>' +
      '</section>';
  }

  if (!id) {
    showBlank('Missing event', 'Add an id to the address, such as event.html?id=1.');
    return;
  }

  requestJson('/api/events/' + encodeURIComponent(id))
    .then(function (item) {
      var share = raisedShare(item.current_amount, item.goal_amount);
      document.title = item.name + ' | Pine & River';

      article.innerHTML =
        '<section class="detail-hero">' +
          '<p class="code">' + item.organisation_name + '</p>' +
          '<h1>' + item.name + '</h1>' +
          '<p class="pill-row">' +
            '<span class="pill pill-' + item.status + '">' + (item.status === 'past' ? 'Past' : 'Upcoming') + '</span>' +
            '<span class="pill pill-type">' + item.category_name + '</span>' +
          '</p>' +
        '</section>' +
        '<section class="stat-row">' +
          '<div><span>When</span><b>' + formatWhen(item.event_date) + '</b></div>' +
          '<div><span>Where</span><b>' + item.location + '</b></div>' +
          '<div><span>Purpose</span><b>' + item.purpose + '</b></div>' +
          '<div><span>Tickets</span><b>' + ticketLabel(item.ticket_price) + '</b></div>' +
        '</section>' +
        '<p class="detail-copy">' + item.full_description + '</p>' +
        '<section class="goal">' +
          '<div>' +
            '<h2>Raised so far</h2>' +
            '<p>' + aud(item.current_amount) + ' of ' + aud(item.goal_amount) + '</p>' +
          '</div>' +
          '<div class="goal-bar">' +
            '<div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + share + '">' +
              '<b style="width:' + share + '%"></b>' +
            '</div>' +
            '<p>' + share + '% of goal</p>' +
          '</div>' +
        '</section>';

      signup.hidden = false;
    })
    .catch(function (err) {
      if (err.status === 404) {
        showBlank('Event unavailable', 'That record is paused or the id is wrong.');
        return;
      }
      showBlank('Could not load event', 'Start the API on port 3002 and try again.');
    });

  document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault();
    dialog.showModal();
  });

  document.querySelectorAll('[data-dismiss]').forEach(function (button) {
    button.addEventListener('click', function () {
      dialog.close();
    });
  });
})();
