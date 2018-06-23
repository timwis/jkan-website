---
title: Step 2
order: 2
---
You'll sign in to your new JKAN site the same way you did above. To set that up, [register it with GitHub](https://github.com/settings/applications/new).

- Application name: Whatever your site will be called (ie. JKAN)
- Homepage URL and Authorization callback URL: `https://<your-github-username>.github.io/jkan/`
- Application description: Whatever you like - users will see this when signing in to your JKAN site

After clicking Register, you'll be given a `Client ID` and a `Client Secret`. Enter the `Client ID` below, and hang on to the `Client Secret` for the next step.

<div class="field">
  <label class="label" for="github-client-id">
    Github Client ID
  </label>
  <div class="control">
    <input type="text" class="input" name="github-client-id" id="github-client-id" data-hook="github-client-id" placeholder="ie. 777ae16009a6f9e6d451">
  </div>
</div>
