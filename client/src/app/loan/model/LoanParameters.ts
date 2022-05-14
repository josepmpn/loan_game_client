import { Pageable } from "src/app/core/model/page/Pageable";
import { Customer } from "src/app/customer/model/Customer";
import { Game } from "src/app/game/model/Game";

export class LoanParameters {
    gameId: number;
    customerId: number;
    loanDate: string;
    pageNumber: number;
    pageSize: number;
}