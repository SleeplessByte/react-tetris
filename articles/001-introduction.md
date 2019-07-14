---
path: "/log/001-introduction/"
published_date: "2019-07-05"
modified_date: "2019-07-05"
author: "Derk-Jan Karrenbeld"
author_id: "https://derk-jan.com/schema/Person.jsonld"
title: "Tetris: Building a game using react"
description: "Introduction to building a Tetris clone using react"
keywords: ["javascript", "game", "react", "typescript"]
languages: ["TypeScript"]
series: "tetris"
license: "CC BY-NC-SA 4.0"
license_url: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
---

I've always been a fan of retro, arcade and retro arcade games, mostly because
their limitations often  resulted in very creative game mechanics that were easy
to learn and difficult to master. Mark Brown from [Game Maker's Toolkit][youtube-game-makers-toolkit]
has done [an excellent video][youtube-game-makers-toolkit] about "versatile
verbs", in a number of excellent games, which I recommend you to watch. Older
games were less versatile, but as they were written mostly for
_arcade machines_, which usually had a very limited set of inputs, those games
utilise the few buttons they had in various ways.

> 🎮 In this series I'll show you all the steps to build a Tetris clone, abiding
> by the [Tetris Guideline][wiki-tetris-guideline], the current specification
> that [The Tetris Company][wiki-tetris-company] enforces for making all new
> (2001 and later) _Tetris_ game products alike in form.
>
> 🛑 _Tetris_ is licensed which means that if you intend to take this series of
> articles to build your own arcade puzzler, make sure to abide by the law, if
> you intend to commerically release it. Even if you provide a clone for free,
> you could still get a cease and desist. [This reddit thread][reddit-tetris] is
> pretty comprehensive how to go about this. Additionally,
> [this Ars Technica article][article-law-tetris-clone] talks in-depth about how
> courts judge gaming clones using _Tetris_ and the alledged clone _Mino_ as an
> example.
>
> 📚 This series is purely meant as an educational, non-commercial resource.
> We'll only be using the _fandom wiki_ as a resource and only use the name
> Tetris to indicate the _type of game_ and not the actual company, game(s) or
> brand.

In this first article, we'll be looking at the **domain** of the game, meaning
which **nouns** (object/subjects) and **verbs** (actions/functions) exist in the
game.

![Photo titled 'Arcade Dreams', Fowler's Live, Adelaide, Australia](../images/articles/001-introduction/intro.jpg "Photo by Ben Neale (https://unsplash.com/@ben_neale) on Unsplash (https://unsplash.com/)")

## Definitions and Concepts

First, let's look at al the game definitions and concepts, before writing any
code. I generally do this step of domain modelling before I write any code,
because it will probably help out making the right abstractions.

### Movement and Buttons

In the classic Tetris, as released in 1984, the number of inputs was basically
the same as the version developed for the iPod (Tetris 2006):

- a button to move the falling _Tetromino_ left
- a button to move the falling _Tetromino_ right
- a button to drop-and-lock the falling _Tetromino_
- a button to rotate the _Tetromino_.

The standard button mapping adds a few more:

- a button to drop (but not lock) the falling _Tetromino_
- a button to rotate the _Tetromino_ in the other direction (so
  counter-clockwise vs clockwise)
- a button to use hold

Whilst these actions seem pretty simple by themselves, together with the other
game rules, they can act on a wide vocalbulary.

Binding a specific _verb_ to a button is what we call a **mapping**. The mapping
has standards as defined by the [Tetris Guideline][wiki-tetris-guideline].

### Playfield

In the manual for _Tetris for NES_ (1989) the **playfield** is defined as:

> PLAYFIELD: This is where the action is.

It makes up the grid on which the _tetriminos_ fall and come to rest. In the
majority of the games the width is 10 tiles, and the height ranges from 16
through 24 tiles. Aboe the grid, there are 20 rows "hidden", which is called the
_Vanish Zone_.

### Tetrominos

There are various _Tetrominos_: shapes that come dropping down from the top of
the playfield. They are defined as follows:

- Cyan: _I_
- Yellow: _O_
- Purple: _T_
- Green: _S_
- Red: _Z_
- Blue: _J_
- Orange _L_

![The different variations of Tetrominos](../images/articles/001-introduction/variations.png "All the Tetrominos")

They also have defined _starting locations_:

- Middle: _I_ and _O_
- Left-Middle: everything else

They should all spawn _horizontally_, with _J_, _L_ and _T_ spawning the
flat-side first, and spawn above the visible playfied (inside the
_Vanish Zone_), but drop one space if there is nothing in its path (becoming
visible).

### Generator

There is a [Random Generator][wiki-tetris-guideline-random] to generate the
pieces that will come down the playfield. The standard implementation is the so
called 7-bag random generator, meaning that all seven one-sided tetriminos are
drawn, randomly, from a bag, before generating another back.

There are [different randomizers][wiki-tetris-guideline-random-alt].

### Holding zone / Hold piece

The player can press a button to send the falling tetrimino to the hold box, and
any tetrimino that had been in the hold box moves to the top of the screen and
begins falling.

### Ghost piece

The _ghost piece_ indicates where the _Tetromino_ will land, if it were dropped,
It greatly reduces the number of misdrops.

### Rotation

Rotation of a _Tetromino_ is actually not straight-forward. The system and
specification that deals with this is called the _Super Rotation System_ (SRS).

![All the four rotation states of all the 7 Tetrominos](../images/articles/001-introduction/srs.png "The various rotations when using the SRS.")

In general, when unobstructed, _Tetrominos_ rotate as you would except: about a
single point. Because this is purely a mathematical **rotatation** without any
**translation**, there are states in which the _J_, _L_, _S_, _T_ and _Z_
_Tetrominos_ "float" above their bounding box.

However, when obstructed, the game will attempt to "kick" the _Tetromino_ into
an alternative position nearby. The rules for these are described in
[the section about Wall Kicks][wiki-tetris-guideline-rotation].

### Levels

A player levels up by clearing lines (filling them completely), or performing
"T-Spins". Higher levels usually have higher drop-speeds and higher score
(-multipliers).

### Scoring

The [Guideline scoring system][wiki-tetris-guideline-scoring] dictates that
certain _ways_ of clearing a line have different scores than _other ways_. We
won't go into the different combos, b2b, spins and so forth right now, but this
will come up as we're implementing the game.

## Next steps

No code has be written yet. The next steps are figuring out:

- Which models and concerns are there? This will be accomplished by mapping the
  various nouns from the definitions and concepts above to programming
  namespaces and function names.
- What toolchain should we use? This will be determined by _the needs_. That
  means deciding on a library/framework (if any), and the style of the output.
- What unique gameplay element(s) do we want to implement? The less Tetris-y the
  better! Gotta be unique.

![Photo of the Eramus Bridge in Rotterdam, The Netherlands, at night](../images/articles/001-introduction/outro.jpg "Photo by Harold Wijnholds (https://unsplash.com/@harold) on Unsplash (https://unsplash.com/)")

[youtube-game-makers-toolkit]: https://www.youtube.com/watch?v=7daTGyVZ60I
[wiki-tetris-guideline]: https://tetris.fandom.com/wiki/Tetris_Guideline
[wiki-tetris-company]: https://tetris.fandom.com/wiki/The_Tetris_Company
[reddit-tetris]: https://www.reddit.com/r/gamedev/comments/5kkk82/law_concerns_when_creating_a_game_inspired_by/
[article-law-tetris-clone]: https://arstechnica.com/gaming/2012/06/defining-tetris-how-courts-judge-gaming-clones/
[wiki-tetris-guideline-rotation]: https://tetris.fandom.com/wiki/SRS#Wall_Kicks
[wiki-tetris-guideline-random]: https://tetris.fandom.com/wiki/Random_Generator
[wiki-tetris-guideline-random-alt]: https://tetris.fandom.com/wiki/TGM_randomizer
[wiki-tetris-guidleline-scoring]: https://tetris.fandom.com/wiki/Scoring#Guideline_scoring_system
