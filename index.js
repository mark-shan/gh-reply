require('dotenv').config();
const puppeteer = require('puppeteer');

const url = 'https://geekhack.org/index.php?action=post;topic=98411.0';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  while(true) {// Too lazy to figure out why login fails a few times
    await page.goto(url, {waitUntil: 'networkidle2'});
    const notLoggedIn = (await page.content()).match('Only registered members');
    if (notLoggedIn) console.log( "not logged in")
    else break;
    // Log in
    await page.type('input[name="user"][size="20"]', process.env.GH_USER);
    await page.type('input[name="passwrd"][size="20"]', process.env.GH_PASS);
    await page.click('div.roundframe input[value="Login"]');
    
  }
  
  console.log("logged in");
  i = 0;
  while(true) {

    await page.goto(url);
    await page.waitFor(200);    //geekhack pages created in <0.1s 

    const canPost = await page.$('#message');
    if (canPost) {
      await page.evaluate(()=>{
        document.querySelector('#message').value = 'oof';
      });
      await page.click('input[value="Post"]');

      console.log("posted");
      await page.pdf({path:'posted.pdf', format:'A4'});
      break;
    }
    else {
      console.log("n", i = (i + 1) % 2);
    }
  }
  
  await browser.close();
})();