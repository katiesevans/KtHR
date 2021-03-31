import { Application } from "./lib/view";

import { ViewEnd } from "./views/end";
import { ViewExerciseGPS } from "./views/exercise_gps";
import { ViewExercise } from "./views/exercise";
import { ViewSelect } from "./views/select";

class MultiScreenApp extends Application {
  screens = { ViewSelect, ViewExerciseGPS, ViewExercise, ViewEnd };
}

MultiScreenApp.start("ViewSelect");
