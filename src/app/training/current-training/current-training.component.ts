import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { DialogPosition, DialogRole, MatDialog } from "@angular/material";
import { StopTrainingComponent } from "./stop-training-component";
import { TrainingService } from "../new-training/training.service";

@Component({
  selector: "app-current-training",
  templateUrl: "./current-training.component.html",
  styleUrls: ["./current-training.component.css"]
})
export class CurrentTrainingComponent implements OnInit {
  // Setting progress
  progress = 0;

  // Total Set Time
  timer;

  // emit an event to listen at the training comp.
  // @Output()
  // exitTraining = new EventEmitter<void>();

  constructor(private dialog: MatDialog, private trainingService: TrainingService) {}

  ngOnInit() {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    let step = (this.trainingService.getRunningExercise().duration / 100) * 1000;
    // console.log('Running exercise duration' + this.trainingService.getRunningExercise().duration);
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100) {
        clearInterval(this.timer);
      }
    }, step);
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        /* If user selects yes then emit this event */
        // this.exitTraining.emit();
        this.trainingService.cancelledExercise(this.progress);
      } else this.startOrResumeTimer();
    });
  }
}
