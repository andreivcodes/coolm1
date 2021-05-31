<h1 align="center">- coolm1 -</h1>

<h4 align="center">A simple temp monitoring utility for Apple M1</h4>

![screenshot2](docs/screenshot2.png)
![screenshot](docs/screenshot.png)

Using a modified version of [fermion-star's apple_sensors](https://github.com/fermion-star/apple_sensors).

## Info

- Made with [Electron](https://github.com/electron/electro) and [ChartJS](https://github.com/chartjs/Chart.js).

## Functionality

- Average M1 SOC temperature
- Detailed temperature graphs for CPU, GPU and ANE

## Installing

- Download the latest version from [Releases](https://github.com/andreivdev/coolm1/releases)
- Extract `coolm1.app` and copy it in your `Applications` directory
- Open the app and unblock it from Gatekeeper
  ![security](docs/security.png)

> Note: Last step is necessary because the app is not notarized using an Apple Developer account. Once I will enroll in the Apple Developer program, I will release a notarized version.

## Building and running

`npm install`

`npm start`

## Packaging

`npm make`

Results of packaging can be found in `/out`

## Contributing

Feel free to make a PR 👍
