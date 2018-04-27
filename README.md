# Chromeless Instagram Post

Post to Instagram using Chromeless without API. It will follow the natural flow of the user, it won't invoke Instagram APIs, so if they will change them, the script will continue to work.

## Installation
1. Clone the repository with `git clone https://github.com/danilopolani/chromeless-instagram-post/`
1. Install the necessary deps (actually only Chromeless) with `yarn` or `npm`

## Configuration
Open the file `index.js` and insert your login credentials near `USERNAME` and `PASSWORD`.  
Now put a valid path of a media in the `FILEPATH` variable and, if you want to add a description, you can put it in the `MEDIA_DESC` variable. To create new lines in the description, just put a `\n`.

## Run

Execute in your terminal `node index.js` and just watch.  
If you want the script to die when it finished, uncomment line 77: `// await browser.end()`.
