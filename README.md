# EA_checkers

## Training
To train, run main.ts with the train method of the Checkers instance included.
Training methods can be defined in trainingPatterns.ts and passed to the train method.
Many training hyperparameters can be defined for each generation in a training pattern individually, or the key '999' can be used for general hyperparameter configuration. Specific generation hyperparameters will override general hyperparameters if the same parameter is defined in both.

Full generation details are logged to unique log files for each training instance in the ./generation_log directory, and training test scores against random, naive, and guided test bots are in the testScores_log.txt file in the outer directory.

To continue training from any generation of a previous training instance, run the Checkers.continueTrainingFromFile() method. Specify the directory of the file which contains the population data in json format (the file can still have a .txt extension) and provide the training pattern to follow and the generation in the pattern to start from.


## Playing
To play against the trained model in your browser, navigate to the outer directory in cmd and run the command `npm run dev`. Then go to localhost:3000 in your browser.