# Eventsphere

EventSphere is an events website where users can view events, sign up to them and manage their events all in one place. The projects includes these main features:

1. User authentication using JWTs.
2. protected end points based on whether the user is registered in the database, whether the user is a staff member, or the user is an admin.
3. full sign up login setups.
4. ability to view all events and search via event date or event title.
5. a page where users can see all the events they're attending.
6. a page where users can see their profile details.
7. users can sign up to an event and also unattend the event.
8. once signed up users can add an event to their google calendar.
9. staff members can create, edit and delete events.
10. admins have all features of normal users and staff users but can also create new accounts with either a user, staff or admin role, or edit the access permissions of an existing user. Note a user will have to log out and log back in for their role change to take effect.
11. fully responsive from mobile devices (320px) all the way up to widescreen desktops.

[Deployed version here!](https://dotcomment.netlify.app/)

---

## Project Setup

clone the repo using the following terminal commands

##### HTTP

    git clone https://github.com/Willfoss/fe-news-project.git

##### SSH

    git clone git@github.com:Willfoss/fe-news-project.git

### back-end setup

Next drop into the back-end folder

    cd events-application/back-end

Then install the various npm packages to run the project:

    npm install

in order to connect to either the development or test database it's required to create the following environment variables:

a .env.development file with the contents:

    PGDATABASE=eventsphere
    JWT_SECRET=super_secret_code

a .env.test file with the contents:

    PGDATABASE=eventsphere_test
    JWT_SECRET=super_secret_code

next setup the databases by running:

    npm run setup-dbs

then run the seed file

    npm run seed

Start the back end server using

    node listen.js

### front-end setup

Drop back into the main repo

    cd ..

Access the front-end folder

    cd front-end

Install dependencies

    npm install

Create a .env file and add the following to it

    VITE_API_URL=http://localhost:9090

Run the Vite development command

    npm run dev

Go to your browser and navigate to

    http://localhost:5173

---

## Testing

to run the test file, drop into the back-end folder and run the following command

    npm test

## Version Requirements

node.js - v20.14.0 (or later)
Postgres - 14.12 (or later)

---
