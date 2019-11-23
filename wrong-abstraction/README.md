# Refactoring : Avoid and remove hasty abstractions

The "wrong abstraction" topic as described by Sandi Metz desserves more attention than it currently gets. What we want to avoid is pretty simple to understand yet hard to detect.

1. dev1 sees a pattern, some kind of duplication -> he creates a shiny abstraction
2. dev2 tries to use this cool abstraction but it is missing something for his use-case. He modifies the abstraction
3. time passes, loop over step (2) multiple time
4. you now look at the code, it's a total mess

To fix this, we need to detect and undo the abstraction.
However, the more time passes by, the harder it is to undo this abstraction. This is the reason why detecting them early and avoiding hasty abstraction is important.


## A little story : The Abstract Comparison Page

Our company compares a lot of products. The comparison pages all look somewhat the same, a filterable list of items (just like most flight or hotel comparison websites). We are currently migrating these pages to React.

Our first idea as *DRY-obsessed* developpers was to abstract this "filterable list of item" logic.

An abstraction that looked sexy was to have a reusable `<FilterableItems/>` component.
Its API has 3 inputs:
- items : the list of items to render
- renderItem : takes an item as input and tells us how to render it `item -> render`
- renderFilters : takes a function that allows to set a predicate as input and tells us how to render it `setPredicate -> render`

The reusable component handles the merge of all predicates to filter and displays our items.

Simple enough. The code is concise, inversion of control makes it very reusable and we can easily reason about it in a functional way. We are happy with this abstraction.

Now, we take a step back and realize that sometimes filters are on top of the list, and sometimes on the side... Fine, we can add a "Layout" to our API so that it can be defined if necessary.

It's a bit confusing to have this separation of layout and actual render but it sound like "separation of concerns". After all this is pretty much what we do when whe segregate HTML and CSS...

Time for another step back. We notice that sometimes, outside of the scope of our `<FilterableItems/>` component, a sentence tells us how many items are being displayed. To sum it up, the parent component needs to be aware of the inner state of its children. Well, I guess we could use some sort of callback...

At this point, we had spent a few hours of work and discussions.
Soon enough, talks by Sebastian Markbage or Sandi Metz pop in our heads: "The cost of the wrong abstraction".

Luckily, all these "new" requirements didn't come up over time so we can observe the cost of this abstraction early on.
It's not too late to make the right decision: Let's give up on this abstraction (and these few hours of work) and **inline** every usages of this abstract component.

We are now free to lift the state up to share it where it needs to be used. We are using React's composition and state management mechanism with no big abstraction on top of it, making the code very flexible and easy to get into. There is going to be a bit of duplication, and this is fine, it's the price to pay to remain flexible.

Now what if we hadn't reverted this abstraction ?

Our codebase's history, due to its monolithic nature and our "DRY" education, is filled with costly abstraction example...
Some of them cursed teams for years. What looked like a smart abstraction at first became a constant struggle, to a point where no one had the courage to remove them. Whenever a new idea came up, devs had to explain that "we can't implement this, because we'd have to modify the homemade framework, which affects the whole codebase...".
This is the path this piece of code would probably have taken if we hadn't reverted it early. Due to its large scope and the intent to use it for every comparison pages, removing it would have been a nightmare.

## The 3 DRY phases

It seems that developpers go through different phases of "DRY" principle as they grow up:

1. Doesn't care about duplication
2. Wants to remove duplication at all cost, enforces abstractions
3. Avoids early abstraction, accepts duplication

If we look at how they see the future, (1) doesn't care, (2) foresees himself repeating tasks, (3) foresees himself struggling against spaghetti code...

Evolving from (1) to (2) is pretty straightforward, there are tons of educationnal content that will push you in this direction.
Creating a cool looking abstraction is in fact quite satisfactory. It makes you feel smart and you can show it off.
Knowing when not to do it unfortunately isn't as flashy and it often goes unoticed. It takes a higher level of maturity.

## Detection

There are probably too many ways to detect abstractions that have gone wrong to list them all, but let's name a few of them.

