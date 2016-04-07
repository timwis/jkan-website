/* global $, Cookies, Github */

var githubLoginUrl = 'https://github.com/login/oauth/authorize'
var disabledClass = 'pure-button-disabled'

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
  forkBtn: queryByHook('fork'),
  saveBtn: queryByHook('save'),
  githubClientId: queryByHook('github-client-id'),
  appName: queryByHook('app-name')
}

var github, forkRepo

// If login step 2 completed
var authToken = Cookies.get('oauth-token')
if (authToken) {
  console.log('all logged in', authToken)
  github = new Github({
    token: authToken,
    auth: 'oauth'
  })
  elements.forkBtn.add(elements.saveBtn).removeClass(disabledClass)
}

// If login step 1 completed
var authCodeMatch = window.location.href.match(/\?code=([a-z0-9]*)/)
if (authCodeMatch) {
  finishLogin(authCodeMatch[1]).then(function (authToken) {
    Cookies.set('oauth-token', authToken)
    clearParams()
  })
}

// Click login button
elements.loginBtn.on('click', function (e) {
  console.log('login')
  initiateLogin()
})

// Click fork button
elements.forkBtn.on('click', function (e) {
  if (elements.forkBtn.hasClass(disabledClass) || !github) return
  console.log('fork')
  var sourceRepo = github.getRepo(settings.repoOwner, settings.repoName)
  sourceRepo.fork(function (err, data) {
    if (err) console.error(err)
    forkRepo = github.getRepo(data.owner.login, data.name)
    console.log('forked', data)
  })
})

// Click save button
elements.saveBtn.on('click', function (e) {
  if (elements.saveBtn.hasClass(disabledClass) || !github) return
  if (!elements.githubClientId.val() || !elements.appName.val()) {
    return console.error('No values set')
  }
  var formData = {
    github_client_id: elements.githubClientId.val(),
    gatekeeper_host: 'https://' + elements.appName.val() + '.herokuapp.com'
  }
  console.log('save', formData)
  forkRepo.read(settings.repoBranch, settings.configFilePath, function (err, fileContents) {
    if (err) console.error(err)
    var newFileContents = updateYamlString(fileContents, formData)
    var commitMsg = 'Updated ' + settings.configFilePath
    forkRepo.write(settings.repoBranch, settings.configFilePath, newFileContents, commitMsg, {}, function (err) {
      if (err) console.error(err)
      else console.log('saved successfully')
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
    console.log(proxyUrl)
    $.getJSON(proxyUrl, function (data) {
      if (data && data.token) {
        resolve(data.token)
      } else {
        reject('Authentication failed')
      }
    })
  })
}

function queryByHook (hook) {
  return $('[data-hook~=' + hook + ']')
}

function clearParams () {
  window.location.href = window.location.href.split('?')[0]
}

function updateYamlString (yamlString, updateObject) {
  for (var key in updateObject) {
    var regex = new RegExp('^( *' + key + ': +?).*', 'm')
    var match = yamlString.match(regex)
    if (match) {
      yamlString = yamlString.replace(regex, match[1] + updateObject[key])
    } else {
      yamlString += '\n' + key + ': ' + updateObject[key]
    }
  }
  return yamlString
}
