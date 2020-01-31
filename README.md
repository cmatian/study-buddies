# Study Buddies

### A resource for quickly making study group reservations at local hot spots.

### By Melisa Lee, Mindy Jones, and Christopher Matian

# Getting Started

The structure of our application is a **React + Express** full-stack framework. React will handle the frontend portion of our code and Express will be managing the backend interactions.

If you've already cloned the repo then you can skip this step. Otherwise, go ahead and clone the repo somewhere on your machine:

`git clone https://github.com/cmatian/study-buddies.git`

Once you've done that, `cd` into the `study-buddies` directory and you should see the following structure in your file explorer (or issue `ls` on the command line):

```
/study-buddies
    /api
    /client
    /database
    .gitignore
    LICENSE
    README.md
```

The screenshots folder is used for the readme screenshots, so avoid putting anything in there that's not related to the readme.

The `/api` folder contains the code for the Express backend.

The `/client` folder contains the code for the React frontend.

## Fire up Express

To fire up the Express backend, `cd` into the `/api` directory and issue `npm install`. This will initialize all of the node module dependencies.

Afterwards, you can issue `npm start` and the server will start up. The server will be hosted at `http://localhost:9000`. If you can see the Study Buddies title then that means you're all set.

## Fire up React

To start the React frontend, `cd` into the `/client` directory and issue the `npm install` command to get all of your dependencies in order. Afterwards, you can safely start up React by issuing `npm start`. Your React application will be served at `http://localhost:3000`.

## Putting it all together

In order for this to all run seamlessly, you need to have **both** the React client and the Express api are running at the same time. Do the above steps each in different terminal windows and you should be good to go.

If you're mostly working on the frontend and don't need any immediate requests to the server or database, then you can probably work without starting up Express (and vice versa). Do note that if your frontend has any requests to the backend and the server isn't running, then the application will experience run time errors.

# Making Changes

I'm hoping that we can all use [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) during development.

Since we are working on this project simultaneously, we don't want to be submitting changes _directly_ to the `devel` branch.

You should be working off of a feature branch and pushing that. When the feature is complete, you will then submit a PR (everyone has privileges to merge PRs) and have it pulled (merged) into the `devel` branch.

Here is a basic flow to follow:

1. First, create a new branch off of the `devel` branch: `git checkout -b your-branch-name`.

2. Make changes where you want and then issue `git status` to see a list of all the changes you've made so far.

3. When you're ready to make a commit/push issue `git add .` to stage (add) all of your changes.

4. Issue `git commit -m "Some commit message"` to produce a message describing your commit. Try to use meaningful commit messages describing what you changed.

5. Finally, you can issue `git push origin your-branch-name`. This will push your changes to the repository where you can either continue work (and repeat the steps above) or produce a pull (merge) request on Github.

## Config
Paste config folder into client/src/config