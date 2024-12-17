const { chromium } = require("playwright");
const database = require("./databaseconnection");
const ProductDB = require("./Model/productschema");
const crone = require("node-cron");
const transporter = require("./Nodemailer");

const run = async () => {
  const urls = [
    {
      urlsstring:
        "https://www.flipkart.com/franktime-avenger-attire-series-analog-watch-men/p/itmae3a1bc97a79a?pid=WATGQWY8GHK3T2W9&lid=LSTWATGQWY8GHK3T2W9P1HFRT&marketplace=FLIPKART&q=watches+for+men&store=r18%2Ff13&srno=s_1_37&otracker=search&otracker1=search&fm=Search&iid=en_2Vxua2F--fyrPU6dx_gu5iGvhT06bVT6YyL-jFSUIXmhkgIJig5CG9rOlhBtSqy8rWKVBhgWJTmc6byhWcTTKA%3D%3D&ppt=pp&ppn=pp&ssid=r4mh49hfr40000001734161864112&qH=959e134ef548e173",
      productnameclass: ".mEh187",
      productpriceclass: ".Nx9bqj",
    },
    {
      urlsstring:
        "https://www.flipkart.com/acer-nitro-5-amd-ryzen-hexa-core-5600h-8-gb-1-tb-hdd-256-gb-ssd-windows-11-home-4-graphics-nvidia-geforce-gtx-1650-144-hz-an515-45-an515-45-r712-gaming-laptop/p/itmc36343cef96ae?pid=COMGF8EY7WV5AGFC&lid=LSTCOMGF8EY7WV5AGFCBMVDTN&marketplace=FLIPKART&q=acer+nitro+laptop&store=6bo%2Fb5g&srno=s_1_1&otracker=AS_QueryStore_OrganicAutoSuggest_1_16_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_1_16_na_na_na&fm=organic&iid=c7b27424-9786-43f8-a68d-4882af9b5af0.COMGF8EY7WV5AGFC.SEARCH&ppt=browse&ppn=browse&ssid=97iguo09qo0000001734194871760&qH=e0375978b399e9a5",
      productnameclass: ".VU-ZEz",
      productpriceclass: ".Nx9bqj",
    },
  ];

  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext();

  const page = await context.newPage();
  let count = 0;
  for (const url of urls) {
    count = count + 1;
    await page.goto(url.urlsstring);
    await page.screenshot({ path: `example${count}.png`, fullPage: true });
    const productprice = await page.textContent(url.productpriceclass);
    const productname = await page.textContent(url.productnameclass);
    console.log(`${productname}:${productprice}`);

    const searchedProduct = await ProductDB.findOne({ url: url.urlsstring });
    if (!searchedProduct) {
      const savedproduct = new ProductDB({
        productname: productname,
        price: productprice,
        url: url.urlsstring,
        lastcheck: new Date(),
      });

      await savedproduct.save();
      console.log("product added sucessfull..");
    } else {
      if (productprice < searchedProduct.price) {
        console.log(
          `In flipkart ${productname} price is decreased from ${searchedProduct.price} to ${productprice}`
        );
        searchedProduct.price = productprice;
        searchedProduct.lastcheck = new Date();
        await searchedProduct.save();
        const html = `<p>Mail from nivashsubash32@gmail.com</p>
    <p>In flipkart ${productname} price is decreased from ${searchedProduct.price} to ${productprice} </p>
    <p>So if you want to buy you can...</p>
    `;

        const mailoption = {
          from: "nivashsubash32@gmail.com",
          to: "billanivash52@gmail.com",
          subject: "Webscrapping Product Alert..!",
          html: html,
        };

        transporter.sendMail(mailoption, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log(info.response);
          }
        });
      } else if (productprice > searchedProduct.price) {
        console.log(
          `In flipkart ${productname} price is increased from ${productprice} to ${searchedProduct.price}`
        );
        searchedProduct.price = productprice;
        searchedProduct.lastcheck = new Date();

          await searchedProduct.save();
          const html = `<p>Mail from nivashsubash32@gmail.com</p>
    <p>In flipkart ${productname} price is increased from ${searchedProduct.price} to ${productprice} </p>
    <p>So if you want to buy you can...</p>
    `;

        const mailoption = {
          from: "nivashsubash32@gmail.com",
          to: "billanivash52@gmail.com",
          subject: "Webscrapping Product Alert..!",
          html: html,
        };

        transporter.sendMail(mailoption, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log(info.response);
          }
        });
      } else {
        console.log("There is no update...");
      }
    }
  }

  await browser.close();
};

crone.schedule("0 5 * * *", () => {
  run();
});
