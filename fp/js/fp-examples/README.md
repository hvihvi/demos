# Bonnes pratiques React & JS

JS contient beaucoup de features, du legacy, d'autres mal foutues, et certaines très pratiques. Il faut piocher le meilleur et éviter le pire.

# FP

- trendy dans l'ecosysteme JS
- cleaner code, facilite la compréhension, moins de boilerplate, mental model simple
- un vocabulaire qui fait peur, mais des conceptes simple, pas besoin d'être un autiste (du moins pour la partie qui nous intéresse)
- y a plus à désapprendre qu'à apprendre
- pour ceux qui aiment pas y a Angular :troll: : https://2019.stateofjs.com/front-end-frameworks/
- Parfois mal interprété: ne pas confondre functionnal programming et fluent API / builders ❗️ :
```js
map(a).to(b).with(toto).and(whatever) // Not FP: fluent API / builders
a.isEqualTo(b.and(c.not())) // Not FP: fluent API / builders

// function and composition as primary abstraction tool
const b = M(a).map(f).map(g) // FP functor/monad
const f = a => 2 * a // FP functions
const b = g(f(a)) // FP functions
const b = g(f) // FP functions
const fgh = compose(f,g,h) // FP functions
const f = a => b => a + b // FP functions
```
- En gros, éviter les design patterns farfelu, utiliser des fonctions, et encore des fonctions https://youtu.be/srQt1NAHYC0?t=226

## Do not use inheritance ("extends"), use composition
  - use **composition** (valable pour java aussi, mais c'est plus simple à faire en js...)
  - composition de fonctions:
  ```js
  // composition de fonctions
  const b = mapAtoB(a);
  const c = mapBtoC(b);

  // version sans variables intermédiaires
  const b = mapBtoC(mapAtoB(a));

  // version sans variables intermédiaires ++
  const c = compose(mapAtoB, mapBtoC)(b)

  // composition dans map (monad/functors)
  M(a).map(mapAtoB).map(mapBtoC)

  // high order function
  const c = myFunction(anotherFunction);
  // currying
  const f = a => b => a + b
  ```
  - composition de components en JSX:
  ```js
  const Comp = () =>
  <Parent>
    <Fils1/>
    <Fils2>
      <PetitFils/>
    </Fils2>
  </Parent>
  ```

## avoid classes

* avoid `class`, `new`, `this`...
  - https://codesandbox.io/s/react-mutation-antipattern-demo-jv5sw : on perd l'encapsulation d'étât de React
  - l'écosysteme React fournit quasiment tout ce qu'il faut pour créer des états sans avoir à créer de classes (state/context/redux/...)
  - Est-ce que je peux remplacer par des fonctions? pure? Est-ce que je peux utiliser les outils mis à disposition par React (ex: `<Context>`, hook, redux...)
  - risque d'avoir des modèles mentaux basés sur Java, alors que `this` et l'héritage sont différents (prototypal inheritance) https://blog.isquaredsoftware.com/presentations/2019-05-js-for-java-devs/#/62
  - pas besoin de créer des `ApiClientService` à instancier en lui passant une baseUrl etc, une simple fonction avec un param suffit (ex ici: `fetch`)
  - pas besoin de faire des classes avec methodes static, une fonction suffit

## let vs const vs var

  - never use var
  - let vs const : https://codesandbox.io/s/let-and-const-6hkk8
  - les 2 permettent des mutations, const un poil moins


## avoid hasty abstractions

  - On a appris pendant des années : inversion of control, DRY, separation of concerns, design-patterns... à modérer 🙏 source de code difficile à penser et manipuler ❗️
  - Exemple DRY hâtif:
    * "hey, si je mutualisais ce truc, ça sera cool, j'aurais plus besoin de me répéter"...
    * le temps passe...
    * "hey, je dois utiliser ce truc mais c'est un peu différent, je rajoute un petit if"
    * le temps passe...
    * le truc mutualisé devient un gros fourre tout bordélique
    * Sandi Metz tl;dr: la duplication coute moins cher à la boite que la mauvaise abstraction, surtout appliquée en largeur comme on aime faire chez LF
  ```js
  <Button> // day 1
  <Button color={blue} weight={PRIMARY}> // day 2
  <Button color={blue} weight={PRIMARY} tag={DIV} logoIfPresent={logo} hasBorder={false} upperCase={true} isAuto={false} cEstLaFete={true}> // ...
  // alternative dupliquée
  <PrimaryButton>
  <SecondaryButton>
  <AutoCta>
  <HardToNameButton>
  ```
  - Exemple d'inversion of control hâtive qui complique la tâche :
```js
// Pattern IoC (render props)
ComposantComplexe = () => <Wrapper
  className={"aze"}
  renderTrucInterne={ctx => <TropBienJeChoisisMonRendu // c'est tordu, faut lui passer ctx si on veut accéder à l'état interne, inception
    ctx={ctx}
    renderAutreTrucInterne={<EtAussiLeRenduDuRendu/>}
  />}
/>

// VS composition
const ComposantProbablementMoinsComplexe = () =>
<Wrapper>
  <TrucInterne>
    <TrucDansLeTruc/>
  </TrucInterne>
  <AutreTrucInterne/>
</Wrapper>
```
  - separation of concerns: ex: split js/html/css. JSX, css-in-js, ça trigger les anciens, mais ça facilite la vie. Présenté en 2014 par @vjeux (prettier, react native...), en 2019 rewrite de facebook avec ces techno 💅.

  - Dans React contemporain, la mutualisation du code stateful se fait très majoritairement via des custom hooks (anciennement HOC et renderProps), et le code stateless via des fonctions. La réutilisabilité des composants est faite par composition, par exemple en piochant dans des design-systems.
  Eviter de retomber dans d'anciennes abstractions poussées par d'autres frameworks moins adaptées (html, jsp, gwt...), React est adapté à l'abstraction "Component". (par ex dans les premières itérations du design-system on passait tag+className en props à un <Bouton>, ça contourne l'abstraction)
  - Il n'y a pas de composant trop petit ✅ par contre ils peuvent être trop gros. Tendance legacy JSP à utiliser le composant comme une page.

