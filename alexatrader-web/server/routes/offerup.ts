// https://www.npmjs.com/package/node-craigslist
import { Router, Request, Response, NextFunction } from "express";
let requests = require('request');
let cheerio = require('cheerio');

var client = require('twilio')("AC621078e1d207d81638d8e24c9dd658c9", "c721b3668e0418a0db7e89edb11263be");

const offerupRouter: Router = Router();

// https://offerupnow.com/search/?q=iphone&sort=-posted&radius=10%2F#offers
let url = "https://offerupnow.com/search";
let url2 = "https://randomuser.me/photos";

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
    //
    // requests(url2, (error, res, body) => {
    //     console.log("Starting search now...");
    //     if (error) {
    //         console.log("Error:" + error);
    //         response.json(error);
    //     }
    //     //Check status code(200 is HTTP ok)
    //     console.log("Status code: " + res.statusCode);
    //     if (res.statusCode === 200) {
    //         var $ = cheerio.load(body);
    //
    //         let guylist = $(".come_in");
    //         let girllist = $("#photos_women");
    //         let guyArray = [];
    //         let girlArray = [];
    //
    //         console.log(guylist);
    //
    //         response.json("works");
    //
    //     }
    // });

    //
    // requests({
    //     url: `https://randomuser.me/api/?results=30&gender=female`,
    //     method: "GET",
    //     json: true
    // }, function(err, response2){
    //     if(err){
    //         console.log(err);
    //         response.json("nope");
    //     }else{
    //         let result = response2.body.results;
    //
    //         let menArray = [];
    //         for(let i = 0; i < 30;i++){
    //             menArray.push(result[i].picture.large);
    //         }
    //
    //         response.json(menArray);
    //
    //     };
    // });


    //
    // $.ajax({
    //     url: 'https://randomuser.me/api/',
    //     dataType: 'json',
    //     success: function(data) {
    //         console.log(data);
    //     }
    // });


    client.messages.create({
        body: "HAHAHAHAH BRUHHH",
        to: "+19089308704",
        from: "+19083602048"
    }, function(err, data){
        if(err){
            console.log(err);
            console.log("Could not send the message for some reason");
            response.json("done!")
        }else{
            console.log("Has been contacted");
            response.json("done!")
        };
    })


});





export { offerupRouter }
