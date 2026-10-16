// Minimal page behaviour: highlight the current section in the table of
// contents and copy the BibTeX entry. No network requests.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  var targets = links
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  function onScroll() {
    var y = window.scrollY + 90;
    var current = null;
    targets.forEach(function (el) { if (el.offsetTop <= y) current = el.id; });
    links.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  if (targets.length) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var btn = document.getElementById('copy-bib');
  var bib = document.getElementById('bibtex-text');
  if (btn && bib) {
    btn.addEventListener('click', function () {
      var text = bib.textContent;
      var done = function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var r = document.createRange();
        r.selectNodeContents(bib);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
        try { document.execCommand('copy'); done(); } catch (e) {}
        s.removeAllRanges();
      }
    });
  }
})();
