<div id="top"></div>

<!-- TABLE OF CONTENTS -->


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#introduction">Introductions</a>
    </li>
    <li>
      <a href="#contributors">Contributors</a>
    </li>
    <li><a href="tech-stacks">Tech Stacks</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installations</a></li>
      </ul>
    </li>
    <li><a href="#configuration">Configuration</a></li>
    <li><a href="#running-locally">Running Locally</a></li>
    <li><a href="#troubleshooting">Troubleshooting</a></li>
    <li><a href="#frequently-asked-question">FAQ</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


## Introduction
<div align="center">
 
 ![alt text](https://res.cloudinary.com/dkboobgab/image/upload/v1646798163/eTimely-540x200_el1kmn.png)
  </div>


eTimely is a responsive web app that allows businesses and employees to communicate about scheduling, staff availability, and anything else related to the workplace.

The goal of creating this software is to provide organizations with a tool to manage and communicate employee schedules in an efficient and timely manner. We think that such a service will aid in the reduction of scheduling and communication issues between coworkers and management.

The purpose of this project is to create a web application that allows restaurants and other similar-sized enterprises to better create and share schedules. This will be accomplished by having two distinct account types, "business" and "staff." Each employee will have their own account where they will be able to post their weekly availability and request time off. This information will be submitted to the business account at their workplace for approval. This information will then be used by a manager to create a schedule for the staff. When the management creates a timetable, it is made available to the staff for viewing. 

As for the objective of this project, we want to create a web application that will help the
business manage time effectively. In doing this, our web application will allow schedules to be
made in less time, with less errors. This will cultivate a practice which will make better use of
time and cut down on inefficiency. 

<p align="right">(<a href="#top">back to top</a>)</p>


## Contributors
  - **Seyed Ziae Mousavi Mojab** - Course Professor
  - **Gayathri Darla** - Assigned Graduate Teaching Assistant
  - **Matt Korte** - Team Lead
  - **Caleb Obi** - Database, Backend, and Quality Assurance Lead
  - **Chris Gumieny** - UI and Frontend Lead
  - **Samia Chowdhury** - Presentation, Documentation, and Communications Lead

<p align="right">(<a href="#top">back to top</a>)</p>

## Tech Stacks
| Software & Services | Purpose |
| ------ | ------ |
| [React.js v17.0.2](https://reactjs.org/) | UI Development |
| [Node.js v16.13.2](https://nodejs.org/en/) | Server Development |
| [Express.js v4.17.2](https://expressjs.com/) | API Development |
| [Jest v27.4](https://expressjs.com/)  | Testing Framework |
| [Cloud Firestore](https://firebase.google.com/docs/firestore) | NoSQL Database |

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started
Instructions for setting up the eTimely project locally are provided below

### Prerequisites
1. [Installing Node,js on Windows](https://kinsta.com/blog/how-to-install-node-js/)

2. [Installing Node.js on Mac](https://kinsta.com/blog/how-to-install-node-js/)
3. Check version of Node.js
   ```sh
   Node --version
   ```
4. Installing npm
   ```sh
   npm install -g npm
   ```
5. Check version of npm
   ```sh
   npm --version
   ```
6. Creating up Firestore Project on the Firesbase console
- Go to [Firebase Console](https://console.firebase.google.com/u/0/)
- Sign into an existing google account
- Click "Create a Project"
- Enter Project Name and accept all conditions and click "Continue"
- Accept Google Analytics terms and conditions and click "Create Project"


7. Create a Cloud Firestore database for the application
- Navigate to "Project Overview" tab
- You will see the following screen that says "Get Started by Adding Firebase to your app"
- Select "Web"
- Enter name of application (e.g eTimely) and click "Register App"
- You will see all the Firebase configuration and keys needed to connect your application to a Firestore database

8. Linking application to a Firestore database 
- In the frontend and backend directory, enter the following on your terminal to install all Firebase dependecies
  ```sh
  npm install Firebase
  ```
- After installation, navigate back to Firebase console and grab all the configuration keys. These keys will look similar to:
  ```js
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  import { getAnalytics } from "firebase/analytics";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "YOUR PRIVATE KEY",
    authDomain: "YOUR PRIVATE KEY",
    projectId: "YOUR PRIVATE KEY",
    storageBucket: "YOUR PRIVATE KEY",
    messagingSenderId: "YOUR PRIVATE KEY",
    appId: "YOUR PRIVATE KEY",
    measurementId: "YOUR PRIVATE KEY"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  ```
  
 - Enter all your private Firebase configuration keys in an .env file. Reference the <a href="#configuration">Configuration</a> section to see how to setup environment variables for the eTimely application


9. Setting up Nodemailer to send emails
- Install Nodemailer
  ```sh
  npm install nodemailer
  ```
  
10. Configuring Nodemailer
- To configure Nodemailer to work with the eTimely application, make sure that your actively signed into a gmail account. <br> If you don't have any gmail account to use, use this link to [create a Gmail account:](https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp)
- Once you have your email configured and set up, paste your email address and password in your .env file
  ```js
  EMAIL_USER=ENTER EMAIL ADDRESS HERE
  EMAIL_PASSWORD=ENTER EMAIL PASSWORD
  ```



### Installation
You can clone the eTimely repository in two different ways, using HTTPS and SSH.
1. Clone the repository using HTTPS
   ```sh
   git clone https://github.com/eTimely/CSC4996_eTimely.git
   ```
2. Clone the repository using SSH
   ```sh
   git clone git@github.com:eTimely/CSC4996_eTimely.git 
   ```


<p align="right">(<a href="#top">back to top</a>)</p>

## Configuration
Instructions on how to set up environment variables for the eTImely Project can be found below:
1. Setting up environment variables in the frontend directory
   ```sh
   cd Frontend
   ```
   * Create an .env file in the root directory
   * Paste the following into your .env file and fill each values with your private firebase configurations
   ```js
    NODE_ENV=development
    REACT_APP_FIREBASE_API_KEY='ENTER FIREBASE API KEY HERE'
    REACT_APP_FIREBASE_AUTH_DOMAIN='ENTER AUTH DOMAIN HERE'
    REACT_APP_FIREBASE_DATABASE_URL='ENTER FIREBASE DATABASE URL'
    REACT_APP_FIREBASE_PROJECT_ID="ENTER FIREBASE PROJECT ID HERE"
    REACT_APP_FIREBASE_STORAGE_BUCKET='ENTER FIREBASE STORAGE BUCKET'
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID='ENTER FIREBASE MESSAGING SENDER ID HERE'
    REACT_APP_FIREBASE_APP_ID='ENTER FIREBASE APP ID HERE'
    ```
2. Setting up environment variables in the backend directory
   ```sh
   cd Backend
   ```
   * Create an .env file in the root directory
   * Paste the following into your .env file and fill each value with your private firebase configurations
   ```js
    NODE_ENV=production
    PORT=ENTER PORT HERE
    HOST=localhost
    HOST_URL=ENTER LOCALHOST URL e.g: https://localhost:5001/


    API_KEY=ENTER API KEY
    AUTH_DOMAIN=ENTER AUTH DOMAIN HERE
    DATABASE_URL=ENTER DATABASE URL HERE
    PROJECT_ID=ENTER PROJECT ID HERE
    STORAGE_BUCKET=ENTER STORAGE BUCKET HERE
    MESSAGING_SENDER_ID=ENTER MESSAGE SENDER ID HERE
    APP_ID=ENTER APP ID HERE

    JWT_KEY=CREATE JWT KEY HERE
    JWT_SECRET=CREATE JWT SECRETS HERE

    EMAIL_USER=ENTER EMAIL ADDRESS HERE
    EMAIL_PASSWORD=ENTER EMAIL PASSWORD
    ```
   

<p align="right">(<a href="#top">back to top</a>)</p>

## Running Locally
The eTimely repository is divided into two directories, The Frontend and Backend. 
* The Frontend is responsible for all the user interfaces that the client will interact with.
* The Backend directory handles all the processing, authentication and programming logic that allows the application to work with the database.

To run the application, you need to have both the client and the server running, instructions on how to do that are listed below:
1. Running Frontend
  ```sh
   cd Frontend
   npm start
   Paste http://localhost:3000/ on your browser.
   ```
2. Running Backend
  ```sh
   cd Backend
   npm run start-dev
   ```


<p align="right">(<a href="#top">back to top</a>)</p>

## Troubleshooting
1. Cannnot send emails using nodemailer?
- Make sure backend server is up and running
- Make sure your signed into an email account while using the eTimely application
- Make sure to you include your email address and password in the .env file. See <a href="#configuration">Configuration</a> for more information.

2. Cannot sign into my account?
- Make sure backend server is up and running
- Check internet connection
- Restart application

3. Firebase GPC connection error?
-  Type "Restart"or "rs" on your terminal to restart Firebase connection

4. Missing depencies while compiling Frontend directory
- Type the following on your terminal to install any missing dependencies:
  ```sh
  npm install
  npm start
  ```


<p align="right">(<a href="#top">back to top</a>)</p>


## Frequently Asked Question 
1. Question 1: How can I navigate the codebase?
* Answer: The codebase is divided into two sections, one being the [__Frontend__](https://github.com/eTimely/CSC4996_eTimely/tree/main/frontend) and the other [__Backend__](https://github.com/eTimely/CSC4996_eTimely/tree/main/Backend). To find all user interfaces, reference the Frontend directory. To see all API and Controller implementation, reference the Backend directory.

2. Question 2: Where can I find all documentation used while developing this application?
* Answer: You can find all the powerpoints and documents used in this application in the [__Documentations__](https://github.com/eTimely/CSC4996_eTimely/tree/development/Documentation) directory.

3. Who do I contact about this application?
* Answer: See the <a href="#contact">Contact</a> section to view list of all students to contact regarding this application.

4. Why do I need to setup a .env file both on the frontend and backend?
* Answer: The eTimely application uses private configurations keys to ensure that the application works as entented with the firestore database. Thus, due to secruity concerns, hiding this keys in a .env file ensure that it cannot be accessed by and pushed to a public repository. <br><br>
Also, In order to run the Frontend directory, the client server will check for these .env configurations to access and retrieve information from the firestore database. This is also similar to running the Backend directory. 
Informations on how to correctly set up your .env in <a href="#configuration">Configuration</a> section.

<p align="right">(<a href="#top">back to top</a>)</p>


## Contact
* [Matt Korte](https://github.com/mkorte13)
* [Caleb Obi](https://github.com/CalebObsCode)
* [Chris Gumieny](https://github.com/chrisgumieny)
* [Samia Chowdhury](https://github.com/samiachowdhury)


<p align="right">(<a href="#top">back to top</a>)</p>



