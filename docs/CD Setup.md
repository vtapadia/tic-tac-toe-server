For Travis
Added the travis file

For CD
Used Heroku to start with.
- Setup a account
- Install CLI for heroku and travis

To generate a token and add it to the .travis.yml file.
`travis encrypt $(heroku auth:token) --add deploy.api_key`


Lot of issues for the first time... some helful ideas.
PORT -> use the environment
localhost -> Don't use. Change application binding to 0.0.0.0
Check your command.
You can login to the bash using ```heroku run bash -a vtapadia-tic-tac-toe```
You can check the logs using ```heroku logs -a vtapadia-tic-tac-toe```
