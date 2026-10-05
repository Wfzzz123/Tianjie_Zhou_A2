(function () {
  var rail = document.getElementById('menu-root');
  if (!rail) {
    return;
  }

  var current = document.body.getAttribute('data-screen');

  rail.innerHTML =
    '<a class="mark" href="index.html">P&amp;R</a>' +
    '<p class="mark-sub">Pine &amp; River<br>Community Trust</p>' +
    '<nav>' +
      '<a href="index.html"' + (current === 'home' ? ' class="on"' : '') + '>Home</a>' +
      '<a href="search.html"' + (current === 'search' ? ' class="on"' : '') + '>Find events</a>' +
    '</nav>' +
    '<div class="rail-foot">' +
      '<p>18 Boundary St<br>West End QLD 4101</p>' +
      '<p>office@pineandriver.org.au</p>' +
      '<p>(07) 3844 2091</p>' +
    '</div>';
})();
