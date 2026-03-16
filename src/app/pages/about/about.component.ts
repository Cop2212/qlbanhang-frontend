import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../services/company.service';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  company: any;
  setting: any;

  constructor(
    private companyService: CompanyService,
    private settingService: SettingService
  ) { }

  ngOnInit(): void {

    // lấy thông tin công ty
    this.companyService.getCompany().subscribe((res: any) => {
      this.company = res;
    });

    // lấy logo
    this.settingService.getSetting().subscribe((res: any) => {
      this.setting = res;
    });

  }

}