- Inheritance: Use Composition over Inheritance (avoid the "extends" keyword). Unfortunately, OOP languages provide a few bad tools to create abstraction, which is probably why quite a few programming figures try to stay away from them (Linus Torvalds creator of Linux and Git http://harmful.cat-v.org/software/c++/linus
Joe Armstrong creator of Erlang http://harmful.cat-v.org/software/OO_programming/why_oo_sucks...), and newer language like Golang don't implement any "extend" feature and force you to compose.
- Huge API surface: The surface is what an abstraction exposes to its client. When an API's surface is too large, the abstraction under it becomes hard to use. You need to be aware of too many factors to use the API. I'd recommend Sebastian Marbage's talk on this topic https://www.youtube.com/watch?v=4anAwXYqLG8
- Too many ifs and parameters...: Too many of these create a lot of complexity. Sometimes they can be avoided. Would you rather have a `<Button>` component and pick its color, or have a `<RedButton>` and a `<BlueButton>` ? Most people go straight to the first one because it makes for a nice abstraction, but the 2nd version is actually more flexible in the long run. It's a matter of finding the right ballance here and split things when necessary, a single Button that has all the logic for every buttons in your design-system is a huge pain point and hard to use when it grows too big.
- Logic in your tests: For example, a test that loops over every "Car" instances and checks that they have 4 wheels. Well, maybe a Car should have 4 wheels by design, that way the dev using a Car doesn't have to add the right amount of wheels himself. Logic resides in code, you probably don't want to be testing your tests.
- Unecessary indirection: It's a bit irritating when you have to navigate a lot for simple stuffs. For example "clean code" tells us to extract strings into constants. But it's annoying to navigate to it's declaration, espacially when it's used only once. That's an example of overkill indirection. Extracting random functions because your IDE has a shortcut is another one we often run into.
- All-in-one functions: For example, when you `map` (ex: in a monad), people tend to try to fit and extract evything into a single function. If you map from type A to D, going `A -> B -> C -> D`. Instead of extracting a single function `mapAtoBtoCtoD` that handles too many tranformations, it is easier to understand successive maps (`mapAtoB`, `mapBtoC`, `mapCtoD`) and that way you can inline the simple ones for minimal navigation overhead.
- The list goes on...

What these all have in common is that code becomes hard to use, hard to understand and hard to change.



## Removing an abstraction

Removing an abstraction is actually pretty simple but might take long.

- **Take small steps:** Always commit minimal steps with a meaningful message, that way when you break something you can figure out what went wrong easily
- **Inline:** Inline each usages, maybe 1 at a time. If it's a function, inline it, if it's inheritance, flatten it into a single class etc
- **Cleanup:** After an inline you're left with raw code, you can now hunt for unused variables, unused if branches...
- **Rewrite:** The idea here is to not make the same mistake. If the code is still a mess, go with simple functional programming principle, such as enforcing immutability, isolating side-effects from pure functions...
- **Repeat:** Rollback when it goes wrong, fight the temptation to build a new abstraction right away, the good ones take time to figure out.


## Producing better abstractions

As a disclaimer, lets remind that not all abstractions are harmful. And most of them were actually good and helpful ones before they go out of control, do not blame their author.

From my experience, applying **functional programming** principles have been very helpful in creating better abstraction, probably due to being backed by actual mathematics and not "gut feeling" like OOP patterns...

Let's look at a few good abstraction produced by functional paradigms that we use on an everyday basis and help us think at higher levels without worrying about inner complexity.

- The Component abstraction : All the current web frameworks (React, Vue, Angular) use the component abstraction. Like its name suggests, enables reuse via composition.
- Redux : Isolates state, avoids mutations, extracts pure functions... It's a bit of a learning curve, but when you get it, thinking the redux way saves so much time
- Optionals, Promises, streams...: The pattern we see here is called Monad. The name doesn't really matter, what matters the most is that we can `map`, which abstracts all the inner complexity. These abstraction are very strong, to the point that most languages turn them into operators. For example `async/await` for Promises, or `.?` for Optionals. I doubt we'll ever want an "abstractfactory" operator, but I could go wrong...


# TDD, Code coverage...

TDD, test coverage, just like DRY, is fine when not taken to the extreme. If you test every possible scenario, you may as well plug your code to your test. Test is about confidence