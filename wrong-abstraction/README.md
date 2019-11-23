# Expensive abstractions

The **wrong abstraction** topic as described by [Sandi Metz](https://www.sandimetz.com/blog/2016/1/20/the-wrong-abstraction) desserves more attention than it currently gets. The scenario is pretty simple :

1. dev1 sees a pattern, some kind of duplication -> he creates a shiny abstraction
2. dev2 tries to use this cool abstraction but it is missing something for his use-case. He modifies the abstraction
3. time passes, loop over step (2) multiple time
4. you now look at the code, it's a total mess

To fix this mess, the abstraction needs to be undone.
However, as time goes by, it gets harder to undo this abstraction. This is the reason why detecting them early and knowing when to avoid hasty abstraction is important.


## A little story : The Abstract Comparison Page

Our company compares all kind of products. Comparison pages all look somewhat the same, a **filterable list of items** (just like most flight or hotel comparison websites). We are in the process of rewriting them using React.

Our first idea as *DRY-obsessed* developpers was to abstract this **filterable list** logic.

An abstraction that looked sexy was to have a reusable `<FilterableItems/>` component.
Its API has 3 inputs:
- items : the list of items to render
- renderItem : takes an item as input and decides how to render it `item -> render`
- renderFilters : takes a function that allows to set a predicate as input and decides how to render it `setPredicate -> render`

The reusable component handles the merge of all predicates to filter and displays our items.

Simple enough. The code is concise, **inversion of control** makes it very modular and we can easily reason about it in a functional way. We are quite happy and proud of this abstraction.

We then realize that sometimes filters are on top of the list, and sometimes on the side... Fine, we can add a "Layout" input to our API so that it can be defined if necessary.
It's a bit confusing to have this separation of layout and actual render but some call it **separation of concerns**. After all this is what we do when we segregate HTML and CSS...

Did I mention we use TypeScript? The type of an item has to be generic for reusability, which leads to this funny JSX syntax: `<FilterableItems<ItemType>/>`.

Taking another step back, we notice that in some cases, outside of the scope of our `<FilterableItems/>`, a sentence counts how many items are being displayed. In short, the parent component needs to be aware of the inner state of its children. Well... I guess we could use some sort of callback...

Luckily, all these *new* requirements didn't come up over time so we could observe the cost of this abstraction early on.
Time to give up on this abstraction and **inline** every usages of this component.

We are now using React's composition and state management mechanism along with javascript's map/filter/reduce, with no abstraction on top of it, making the code very flexible and straightforward. We are now free to lift the state up to share it where it needs to be used. There is going to be a bit of duplication, and this is fine.

## The cost of the wrong abstraction

Our codebase's history, due to its monolithic nature and our "DRY/SoC" education, has seen a few costly abstractions...
What looked like a smart abstraction at first became a constant struggle for teams, to a point where no one had the courage to remove them. Whenever a new idea came up, devs had to explain that "we can't implement it in a decent amount of time, because we'd have to modify our framework, which affects the whole codebase...".
This is the path our little example would probably have taken if we hadn't reverted it early. Due to its large scope and the intent to use it for every comparison pages, removing it would have been a nightmare.

We use **duplication** and **DRY** as our primary motivation for creating abstraction, but other fancy keywords like **Separation of Concerns** and **Consistency** are also a source of hasty abstractions.


## The 3 phases of abstraction generation

It seems that developpers go through different phases of abstraction generation as they grow up:

1. Doesn't care about creating abstractions or duplication, getting things to work is hard enough
2. Wants to remove duplication at all cost, enforces many abstractions
3. Avoids early abstraction, accepts duplication

Going from (1) to (2) is pretty straightforward, there are tons of educationnal content that will push you in this direction.
Creating a cool looking abstraction provides satisfaction. It makes you feel smart and you can show it off.
Knowing when not to do it takes a higher level of maturity. Unfortunately it isn't as flashy and it might go unoticed. You might even be blamed for duplication, which is why education on the subject matters.

## Detection

There are probably too many ways to detect abstractions that have gone wrong to list them all, but let's name a few of them.

### Inheritance

 **Use Composition over Inheritance** (aka: avoid the "extends" keyword).
 Unfortunately, OOP languages provide a few bad tools to create abstraction, which is probably why quite a few programming figures try to stay away from them ([Linus Torvalds](http://harmful.cat-v.org/software/c++/linus) creator of Linux and Git, [Joe Armstrong](http://harmful.cat-v.org/software/OO_programming/why_oo_sucks) creator of Erlang...), and newer language like Golang don't implement any "extend" feature and force you to compose.

### Huge API surface

 The surface is how much an abstraction exposes to its clients.
 I'd recommend [Sebastian Markbage's talk](https://www.youtube.com/watch?v=4anAwXYqLG8) on the topic.
 When an API's surface is too large, the abstraction under it becomes hard to use. You need to be aware of too many factors to use the API.
 An example is having too many ifs and parameters... They create a lot of complexity and they can sometimes be avoided.
 Would you rather have a `<Button>` component and pick its color, or have a `<RedButton>` and a `<BlueButton>` ?
 Most people go straight to the first one because it makes for a nice abstraction, but the 2nd version is actually more flexible in the long run.
 It's a matter of finding the right ballance here and split things when necessary, a single Button that has all the logic for every buttons in your design-system is a huge pain point when it grows too big.

### Logic in your tests

 For example, a test that loops over every "Car" instances in your codebase and checks that they have 4 wheels. Maybe a Car should have 4 wheels by design, that way the dev using a Car doesn't have to add the right amount of wheels himself. Logic resides in code, you probably don't want to be testing your tests.

### Unecessary indirection

 It's a bit irritating when you have to navigate a lot for simple stuffs. For example **clean code** suggests that we extract strings into constants. But it is annoying to navigate to its declaration, more so when it is used only once. That's an example of an overkill indirection. Extracting random impure functions because your IDE has a shortcut to do so is another one we often run into.

### All-in-one functions

 For example, when you chain `map`s or `filter`s, people tend to try to fit and extract evything into a single function. If you need to map from type A to D going `A -> B -> C -> D`, instead of extracting a single function `mapAtoBtoCtoD` that handles too many tranformations, it is easier to understand successive `map`s (`mapAtoB`, `mapBtoC`, `mapCtoD`). That way you can inline the simple ones for minimal navigation overhead.

### Excessive Separation of Concerns

 Like DRY, this is another dangerous flashy keyword that tends to justify painful architectures.
 I like to use this metaphore when people raise the Separation of Concern flag: **Placing left foot and right foot socks in 2 different boxes separates concerns but it doesn't help you get dressed faster in the morning**.
 When parts that live together are segregated, navigation and mental models become difficult, which costs a lot.
 For example if you use the component abstraction, having tests, js, css, html and assets for a single component in separate dedicated subtrees becomes a navigation nightmare since they are bound to change together.
 Or, if you use a microservice architecture, having DAO, endpoints, services and model each in dedicated subtrees for Separation of Concern purpose doesn't really make sense...

### Excessive Consistency

 The socks metaphore applies to consistency too. You could be consistent in a way that slows you down. It is preferable to stay open to trying alternatives.
 For a while, our company used solely GWT as framework of choice for all of its legacy products.
 Choosing **exploration over consistency** has opened a path toward other frameworks such as React, for faster and cheaper delivery. Like duplication, it's a matter of finding the right balance.


The list goes on, but what all these abstraction examples all have in common is that code becomes hard to use, hard to understand and hard to change.


## Removing an abstraction

Removing an abstraction is actually pretty simple but might take a while.

- **Avoid reuse :** It's best not to keep using an abstraction that has gone out of control and explore new options instead
- **Take small steps :** Always commit minimal steps with a meaningful message, that way when you break something you can figure out what went wrong easily
- **Inline :** Inline each usages, maybe 1 at a time. If it's a function, inline it, if it's inheritance, flatten it into a single class etc
- **Cleanup :** After an inline you're left with raw code, you can now hunt for unused variables, unused if branches...
- **Rewrite :** The idea here is to not make the same mistake. If the code is still a mess, go with simple functional programming principle, such as enforcing immutability, isolating side-effects from pure functions...
- **Repeat :** Rollback when it goes wrong, fight the temptation to build a new abstraction right away, the good ones take time to figure out.


## Producing better abstractions

As a disclaimer, lets remind that not all abstractions are harmful. And most of them were actually good and helpful ones before they went out of control.

From my experience, applying **functional programming** principles has been very helpful in creating better abstraction, probably due to being backed by mathematic models and not "gut feelings" like OOP patterns, or "religious" principles like DRY, SoC, TDD, consistency...

Let's look at a few good abstractions that were produced by functional paradigms that we use on an everyday basis and help us abstract quite a bit of complexity.


- **Optionals, Promises, streams... :** Monads. The name doesn't really matter, what matters here is that we can `map`, which abstracts all the inner complexity. These abstraction are very powerful, to the point that most languages turn them into operators. For example `async/await` for Promises, or `.?` for Optionals. I doubt we'll ever want an `abstractfactory` operator, but I could go wrong...
- **The Component abstraction :** All the current web frameworks (React, Vue, Angular) use the component abstraction. Like its name suggests, it enables reuse via composition.
- **Redux :** Isolates state, avoids mutations, gives birth to pure functions... It's a bit of a learning curve, but when you get it, thinking the redux way is a real time-saver.


