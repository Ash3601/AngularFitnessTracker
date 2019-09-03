import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";

@Injectable()
export class UIService {
    loadingStateChanged = new Subject<boolean>();

    constructor(private snackbar: MatSnackBar) {}
    showSnackbar(message: string, event, duration) {
        this.snackbar.open(message, null, {duration: duration});
    }
}