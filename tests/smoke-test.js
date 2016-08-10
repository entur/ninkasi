module.exports = {

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
        .click("[value^='14']")
        .pause(2000)
        .waitForElementVisible('#supplier-name', 2000)
        .pause(2000)
        .assert.containsText("#supplier-name", "Nordland")
        .pause(1000)
        .end()

  }

}
