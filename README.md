# Decentralized Software Example | Voting Application

Decentralized Software Example Voting Application has been developed to
demonstrate some of the best practices for a decentralized software
development. It showcases step-by-step process of developing a DApp
(decentralized application) on Ethereum with a simple web front-end.
One of the specific things the application focuses on is showcasing the
process of potential update of the logic layer for decentralized
application.

The functionality of voting itself is quite basic. There is a hardcoded
list of candidates that is initialized along with the deployment process.
From there, the voting is open to anyone, users are free to cast
whichever number of votes they are willing to cast from a single account.
Upon voting, the front-end is being updated in real-time as the new
voting event are registered in the application.

## Pre-requisites

Make sure to have Truffle framework installed on your machine:

```bash
npm install -g truffle
```

Also, for local tests you may install Ganache application from
[here](https://truffleframework.com/ganache)

## Smart contracts setup

First, if you want to deploy your application to the local node, make
sure to run a node of Ganache, or any other Ethereum node you find
suitable. Then, in order to compile and deploy the smart contracts for
the application, run the following:

```bash
truffle compile # compile contracts
truffle migrate # deploy contracts
```

**Note:** smart contracts has been developed and tested using version
0.4.25 of the Solc compiler. Hence, Truffle configuration enforces usage
of such version.

## Front-end deploy

In order to setup the front-end app execute

```bash
$ npm install
```

Then, you may serve the application by running

```bash
$ npm run dev
```