## avoid mutations

  - examples of mutations and solutions: https://codesandbox.io/s/github/hvihvi/ts-enforce-immutability-examples/tree/master/
  - Java bonus: avoid setters
  - discussion: event_service/history_service

  - bad array prototype functions:
  array.push() // ❌ add to back
  array.unshift() // ❌ add to front
  array.pop() // ❌ remove from back
  array.shift() // ❌ remove from front
  array.splice() // ❌ can insert or remove in the middle
  array.sort() // ❌ sorts the array in-place!!!
  array.reverse() // ❌ reverse the array in-place

## Functors, Monads & syntactic sugar
  - Functors : Wrapper/boite qui peut contenir n'importe quel type, qui masque la complexité et qui permet de `map` d'un type A vers un type B...
  ```js
  // sans functor
  const b = mapAtoB(a);
  const c = mapBtoC(b);
  
  // avec functor
  Boite(a)
    .map(mapAtoB)
    .map(mapBtoC)
  
  // => permet d'abstraire ce qu'il se passe dans la Boite, et d'appliquer des fonctions directement sur `a`
  ```
  - Monads : un functor qui peut `flatMap`, c'est équivalent à map mais une `Boite(Boite(a))` devient une `Boite(a)` :
  ```js
  Boite(a)
    .flatMap(mapAtoBoiteDeB) // on applique à Boite(A) une fonction A -> Boite(B), on récupère une Boite(B) au lieu de Boite(Boite(B)) avec un map classique
    .map(mapBtoC)
  ```
  - async/await & promises
  - optionals
  - arrays
  
  
 ## CSS
  - design bancale du language basé sur l'héritage
  - éviter de "cascader" (hériter)
  - pattern "css-in-js", 1 css par composant, on utilise le composant (avec son style) comme abstraction et on compose avec en JSX, plutôt que partager des classnames
  - Note BEM: Garder l'esprit de découpe est le même, mais découper en Components au lieu de className
  - discussion: éviter les collisions?
  - si vous avez à écrire du css hors du design-system, posez vous la question si c'est normal ou pas
```js
import "./Component.scss";

export const Component: FC<ComponentProps> = ({children}) => <div className="Component">{children}</div>;
```

## flexbox grid vs bootstrap
  - kill bootstrap?

## === vs ==
  - avoid `==` : `true === 1 // false`, `true == 1 // true` https://blog.isquaredsoftware.com/presentations/2019-05-js-for-java-devs/#/40

## external libs
  - no jquery
  - don't use libs imported from jsp

## state management

  - state management tools:
    * plain React: lift state jusqu'au plus haut composant commun (TODO: faire un dessin)
    * plain React with Context: même esprit qu'au dessus, permet d'eviter les props drilling. Un peu moins opti que redux sur des states qui changent beaucoup, mais ça fait le taf. Nickel pour partager des constantes ou presque.
    * Redux: state global, mais bien managé
    * StateX: states possibles et transformations hardcodés
  -  garder states minimales: par exemple, au lieu d'avoir un état qui dit si on est LOADING/DISPLAY_PPS/ERROR et un état qui contient les tarifications, il suffit de fetcher les tarifications, et display loading si tarifications est undefined, et error si offre.length===0 par exemple. 1 état au lieu de 2.
