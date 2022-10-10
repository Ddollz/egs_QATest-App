# egs_QATest-App
 For Interns

For quilljs error
npm i ngx-quill
npm i @types/quill@1

For Angular Material Error
ng add @angular/material

For Angular Split
npm install angular-split

Initial angular json production size
- ng build
"configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "outputHashing": "all"
            },
