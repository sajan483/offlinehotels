import { Component , Input , OnChanges , Output , EventEmitter} from '@angular/core';  

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() totalPage: number ;
  @Input() currentPage: number ;
  
  @Output() onPageChange: EventEmitter<number> = new EventEmitter();  
      
  public pages: number [] = [];  
  activePage:number; 

  constructor() { }

  ngOnChanges(){  
  } 
  
  onClickPage(pageNumber:number){  
    if(pageNumber < 1) return;
    if(pageNumber > this.pages.length) return;
    this.activePage = pageNumber;  
    this.onPageChange.emit(this.currentPage +1 );  
  }  
  onPreviousClicked(){
    this.onPageChange.emit(this.currentPage - 1 );
  }
  onNextClicked(){
    this.onPageChange.emit(this.currentPage + 1 );
  }
}
