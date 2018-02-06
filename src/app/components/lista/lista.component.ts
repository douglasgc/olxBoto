import { Component, OnInit } from '@angular/core';
import { Item } from './../../providers/lista.type';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {

  constructor() { }

  editRow = null;
  tempEditObject = {};
  data:Array<Item> = [
    {
      id: 0,
      url: "teste",
      total: 100000,
      realizados: 10
    }
  ];

  edit(data:Item) {
    this.tempEditObject[ data.id ] = { ...data };
    this.editRow = data.id;
  }

  save(data:Item) {
    Object.assign(data, this.tempEditObject[ data.id ]);
    this.editRow = null;
  }

  cancel(data:Item) {
    this.tempEditObject[ data.id ] = {};
    this.editRow = null;
  }

  ngOnInit() {
    // this.data.forEach(item:Item => {
    //   this.tempEditObject[ item.id ] = {};
    // })
  }

}
