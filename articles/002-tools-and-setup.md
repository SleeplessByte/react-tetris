---
path: "/log/002-tools-and-setup/"
published: true
published_date: "2019-07-14"
modified_date: "2019-07-14"
author: "Derk-Jan Karrenbeld"
author_id: "https://derk-jan.com/schema/Person.jsonld"
title: "Tetris: Choosing the tools and setting up the project"
description: "Second instalment in the tetris series about building a tetris clone using react"
keywords: ["javascript", "game", "react", "typescript"]
languages: ["TypeScript"]
series: "tetris"
license: "CC BY-NC-SA 4.0"
license_url: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
cover_image: https://thepracticaldev.s3.amazonaws.com/i/6i5qql3ok34lsahpnufy.jpg
---

> 🔙 This is the _second instalment_ of a series on building a Tetris clone using React. If you've missed the first, find it [here][rel-prev].

Today we'll take a step towards starting the project. I'll discuss various options and choices which you might encounter when you're bootstrapping your own projects. It's important to talk about these - especially since a lot of tutorials and guides completely skip over the _why_ - and you'll notice that not everything is crystal clear of has a single way to move forward.

> 🎮 In this series I'll show you all the steps to build a Tetris clone, abiding by the [Tetris Guideline][wiki-tetris-guideline], the current specification that [The Tetris Company][wiki-tetris-company] enforces for making all new (2001 and later) _Tetris_ game products alike in form.
>
> 🛑 _Tetris_ is licensed which means that if you intend to take this series of articles to build your own arcade puzzler, make sure to abide by the law, if you intend to commercially release it. Even if you provide a clone for free, you could still get a cease and desist. [This reddit thread][reddit-tetris] is pretty comprehensive how to go about this. Additionally, [this Ars Technica article][article-law-tetris-clone] talks in-depth about how courts judge gaming clones using _Tetris_ and the alleged clone _Mino_ as an example.
>
> 📚 This series is purely meant as an educational, non-commercial resource. We'll only be using the _fandom wiki_ as a resource and only use the name Tetris to indicate the _type of game_ and not the actual company, game(s) or brand.

