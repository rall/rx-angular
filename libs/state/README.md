# @rx-angular/state

[![npm](https://img.shields.io/npm/v/%40rx-angular%2Fstate.svg)](https://www.npmjs.com/package/%40rx-angular%2Fstate)
[![rx-angular circleci-status](https://circleci.com/gh/BioPhoton/rx-angular.svg?style=shield)](https://circleci.com/gh/BioPhoton/rx-angular)

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

It's light-weight and intuitive API and the automatic subscription handling making `@rx-angular/state`
the **perfect fit** for handling state in any angular component.

Using this library allows you to implement things like:

- merge global into local state
- shared state selections
- subscription-less interaction
- hook into imperative functions (e.g. component lifecycle or HostBindings)

with very little effort in any component.

## Key features

- Slim and intuitive API
- Automated subscription handling
- Connect any Observable source to the state
- Partial state updates
- Reactive state selection
- Lazy state (no BehaviourSubject)
- Foundation for zone-less Angular applications

## Install

`npm install @rx-angular/state`

## API

Services:

- [RxState](https://github.com/BioPhoton/rx-angular/tree/master/libs/state/docs/api.md)

Operators:

- [stateful](https://github.com/BioPhoton/rx-angular/tree/master/libs/state/docs/operators/stateful.md)
- [select](https://github.com/BioPhoton/rx-angular/tree/master/libs/state/docs/operators/select.md)
- [distinctUntilSomeChanged](https://github.com/BioPhoton/rx-angular/tree/master/libs/state/docs/operators/distinctUntilSomeChanged.md)

## Usage

[Usage Documentation](https://github.com/BioPhoton/rx-angular/tree/master/libs/state/docs/usage.md)

### Tutorials

- [Basic Tutorial](https://github.com/BioPhoton/rx-angular/tree/master/apps/state-demo/src/app/examples/demo-basics)
- [Counter - StackBlitz](https://stackblitz.com/edit/rx-angular-state-counter-demo?file=src%2Fapp%2Fcounter%2Fcounter.component.ts)

### Snippets

- [Logic comparison - Increment a Value](https://github.com/BioPhoton/rx-angular/tree/master/libs/state/docs/snippets/component-logic-comparison.md)
- [Loading state and data fetching](https://github.com/BioPhoton/rx-angular/tree/master/libs/state/docs/snippets/fetch-user.md)
- [Passing Observables](https://github.com/BioPhoton/rx-angular/tree/master/libs/state/docs/snippets/passing-observables-directly.md)
- [How to run partial state updates](https://github.com/BioPhoton/rx-angular/tree/master/libs/state/docs/snippets/how-to-run-partial-state-updates.md)
- [Get nested state slices](https://github.com/BioPhoton/rx-angular/tree/master/libs/state/docs/snippets/get-nested-state-slices.md)
- [Derive simple state](https://github.com/BioPhoton/rx-angular/tree/master/libs/state/docs/snippets/derive-simple-state.md)

## Resources

- [🎥 Tackling Component State Reactively (Live Demo at 24:47)](https://www.youtube.com/watch?v=I8uaHMs8rw0)
- [🎥 Extending Angular for the Reactive Web](https://youtu.be/pkN6CeZ8h_U?t=5913)
- [💾 Research on Reactive Ephemeral State](https://dev.to/rxjs/research-on-reactive-ephemeral-state-in-component-oriented-frameworks-38lk)
- [📜 Design Documents](https://hackmd.io/wVkWRc3XQWmtM6YcktRTrA)
- [📑 Fully-reactive Zone-Less Angular/Ionic Progressive Web Application](https://startrack-ng.web.app/search) by [Mike Hartington](https://twitter.com/mhartington)
