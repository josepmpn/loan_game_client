import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Author } from 'src/app/author/model/Author';
import { CustomerService } from 'src/app/customer/customer.service';
import { Customer } from 'src/app/customer/model/Customer';
import { GameService } from 'src/app/game/game.service';
import { Game } from 'src/app/game/model/Game';
import { LoanService } from '../loan.service';
import { Loan } from '../model/Loan';

@Component({
  selector: 'app-loan-edit',
  templateUrl: './loan-edit.component.html',
  styleUrls: ['./loan-edit.component.scss']
})
export class LoanEditComponent implements OnInit {

  customers: Customer[];
  games: Game[];
  loan: Loan;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });



  constructor(
    public dialogRef: MatDialogRef<LoanEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gameService: GameService,
    private customerService: CustomerService,
    private loanService: LoanService
   ) { }

    ngOnInit(): void {

        if (this.data.loan != null) {
            this.loan = Object.assign({}, this.data.loan);
        }
        else {
            this.loan = new Loan();
        }

        this.gameService.getGames()
        .subscribe(
            games => {
                this.games = games;
            }
        );

        this.customerService.getCustomers().subscribe(
            customers => {
                this.customers = customers;
            }
        );
    }

    onSave() {
        if (Math.floor((this.loan.end.getTime() - this.loan.start.getTime())/(16*24*60*3660))<=14){
            this.loanService.saveLoan(this.loan).subscribe(result => {
                if (result == true){
                    this.dialogRef.close();
                } else{
                    let mensaje ="El prestamo no cumple alguna de las siguientes condiciones:"+ "\n" 
                                +"1: El juego no puede estar prestado a dos clientes distintos con misma fecha de inicio" +"\n"
                                +"2: El mismo cliente no puede tener prestados más de 2 juegos con la misma fecha de inicio";
                    window.alert(mensaje); 
                }
                
            }); 
        }else{
            window.alert("No se permite prestamo de más de 14 días");
        }
           
    }  

    onClose() {
        this.dialogRef.close();
    }

}
