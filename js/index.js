/* global $, Cookies, Github */

var githubLoginUrl = 'https://github.com/login/oauth/authorize'
var disabledClass = 'pure-button-disabled'
var hiddenClass = 'hidden'

var settings = {
  repoOwner: 'timwis',
  repoName: 'jkan',
  repoBranch: 'gh-pages',
  configFilePath: '_config.yml',
  clientId: 'd246095a31922f92736d',
  proxyHost: 'https://jkan-website-gatekeeper.herokuapp.com'
}

var elements = {
  loginBtn: queryByHook('login'),
  loginLoading: queryByHook('login-loading'),
  loginStatus: queryByHook('login-status'),
  forkBtn: queryByHook('fork'),
  forkLoading: queryByHook('fork-loading'),
  forkStatus: queryByHook('fork-status'),
  saveBtn: queryByHook('save'),
  saveLoading: queryByHook('save-loading'),
  saveStatus: queryByHook('save-status'),
  githubClientId: queryByHook('github-client-id'),
  appName: queryByHook('app-name'),
  success: queryByHook('success'),
  siteUrl: queryByHook('site-url')
}

var github, forkRepo

// Click login button to initiate step 1
elements.loginBtn.on('click', function (e) {
  if (!elements.loginBtn.hasClass(disabledClass)) initiateLogin()
})

// If login step 1 completed
var authCodeMatch = window.location.href.match(/\?code=([a-z0-9]*)/)
if (authCodeMatch) {
  show(elements.loginLoading)
  finishLogin(authCodeMatch[1]).then(function (authToken) {
    hide(elements.loginLoading)
    Cookies.set('oauth-token', authToken)
    clearParams()
  })
}

// If login step 2 completed
var authToken = Cookies.get('oauth-token')
if (authToken) {
  github = new Github({
    token: authToken,
    auth: 'oauth'
  })
  getUsername(github).then(function (username) {
    elements.loginStatus.text('Signed in as ' + username)
    disable(elements.loginBtn)
    enable(elements.forkBtn)
  })
}

// Click fork button
elements.forkBtn.on('click', function (e) {
  if (elements.forkBtn.hasClass(disabledClass) || !github) return
  show(elements.forkLoading)
  var sourceRepo = github.getRepo(settings.repoOwner, settings.repoName)
  sourceRepo.fork(function (err, data) {
    hide(elements.forkLoading)
    if (err) return console.error(err)
    forkRepo = github.getRepo(data.owner.login, data.name)
    elements.forkStatus.html('Forked to <a href="' + data.html_url + '" target="_blank">' + data.full_name + '</a>')
    var siteUrl = 'http://' + data.owner.login + '.github.io/' + data.name
    elements.siteUrl.text(siteUrl).attr('href', siteUrl)
    disable(elements.forkBtn)
    enable(elements.saveBtn)
  })
})

// Click save button
elements.saveBtn.on('click', function (e) {
  if (elements.saveBtn.hasClass(disabledClass) || !github || !forkRepo) return
  if (!elements.githubClientId.val() || !elements.appName.val()) {
    elements.saveStatus.text('Error: Github Client ID and App Name must be provided')
    return console.error('No values set')
  }
  var formData = {
    github_client_id: elements.githubClientId.val(),
    gatekeeper_host: 'https://' + elements.appName.val() + '.herokuapp.com'
  }
  show(elements.saveLoading)
  forkRepo.read(settings.repoBranch, settings.configFilePath, function (err, fileContents) {
    if (err) console.error(err)
    var newFileContents = updateYamlString(fileContents, formData)
    var commitMsg = 'Updated ' + settings.configFilePath
    forkRepo.write(settings.repoBranch, settings.configFilePath, newFileContents, commitMsg, {}, function (err, data) {
      hide(elements.saveLoading)
      if (err) return console.error(err)
      elements.saveStatus.html('Saved to <a href="' + data.commit.html_url + '">' + settings.configFilePath + '</a>')
      disable(elements.saveBtn)
      show(elements.success)
    })
  })
})

function initiateLogin () {
  var redirectParams = {
    client_id: settings.clientId,
    redirect_uri: window.location.href,
    scope: 'public_repo'
  }
  window.location.href = githubLoginUrl + '?' + $.param(redirectParams)
}

// Use authCode from step 1 to fetch auth token
function finishLogin (authCode) {
  return new Promise(function (resolve, reject) {
    var proxyUrl = settings.proxyHost + '/authenticate/' + authCode
    $.getJSON(proxyUrl, function (data) {
      if (data && data.token) {
        resolve(data.token)
      } else {
        reject('Authentication failed')
      }
    })
  })
}

function getUsername (github) {
  return new Promise(function (resolve, reject) {
    var user = github.getUser()
    user.show(null, function (err, userData) {
      if (err) reject(err)
      else resolve(userData.login)
    })
  })
}

function queryByHook (hook) {
  return $('[data-hook~=' + hook + ']')
}

function enable (el) { return el.removeClass(disabledClass) }
function disable (el) { return el.addClass(disabledClass) }
function show (el) { return el.removeClass(hiddenClass) }
function hide (el) { return el.addClass(hiddenClass) }

function clearParams () {
  window.location.href = window.location.href.split('?')[0]
}

function updateYamlString (yamlString, updateObject) {
  for (var key in updateObject) {
    var regex = new RegExp('^( *' + key + ':[ +]?).*', 'm')
    var match = yamlString.match(regex)
    if (match) {
      yamlString = yamlString.replace(regex, match[1] + updateObject[key])
    } else {
      yamlString += '\n' + key + ': ' + updateObject[key]
    }
  }
  return yamlString
}
