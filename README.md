# Mailman
Mailman aims to make sending emails easy. Using common spreadsheet functions, customize when you want to send your emails.
A powerful, easy to use mail merge solution for the City of Edmonton.
Mailman guides you through the process of setting up your own mail merge. Just use our merge tags! You can use <<>> to swap out data from your Google Sheets into your emails. Supercharge your email workflow today!

## Collaborate

Is Mailman missing a feature you need? Let us know by filling [this](https://docs.google.com/forms/d/e/1FAIpQLSdbnbN77OCClYjTty4p7j_d25-n0cit_4Mko2BKpIz-LUGedA/viewform) Google Form out. After ~20 minutes, it should show up in [Mailman's issue tracker](https://github.com/coe-google-apps-support/Mailman/issues).

## Features

* quickly set up email campaigns
* use Google Sheets functions to determine when to send your emails
* send up to 1500 emails per day
* store and reuse merge templates for future use
* create advanced bug trackers, inventory managers and more


## Dev Setup
* Install donet sdk (2.1 or greater): https://www.microsoft.com/net/download
* Install latest version of node: https://nodejs.org/en/
* Install clasp: https://github.com/google/clasp
* [TODO: fix process to be able to use "clasp create --rootDir ./gas"]: modify the .clasp.json file to point to the correct scriptId
* Run "clasp push" from the command line (one-time setup to push Code.js to an apps script project).

### UI Layer
* VSCode is recommended: https://code.visualstudio.com/
* Open the following folder in VSCode: {mailman_repo}/src/Mailman.Server/ClientApp
* Run the "start web" task (in the menu select Terminal->Run task...)
* Open the Apps script project deployed when you ran "clasp push"
* Run the Apps script project as a Test Add-On
* Happy Coding :) Any changes to the files in VSCode will automatically cause the add-on to refresh with the updated changes
