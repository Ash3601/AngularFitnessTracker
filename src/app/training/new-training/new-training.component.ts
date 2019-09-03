import {
  Component,
  EventEmitter,
  Injectable,
  OnInit,
  Output,
  OnDestroy
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { AngularFirestore } from "angularfire2/firestore";
import { Observable, Subscription } from "rxjs";
import { TrainingService } from "./training.service";
import { map } from "rxjs/operators";
import { Exercise } from "../exercise.model";
@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"]
})
@Injectable()
export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output()
  trainingStart = new EventEmitter<void>();

  // Exercises subscription
  exerciseSubscription: Subscription;

  onStartTraining(form: NgForm) {
    // console.log(form.value.exercise);
    this.trainingService.startExercise(form.value.exercise);
  }

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}

  // exercises: Exercise[];
  exercises: Exercise[];

  ngOnInit() {
    // this.exercises = this.trainingService.getAvailableExercises();
    // We are getting an error here since we have exercises of type Exercise array
    // thus we need to create exercise of type observable
    // this.exercises =
    // this.exercises = this.trainingService.exercisesChanged.subscribe();
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      (exercises: Exercise[]) => {
        this.exercises = exercises;
      }
    );
    this.trainingService.fetchAvailableExercises();

    // .subscribe(result => {
    //   // for (let res of r) {
    //   //   console.log(res.payload.doc.data());
    //   // }
    //   console.log(result);
    // });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.exerciseSubscription.unsubscribe();
  }
}
