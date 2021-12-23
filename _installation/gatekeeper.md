---
title: Step 3
order: 3
---
In order to authenticate with GitHub securely, you'll need to setup a tiny authentication server called Gatekeeper. Heroku.com provides free server hosting, but you'll need to [create an account](https://signup.heroku.com/) and confirm your email adress. Once you have an account, click the Deploy button below. Pick an `App Name` and fill in your `Client ID` and `Client Secret` then click **Deploy for Free**. Enter the `App Name` you chose below.

<a href="https://dashboard.heroku.com/new?button-url=https%3A%2F%2Fgithub.com%2Fprose%2Fgatekeeper&template=https%3A%2F%2Fgithub.com%2Fprose%2Fgatekeeper%2Ftree%2Fmaster" target="_blank">
  <img src="https://www.herokucdn.com/deploy/button.png" alt="Deploy to Heroku">
</a>

<div class="field">
  <label class="label" for="app-name">
    App Name
  </label>
  <div class="control">
    <input type="text" class="input" name="app-name" id="app-name" data-hook="app-name" placeholder="ie. jkan-gatekeeper">
  </div>
</div>
