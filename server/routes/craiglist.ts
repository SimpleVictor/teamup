import { Router, Request, Response, NextFunction } from "express";
let craigslist = require('node-craigslist');


const craiglistRouter: Router = Router();

let client = new craigslist.Client({
    baseHost : 'craigslist.org',
    city : 'cnj'
});




let listStorage;
let detailStorage;

craiglistRouter.post("/search", function (request: Request, response: Response, next: NextFunction) {


    console.log(request.body);

    let searchItem = request.body.searchItem;


    console.log(client);

    client
        .search(searchItem)
        .then((listings) => {
            let obj = [];
            // play with listings here...
            console.log(listings.length);
            listStorage = listings;
            // listings.forEach((listing) => {
            //     obj.push(listing);
            // });
            response.json(listings);
        })
        .catch((err) => {
            console.error(err);
            response.json(err);
        });


});

craiglistRouter.post("/retreive", function (request: Request, response: Response, next: NextFunction) {


    console.log(request.body);
    let userID = request.body.userID;

    client
        .details(listStorage[userID])
        .then((details) => {
            detailStorage = details;
            console.log(details);
            response.json();
        })
        .catch((err) => {
            console.error(err);
            response.json(err);
        });
});


craiglistRouter.post("/save", function(request: Request, response: Response, next: NextFunction){


    

});


export { craiglistRouter }
