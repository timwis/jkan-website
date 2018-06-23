---
layout: default
---
Open-source data portals can be
[really](https://twitter.com/waldojaquith/status/282599673569619969).
[hard](https://twitter.com/chris_whong/status/669207423719235584).
to install and maintain. But their basic purpose of providing links to download data really isn't that complicated. JKAN is a proof-of-concept that allows a small, resource-strapped government agency to stand-up an open data portal by simply clicking the fork button.

{% include feature-cards.html %}

<h2 class="title">Who's Using JKAN</h2>
{% include implementation-tiles.html %}

<h2 class="title" id="get-started">Get Started</h2>
Installing JKAN only takes a couple minutes, and we'll walk you through it below, but it will involve being rerouted to GitHub.com and Heroku.com, where you'll need to create free accounts if you don't have one already.

Would you rather set this up manually? Check out the [manual installation](https://github.com/timwis/jkan/wiki/Manual-Installation) instructions.

{% assign steps = site.installation | sort: "order" %}
{% for step in steps %}
  <div class="box">
    <h4 class="title is-4">{{ step.title }}</h4>
    <div class="content">
      {{ step.content }}
    </div>
  </div>
{% endfor %}
