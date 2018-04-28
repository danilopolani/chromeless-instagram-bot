const { Chromeless } = require('chromeless')
const Colors = require('colors')

// Settings
const USERNAME = '' // Instagram username
const PASSWORD = '' // Instagram password
const URLS_FILEPATH = 'follow.txt' // Profiles URLS to follow
const FOLLOW_PRIVATE = false // Should it follow private profiles?
const WAIT_TIMEOUT = 10000 // Wait timeout between each follow
const offset = process.argv[2] || 1 // DO NOT EDIT -> Offset line to start with (pass it as arg: node follow.js <line>)

async function run () {
  console.log('Reading file...')

  // Read line by line the file
  const data = []
  const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(URLS_FILEPATH)
  })

  lineReader.on('line', line => {
    data.push(line)
  }).on('close', async () => {
    const totalLines = data.length
    let i = 0

    console.log(`Found ${totalLines} rows.`.bgGreen)
    console.log('Starting browser...')

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

    // Just to be sure
    await sleep(3000)

    for (let line of data) {
      i++

      // Offset
      if (i < offset) continue

      console.log(`Doing line ${i}/${totalLines}...`)
      try {
        // Go to URL
        await browser
          .goto(line + '?hl=en')
          .wait('main header')

        // Check if exists
        if (await browser.evaluate(findElementByText, 'Sorry', 'h2', false) !== false) {
          console.log(`Page not found. Skipping URL: ${line}`.red)
          continue
        }

        // Check if account is private
        const isPrivate = await browser.evaluate(findElementByText, 'This Account is Private', 'h2') !== false
        if (isPrivate && !FOLLOW_PRIVATE) {
          console.log(`Private account, not following. URL: ${line}`.yellow)
          continue
        }

        // Check if already following
        if (await browser.evaluate(findElementByText, 'Following') !== false) {
          console.log(`Already following. Skipping URL: ${line}`.yellow)
          continue
        }

        // Follow
        const followButton = await browser.evaluate(findElementByText, 'Follow')
        if (!followButton) {
          console.log(`Can't find Follow button on URL: ${line}`.red)
          continue
        }
        await browser.evaluate(click, followButton)

        // Success message
        console.log(`Now following: ${line}`.green)

        // Check if final row
        if (i === totalLines) {
          console.log(`Rows finished.`.bgGreen)
          await browser.end()
        } else {
          // Wait to process next one
          await sleep(WAIT_TIMEOUT)
        }
      } catch (e) {
        console.log(`Timeout failed. Skipping URL: ${line}`.bgRed)

        await sleep(2000)

        continue
      }
    }
  })

  // await browser.end()
}

run().catch(console.error.bind(console))

/**
 * Find an element by its text
 *
 * @param  {String} t - Text to be find
 * @param  {String} e - Element selector
 * @param  {Boolean} exact - Should it be an exact match or should it contain it?
 * @return {*}
 */
function findElementByText (t, e = 'button', exact = true) {
  for (let i = 0, b; b = document.querySelectorAll(e)[i]; i++) {
    if (b.innerText === t || (!exact && b.innerText.indexOf(t) > -1)) {
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
