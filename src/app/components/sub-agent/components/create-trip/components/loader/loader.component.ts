import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  freeArray = ["1","2","3","4"];

  constructor()
   { }

  ngOnInit() {
  }

}