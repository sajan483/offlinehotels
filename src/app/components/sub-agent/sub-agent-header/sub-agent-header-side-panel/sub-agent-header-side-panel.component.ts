import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, Renderer2 } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sub-agent-header-side-panel',
  templateUrl: './sub-agent-header-side-panel.component.html',
  styleUrls: ['./sub-agent-header-side-panel.component.scss'],
  animations: [
    trigger('ContentAnimation', [
      state('hidden', style({
        overflow: 'hidden',
        left: '-100%',
        opacity: 0
      })),
      state('visible', style({
        left: '0',
        opacity: 1
      })),
      transition('hidden => visible', animate('0.4s ease')),
      transition('visible => hidden', animate('0.3s ease-in'))
    ]),
    trigger('OverlayAnimation', [
      state('hidden', style({
        opacity: 0,
        'pointer-events': 'none'
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('hidden <=> visible', animate('0.3s'))
    ]),
    trigger('modalOverlay', [
      state('hidden', style({
        opacity: 0,
        'pointer-events': 'none'
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('hidden <=> visible', animate('0.3s'))
    ]),
    trigger('modalAnimation', [
      state('hidden', style({
        'transform': 'translate(-50%,-50%) scale(0)',
        opacity: 0
      })),
      state('visible', style({
        'transform': 'translate(-50%,-50%) scale(1)',
        opacity: 1
      })),
      transition('hidden <=> visible', animate('0.3s'))
    ]),
    trigger('expand', [
      transition(':enter', [
        style({
          height: 0, opacity: 0, overflow: 'hidden'
        }),
        animate('0.3s', style({
          height: '*', opacity: 1, overflow: 'hidden'
        }))
      ]),
      transition(':leave',
        animate('0.3s', style({
          height: 0, opacity: 0, overflow: 'hidden'
        })))
    ])
  ]
})
export class SubAgentHeaderSidePanelComponent implements OnInit {

  @Input() currentState: string;
  @Input() selectedCurrencyCode: string;
  @Input() currencyList: any = [{currency: "SAR", precision: 2, rate: 1}];
  @Input() langList: any = [ {lang:'ar-AE',langName:'العربية'},{lang:'en-US',langName:'ENGLISH'}]
  @Input() selectedLanguage: string = '';
  @Input() profile:any;
  @Output() onClose = new EventEmitter();
  @Output() onCurrencyChange = new EventEmitter();
  @Output() onLanguageChange = new EventEmitter();
  @Output() navigate = new EventEmitter();
  @Output() navigetService = new EventEmitter();
  @Output() logout = new EventEmitter();
  @Input() isSubUser:boolean = false;

  modalState: string = 'hidden';
  modal: boolean = false;
  country: boolean = false;
  version:string = 'V-7.0.0';

  constructor(private renderer: Renderer2, @Inject(PLATFORM_ID) private platform: any) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platform)) {
      this.renderer.removeClass(document.body, 'overflow-hidden');
    }
  }

  close(action: string = 'hidden') {
    this.hideModal();
    this.onClose.emit(action);
  }

  hideModal() {
    this.modalState = 'hidden'
  }

  showModal(country: boolean = false) {
    this.country = country? true: false;
    this.modal = !this.modal;
    this.modalState = 'visible'
  }

  changeCurrencyValue(value){
    this.onCurrencyChange.emit(value);
    this.hideModal();
  }

  changeLangValue(value){
    this.onLanguageChange.emit(value);
    this.hideModal();
  }

  navigareUrl(url){
    this.navigate.emit(url);
    this.close();
  }

  navigateServiceUrl(url,service){
    this.navigetService.emit({url,service});
    this.close();
  }

  logoutUser(){
    this.logout.emit();
    this.close();
  }

}
