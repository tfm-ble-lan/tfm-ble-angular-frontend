import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.scss']
})
export class AyudaComponent implements OnInit {

  activeInfo = '';
  
  constructor() { }

  ngOnInit(): void {
  }
  
  showFAQInfo() {
    this.activeInfo = 'faq';
  }

  showTermsInfo() {
    this.activeInfo = 'terms';
  }

  showPrivacyInfo() {
    this.activeInfo = 'privacy';
  }
}


