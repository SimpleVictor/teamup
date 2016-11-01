import { Component, OnInit } from '@angular/core';
import {HomePage} from "../home/home";
import {SavedPage} from "../saved/saved";
import {SearchPage} from "../search/search";
import {BlogsPage} from "../blogs/blogs";
import {MorePage} from "../more/more";

@Component({
    templateUrl: 'build/pages/tabs/tabs.component.html'
})
export class TabsComponent implements OnInit {
  private tab1:any;
  private tab2: any;
  private tab3:any;
  private tab4:any;


  constructor() {

    this.tab1 = BlogsPage; //home
    this.tab2 = HomePage; //showcase
    this.tab3 = SearchPage; //database
    this.tab4 = MorePage; //error

    }


    ngOnInit() { }




}
