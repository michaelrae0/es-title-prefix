/**
 * Constants
 */
const LOCAL = {
  prefix: 'local',
  match: '://titan.local.expandshare.com',
}
const BRANCH = {
  prefix: 'branch',
  match: '/g-branches/',
}
const DEV = {
  prefix: 'dev',
  match: '://titan.dev.expandshare.com',
  sub_envs: [BRANCH],
}
const PROD = {
  prefix: 'prod',
  match: '://app.expandshare.com',
}

// root level envs
const ENVIRONMENTS = [LOCAL, DEV, PROD]


/**
 * Add prefix when tab updates
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    const env = getEnvironment(tabId, tab, ENVIRONMENTS)

    if (env && !tab.title.includes(env.prefix)) { // add prefix if not already added
      chrome.scripting.executeScript({
        target: { tabId },
        function: addPrefixToTitle,
        args: [env, tab], // add variables to script scope
      })
    }
  }
})


/**
 * Returns active environment
 * Checks root environments, then sub environments
 */
function getEnvironment(tabId, tab, envs) {
  for (const env of envs) { // loop envs
    if (tab.url.includes(env.match)) { // match env
      if (env.sub_envs) { // return sub_env if match
        const sub = getEnvironment(tabId, tab, env.sub_envs)
        if (sub) return sub
      }

      return env // return env
    }
  }
}


/**
 * prefix - tab title
 * @param {object} env 
 * @param {object} tab 
 */
function addPrefixToTitle(env, tab) {
  document.title = `${env.prefix} - ${tab.title}`
}
