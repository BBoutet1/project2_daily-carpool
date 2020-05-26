# Daily Commuter Carpool (DCC)

This web application matches workers to share a daily ride as drivers and passenger on their way to/from work. The user selects a companion: a passenger if you are a driver or a driver if you are a passenger. To have an idea of the detour cost, the selection shows how much the driver route is detoured by comparing the driver direct route and the detoured route (to pick up the passenger) in term of distance and duration.

## Table of contents

<!-- ⛔️ MD-MAGIC-EXAMPLE:START (TOC:collapse=true&collapseText=Click to expand) -->
<details>
<summary>Click to expand</summary>

* [Technologies used](#technologies-used)
* [Installation](#installation)
* [Usage](#Usage)
* [Registration](#registration)
* [Sign in](#sign-in)
* [Companion selection](#companion-selection)
* [Futur developments](#future-developments)
* [Licence](#licence)
* [Author information](#author-information)
</details>
<!-- ⛔️ MD-MAGIC-EXAMPLE:END -->

## Technologies used

- HTML5
- CSS3
- Foundation (css framework)
- Javascript
- jQuery
- Node
- EXpress
- Node
- handlebars

## Installation

Command line:

```sh
node server.js
```

## Usage

#### Registration


- When, from the home page, you click on `Driver register` or `Passenger register` button or navigation link
a registration form is  presented in a new page. Your name, first name, home address, work address and a 
user name are required to submit the form.
- When you submit the form a success or failed prompt is presented
- If the user name entered belong to a registered user, you are prompted to choose another user name
- If your form submission is successfull, you are registered in the user category you chosed from the home page.


#### Sign in

- When, from the home page, you click on `User sing in` button or navigation link a sign in form is  presented in 
a new page. Your first name, user name and user category selection are required to sign in your profile.
- When you submit the form your profile is presented or a failed prompt is presented.
- If your sign in succeed, your profile is displayed with your name, your direct route on google map and route data in 
the table, together with a list of passenger options if you are a driver or list of driver options if you are a passenger.
- If your sign do not match any registered user a failed prompt is presented.

#### Companion selection

- When you select a companion (driver or passenger) from the list in your profile, 3 routes are displayer:
the passenger direct route, the driver direct route, and the driver detoured route to pick-up and dropp-off
the passenger. The driver detoured route data includes the time difference with his direct route in a table.
- When you click on the `Merge routes` button, driver and passenger directs routes disappear. Only the driver 
derouted route is then displayed on google map with passenger pick-up and dropp-off way ponts.
- When you deselect (no selection option) the driver, the profile and the route are reinitialized and only the user 
direct route is displayed..


## Futur developments

- The addresses validation at the registration step. No registration should be allowed with incorrect addresses or
nonexistent driving route
- Let the user to select tolls avoidance or not
- Detoured route distance, time and differences calculation when signing in for each option to allow user to directly
the best choice instead of checking each option. 
- Available options limitations to the best ones in term of detour cost (time and distance differences). 
- Notification email to the selected option user as additional function for the `Merge routes` button.
- The latest arrival time as additional filters to match passengers and drivers
- Errors handling.
- Complete the Contact Us code with an email submission form
- Complete the menu icon: about us, application use, etc.
- Thinking about to include the food delivery usind detoured driver routes.
- Make the code cleaner


## Licence

© 2020. All Rights Reserved.

## Authors information   

- Brice Boutet 
    - GitHub : [BBoutet1](https://github.com/bboutet1)
- Bernard Isaac
    - GitHub : [FreezerBurns](https://github.com/FreezerBurns)
- Joey Billingsley
    - GitHub : [jbills97](https://github.com/jbills97)