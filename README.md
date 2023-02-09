# Motivation

Website for Digital Twin as a Service (DTaaS) software. This software shall be used for creating a Digital Twin support platform for SMEs. A brief overview of the software is available in [this presentation](docs/DTaaS-overview.pdf).

This is a mono repo containing code for both the client (web browser) and server code.

## Before Installing the Environment

Give Linux user sudo privileges, if your user already has sudo privileges you can skip this step. <br />
On start up hold shift. <br />
Select the second option, "Advanced options for Ubuntu". <br />
Again select the second option, "Ubuntu, with Linux 5.15.0-60-generic (recovery mode)". <br />
On the "Recovery Menu" select "root" and enter your password. <br />
Use the following:
```bash
usermod -aG sudo <username>
exit
```
Now select "resume". <br />
Once you're back on the desktop check if your user has sudo privileges:
```bash
groups <username>
```
Now log in to git using cmd line:
```bash
git config --global user.name "your_username"
git config --global user.email "your_email_address@example.com"
```

## Install the Environment

```bash
sudo bash script/install.bash
```

---

## For Client app (serves React Website)

```bash
cd client
yarn install    #install the nodejs dependencies
yarn syntax     #perform linting and static analysis
yarn build      #build the react app into build/ directory

#one of the environments; specify only one; "dev" used the REACT_APP_ENV is not set
export REACT_APP_ENV= "dev | test | prod"   
yarn configapp

yarn start      #start the application
yarn test       #UI testing of the application
yarn clean      #clean the directory of temporary files
```

---

## Infrastructure Components

The application requires the following open-source components.

1. Traefik
1. InfluxDB
1. Grafana

See each of the directories to launch the respective docker services.

**TODO**: docker-compose file for all the infrastructure components.

---

## For server apps

The server apps shall be a set of microservices.

```bash
cd server/<microservice-folder>
yarn install    #install the nodejs dependencies
yarn syntax     #perform linting and static analysis
yarn build      #compile ES6 files into ES5 javascript files and copy all JS files into build/ directory
yarn test       #test the application

#optional step: set the environment variables in .env file

yarn start      #start the application
yarn clean      #clean the directory of temporary files
```

## License

This software is owned by [The INTO-CPS Association](https://into-cps.org/) and is licensed under the terms of the INTO-CPS Association.
