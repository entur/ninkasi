module.exports = {

  '@tags': ['smoke'],
  'Ninkasi loads' : function (browser) {
    browser
      .url(browser.launch_url)
      .waitForElementVisible('body', 1000)
      .pause(1000)
      .assert.containsText('#title', 'Providers')
      .end()
  },

  '@tags': ['smoke'],
  'Create new provider' : function (browser) {
    browser
      .url(browser.launch_url)
      .waitForElementVisible('body', 1000)
      .pause(1000)
      .assert.visible("#new-provider")
      .click("#new-provider")
      .pause(1000)
      .assert.visible("body")
      .assert.visible("button[type='submit']")
      .click("#back")
      .pause(1000)
      .assert.containsText("#title", 'Providers')
      .end()
  },

  '@tags': ['smoke'],
  'Edit new provider' : function(browser) {
      browser
        .url(browser.launch_url)
        .waitForElementVisible('body', 1000)
        .pause(500)
        .assert.visible("#select-supplier")
        .click("#select-supplier")
        .pause(200)
        .click("select option[value='18']")
        .pause(1000)
        .waitForElementVisible('.supplier-header h3', 2000)
        .assert.containsText(".supplier-header h3", "Telemark")
        .pause(1000)
        .end()

  }

}
