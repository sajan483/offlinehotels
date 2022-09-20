import { Component, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges, OnInit {
  @Input() totalPage: number;
  @Input() currentPage: any;

  @Output() onPageChange: EventEmitter<number> = new EventEmitter();

  public pages: number[] = [];
  startPage = 1;
  endPage = 1;
  diff = 0;
  buttons: String[] = [];

  constructor() { }
  ngOnInit(): void {
    this.initializePages();
  }

  initializePages() {
    this.buttons = [];
    this.endPage = this.totalPage;
    this.startPage = (this.currentPage < 5) ? 1 : this.currentPage - 4;
    this.endPage = 8 + this.startPage;
    this.endPage = (this.totalPage < this.endPage) ? this.totalPage : this.endPage;
    this.diff = this.startPage - this.endPage + 8;
    this.startPage -= (this.startPage - this.diff > 0) ? this.diff : 0;

    if (this.currentPage > 1) this.buttons.push("Previous");
    for (let i = this.startPage; i <= this.endPage; i++) this.buttons.push("" + i);
    if (this.currentPage < this.endPage) this.buttons.push("Next");
  }
  ngOnChanges() {
    this.buttons = [];
    this.initializePages();
  }
  
  onPageClicked(page) {
    if ("Previous" == page) {
      this.onPageChange.emit(this.currentPage - 1);
    } else if ("Next" == page) {
      this.onPageChange.emit(this.currentPage + 1);
    } else {
      this.onPageChange.emit(page);
    }
  }
}
