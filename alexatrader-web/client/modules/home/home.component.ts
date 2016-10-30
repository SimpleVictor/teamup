import {Component, NgZone, AfterViewInit} from "@angular/core";
import * as CONFIGS from "../../myconfig";
import {FirebaseService} from "../../providers/firebase-service";
import {myJSON} from "../../json/team";



declare var firebase;
declare var $;
declare var TweenMax;
declare var Bounce;
declare var Circ;
declare var Back;
declare var SlowMo;
declare var TimelineLite;

@Component({
    selector: "home",
    styleUrls: [`client/modules/home/home.component.css`],
    templateUrl: `client/modules/home/home.component.html`
})
export class HomeComponent implements AfterViewInit{

    zone;

    users1 =[];
    users2 =[];


    individualUser = {
        picture: "",
        last_name: "",
        first_name: "",
        email: ""
    };

    secondStarter:number = 4;

    constructor(public firebase_service: FirebaseService) {
        var config = {
            apiKey: CONFIGS.myConfigs.apiKey,
            authDomain: CONFIGS.myConfigs.authDomain,
            databaseURL: CONFIGS.myConfigs.databaseURL,
            storageBucket: "",
            messagingSenderId: CONFIGS.myConfigs.messagingSenderId
        };
        firebase.initializeApp(config);

        this.zone = new NgZone({enableLongStackTrace: false});
        let valueChanged = firebase.database().ref("/Listener");

        valueChanged.on("value", (snapshot) => {

            let obj = snapshot.val();
            console.log(obj);

            this.zone.run(() => {
                Object.keys(obj).forEach((key) => {
                    if(obj[key].active === 1){
                        this[key](key, obj);
                    }
                });
            });
        });


    }

    ngAfterViewInit(){
        let myData = JSON.parse(myJSON);
        console.log(myData);

        let page1 = [];
        let page2 = [];
        let page3 = [];


        for(let i = 0; i < myData.length; i++){
            if(i <= 9){
                page1.push(myData[i]);
            }else if(i >= 10 && i <= 19){
                page2.push(myData[i]);
            }else{
                page3.push(myData[i]);
            }
        }

        for(let i = 0; i < page1.length; i++){
            if(i <= 4){
                this.users1.push(page1[i]);
            }else{
                this.users2.push(page2[i]);
            }
        }

        // console.log(this.users1);
        // console.log(this.users2);


        // var half_length = Math.ceil(page1.length / 2);
        // var leftSide = page1.splice(0,half_length);
        // console.log(leftSide);

    }


    refreshSkill(skill){
        this.firebase_service.Refresh_ActiveSkill(skill).subscribe(
            (data) => {
                console.log("Sucessfylly changed the data");
            }, (err) => {
                console.log(err);
            }
        );
    }

    SetUpMainPage(message, robot){


        let robot_container = $('.robot-container');

        console.log("new one2");

        //do animations on robot
        TweenMax.to(robot_container, 2, {rotation: 720, scale: 0.4 , left: '39%', top: '92%',ease:Circ.easeOut});

        //get rid of message
        TweenMax.to(message, 1, {left: '100%',opacity: 0, ease:Circ.easeOut});

        //get rid of background
        // let background = $(".login-container");
        // console.log(background);

        let background = $(".login-container");
        background.css('background', 'none');

        //get rid of clouds
        let clouds = $('.opacityfade')[0];
        TweenMax.to(clouds, 2, {scale: 0, ease:Circ.easeOut});

        //Bring up the Shadoq
        let black_container = $(".black-container");
        TweenMax.to(black_container, 1, {height: '100%' , background: 'rgba(0,0,0,0.9)', ease:Circ.easeOut});

        let initMessage = $('.initial-message')[0];

        console.log("###########");
        console.log(initMessage);

        setTimeout(() => {
            TweenMax.to(initMessage, 1, {opacity: 1 , ease:Circ.easeOut});
        }, 1500);



    }

    SetupNumber(skill){
        console.log(`Sucessfully received from ${skill}`);


        let MessageComplete = (message, callback, robot) => {
            connected_message[0].innerHTML = `You are now <span style='color: #46C92D'>connected</span>`;
            TweenMax.to(message, 1, {opacity: 1, left: '40%', ease:Circ.easeOut});
            setTimeout(() => {
                callback(message, robot);
            }, 2000);
        };

        let robot_circle = $('.circlepart')[0];

        let connected_message = $('.login-message1');

        TweenMax.to(connected_message, 1, {opacity: 0, ease:Circ.easeOut, onComplete: MessageComplete, onCompleteParams:[connected_message, this.SetUpMainPage, robot_circle]});

        let commands = $("#commands");
        TweenMax.to(commands , 1, {opacity: 1, ease:Circ.easeIn , delay: 3});
        TweenMax.to(commands, 1, {left: '2px',repeat:'infinite', yoyo:true ,ease:Circ.easeIn});

        let help_button = $("#help-button");
        TweenMax.to(help_button , 1, {opacity: 1, ease:Circ.easeIn , delay: 3});

        let hand = $("#handIcon");
        TweenMax.to(hand, 1, {opacity: 1, ease:Circ.easeIn, delay:3});
        TweenMax.to(hand, 1, {left: '2px',repeat:'infinite', yoyo:true ,ease:Circ.easeIn});



        this.refreshSkill(skill);
    }

    //QUERIES
    FindWithSkill(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    FindWhoNeedsTeam(skill){
        console.log(`Sucessfully received from ${skill}`);

        let connected_message = $('.login-message1')[0];
        TweenMax.to(connected_message, 1, {opacity: 0, ease:Circ.easeOut});

        let iniMessage = $(".initial-message")[0];
        TweenMax.to(iniMessage, 1, {opacity: 0, ease:Circ.easeOut});

        let user_profile = $(".users-box")[0];
        TweenMax.to(user_profile, 1, {opacity: 1, ease:Circ.easeOut});



        this.refreshSkill(skill);
    }

    FindIndividualName(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    FindDescriptionProject(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    FindSpecificTeam(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    //CHOOSING AN OPTION
    ChooseTeamMember(skill, respond){
        console.log(`Sucessfully received from ${skill}`);
        let numberAcc = respond[skill].respond;
        console.log(numberAcc);

        let UseMe;

        if(numberAcc <= 4){
            UseMe = this.users1[numberAcc];
        }else{
            UseMe = this.users2[numberAcc];
        }


        let user_profile = $(".users-box")[0];
        TweenMax.to(user_profile, 1, {opacity: 0, ease:Circ.easeOut});


        this.individualUser = UseMe;

        let indivi = $("#individual-user");
        TweenMax.to(indivi, 1, {opacity: 1, ease:Circ.easeOut});




        this.refreshSkill(skill);
    }

    LookUpHisTeamMate(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }


    //REQUESTING
    RequestToTextTeamParty(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    RequestToJoinTeam(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    RequestToTextIndividual(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    //UNIVERSALS COMMANDS
    GoToMainMenu(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }

    GoBackACommand(skill){
        console.log(`Sucessfully received from ${skill}`);
        this.refreshSkill(skill);
    }




}
