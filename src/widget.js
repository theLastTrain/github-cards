(function(d) {

  var i, count = 0;

  function queryclass(name) {
    if (d.querySelectorAll) {
      return d.querySelectorAll('.' + name);
    }
    var elements = d.getElementsByTagName('div');
    var ret = [];
    for (i = 0; i < elements.length; i++) {
      if (~elements[i].className.split(' ').indexOf(name)) {
        ret.push(elements[i]);
      }
    }
    return ret;
  }

  function querydata(element, name) {
    return element.getAttribute('data-' + name);
  }

  function heighty(iframe) {
    if (window.addEventListener) {
      window.addEventListener('message', function(e) {
        if (~iframe.src.indexOf(e.origin)) {
          if (iframe.id === e.data.sender) {
            iframe.height = e.data.height + 10;
          }
        }
      }, false);
    }
  }

  function render(card, baseurl) {
    var user = querydata(card, 'user');
    if (!user) {
      return;
    }
    count += 1;

    var repo = querydata(card, 'repo');
    var width = querydata(card, 'width');
    var height = querydata(card, 'height');
    var target = querydata(card, 'target');
    var identity = 'ghcard-' + user + '-' + count;

    var iframe = d.createElement('iframe');
    iframe.setAttribute('id', identity);
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('scrolling', 0);
    iframe.setAttribute('allowtransparency', true);

    var url = baseurl + '?user=' + user + '&identity=' + identity;
    if (repo) {
      url += '&repo=' + repo;
    }
    if (target) {
      url += '&target=' + target;
    }
    iframe.src = url;
    iframe.width = width || Math.min(d.body.clientWidth || 400, 400);
    if (height) {
      iframe.height = height;
    }
    heighty(iframe);
    card.parentNode.replaceChild(iframe, card);
    return iframe;
  }

  var metas = d.head.getElementsByTagName('meta');
  var baseurl = 'http://lab.lepture.com/github-cards/card.html'
  for (i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') == 'github-card') {
      baseurl = metas[i].getAttribute('content');
      break;
    }
  }

  var cards = queryclass('github-card');
  for (i = 0; i < cards.length; i++) {
    render(cards[i], baseurl);
  }

  if (window.githubCard) {
    window.githubCard.render = render;
  }

})(document);
