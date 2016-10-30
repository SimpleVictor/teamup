// https://www.npmjs.com/package/node-craigslist
import { Router, Request, Response, NextFunction } from "express";
let requests = require('request');
let cheerio = require('cheerio');


const offerupRouter: Router = Router();

// https://offerupnow.com/search/?q=iphone&sort=-posted&radius=10%2F#offers
let url = "https://offerupnow.com/search";

offerupRouter.post("/search", function (request: Request, response: Response, next: NextFunction) {




});

offerupRouter.post("/retreive", function (request: Request, response: Response, next: NextFunction) {


});


offerupRouter.get("/save", function(request: Request, response: Response, next: NextFunction){

    console.log(cheerio);




    let pageToVisit = `${url}/?q=monitors`;
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
            //Parse the document body
            var $ = cheerio.load(body);
            //Log out the title name(testing if cheerio works)
            console.log("made it");
            console.log("Page title: " + $('title').text());
            response.json("works");

        }

    });


});


export { offerupRouter }
