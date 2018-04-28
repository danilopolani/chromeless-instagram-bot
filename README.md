# Chromeless Instagram Bot

Instagram Share + Follow Bots using Chromeless without API. It will follow the natural flow of the user, it won't invoke Instagram APIs, so if they will change them, the script will continue to work.

## Installation
1. Clone the repository with `git clone https://github.com/danilopolani/chromeless-instagram-bot`
1. Install the necessary deps with `yarn` or `npm`

## Share

The file `post.js` allows you to post an image programmatically.

### Configuration
Open the file `index.js` and insert your login credentials near `USERNAME` and `PASSWORD`.  
Now put a valid path of a media in the `FILEPATH` variable and, if you want to add a description, you can put it in the `MEDIA_DESC` variable. To create new lines in the description, just put a `\n`.

### Run

Execute in your terminal running `node post.js` and just wait.  
If you want the script to die when it finished, uncomment line 77: `// await browser.end()`.

## Follow

The script `follow.js` takes a bunch of urls from a file (default: `follow.txt`) and follows those accounts automatically.

**Features**
- Skip already following users
- Choose if to follow private accounts
- Check progress and errors in the console
- Choose which line to start from

### Configuration

As above, open the file `index.js` and insert your login credentials near `USERNAME` and `PASSWORD`.   

**Additional configuration:**

| Variable | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| URLS_FILEPATH | String | `follow.txt` | The filepath of the URLs to follow to |
| FOLLOW_PRIVATE | Bool | `false` | Choose if to follow private accounts |
| WAIT_TIMEOUT | Int | `10000` | Timeout milliseconds between each account |


### Run

Execute in your terminal running `node follow.js` and just wait.  
If you want to choose which line to start from, you can set it as third argument when running the script, example: `node follow.js 3`. 
