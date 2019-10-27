import {Component, NgModule, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {PokemonService} from './service/pokemon.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatDividerModule  } from '@angular/material/divider';
import { MatFormFieldModule  } from '@angular/material/form-field';
import { MatGridListModule  } from '@angular/material/grid-list';
import { MatInputModule  } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatSelectModule  } from '@angular/material/select';
import {MatCardModule, MatSliderModule} from '@angular/material';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'PokemonDek';
  pokemonForm: FormGroup;
  submitted = false;
  loading = null ;
  Null = null
  pokemons = []
  pokemon = {
    name : '',
    num : '',
    type : ''
  }
  data = []


  constructor(
    private pokemonService: PokemonService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    console.log('Getting list of pokemons ....')

    this.pokemons = this.pokemonService.pokemons
    this.data = this.pokemons
    this.onChanges();
    console.log('fetched pokemons list' , this.data)
  }


  async onChanges() {
    this.pokemonForm.valueChanges.subscribe(val => {
      // this.filterName()
      // this.filterNum()
      // this.filterType()
      this.filter()
    });
  }

  createForm() {
    this.pokemonForm = this.fb.group({
      name: [''],
      num: [''],
      type: ['']
    });
  }



  changeType(e) {
    this.pokemonForm.get('type').setValue(e.value, {
      onlySelf: true
    }) ;
  }






  async filter() {
    let name  =  this.pokemonForm.get('name').value
    let num  =  this.pokemonForm.get('num').value
    let type  =  this.pokemonForm.get('type').value

    if(!name && !num && type) {
      this.data = this.pokemons ;
      return
    }
    let nameData = !name ?  this.pokemons : await this.pokemons.filter(p =>( (p.name).toLowerCase().includes(name.toLowerCase()) ) )
    let numData = !num ?  this.pokemons : await this.pokemons.filter(p => ( (parseInt(p.id)) === (num) ) )
    let typeData = !type ? this.pokemons : await this.pokemons.filter(p=>p.type.includes((this.pokemon.type)) )


    this.data = this.intersection([numData,nameData,typeData])


  }
  intersection(arr) {
    var result = [];
    var lists;

    if(arr.length === 1) {
      lists = arr[0];
    } else {
      lists = arr;
    }

    for(var i = 0; i < lists.length; i++) {
      var currentList = lists[i];
      for(var y = 0; y < currentList.length; y++) {
        var currentValue = currentList[y];
        if(result.indexOf(currentValue) === -1) {
          var existsInAll = true;
          for(var x = 0; x < lists.length; x++) {
            if(lists[x].indexOf(currentValue) === -1) {
              existsInAll = false;
              break;
            }
          }
          if(existsInAll) {
            result.push(currentValue);
          }
        }
      }
    }
    return result;
  }




  filterType (){
    console.log('Filtering Type ....',this.pokemonForm.get('type').value)
    if(!this.pokemonForm.get('type').value) {
      this.data = this.pokemons ;
      return
    }
    console.log(this.data)
    this.data = this.pokemons.filter(p =>{
      return p.type.includes((this.pokemon.type));
    })
  }



}
