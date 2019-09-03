import { Component, OnInit } from "@angular/core";
import { TrainingService } from "./new-training/training.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-training",
  templateUrl: "./training.component.html",
  styleUrls: ["./training.component.css"]
  // providers: [TrainingService]
})
export class TrainingComponent implements OnInit {
  trainingSubscription: Subscription;
  onGoingTraining = false;
  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.trainingService.exerciseChanged.subscribe(exercise => {
      // if exercise then ongoing true else false
      exercise ? (this.onGoingTraining = true) : (this.onGoingTraining = false);
    });
  }
}
