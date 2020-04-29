# @rx-angular/state

[![rx-angular circleci-status](https://circleci.com/gh/BioPhoton/rx-angular.svg?style=shield)](https://circleci.com/gh/BioPhoton/rx-angular)
[![npm version](https://badge.fury.io/js/%40rx-angular%2Fstate.svg)](https://www.npmjs.com/@rx-angular/state)


## Reactive Component State for Angular

RxState is a light-weight, flexible, strongly typed and tested tool dedicated to reduce the complexity of managing component state in angular.

![state logo](https://raw.githubusercontent.com/BioPhoton/rx-angular/master/libs/state/images/state_logo.png)

## Description

Developing modern, **reactive** user interfaces imposes a variety of challenging tasks. Naming some of those:

- reacting to events from different sources
- transforming and composing state
- handling state lifetime
- handling subscriptions

There are plenty of solutions available for managing these challenges on a **global level** (Akita, NgRx, NgXs, ...).
None of them targeting the special needs of the **component level**.

`@rx-angular/state` was specifically designed to give developers a tool for mastering **component state** without forcing
them to use complex design patterns.
It's light-weight and intuitive API, the automatic subscription handling and lifecycle integration making `@rx-angular/state`
the **perfect fit** for handling state in any angular component.
Using this library allows you to build components that:

- have their state tied to their lifecycle
- have a streamlined event flow
- are fully reactive (push based)
- can adapt to any global state source

## Key features

- Slim and intuitive API
- Automated subscription handling
- Connecting third party data
- Partial state updates
- Automatic caching
- Improved rendering performance
- Lazy state
- Hook into imperative functions (e.g. component lifecycle or HostBindings)
- Foundation for zoneless angular applications

## Install

`npm install @rx-angular/state`

## API

Read the [API Documentation](./docs/api.md)

## Usage

Find more information about usage and use cases in the [Usage Documentation](./docs/usage.md).

## Resources

Videos:

- [🎥 Tackling Component State Reactively (Live Demo at 24:47)](https://www.youtube.com/watch?v=I8uaHMs8rw0)

Articles:

- [💾 Research on Reactive Ephemeral State](https://dev.to/rxjs/research-on-reactive-ephemeral-state-in-component-oriented-frameworks-38lk)

Design Documents

- [💾 Design Documents](https://hackmd.io/wVkWRc3XQWmtM6YcktRTrA)

Usage in the wild

- [Fully-reactive Zone-Less Angular/Ionic Progressive Web Application](https://startrack-ng.web.app/search) by [Mike Hartington](https://twitter.com/mhartington)
- [Counter](https://stackblitz.com/edit/rx-angular-state-demo?file=src%2Fapp%2Fcounter.component.ts)
- [Repository Demo](https://github.com/BioPhoton/rx-angular/tree/master/apps/rx-angular-state-demo)