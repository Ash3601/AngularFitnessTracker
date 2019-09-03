import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Subject, Subscription } from "rxjs";
import { map } from 'rxjs/operators';
import { AuthService } from "src/app/auth/auth.service";
import { Exercise } from "../exercise.model";
import { AngularFireAuth } from "angularfire2/auth";
import { UIService } from "src/app/shared/ui.service";
@Injectable()
export class TrainingService {

  // CANCEL SUBSCRIPTION
  fbSubcription: Subscription[] = [];

  //   create running exercise if any on start button click
  private runningExercise: Exercise;

  // Emit to the training component if the new exercise is selected
  exerciseChanged = new Subject<Exercise>();

  // Now we need to emit an event for the exercise changed to our new training component from the service
  exercisesChanged = new Subject<Exercise[]>();

  // finished exercise changed
  finishedExerciseChanged = new Subject<Exercise[]>();

  // constructor
  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private uiService: UIService) {}

  // Complete Exercise
  private finishedExercises: Exercise[] = [];

  private availableExercises: Exercise[] = [
    { id: "crunches", name: "Crunches", duration: 30, calories: 8 },
    { id: "touch-toes", name: "Touch Toes", duration: 180, calories: 15 },
    { id: "side-lunges", name: "Side Lunges", duration: 120, calories: 18 },
    { id: "burpees", name: "Burpees", duration: 60, calories: 8 }
  ];

  fetchAvailableExercises() {
    // return this.availableExercises.slice();
   this.fbSubcription.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          // throw(new Error());
          return docArray.map(doc => {
            // console.log(doc.payload.doc.data().name);
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data(),
            };
          });
        })
      ).subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        // [ ] array with a spread operator creates a copy
        this.exercisesChanged.next([...this.availableExercises]);
      },
      (err) => {
        this.uiService.showSnackbar('An error has occured, please try again later!', null, 4000); 
      }
      )
      
      );
  }

  // get into complete exercise
  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  // get into cancelled exercise
  // get progress to find calories burned
  cancelledExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      // calories: 100,
      // duration: 1000,
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  startExercise(selectedId: string) {

    this.runningExercise = this.availableExercises.find(
      (obj) => {
        return obj.name === selectedId;
      }
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  getExercises() {
    // return this.exercises.slice();
  }

  // get our running exercise object
  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubcription.push(this.db.collection('completedExercise').valueChanges()
    .subscribe((exercises: Exercise[]) => {
      // this.finishedExercises = [...exercises];
      this.finishedExerciseChanged.next(exercises);
    }));
  }

  // get our data to database
  private addDataToDatabase(exercise: Exercise) {
    exercise.username = this.afAuth.auth.currentUser.email;
    this.db.collection('completedExercise').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubcription.forEach(subs => subs.unsubscribe());
  }

  
}

