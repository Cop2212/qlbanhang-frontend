import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingService } from '../../services/setting.service';
import { Setting } from '../../models/setting';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  setting?: Setting;

  constructor(private settingService: SettingService) { }

  ngOnInit(): void {
    this.settingService.getSetting().subscribe(data => {
      this.setting = data;
    });
  }

}