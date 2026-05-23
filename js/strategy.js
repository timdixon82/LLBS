// strategy.js
// Behaviour for the LLBS Living Well Together Strategy page (index.html).
// Two responsibilities: mobile navigation toggle and ARIA tab keyboard handler.

// Mobile nav toggle
(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var nav    = document.querySelector('.site-nav');

  if (!toggle || !nav) { return; }

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}());

// ARIA tabs — Arrow Left/Right, Home, End keyboard support
(function () {
  'use strict';

  var tabList = document.querySelector('[role="tablist"]');
  if (!tabList) { return; }

  var tabs   = Array.from(tabList.querySelectorAll('[role="tab"]'));
  var panels = tabs.map(function (t) {
    return document.getElementById(t.getAttribute('aria-controls'));
  });

  function activate(tab) {
    tabs.forEach(function (t, i) {
      var sel = t === tab;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.setAttribute('tabindex', sel ? '0' : '-1');
      panels[i].hidden = !sel;
    });
    tab.focus();
  }

  tabs.forEach(function (tab, idx) {
    tab.addEventListener('click', function () { activate(tab); });
    tab.addEventListener('keydown', function (e) {
      var target;
      if      (e.key === 'ArrowRight') { target = tabs[(idx + 1) % tabs.length]; }
      else if (e.key === 'ArrowLeft')  { target = tabs[(idx - 1 + tabs.length) % tabs.length]; }
      else if (e.key === 'Home')       { target = tabs[0]; }
      else if (e.key === 'End')        { target = tabs[tabs.length - 1]; }
      if (target) { e.preventDefault(); activate(target); }
    });
  });
}());
