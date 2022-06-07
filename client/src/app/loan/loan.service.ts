import { Injectable } from '@angular/core';
import { Loan } from './model/Loan';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { Pageable } from '../core/model/page/Pageable';
import { LoanPage } from './model/page/LoanPage';


@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor(
    private http:HttpClient
  ) { }

  //Filtro de prestamos parametrizado por juego y/o cliente y/o fecha de prestamo
  getLoans(gameId?:number,customerId?:number,loanDate?:string,pageNumber?:number,pageSize?:number): Observable<LoanPage> {
    return this.http.get<LoanPage>(this.composeFindUrl(gameId,customerId,loanDate,pageNumber,pageSize));
  
  }

  // Recupera todos los prestamos
  getAllLoans(pageable: Pageable): Observable<LoanPage> {
    return this.getLoans(null, null, null, pageable.pageNumber, pageable.pageSize);
  
  }

  // Guarda un prestamo
  saveLoan(loan: Loan): Observable<boolean> {
      let url = 'http://localhost:8080/loan';

        if (loan.id != null) {
            url += '/'+loan.id;
        }

        return this.http.put<boolean>(url, loan);
  }

  private composeFindUrl(gameId?:number,customerId?:number,loanDate?:string,pageNumber?:number,pageSize?:number){
    let params = '';
    

    if (gameId != null) {
        params += 'idGame='+gameId;
    }

    if (customerId != null) {
        if (params != '') params += "&";
        params += "idCustomer="+ customerId;
    }

    if (loanDate != null) {
      let fecha = new Date(loanDate).toLocaleDateString('en-EN'); 
      if (params != '') params += "&";
      params += "loanDate="+ fecha;
    }

    if (pageNumber != null) {
        if (params != '') params += "&";
        params += "pageNumber="+ pageNumber;
    }
  
    if (pageSize != null) {
      if (params != '') params += "&";
      params += "pageSize="+ pageSize;
  }

    let url = 'http://localhost:8080/loan'

    if (params == '') return url;
    else return url + '?'+params;
  }
   
  deleteLoan(loan: Loan): Observable<any> {
    return this.http.delete('http://localhost:8080/loan/'+loan.id);
  }

}
