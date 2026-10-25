// Renders a post at /blog/<slug>/ from /blog/<slug>/index.md and its entry in /blog/posts.json.

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function notFound() {
  document.getElementById('post').innerHTML =
    '<h1 class="post-title">Post not found</h1><p><a href="/blog/">&larr; Back to all posts</a></p>';
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Resolve relative image paths (e.g. images/foo.png) against the post folder,
// and turn a paragraph holding only an image into <figure> with its title as caption.
function buildFigures(body, base) {
  body.querySelectorAll('img').forEach(function (img) {
    img.src = new URL(img.getAttribute('src'), base).href;
    img.loading = 'lazy';

    var p = img.parentElement;
    if (p.tagName !== 'P' || p.childNodes.length !== 1) return;

    var figure = document.createElement('figure');
    figure.appendChild(img);
    if (img.title) {
      var caption = document.createElement('figcaption');
      caption.textContent = img.title;
      figure.appendChild(caption);
      img.removeAttribute('title');
    }
    p.replaceWith(figure);
  });
}

// Give every h1/h2 an id and list them in a "Contents" sidebar.
function buildToc(body) {
  var headings = body.querySelectorAll('h1, h2');
  if (headings.length < 2) return;

  var used = {};
  var links = [];
  headings.forEach(function (h) {
    var id = slugify(h.textContent) || 'section';
    if (used[id]) id += '-' + (++used[id]); else used[id] = 1;
    h.id = id;
    links.push('<li class="toc-' + h.tagName.toLowerCase() + '"><a href="#' + id + '">' +
      h.textContent.replace(/</g, '&lt;') + '</a></li>');
  });

  var toc = document.createElement('nav');
  toc.className = 'toc';
  toc.setAttribute('aria-label', 'Contents');
  toc.innerHTML = '<details open><summary>Contents</summary><ul>' + links.join('') + '</ul></details>';
  body.parentNode.insertBefore(toc, body);

  if (!('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      toc.querySelectorAll('a').forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '0px 0px -70% 0px' });
  headings.forEach(function (h) { observer.observe(h); });
}

var slug = location.pathname.split('/').filter(Boolean)[1];

fetch('/blog/posts.json')
  .then(function (res) { return res.json(); })
  .then(function (posts) {
    var post = posts.find(function (p) { return p.slug === slug; });
    if (!post) return notFound();

    var base = location.origin + '/blog/' + encodeURIComponent(post.slug) + '/';
    return fetch(base + 'index.md')
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.text();
      })
      .then(function (md) {
        var minutes = Math.max(1, Math.round(md.split(/\s+/).length / 200));
        var body = document.getElementById('body');
        document.title = post.title + ' | Jay Modi';
        document.getElementById('title').textContent = post.title;
        document.getElementById('subtitle').textContent = post.subtitle || '';
        document.getElementById('author').textContent = post.author;
        document.getElementById('avatar').textContent = post.author.charAt(0);
        document.getElementById('meta').textContent = formatDate(post.date) + ' · ' + minutes + ' min read';
        body.innerHTML = marked.parse(md);
        buildFigures(body, base);
        buildToc(body);
        if (location.hash) {
          var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
          if (target) target.scrollIntoView();
        }
      });
  })
  .catch(notFound);
