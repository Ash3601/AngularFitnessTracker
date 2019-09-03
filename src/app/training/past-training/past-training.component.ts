import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Injectable
} from "@angular/core";
import { MatTableDataSource, MatSort, MatPaginator } from "@angular/material";
import { Exercise } from "../exercise.model";
import { TrainingService } from "../new-training/training.service";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-past-training",
  templateUrl: "./past-training.component.html",
  styleUrls: ["./past-training.component.css"]
})
@Injectable()
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  // get current user
  // currentUser: string = this.authService.getUsername();

  displayedColumns = [
    "date",
    "name",
    "calories",
    "duration",
    "state",
    "username"
  ];
  dataSource = new MatTableDataSource<Exercise>();
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  private finishedExerciseSubsription: Subscription;

  constructor(
    private trainingService: TrainingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.finishedExerciseSubsription = this.trainingService.finishedExerciseChanged.subscribe(
      (exercises: Exercise[]) => {
        this.dataSource.data = exercises;
        // this.dataSource.data.push(username: this.currentUser);
        // console.log(this.dataSource.data);
      }
    );
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.finishedExerciseSubsription.unsubscribe();
    // this.authService.getUsername();
  }

  // Filter
  doFilter(event: string) {
    this.dataSource.filter = event.trim().toLowerCase();
  }
}
