const { Chromeless } = require('chromeless')

const USERNAME = ''
const PASSWORD = ''
const FILEPATH = '' // Ex: /Users/DaniloPolani/Desktop/file.jpg
const MEDIA_DESC = ''

async function run () {
  const browser = new Chromeless({
    scrollBeforeClick: true,
    implicitWait: true,
    viewport: {
      width: 360,
      height: 640
    }
  })

  await browser
    .setUserAgent('Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Mobile Safari/537.36')
    .goto('https://www.instagram.com/accounts/login/?hl=en')
    .wait('main button')

  // Find login button
  const loginButton = await browser.evaluate(findElementByText, 'Log In')

  // Do login
  await browser
    .evaluate(fill, USERNAME, 'input[name="username"]')
    .evaluate(fill, PASSWORD, 'input[name="password"]')
    .evaluate(click, 'form button')

  // Check if there is "Save credentials" screen
  const currentUrl = await browser.evaluate(() => window.location.href)
  if (currentUrl.indexOf('accounts/onetap/') > -1) {
    await browser.goto('https://www.instagram.com?hl=en')
  }

  // Upload image
  await browser
    .wait('nav[role="navigation"] form input')
    .evaluate(() => {
      // document.querySelector('nav[role="navigation"]').style.cssText = 'position:absolute;top:50px'
      // document.querySelector('nav[role="navigation"] form input').className = ''
    })

  // Create Instagram log to allow file upload
  await browser.evaluate(click, '.coreSpriteFeedCreation')

  // Wait for ajax ends
  await sleep(1000)

  // Upload file
  await browser.setFileInput('nav[role="navigation"] form input', FILEPATH)
  await browser.evaluate(actualValue => {
    const input = document.querySelector('nav[role="navigation"] form input')
    const event = new Event('change', { bubbles: true })
    event.simulated = true
    input.dispatchEvent(event)
  })

  // Click "Next"
  await browser
    .wait('.createSpriteExpand')
    .evaluate(clickByText, 'Next')

  // Click share
  await browser
    .wait('.coreSpriteLocation')
    .wait('textarea')

  await sleep(1000)

  await browser
    .evaluate(fill, MEDIA_DESC)
    .evaluate(clickByText, 'Share')

  // await browser.end()
}

run().catch(console.error.bind(console))

/**
 * Find an element by its text
 *
 * @param  {String} t - Text to be find
 * @param  {String} e - Element selector
 * @return {*}
 */
function findElementByText (t, e = 'button') {
  for (let i = 0, b; b = document.querySelectorAll(e)[i]; i++) {
    if (b.innerText === t) {
      return '.' + b.getAttribute('class')
        .trim()
        .split(' ')
        .filter(c => c.trim().length > 0)
        .join('.')
    }
  }

  return false
}

/**
 * Click an element
 * 
 * @param  {String} e - Element selector
 */
function click (e) {
  document.querySelector(e).click()
}

/**
 * Click an element by its text
 * 
 * @param  {String} e - Element selector
 */
function clickByText (t, e = 'button') {
  for (let i = 0, b; b = document.querySelectorAll(e)[i]; i++) {
    if (b.innerText === t) {
      b.click()
    }
  }
}

/**
 * Type in an input
 *
 * @param  {String} v - New value
 * @param  {String} e - Element selector
 */
function fill (v, e) {
  const input = document.querySelector(e)
  const lastValue = input.value
  input.value = v
  const event = new Event('input', { bubbles: true })
  // hack React15
  event.simulated = true
  // hack React16
  const tracker = input._valueTracker
  if (tracker) {
    tracker.setValue(lastValue)
  }
  input.dispatchEvent(event)
}

/**
 * Sleep
 *
 * @param  {int} ms
 */
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