![Photo showing various machines in the Arcade "Lightroom", in New Brighton, Wallasey, United Kingdom](https://thepracticaldev.s3.amazonaws.com/i/kmddjw275q1tzeym5f74.jpg "Photo by Carl Raw (https://unsplash.com/@carltraw) on Unsplash (https://unsplash.com/)")

## Table of Contents

- [Table of Contents](#Table-of-Contents)
- [The Game Engine](#The-Game-Engine)
- [The Toolchain](#The-Toolchain)
  - [Package management](#Package-management)
  - [Bundler](#Bundler)
  - [Compiler](#Compiler)
  - [Linting and Styleguides](#Linting-and-Styleguides)
  - [Testing libraries](#Testing-libraries)
  - [Base Library](#Base-Library)
  - [Bootstrap](#Bootstrap)
- [Initialisation of the project](#Initialisation-of-the-project)
- [Setting up `typescript` correctly](#Setting-up-typescript-correctly)
- [Setting up `babel` correctly](#Setting-up-babel-correctly)
- [Setting up `eslint` correctly](#Setting-up-eslint-correctly)
  - [Testing the `eslint` configuration](#Testing-the-eslint-configuration)
  - [Fine-tuning the rules](#Fine-tuning-the-rules)
- [Setting up `jest` correctly](#Setting-up-jest-correctly)
  - [Enabling `jest-dom` extensions](#Enabling-jest-dom-extensions)
  - [Getting a coverage report](#Getting-a-coverage-report)
- [Setting up `prettier` correctly](#Setting-up-prettier-correctly)
  - [Automatically formatting](#Automatically-formatting)
- [Conclusion](#Conclusion)

## The Game Engine

Since this series has a game as its deliverable, it can be wise to pick a game engine. As taken from the [WikiPedia article][wiki-game-engine], a game engine is a software-development environment designed for people to build video games. There is an entire [list of game engines][wiki-game-engine-list], which isn't complete, and choosing which one to use for your game is such an endeavour that [many][source-choice-1] [have][source-choice-2] [entire][source-choice-3] [articles][source-choice-4] [or][source-choice-5] [video][source-choice-6] [about it][source-choice-7]. In my opinion, if you're building a game, from scratch, and you have the time, potential and choice, you only need to ask yourself the following question:

1. Do I ever want to go multiplayer? Pick [Unreal Engine][web-unreal-engine].
2. Do I want to build a First-Person Shooter (single- or multiplayer)? Pick [Unreal Engine][web-unreal-engine].
3. Otherwise, pick [Unity][web-unity].

I'm basing this on the hours and hours of [GDC][web-gdc] talks, and job listings! There are many more interesting engines, but if you need something which other people will _trust_ and _be able to work with, quickly_, you probably need to pick one of these two.

If you're a one-person shop, and building for the web, there is a [collection of javascript game engines][git-collection-js-engine], including well-known options such as [GameMaker Studio (2)][web-gamemaker].

_However_, since this series is building a Tetris clone using _react_, that is **exactly** what I'll use. Ask yourself: is React the right tool for the job? Meh, probably not (because there are _better_ tools. Just because you can make something work, doesn't mean it was the right choice). Does that matter? It depends on the people you work with and the willingness of working around abstractions and challenges.

## The Toolchain

Since `react` is supposed to be used for this project, it is likely that this project will be built as a JavaScript application. JavaScript projects (and libraries) tend to have a (sub)set of tools, which I refer to as the "toolchain".

### Package management

A package manager has its function it the name: it manages packages. JavaScript modules, as listed in your package _manifest_ (the collection of packages that the project depends on, for example listing an URL or a name, and version or version-range) are dependencies for your project. The current popular ones include [Yarn][web-packager-yarn] and [NPM][web-packager-npm].

You might ask: "But don't I always need a package manager?" The answer to that is a short **no**. You can also opt to:

- Including all your dependencies locally, for example by _vendoring_ (the act of storing dependencies locally to the project) them. This means you _always_ have a working copy, without the need for the interwebs.
- Use a runtime that doesn't use packages in the traditional sense, such as [deno][web-runtime-deno], but also using [unpkg][web-packager-unpkg], which makes your HTML file the _dependency manifest_ and _manager_ in one.
- Use system packages such as `.deb`ian packages, and manage dependencies using a system tool such as `make` and a Makefile. This technically still uses a _package manager_, but not in the same way as the `Yarn` or `npm` options.

> 💎 I'm choosing `Yarn` with the package manifest inside `package.json`. I think there are many valid reasons to pick any of the options above. I've used most of them myself, including now defunct tools such as [Bower][web-packager-bower]. It often doesn't matter, and the decision should be made in line with company policies or project team alignment.

### Bundler

A bundler in the JavaScript eco-system is not to be confused with the _package manager_ [bundler][web-ruby-bundler] from the Ruby eco-system. In the JavaScript eco-system, it usually takes care of the following set of feature, or a sub-set thereof:

- collecting all the assets in your project (JS, HTML, files, images, CSS)
- stripping out unused assets (think tree-shaking, dead code/import elimination)
- applying transformations (transpilation e.g. Babel, post processing e.g. PostCSS)
- outputting code bundles (chunks, code splitting, cache-friendly output)
- error logging (more friendly)
- hot module replacement (automatically updating modules / assets during development)

Some of the tools I've used in the past and still use are [Webpack][web-bundler-webpack], [Parcel][web-bundler-parcel], [Rollup][web-bundler-rollup], [microbundle][web-bundler-microbundle], [Browserify][web-bundler-browserify] and [Brunch][web-bundler-brunch]. The same _can be achieved_ using a task runner such as [Grunt][web-bundler-grunt] or using [Gulp][web-bundler-gulp], but in my experience, those tend to get out of hand fast.

The choice here, again, doesn't _really_ matter. I think they all have their strengths and weaknesses, and you should pick whichever you feel comfortable with. If you foresee you'll need to customise a lot, some will be favourable over others. If your team knows one of them better than the others, that will probably be favourable. In general: **a great bundler is replaceable**.

> 💎 I'm not choosing anything yet! I'll let the rest of the toolchain dictate what bundler I want to go with. If done right, it won't be _that_ costly to replace the bundler later. Perhaps I won't need _any_.

### Compiler

Technically, babel is mostly a _transpiler_, as it compiles code to the same level of abstraction (think JavaScript ESNext to JavaScript ES3). A _compiler_ generally compiles code to a lower level of abstraction (think Java to JVM / ByteCode, TypeScript to JavaScript). That said, [Babel][web-compiler-babel] lists itself as a compiler, which it also is as it can remove TypeScript token from TypeScript code, yielding valid JavaScript

> 💎 Since I want some type-safety, and I'm better at using [TypeScript][web-compiler-typescript] (which does come with a _compiler_ which also _transpiles_) than [Flow][web-compiler-flow] (which is technically a static type checker and not a _compiler_ or _transpiler_), I'm choosing TypeScript for _compilation_ to type-check and then use `babel` to actually compile and then transpile the files to JavaScript.

### Linting and Styleguides

According to [WikiPedia][wiki-linting], Lint, or a linter, is a tool that analyses source code to flag programming errors, bugs, stylistic errors, and suspicious constructs. Since I'll be using `TypeScript`, I'm at least looking for a code-linter.

> 💎 [TSLint][web-linter-tslint] has been [deprecated][web-tslint-deprecated], as Microsoft has rolled out an amazing toolset which enables [ESLint][web-linter-eslint] to support Typescript, called [`typescript-eslint`][git-typescript-eslint].

I also think that it's good practise to pick a coding style guide (e.g. do you use semicolons or not) and apply that to the project. Towards this goal, I'll use `prettier`.

### Testing libraries

Alright, this one is also not groundbreaking. Whilst there are a lot of options here, such as [mocha][web-testing-mocha], [jasmine][web-testing-jasmine], [tape][web-testing-tape], or one of my favourites [AVA][web-testing-ava], I'll use [jest][web-testing-jest]. I personally think it has all the great features I love from AVA, but because Facebook uses it internally, there is quite a bit of _React tooling_ that hooks perfectly into `jest`.

### Base Library

There are currently multiple options when you want to develop in "react":

- `react`: https://reactjs.org/
- `preact`: https://preactjs.com/
- `react-native-web`: https://github.com/necolas/react-native-web

> 💎 Without going to deep into detail, since this series is focused on writing a game using `react`, that's what I'll use; if there is a lot of ask by the end of the series, I'll write one about how to move from `react` to `preact`.

### Bootstrap

If you've read the [react docs][web-react-docs], you might know that there are several "toolchains" out there. They are mostly wrappers providing a single Command-Line Interface (CLI) and come bundled with all the dependencies (tools), as listed above in the various categories. The React team primarily recommends a few solutions, and I tend to agree with them:

- If you’re learning React or creating a new single-page app, use [Create React App][web-bootstrap-cra].
- If you’re building a server-rendered website with Node.js, try [Next.js][web-bootstrap-next].
- If you’re building a static content-oriented website, try [Gatsby][web-bootstrap-gatsby].
- If you’re building a component library or integrating with an existing codebase, try [Neutrino][web-bootstrap-neutrino], [nwb][web-bootstrap-nwb], [Parcel][web-bootstrap-parcel] or [Razzle][web-bootstrap-razzle].

I'd like to throw [`react-static`][web-bootstrap-react-static] in the mix as well as an alternative to `next.js` and `gatsby`, which allows you to build super fast static content sites, hydrated with a react-app, without the requirement of using `GraphQL` or a server.

This is a very important decision, because if you choose to use a bootstrapped project with one of the toolchains above, you'll be _somewhat tied_ to their technologies, choice of configuration and general ideas. Most of the tools allow you to _eject_ (to stop using the built-in defaults), but you'll still have to to a lot of work to move away.

> 💎 The project (Tetris clone) is probably completely feasible without a complete bootstrapped toolchain. That's why I've chosen _not_ to use one of the bootstrapping toolchains. Often I run into _meh_ behaviour when I need to add something that it currently doesn't support correctly out of the box, when I try to upgrade dependencies or anything similar. If I end up needing it, I can always add it later!

## Initialisation of the project

```bash
# Create the directory for this new project
mkdir tetreact

# Move into that directory
cd tetreact

# Install dependencies
yarn add react react-dom

# Install development dependencies (explanation below)
yarn add typescript core-js@3 eslint eslint-config-prettier eslint-plugin-import -D
yarn add eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks -D
yarn add jest babel-jest prettier @babel/cli @babel/core @babel/preset-env -D
yarn add @babel/preset-react @babel/preset-typescript @typescript-eslint/eslint-plugin -D
yarn add @typescript-eslint/parser @testing-library/react @testing-library/jest-dom -D
yarn add @types/jest @types/react @types/react-dom -D

# Make this a git repository
git init
```

Here is why the following packages are being installed:

- `react` and `react-dom` are runtime packages for react,
- `typescript`: used to type-check the `ts` and `tsx` files,
- `core-js`: a library that polyfills features. There is an older, version (`@2`) and a newer version (`@3`).
- `eslint`: the core package for the linter,
- `eslint-config-prettier`: turns off conflicting, stylistic rules that are handled by prettier,
- `eslint-plugin-import`: adds rules and linting of `import` and `export` statements,
- `eslint-plugin-jsx-a11y`: adds accessibility rules on JSX elements,
- `eslint-plugin-react`: adds React specific linting rules,
- `eslint-plugin-react-hooks`: adds React Hooks specific linting rules,
- `jest`: the testing framework,
- `babel-jest`: makes it possible to run the test code _through babel_,
- `@babel/cli`: allows me to run babel as a standalone command from the command line,
- `@babel/core`: the core package for Babel,
- `@babel/preset-env`: preset to determine which transformations need to be applied on the code, based on a list of browsers,
- `@babel/preset-react`: preset that allows transpilation of JSX and ensures React's functional component's property `displayName` is correctly set,
- `@babel/preset-typescript`: allows stripping TypeScript type tokens from files, leaving behind valid JavaScript,
- `@typescript-eslint/eslint-plugin`: adds a lot of rules for linting TypeScript,
- `@typescript-eslint/parser`: allows `eslint` to use the TypeScript ESLint parser (which knows about type tokens),
- `@testing-library/react`: adds officially recommended testing library, for react,
- `@testing-library/jest-dom`: adds special matchers for `jest` and the DOM,
- `@types/*`: type definitions

You might think: "jee, that's a lot of dependencies", and yep, it's quite a few. However, when using something like `create-react-app`, you are installing _the same if not more_ dependencies, as these are dependencies of the `react-scripts` project you'll be depending on. I've spent quite some time on getting this list to where it is, but feel free to make your own changes and/or additions.

Normally I would add these dependencies as I go, but I already did all the steps listed below, so I collected all the dependencies and listed them in two single commands for you to copy and paste.

## Setting up `typescript` correctly

The following is to setup `typescript`. The dependencies added for this are:

- `typescript`: provides the `tsc` typescript compiler and allows you to have a project version, different from a version e.g. bundled with your IDE or text editor.

Run the `tsc --init` command in order to create the `tsconfig.json` with the default settings.

```bash
yarn tsc --init
```

Now I need to make a few changes, all of which are explained below:

```diff
-  // "incremental": true,
+  "incremental": true
-  // "target": "es5",
+  "target": "esnext",
-  // "jsx": "preserve",
+  "jsx": "preserve",
-  // "noEmit": true,
+  "noEmit": true,
-  // "isolatedModules": true,
+  "isolatedModules": true,
-  // "moduleResolution": "node",
+  "moduleResolution": "node",
-  // "allowSyntheticDefaultImports": true,
+  "allowSyntheticDefaultImports": true,
```

Remember, the goal is to have `tsc` type-check the codebase. That means there doesn't need to be an output, hence `noEmit`. Furthermore, it doesn't need to spend time transpiling to an older JavaScript, because `babel` will take care of that, which means it can have an `esnext` target. For the same reason, `jsx` is set to `preserve` and **not** `react`. Babel will take care of that. Then there are a few options that make interoptability with other packages easier. Finally, `isolatedModules` is required for the TypeScript over Babel functionality to work correctly.

Additionally, `package.json` needs to get the `"scripts"` key with a command that runs the type-checking.

```diff
+  "scripts": {
+    "lint:types": "yarn tsc"
+  }
```

Running `yarn lint:types` should yield the following error:

```text
error TS18003: No inputs were found in config file 'path/to/tetreact/tsconfig.json'. Specified
'include' paths were '["**/*"]' and 'exclude' paths were '[]'.


Found 1 error.
```

This is the correct error. There is nothing to compile! Let's add that:

```bash
mkdir src
touch src/App.tsx
```

Running `yarn lint:types` should yield the following errors:

```text
node_modules/@types/babel__template/index.d.ts:16:28 - error TS2583: Cannot find name 'Set'. Do
you need to change your target library? Try changing the `lib` compiler option to es2015 or later.

16     placeholderWhitelist?: Set<string>;
                              ~~~

node_modules/@types/react/index.d.ts:377:23 - error TS2583: Cannot find name 'Set'. Do you need
to change your target library? Try changing the `lib` compiler option to es2015 or later.

377         interactions: Set<SchedulerInteraction>,
                          ~~~

src/App.tsx:1:1 - error TS1208: All files must be modules when the '--isolatedModules' flag is
provided.

1
```

Let's start at the first two. These give an explicit option to fix the error.

```diff
-  // "lib": [],
+  "lib": ["dom", "es2015"],
```

This is very similar to setting the correct `env` in your `.eslintrc` configuration file: I need to tell TypeScript that I'm in a browser environment (`dom`) and that it should be able to access those constructs that have been introduced in `es2015`.

The final error is because of the `--isolatedModules` flag. When running the compiler with this flag/option, each file _expects_ to be its own, free-standing module. A file is _only_ a module if it `import`s or `export`s something. The reason for this flag isn't apparent: It's listed on the [documentation of `@babel/plugin-transform-typescript`][web-babel-typescript-docs] as one of the caveats of "compiling" TypeScript using Babel. I have advanced knowledge here, but it would become clear in the next step.

I update the `src/App.tsx` file:

```tsx
import React from 'react'

export function App(): JSX.Element {
  return <div>Hello world</div>
}
```

Finally, `tsc` does _not complain_.

## Setting up `babel` correctly

Next up is making sure that `babel` "compiles" the TypeScript code to JavaScript, applies transformations and hooks into the various plugins that I've installed.

- `core-js@3`: a library that polyfills features. There is an older, version (`@2`) and a newer version (`@3`); it uses used by `@babel/preset-env` in conjunction with a `browerlist` configuration,
- `@babel/cli`: allows me to run babel as a standalone command from the command line,
- `@babel/core`: the core package for Babel,
- `@babel/preset-env`: preset to determine which transformations need to be applied on the code, based on a list of browsers,
- `@babel/preset-react`: preset that allows transpilation of JSX and ensures React's functional component's property `displayName` is correctly set,
- `@babel/preset-typescript`: allows stripping TypeScript type tokens from files, leaving behind valid JavaScript.

Babel currently, at moment of writing, does not have an `--init` command, but setting it up is not very complicated, albeit it takes some effort to get all the presets and plugins correctly listed. Since this is a _project_, per [the babel documentation][web-babel-docs], the best way for this project is to create a `JSON` configuration, called `.babelrc`.

```bash
touch .babelrc
```

The contents are as follows, which I collected by taking the documentation of the three `@babel/preset-*` plugins and applying them:

```json
{
  "presets": [
    [
      "@babel/preset-env", {
        "targets": {
          "node": "current"
        },
        "useBuiltIns": "usage",
        "corejs": { "version": 3 }
      }
    ],
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  "ignore": [
    "node_modules",
    "dist"
  ]
}
```

It's also a good idea to explicitly define the `browserlists` key/configuration, even though since I'm building a cross-env cross-browser game, the setting can stay on `defaults`. In order to do that, and in order to be abel to call `babel` using `@babel/cli`, in `package.json`, I added the following:

```diff
   {
     "scripts": {
+      "build": "yarn babel src --out-dir dist --extensions \".ts,.tsx\"",
+      "watch": "yarn build --watch",
       "lint:types": "yarn tsc"
     },
     "dependencies": {

  ...

       "typescript": "^3.5.3"
     },
+    "browserslist": [
+      "defaults"
+    ]
   }
```

If you want a different target, make sure to follow the [Browserlist best practices][git-browserlist-best-practice]. You can also use a configuration file; pick whichever you like.

Let's see if this works!

```bash
$ yarn build
yarn run v1.16.0
warning package.json: No license field
$ babel src --out-dir dist --extensions ".ts,.tsx"
Successfully compiled 1 file with Babel.
Done in 1.67s.
```

In `dist` I can now find `App.js`, which does not have any type information. It should look something like this:

```javascript
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = App;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function App() {
  return _react.default.createElement("div", null, "Hello World!");
}
```

A few things to notice:

- It added `"use strict";`
- It is using the `interopRequireDefault` to require `react`'s default export
- It transpiled `JSX` to use `_react.default.createElement`

These three things would only happen if Babel is configured correctly.

## Setting up `eslint` correctly

Next step is making sure that the TypeScript code can be linted!

- `eslint`: the core package for the linter,
- `eslint-config-prettier`: turns off conflicting, stylistic rules that are handled by prettier,
- `eslint-plugin-import`: adds rules and linting of `import` and `export` statements,
- `eslint-plugin-jsx-a11y`: adds accessibility rules on JSX elements,
- `eslint-plugin-react`: adds React specific linting rules,
- `eslint-plugin-react-hooks`: adds React Hooks specific linting rules,
- `@typescript-eslint/eslint-plugin`: adds a lot of rules for linting TypeScript,
- `@typescript-eslint/parser`: allows `eslint` to use the TypeScript ESLint parser (which knows about type tokens).

The `eslint` core package comes with a CLI tool to initialise (and run) `eslint`:

```text
$ yarn eslint --init

? How would you like to use ESLint? To check syntax and find problems
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? React
? Where does your code run? Browser
? What format do you want your config file to be in? JSON

Successfully created .eslintrc.json file in path/to/tetreact
```

Depending on your configuration, and depending if you call `yarn eslint` (execute `eslint` from the local `node_modules`) or plain `eslint` (which might call the "globally" installed `eslint`), the following message _may_ appear:

```text
The config that you've selected requires the following dependencies:

eslint-plugin-react@latest

? Would you like to install them now with npm? No
```

I choose `"No"` because on one hand, it's already installed under `devDependencies` and on the other hand, it will try to use `npm` to install it if I say `"yes"` (at moment of writing), which is something I don't want (as I am using `yarn`).

As for the options: I personally like the `.json` file, because it restricts me from solving something using `JavaScript`, which makes the barrier to do something "hackly" a bit higher. I basically guard myself from trying to do something that is not supported out of the box. Your mileage may vary, but I like to use my dependencies with standard configuration, because it makes it easier to search for solutions _and_ ask for support!

> 🛑 If you run into an error that looks like this:
> ```text
> ESLint couldn't find the plugin "eslint-plugin-react". This can happen for a
> couple different reasons:
> ...
> ```
>
> Even though it _is_ installed locally, remove `eslint` from the global packages:
> ```bash
> yarn global remove eslint
> ```

If you're using an IDE with `eslint` integration set-up, chances are that both `App.js` (in the `dist` folder) ánd `App.tsx` (in the `src` folder) light up with errors. **This is to be expected**. It doesn't automagically configure `.eslintrc.json` with all the plugins from your `devDependencies`.

In order to get all the configurtion in, I edit the generated `.eslintrc.json`.

- First, I mark the configuration as the `root` configuration. This prohibits any `eslint` configuration somewhere up the tree to apply rules to this project.
- Next, I update the `parserOptions` and tell it to use the `@typescript-eslint/parser` parser. My [article][article-typescript-code-analyzer] on [writing a TypeScript code Analyzer][article-typescript-code-analyzer] goes into a bit more detail on what the different `@typescript-eslint/*` packages are and do.
- Finally, there are all the `extends`. These take preset configurations that I want to apply to this configuration. The `@typescript-eslint/*` and `prettier/*` modules have documentation that explains _in what order_ these should be placed.

```diff
   {
+    "root": true,
+    "parser": "@typescript-eslint/parser",
     "parserOptions": {
+      "project": "./tsconfig.json",
+      "ecmaFeatures": {
+        "jsx": true
+      },
       "ecmaVersion": 2018,
       "sourceType": "module"
     },
     "env": {
       "browser": true,
       "es6": true
     },
-    "extends": "eslint:recommended"
+    "extends": [
+      "eslint:recommended",
+      "plugin:@typescript-eslint/eslint-recommended",
+      "plugin:@typescript-eslint/recommended"
+      "plugin:react/recommended",
+      "prettier",
+      "prettier/@typescript-eslint",
+      "prettier/babel",
+      "prettier/react"
+    ],
     "globals": {
       "Atomics": "readonly",
       "SharedArrayBuffer": "readonly"
     },
     "plugins": [
-      "react",
+      "@typescript-eslint",
+      "react-hooks",
     ],
     "rules": {
     },
+    "settings": {
+      "react": {
+        "version": "detect"
+      }
+    }
   }
```

The `rules` are currently still empty, I'll get to that. First, let's test the configuration!

### Testing the `eslint` configuration

I change `src/App.tsx`:

```diff
+  function Header() {
+    return <h1>Hello World!</h1>
+  }

   export function App(): JSX.Element {
-    return <div>Hello World!</div>
+    return <Header />
   }
```

And add a new `scripts` entry:

```diff
   "scripts" {
     "build": "yarn babel src --out-dir dist --extensions \".ts,.tsx\"",
      "watch": "yarn build --watch",
+     "lint": "yarn eslint src/**/*",
      "lint:types": "yarn tsc"
   },
```

Now I run it!

```text
yarn lint

$ eslint src/**/*

path/to/tetreact/src/App.tsx
  3:1  warning  Missing return type on function  @typescript-eslint/explicit-function-return-type

✖ 1 problem (0 errors, 1 warning)

Done in 4.01s.
```

Woopdiedo. A warning from the `@typescript-eslint` plugin! This is exactly what I expect to see, so I can now move on fine-tuning the `"rules"`.

### Fine-tuning the rules

Normally I fine-tune the `"rules"` as I develop a library or a project, or I use a set of rules that is pre-determined by a project lead. In the [exercism/javascript-analyzer respository][git-javascript-analyzer], I've [added a document][git-javascript-analyzer-eslint-rules] about the rules and why I chose them to be like this. The results are as listed below, which include the two `react-hooks` rules at the bottom.

```json
{
  "rules": {
    "@typescript-eslint/explicit-function-return-type": [
      "warn", {
        "allowExpressions": false,
        "allowTypedFunctionExpressions": true,
        "allowHigherOrderFunctions": true
      }
    ],
    "@typescript-eslint/explicit-member-accessibility": [
      "warn", {
        "accessibility": "no-public",
        "overrides": {
          "accessors": "explicit",
          "constructors": "no-public",
          "methods": "explicit",
          "properties": "explicit",
          "parameterProperties": "off"
        }
      }
    ],
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-parameter-properties": [
      "warn", {
        "allows": [
          "private", "protected", "public",
          "private readonly", "protected readonly", "public readonly"
        ]
      }
    ],
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-use-before-define": [
      "error", {
        "functions": false,
        "typedefs": false
      }
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

As I write more code, this ruleset may change, but for now this should suffice.

## Setting up `jest` correctly

Next up is making sure the code is testable.

I personally _don't_ like to co-locate my test files next to my source files, but rather put all the tests in a separate directory. However this isn't better or preferred, just different. You can do whichever you like. If you co-locate the tests, make sure that your tests end with `.test.ts` or `.test.tsx`, and if you don't, the _default_ folder is `__tests__`. You can change these in the, soon to be, generated `jest.config.js`.

The dependencies that matter are:

- `jest`: the testing framework,
- `babel-jest`: makes it possible to run the test code _through babel_,
- `@testing-library/react`: adds officially recommended testing library, for react,
- `@testing-library/jest-dom`: adds special matchers for `jest` and the DOM,

Just like some of the other tools, `jest` comes with a CLI and an option that allows you to _generate_ the configuration file.

```text
$ yarn jest --init

√ Would you like to use Jest when running "test" script in "package.json"? ... yes
√ Choose the test environment that will be used for testing » jsdom (browser-like)
√ Do you want Jest to add coverage reports? ... yes
√ Automatically clear mock calls and instances between every test? ... no
```

This adds the `test` script to `"scripts"` in `package.json` and adds a `jest.config.js` file with defaults to the root directory.
The contents of the configuration file are all set correctly (given the answers as listed above), with the important ones being (you can go in and confirm):

- `coverageDirectory` should be set to `"coverage"`, because I want coverage reports,
- `testEnvironment` should not be set or set to `"jest-environment-jsdom"`, because I don't want to _have_ to run in a browser.

The `babel-jest` package is _automagically_ supported, out-of-the-box, without needing to set-up anything else. Since Babel is already configured correctly to "compile" the source code, and the test code has the same properties, no steps need to be taken in order to make the tests be "compiled" as well.

Then I want to integrate with the `@testing-library/react` library, which provides a cleanup script that makes sure the `React` application state and environment is reset (cleaned-up) after each test. Instead of including this in every test, it can be setup via the `jest.config.js` file:

```diff
-  // setupFilesAfterEnv: []
+  setupFilesAfterEnv: [
+    '@testing-library/react/cleanup-after-each'
+  ],
```

I use the default folder name for my tests:

```bash
mkdir __tests__
```

And now I create a smoke test `__tests__/App.tsx` with the following:

```tsx
import React from 'react'
import { render } from '@testing-library/react'
import { App } from '../src/App';

it('App renders heading', () => {
  const {queryByText} = render(
    <App />,
  );

  expect(queryByText(/Hi/)).toBeTruthy();
});
```

Finally I run the tests using the `"scripts"` command that was added by `yarn jest --init`:

```text
yarn test

$ jest
 FAIL  __tests__/App.tsx
  × App renders heading (29ms)

  ● App renders heading

    expect(received).toBeTruthy()

    Received: null

      14 |   );
      15 |
    > 16 |   expect(queryByText(/Hi/)).toBeTruthy();
         |                             ^
      17 | });
      18 |

      at Object.toBeTruthy (__tests__/App.tsx:16:29)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.361s
Ran all test suites.
```

Ah. I'm rendering `Hello World`, and not `Hi`. So now I change the regular expression to test for `Hello World` instead, and run the tests again:

```text
$ jest
 PASS  __tests__/App.tsx
  √ App renders heading (21ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        4.184s
Ran all test suites.
Done in 6.10s.
```

### Enabling `jest-dom` extensions

You might have noticed that there is another `@testing-library` dependency. I want to use the `'@testing-library/jest-dom/extend-expect'` visibility check `toBeVisible`, instead of only testing if it exists via `toBeTruthy`. I order to integrate with that package, I make the following change to the `jest.config.js`:

```diff
   setupFilesAfterEnv: [
     '@testing-library/react/cleanup-after-each',
+    '@testing-library/jest-dom/extend-expect',
   ],
```

This change makes the extension (new matchers, including `.toBeVisible`) available to all the tests.

I update the test to use these:

```diff
   import React from 'react'
   import { render } from '@testing-library/react'
   import { App } from '../src/App'

   it('App renders heading', () => {
     const { container, queryByText } = render(
       <App />,
     );

-    expect(queryByText(/Hello World/)).toBeTruthy()
+    expect(queryByText(/Hello World/)).toBeVisible()
   }
```

Running the tests works, but my IDE gives an error on the `toBeVisible` matcher. This is because TypeScript doesn't quite know that the `expect` matchers have been extended. It's not good at inferring new types from _dynamically executed code_. Since there is no _cross-file_ information between the `jest` configuration and this test, I can't expect that to be magically picked up. Fortunately, there are various ways to solve this, for example, but not limited to:

- Add `import '@testing-library/jest-dom/extend-expect'` to each test file. This extends the `expect()` Matchers to include those provided by the library,
- Make sure `typescript` knows this is always included (which is true, given the `jest.config.js` changes).

In order to get the "always included" experience, I add a new file `declarations.d.ts` and add a _triple-slash directive_. I generally stay clear of these directives, and even have an `eslint` rule to disallow them, but in my experience, tooling is best when you run into something like this issue and use them. This might not be true if you follow this post some time in the future. You can do whatever works, perhaps an `import` suffices:

```bash
touch __tests__/declarations.d.ts
```

```typescript
/* eslint-disable @typescript-eslint/no-triple-slash-reference */
/// <reference types="@testing-library/jest-dom/extend-expect" />
```

What this does is tell TypeScript that for the current directory subtree (`__tests__`), it should always add the package' types as defined by the directive. I can now also see that the error in `__tests__/App.tsx` has been resolved and that it recognises `.toBeVisible`.

### Getting a coverage report

There are no new dependencies required for a coverage report as `jest` comes bundled with built-in coverage.

In order to test if the `coverage` is working _correctly_, I first change the `App.tsx` src file to include a branch:

```tsx
import React from 'react'

export interface AppProps {
  headingText?: string
}

export function App({ headingText }: AppProps): JSX.Element | null {
  if (headingText === undefined) {
    return null
  }

  return <h1>{headingText}</h1>
}
```

Now, the app renders `null` unless a `headingText` is given. I also have to change the test to pass in `"Hello World"` as the heading text, or the test will
fail:

```diff
-  <App />
+  <App headingText="Hello World" />,
```

I run the test suite with coverage enabled:

```bash
yarn test --coverage
```

This runs the tests and they are _passing_; it also outputs the following table summary:

```text
----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |    66.67 |       50 |      100 |    66.67 |                   |
 App.tsx  |    66.67 |       50 |      100 |    66.67 |                 9 |
----------|----------|----------|----------|----------|-------------------|
```

**Line 9** is inside a conditional branch (for when `headerText === undefined`):

```tsx
    return null
```

This can be tested by explicitly adding a test.

```tsx
it('App renders nothing without headingText', () => {
  const { container } = render(
    <App />,
  )

  expect(container.firstChild).toBeNull()
})
```

I generally don't like to test that things are _not_ there, because often you have to make a few assumptions that are fragile at best (and therefore break easily), but just to test if `jest` has been set-up correctly, this is fine, since I'll throw away these lines later:

```text
$ jest --coverage
 PASS  __tests__/App.tsx
  √ App renders heading (46ms)
  √ App renders nothing without headingText (1ms)

----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |      100 |      100 |      100 |      100 |                   |
 App.tsx  |      100 |      100 |      100 |      100 |                   |
----------|----------|----------|----------|----------|-------------------|
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        4.911s
Ran all test suites.
Done in 6.78s.
```

## Setting up `prettier` correctly

Finally, I can focus on setting up the (automatic) code formatter! I really like `prettier` for the simple reason that it removes the need of discussing a lot of style choices. I _don't_ think it always or even often generates **pretty** code, but that's okay. As their library improves, so does the output, and it's trivial to re-format all the code once they do.

- `eslint-config-prettier`: turns off style rules that are in conflict with prettier. You can see the various `prettier/*` lines in the `eslint` configuration above. This has already been set-up.
- `prettier`: the core package, including the CLI tools to run prettier.

Prettier has already been added to the `eslint` configuration, so that part can be skipped.

The `prettier` CLI doesn't have an `--init` option at the moment of writing, so I create the configuration file manually:

```bash
touch .prettierrc.json
```

I've chosen to loosly follow the `StandardJS` style, but it really doesn't matter. Pick a style and stick with it.

```json
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "jsxSingleQuote": false
}
```

I also want to be able to run these as a script, so I add the following three `"scripts"`:

```diff
   "lint:types": "yarn tsc",
+  "lint:format": "yarn format --check",
+  "format": "yarn prettier \"{src,__{tests}__}/**/*.{ts,tsx}\"",
+  "format:fix": "yarn format --write",
   "test": "yarn jest"
```

### Automatically formatting

Since `prettier` has been added as plugin to `eslint`, it is already correctly integrated with `eslint`. However, you might want code to be formatted _on save_. The [prettier documentation][web-prettier-editors] lists a lot of IDEs and allow you to turn on formatting on save.

In general, I'm not a fan of running prettier _on commit_, because it slows down my commits, occasionally breaks things and I think it shouldn't be a concern of the commit to format the code. That said, I do think it's a good idea to add a check in the continuous integration (CI) to test the format of the project.

## Conclusion

And that's it! The project is now in a pretty good state to start writing code. Yes, it took quite a bit to get here and a lot of the configuration setup above is exactly why tools such as `create-react-app` or even the `parcel` bundler exist. Note that I haven't actually dealt with some of the things that `parcel` and `webpack` deal with, such as importing images or other file types; I don't think I'll need it, and therefore I didn't add that.

A few things are left to do:

- Set-up CI,
- Add the `"name"` and "license"` fields,
- Add the _servability_ i.e. add the HTML file that we can see in a browser.

Next time I will _actually_ write some game code, and perhaps the things just listed, but for now, this is all I give you.

![Photo of "De Rotterdam", Rotterdam, Netherlands, with the building, the Cruise Terminal, and a small boat coasting towards the photographer on a gloomy day.](https://thepracticaldev.s3.amazonaws.com/i/74bosly3ryp7snoz4xt4.jpg "Photo by Reginar (https://unsplash.com/@reginar) on Unsplash (https://unsplash.com/)")

[rel-prev]: https://dev.to/sleeplessbyte/tetris-building-a-game-using-javascript-3j6f
[article-typescript-code-analyzer]: https://dev.to/xpbytes/writing-a-code-analyzer-in-typescript-5ec3
[wiki-game-engine]: https://en.wikipedia.org/wiki/Game_engine
[wiki-game-engine-list]: https://en.wikipedia.org/wiki/List_of_game_engines
[wiki-linting]: https://en.wikipedia.org/wiki/Lint_(software)
[wiki-tetris-guideline]: https://tetris.fandom.com/wiki/Tetris_Guideline
[wiki-tetris-company]: https://tetris.fandom.com/wiki/The_Tetris_Company
[reddit-tetris]: https://www.reddit.com/r/gamedev/comments/5kkk82/law_concerns_when_creating_a_game_inspired_by/
[article-law-tetris-clone]: https://arstechnica.com/gaming/2012/06/defining-tetris-how-courts-judge-gaming-clones/
[source-choice-1]: https://www.youtube.com/watch?v=ibK3Ds7nDyk
[source-choice-2]: https://www.youtube.com/watch?v=2tZK75R2K2c
[source-choice-3]: https://www.linkedin.com/pulse/how-choose-game-engine-yann-kronberg/
[source-choice-4]: https://www.technobyte.org/which-game-engine-should-you-choose/
[source-choice-5]: https://blackshellmedia.com/2016/09/29/6-crucial-questions-ask-choosing-game-engine/
[source-choice-6]: https://www.youtube.com/watch?v=Tnci1hO0prc
[source-choice-7]: http://mightyfingers.com/blog/11-steps-for-choosing-the-best-game-engine/
[web-unreal-engine]: https://www.unrealengine.com/en-US/
[web-unity]: https://unity.com/
[web-gdc]: https://gdconf.com/
[web-gamemaker]: https://www.yoyogames.com/gamemaker
[git-collection-js-engine]: https://github.com/collections/javascript-game-engines
[git-typescript-eslint]: https://typescript-eslint.io/
[git-browserlist-best-practice]: https://github.com/browserslist/browserslist#best-practices
[git-javascript-analyzer]: https://github.com/exercism/javascript-analyzer
[git-javascript-analyzer-eslint-rules]: https://github.com/exercism/javascript-analyzer/blob/b32e6dc67842c4edad6f75e9b8909bf5d2ac6926/docs/linting.md
[web-packager-yarn]: https://yarnpkg.com/en/
[web-packager-npm]: https://www.npmjs.com/
[web-runtime-deno]: https://deno.land/
[web-packager-unpkg]: https://unpkg.com/
[web-packager-bower]: https://bower.io/
[web-ruby-bundler]: https://bundler.io
[web-bundler-brunch]: https://brunch.io/
[web-bundler-browserify]: http://browserify.org/
[web-bundler-gulp]: https://gulpjs.com/
[web-bundler-grunt]: https://gruntjs.com/
[web-bundler-parcel]: https://parceljs.org/
[web-bundler-webpack]: https://webpack.js.org/
[web-bundler-rollup]: https://rollupjs.org/guide/en/
[web-bundler-microbundle]: https://www.npmjs.com/package/microbundle
[web-compiler-babel]: https://babeljs.io/
[web-compiler-flow]: https://flow.org/
[web-compiler-typescript]: https://www.typescriptlang.org/
[web-linter-eslint]: https://eslint.org/
[web-linter-tslint]: https://palantir.github.io/tslint/
[web-tslint-deprecated]: https://medium.com/palantir/tslint-in-2019-1a144c2317a9
[web-react-docs]: https://reactjs.org/docs/create-a-new-react-app.html
[web-bootstrap-cra]: https://github.com/facebook/create-react-app
[web-bootstrap-next]: https://nextjs.org/
[web-bootstrap-gatsby]: https://www.gatsbyjs.org/
[web-bootstrap-neutrino]: https://neutrinojs.org/
[web-bootstrap-nwb]: https://github.com/insin/nwb
[web-bootstrap-parcel]: https://parceljs.org/
[web-bootstrap-razzle]: https://github.com/jaredpalmer/razzle
[web-bootstrap-react-static]: https://react-static.js.org
[web-react-docs-plain]: https://reactjs.org/docs/add-react-to-a-website.html
[web-testing-jest]: https://jestjs.io/
[web-testing-ava]: https://github.com/avajs/ava
[web-testing-mocha]: https://mochajs.org/
[web-testing-jasmine]: https://jasmine.github.io/
[web-testing-tape]: https://github.com/substack/tape
[web-prettier-editors]: https://prettier.io/docs/en/editors.html
[web-babel-typescript-docs]: https://babeljs.io/docs/en/babel-plugin-transform-typescript
[web-babel-docs]: https://babeljs.io/docs/en/configuration#what-s-your-use-case

