import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingService } from '../../services/setting.service';
import { CompanyService } from '../../services/company.service';
import { Setting } from '../../models/setting';
import { Company } from '../../models/company';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  setting?: Setting;
  company?: Company;

  constructor(
    private settingService: SettingService,
    private companyService: CompanyService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    
    // Load setting
    this.settingService.getSetting().subscribe(res => {
      this.setting = res;
      // Set Browser Title
      if (res.site_name) {
        this.titleService.setTitle(`Giới thiệu | ${res.site_name}`);
      }
    });

    // Load company info
    this.companyService.getCompany().subscribe(res => {
      this.company = res;
    });

  }

}