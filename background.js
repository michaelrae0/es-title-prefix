/**
 * Constants
 */
const LOCAL = {
  prefix: 'local',
  domain: '://titan.local.expandshare.com',
}
const DEV = {
  prefix: 'dev',
  domain: '://titan.dev.expandshare.com',
}
const PROD = {
  prefix: 'prod',
  domain: '://app.expandshare.com',
}
const ENVIRONMENTS = [LOCAL, DEV, PROD]


/**
 * Add prefix when tab updates
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {

    ENVIRONMENTS.some(env => { // loop envs
      if (tab.url.includes(env.domain)) { // match env

        if (!tab.title.startsWith(env.prefix)) { // add prefix if not already added
          chrome.scripting.executeScript({
            target: { tabId },
            function: addPrefixToTitle,
            args: [env, tab], // add variables to script scope
          })
        }

        return true
      }
    })

  }
})


/**
 * prefix - tab title
 * @param {object} env 
 * @param {object} tab 
 */
function addPrefixToTitle(env, tab) {
  document.title = `${env.prefix} - ${tab.title}`
}
