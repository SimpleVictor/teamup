import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {TabsComponent} from "../tabs/tabs.component";

declare var $:any;
declare var TweenMax;
declare var TweenLite;
declare var Bounce;
declare var Circ;
declare var Back;
declare var SlowMo;
declare var TimelineLite;
declare var CSSPlugin;
declare var wanderTween;
declare var ignoreRollovers;
declare var Power1;

@Component({
  templateUrl: 'build/pages/home/home.html',
})
export class HomePage {

  goLeft;

  robotAnimations;
  robot;
  robot2;

  rotationY = 0;

  constructor(public navCtrl: NavController) {

  }

  ionViewWillEnter(){
    CSSPlugin.defaultTransformPerspective;
    this.robot= $('.robot')[0];
    // this.robotAnimations = TweenMax.to(this.robot, 1, {scale:2, yoyo:true,repeat:-1,ease:Back.easeInOut});
    // this.robotAnimations = TweenMax.from(this.robot, 2, {y:'-200px', force3D:true,repeat:'infinite', yoyo:true, ease:Back.easeInOut});
    this.robotAnimations = TweenMax.from(this.robot, 2, {y:'-200px', force3D:true,repeat:'infinite', yoyo:true, ease:Power1.easeInOut});
    // this.robotAnimations = TweenMax.to(this.robot, 8,  {rotationY:360, force3D:true,repeat: 'infinite'});


    TweenMax.to(this.robot, 3, {scaleX:2.8, scaleY:2.8, force3D:true, yoyo:true, repeat:-1, ease:Power1.easeInOut});



  }

}
