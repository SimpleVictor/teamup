// https://www.npmjs.com/package/node-craigslist
import { Router, Request, Response, NextFunction } from "express";
let requests = require('request');
let cheerio = require('cheerio');


const offerupRouter: Router = Router();

// https://offerupnow.com/search/?q=iphone&sort=-posted&radius=10%2F#offers
let url = "https://offerupnow.com/search";

offerupRouter.post("/search", function (request: Request, response: Response, next: NextFunction) {

    let searchQuery = request.body.searchQuery;

    let pageToVisit = `${url}/?q=${searchQuery}`;
    console.log(pageToVisit);

    requests(pageToVisit, (error, res, body) => {
        console.log("Starting search now...");
        if (error) {
            console.log("Error:" + error);
            response.json(error);
        }
        //Check status code(200 is HTTP ok)
        console.log("Status code: " + res.statusCode);
        if (res.statusCode === 200) {
            var $ = cheerio.load(body);

            let fullList = $(".item_listing_id");
            let finalObj = [];

            for(let i = 0; i < fullList.length; i++){
                let currentObj = {
                    id: fullList[i].attribs.value,
                    href: $(".item-container > .item-pic > a")[2].attribs.href,
                    title: $(".item-container > .item-pic > a")[2].attribs.title,
                    picture_url: $(".item-container > .item-pic > a > img")[2].attribs.src,                       price: ($(".item-container > .item-info > .item-info-price")[2].children[0].data).trim(),
                    distance_from_location: ($(".item-container > .item-info > .item-info-distance")[2].children[2].data).trim()
                }
                finalObj.push(currentObj);
            }

            // console.log(finalObj);

            response.json(finalObj);
        }
    });

});

offerupRouter.post("/retreive", function (request: Request, response: Response, next: NextFunction) {


});


offerupRouter.get("/save", function(request: Request, response: Response, next: NextFunction){




});


export { offerupRouter }
