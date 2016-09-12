module.exports = {

  '@tags': ['smoke'],
  'Create new provider' : function (browser) {
    browser
      .url(browser.launch_url)
      .waitForElementVisible('body', 1000)
      .assert.visible("body")
      .end()
  }

}
