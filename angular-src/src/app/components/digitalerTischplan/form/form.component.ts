import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TischplanService } from '../../../services/tischplan.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Table } from '../../../../../Table';


@Component({
  selector: 'app-form',
  templateUrl: 'form.component.html',
  styleUrls: ['../tischplan.component.css']
})
export class FormComponent implements OnInit {

  @Input('newInformationElements') newInformationElements: any[] = [];
  @Input('dateGenerated') dateGenerated: any;
  @Input('title') title: string;
  @Input('roomNumber') roomNumber: string;
  @Input('tableNumber') tableNumber: string;
  @Input('nameTraceInput') nameTraceInput: string;
  @Input('employee') employee: string;
  @Input('tablesRestaurant') tablesRestaurant: Table[];
  @Input('tablesPanorama') tablesPanorama: Table[];
  @Input('tablesWintergarten') tablesWintergarten: Table[];
  @Input('tablesSonnbergZirbn') tablesSonnbergZirbn: Table[];
  @Input('showInfoFormBool') showInfoFormBool: boolean;
  @Input('showNotizFormBool') showNotizFormBool: boolean;
  @Input('notizElements') notizElements: any;
  @Input('showWintergartenBool') showWintergartenBool: boolean;
  @Input('showSonnbergZirbnBool') showSonnbergZirbnBool: boolean;
  @Input('showPanoramaBool') showPanoramaBool: boolean;
  @Input('showRestaurantBool') showRestaurantBool: boolean;
  @Input('showAlleBool') showAlleBool: boolean;
  @Output()
  notizResponse:EventEmitter<any> = new EventEmitter();
  @Output()
  changeColorIfAnreiseExport:EventEmitter<any> = new EventEmitter();
  parts: any[] = [];
  notizInput: string;
  departmentNotizInput: string;
  departments: any[] = [];
  employees: any[] = [];
  notizDate: any;

  constructor(private tischplanService: TischplanService, private _flashMessagesService: FlashMessagesService) {
    this.departments = ["Sonnberg-Zirbn", "Restaurant", "Wintergarten", "Panorama"];
    this.employees = ["Alexandra Lopion", "Julia Ackermann", "Torsten Streit", "Sabrina Schrötwieser", "Loreen Kumpfert", "Aylin Fiedler", "Julia Laue", "Richard Klöffel", "Tino Deisenroth", "Stefan Scheiber", "Dominic Mugambi", "Ralf Rohsmann", "Florian Thurner"];
  }

  ngOnInit() {
  }

  sendInformation(event) {
    event.preventDefault();
    this.dateGenerated = new Date();
    let newInformation = {
      text: this.title,
      roomNumber: this.roomNumber,
      tableNumber: this.tableNumber,
      date: this.dateGenerated,
      name: this.nameTraceInput,
      employee: this.employee
    };
    if (newInformation.text === undefined) {
      this._flashMessagesService.show('Die Nachricht ist leer ... ',
        {cssClass: 'alert-danger', timeout: 20000});
      return;
    } else {
      this._flashMessagesService.show('Erfolgreich Information gespeichert ... ',
        {cssClass: 'alert-success', timeout: 20000});
    }
    console.log(newInformation.tableNumber);

    if (newInformation.tableNumber) {
      this.tischplanService.sendInformation(newInformation)
        .subscribe(Information => {
          //console.log('Information: ' + JSON.stringify(Information.tables[0].tableNumber));
          console.log('Information: ' + JSON.stringify(Information));
          //console.log(Information.tables[0]);
          console.log("------");
          //console.log(Information[0].tables);

          if (Information === null) {
            return;
          } else {
            if (Information.tables[0].department === "Sonnberg-Zirbn") {
              for (let i = 0; i < this.tablesSonnbergZirbn.length; i++) {
                if (this.tablesSonnbergZirbn[i].number === Information.tables[0].number) {
                  this.tablesSonnbergZirbn[i] = Information.tables[0];
                }
              }
            } else if (Information.tables[0].department === "Panorama") {
              for (let i = 0; i < this.tablesPanorama.length; i++) {
                if (this.tablesPanorama[i].number === Information.tables[0].number) {
                  this.tablesPanorama[i] = Information.tables[0];
                }
              }
            } else if (Information.tables[0].department === "Restaurant") {
              for (let i = 0; i < this.tablesRestaurant.length; i++) {
                if (this.tablesRestaurant[i].number === Information.tables[0].number) {
                  this.tablesRestaurant[i] = Information.tables[0];
                }
              }
            } else if (Information.tables[0].department === "Wintergarten") {
              for (let i = 0; i < this.tablesWintergarten.length; i++) {
                if (this.tablesWintergarten[i].number === Information.tables[0].number) {
                  this.tablesWintergarten[i] = Information.tables[0];
                }
              }
            }
          }
        });
      this.changeColorIfAnreiseExport.emit();
    }
    this.tischplanService.sendInformationToBox(newInformation)
      .subscribe(Information => {
        //console.log('Information: ' + JSON.stringify(Information.tables[0].tableNumber));
        console.log('Information: ' + JSON.stringify(Information));
        //console.log(Information.tables[0]);
        //console.log("------");
        //console.log(Information[0].tables);
        this.newInformationElements.push(Information);
        console.log('this.newInformationElements' + this.newInformationElements);
      });
  }

  sendNotiz(event) {
    event.preventDefault();

    this.notizDate = String(new Date()).substring(0, 15);

    console.log(this.notizDate);

    let newNotiz = {
      notizInput: this.notizInput,
      departmentNotizInput: this.departmentNotizInput,
      date: this.notizDate
    };
    if (newNotiz.notizInput === undefined) {
      this._flashMessagesService.show('Die Nachricht ist leer ... ',
        {cssClass: 'alert-danger', timeout: 20000});
      return;
    } else {
      this._flashMessagesService.show('Erfolgreich Information gespeichert ... ',
        {cssClass: 'alert-success', timeout: 20000});
    }
    this.tischplanService.sendInformationToNotizBlock(newNotiz)
      .subscribe(Notiz => {
        //console.log('Information: ' + JSON.stringify(Information.tables[0].tableNumber));
        console.log('Information: ' + JSON.stringify(Notiz));
        //console.log(Information.tables[0]);
        //console.log("------");
        //console.log(Information[0].tables);
        this.notizResponse.emit(Notiz);
        this.notizElements = Notiz;
        console.log(this.notizElements);
        //console.log('this.newInformationElements' + this.newInformationElements);
      });

  }


}
