import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from 'src/app/customer/customer.service';
import { Customer } from 'src/app/customer/model/Customer';
import { LoanEditComponent } from '../loan-edit/loan-edit.component';
import { GameService } from 'src/app/game/game.service';
import { Loan } from 'src/app/loan/model/Loan';
import { Game } from 'src/app/game/model/Game';
import { LoanService } from '../loan.service';
import { DialogConfirmationComponent } from 'src/app/core/dialog-confirmation/dialog-confirmation.component';
import { PageEvent } from '@angular/material/paginator';
import { Pageable } from 'src/app/core/model/page/Pageable';
import { MatTableDataSource } from '@angular/material/table';
import { LoanParameters } from '../model/LoanParameters';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})

export class LoanListComponent implements OnInit {

  customers : Customer[];
  games: Game[];
  loans: Loan[];
  filterCustomer: Customer;
  filterGame: Game;
  filterDate:string;
  
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['id', 'title', 'customer', 'start', 'end', 'action'];

  constructor(
      private gameService: GameService,
      private customerService: CustomerService,
      private loanService: LoanService,
      public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

      
    this.gameService.getGames().subscribe(
          games => this.games = games
      );

    
    this.customerService.getCustomers().subscribe(
          customers => this.customers = customers
      );

      this.loadPage();
  }

  loadPage(event?: PageEvent) {

    let pageable : Pageable =  {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sort: [{
            property: 'id',
            direction: 'ASC'
        }]
    }

    if (event != null) {
        pageable.pageSize = event.pageSize
        pageable.pageNumber = event.pageIndex;
    }

    this.loanService.getAllLoans(pageable).subscribe(data => {
        this.dataSource.data = data.content;
        this.pageNumber = data.pageable.pageNumber;
        this.pageSize = data.pageable.pageSize;
        this.totalElements = data.totalElements;
    });

    }  

  onCleanFilter(): void {
      this.filterGame = null;
      this.filterCustomer = null;
      this.filterDate = null;

      this.onSearch();
  }

  onSearch(): void {

    let pageable : Pageable =  {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sort: [{
            property: 'id',
            direction: 'ASC'
        }]
    }
    
    let customerId = this.filterCustomer != null ? this.filterCustomer.id : null;
    let gameId = this.filterGame != null ? this.filterGame.id : null;
    let loanDate = this.filterDate != null ? this.filterDate: null;

    this.loanService.getLoans(gameId, customerId, loanDate, pageable.pageNumber, pageable.pageSize).subscribe(data => {
        this.dataSource.data = data.content;
        this.pageNumber = data.pageable.pageNumber;
        this.pageSize = data.pageable.pageSize;
        this.totalElements = data.totalElements;
    });
      
  }

  createLoan() {    
      const dialogRef = this.dialog.open(LoanEditComponent, {
          data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
          this.ngOnInit();
      });    
  }  



   deleteLoan(loan: Loan){

    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
        data: { title: "Eliminar prestamo", description: "Atención si borra el prestamo se perderán sus datos.<br> ¿Desea eliminar el prestamo?" }
      });
  
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.loanService.deleteLoan(loan).subscribe(result => {
             this.ngOnInit();
          }); 
        }
      });
    }

}
