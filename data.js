// Leerstof: Blink Engels – Song 2, Lesson 2 (Ed Sheeran – Azizam) – Words and phrases
window.LESSON = {
  groups: [
    { id: 'g1', name: 'Eten in de keuken', short: 'Groep 1', color: 'tomato' },
    { id: 'g2', name: 'Hoe smaakt het?', short: 'Groep 2', color: 'mustard' },
    { id: 'g3', name: 'Koken & meer', short: 'Groep 3', color: 'leaf' }
  ],
  words: [
    { id: 'tomato', syl: 'to·ma·to', en: 'tomato', nl: 'tomaat', g: 'g1', pic: '🍅' },
    { id: 'carrot', syl: 'car·rot', en: 'carrot', nl: 'wortel', g: 'g1', pic: '🥕' },
    { id: 'pepper', syl: 'pep·per', en: 'pepper', nl: 'paprika', g: 'g1', pic: '🫑' },
    { id: 'lettuce', syl: 'let·tuce', en: 'lettuce', nl: 'sla', g: 'g1', pic: '🥬' },
    { id: 'cucumber', syl: 'cu·cum·ber', en: 'cucumber', nl: 'komkommer', g: 'g1', pic: '🥒' },
    { id: 'beef', en: 'beef', nl: 'rundvlees', g: 'g1', pic: '🥩' },
    { id: 'chicken', syl: 'chick·en', en: 'chicken', nl: 'kip', g: 'g1', pic: '🍗' },
    { id: 'cheese', en: 'cheese', nl: 'kaas', g: 'g1', pic: '🧀' },

    { id: 'crunchy', syl: 'crun·chy', en: 'crunchy', nl: 'knapperig', g: 'g2', pic: '🥨' },
    { id: 'sweet', en: 'sweet', nl: 'zoet', g: 'g2', pic: '🍬' },
    { id: 'sour', en: 'sour', nl: 'zuur', g: 'g2', pic: '🍋' },
    { id: 'soft', en: 'soft', nl: 'zacht', g: 'g2', pic: '🍞' },
    { id: 'hard', en: 'hard', nl: 'hard', g: 'g2', pic: '🪨' },
    { id: 'creamy', syl: 'cream·y', en: 'creamy', nl: 'romig', g: 'g2', pic: '🍦' },
    { id: 'spicy', syl: 'spic·y', en: 'spicy', nl: 'pittig', g: 'g2', pic: '🌶️' },
    { id: 'greasy', syl: 'greas·y', en: 'greasy', nl: 'vettig', g: 'g2', pic: '🍟' },

    { id: 'smelly', syl: 'smel·ly', en: 'smelly', nl: 'stinkend', g: 'g3', pic: '🦨' },
    { id: 'meatballs', syl: 'meat·balls', en: 'meatballs', nl: 'gehaktballetjes', g: 'g3', pic: '🧆', altNl: ['gehaktballen'] },
    { id: 'mashed', syl: 'mashed po·ta·toes', en: 'mashed potatoes', nl: 'aardappelpuree', g: 'g3', pic: '🥔', altNl: ['aardappelpurée', 'puree'] },
    { id: 'boil', en: 'boil', nl: 'koken', g: 'g3', pic: '♨️' },
    { id: 'bake', en: 'bake', nl: 'bakken', g: 'g3', pic: '🧁' },
    { id: 'cut', en: 'cut', nl: 'snijden', g: 'g3', pic: '🔪' },
    { id: 'piece', en: 'piece', nl: 'stukje', g: 'g3', pic: '🍰', altNl: ['stuk'] }
  ],
  // Zinnen: alleen Engels -> Nederlands nodig
  phrases: [
    { id: 'p1', en: 'You can fill tacos with beef or chicken.', nl: "Je kunt taco's vullen met rundvlees of kip.", pic: '🌮', tip: 'fill = vullen' },
    { id: 'p2', en: 'Most pizzas have a crunchy crust.', nl: "De meeste pizza's hebben een knapperige korst.", pic: '🍕', tip: 'most = de meeste, crust = korst' },
    { id: 'p3', en: 'To make pancakes you need milk, butter and flour.', nl: 'Om pannenkoeken te maken heb je melk, boter en meel nodig.', pic: '🥞', tip: 'butter = boter, flour = meel' },
    { id: 'p4', en: 'This green salad has lettuce, cucumber and a lemon dressing.', nl: 'In deze groene salade zit sla, komkommer en een dressing met citroen.', pic: '🥗', tip: 'lemon = citroen' },
    { id: 'p5', en: 'You can eat it with your hands.', nl: 'Je kunt het met je handen eten.', pic: '🙌', tip: 'hands = handen' },
    { id: 'p6', en: 'It tastes delicious.', nl: 'Het smaakt heerlijk.', pic: '😋', tip: 'tastes = smaakt' },
    { id: 'p7', en: 'It is very healthy.', nl: 'Het is heel gezond.', pic: '💪', tip: 'healthy = gezond' },
    { id: 'p8', en: 'Everyone likes it.', nl: 'Iedereen vindt het lekker.', pic: '👍', tip: 'everyone = iedereen' },
    { id: 'p9', en: 'You can eat it with different vegetables.', nl: 'Je kunt het met verschillende groenten eten.', pic: '🥦', tip: 'different = verschillende' }
  ],
  // Grammatica: It is / They are (+ not + korte vorm)
  grammarThings: {
    one: [
      { en: 'The tomato', nl: 'De tomaat', pic: '🍅' },
      { en: 'The cheese', nl: 'De kaas', pic: '🧀' },
      { en: 'The pizza', nl: 'De pizza', pic: '🍕' },
      { en: 'The lemon', nl: 'De citroen', pic: '🍋' },
      { en: 'The chicken', nl: 'De kip', pic: '🍗' },
      { en: 'The cake', nl: 'De taart', pic: '🍰' }
    ],
    more: [
      { en: 'The carrots', nl: 'De wortels', pic: '🥕🥕' },
      { en: 'The meatballs', nl: 'De gehaktballetjes', pic: '🧆🧆' },
      { en: 'The peppers', nl: 'De paprika\'s', pic: '🫑🫑' },
      { en: 'The fries', nl: 'De patatjes', pic: '🍟🍟' },
      { en: 'The cucumbers', nl: 'De komkommers', pic: '🥒🥒' },
      { en: 'The tacos', nl: "De taco's", pic: '🌮🌮' }
    ]
  },
  adjectives: [
    { en: 'crunchy', nl: 'knapperig' }, { en: 'sweet', nl: 'zoet' }, { en: 'sour', nl: 'zuur' },
    { en: 'soft', nl: 'zacht' }, { en: 'hard', nl: 'hard' }, { en: 'creamy', nl: 'romig' },
    { en: 'spicy', nl: 'pittig' }, { en: 'greasy', nl: 'vettig' }, { en: 'red', nl: 'rood' },
    { en: 'orange', nl: 'oranje' }, { en: 'green', nl: 'groen' }, { en: 'healthy', nl: 'gezond' }
  ],
  // Vaste voorbeeldzinnen uit het boek
  grammarBook: [
    { en: 'It is red and a bit sour.', nl: 'Het is rood en een beetje zuur.' },
    { en: 'It is not hard.', nl: 'Het is niet hard.' },
    { en: 'They are orange and crunchy.', nl: 'Ze zijn oranje en knapperig.' },
    { en: 'They are not sour.', nl: 'Ze zijn niet zuur.' }
  ],
  shortForms: [
    { long: 'It is', short: "It's" },
    { long: 'It is not', short: "It's not" },
    { long: 'They are', short: "They're" },
    { long: 'They are not', short: "They're not" }
  ]
};

// Planning t/m toets (ma 2 november 2026)
window.PLAN = [
  { date: '2026-10-21', day: 'wo 21 okt', min: 10, title: 'Kennismaken met Groep 1', note: 'Rustig beginnen. Alleen kijken, luisteren en nazeggen.',
    tasks: [ { id: 'd1a', text: 'Leer-kaarten Groep 1 (luister & zeg na)', go: 'learn:g1' }, { id: 'd1b', text: 'Luister-spel Groep 1', go: 'listen:g1' } ] },
  { date: '2026-10-22', day: 'do 22 okt', min: 10, title: 'Kort rondje (\'s avonds)', note: 'Middag niet thuis: alleen 10 minuten, mag ook in bed op de tablet.', busy: true,
    tasks: [ { id: 'd2a', text: 'Luister-spel Groep 1, beide kanten op', go: 'listen:g1' } ] },
  { date: '2026-10-23', day: 'vr 23 okt', min: 0, title: 'Vrije dag', note: 'Grotendeels weg. Geen Engels nodig. Wil je toch? 3 minuten luisteren mag.', rest: true,
    tasks: [ { id: 'd3a', text: '(Mag) 3 min luisteren naar Groep 1', go: 'learn:g1', optional: true } ] },
  { date: '2026-10-24', day: 'za 24 okt', min: 15, title: 'Groep 2 erbij', note: 'Eerst Groep 1 even typen, dan de smaak-woorden.',
    tasks: [ { id: 'd4a', text: 'Typ-chef Groep 1 (NL → EN)', go: 'type:g1:nl' }, { id: 'd4b', text: 'Leer-kaarten Groep 2', go: 'learn:g2' }, { id: 'd4c', text: 'Printblad: woordkaartjes knippen', go: 'print' } ] },
  { date: '2026-10-25', day: 'zo 25 okt', min: 15, title: 'Groep 3 erbij', note: 'Nu ken je bijna alle woorden al een beetje.',
    tasks: [ { id: 'd5a', text: 'Luister-spel Groep 2', go: 'listen:g2' }, { id: 'd5b', text: 'Leer-kaarten Groep 3', go: 'learn:g3' } ] },
  { date: '2026-10-26', day: 'ma 26 okt', min: 15, title: 'Alle woorden schrijven', note: 'Schrijven met de hand helpt onthouden.',
    tasks: [ { id: 'd6a', text: 'Typ-chef alle woorden (NL → EN)', go: 'type:all:nl' }, { id: 'd6b', text: 'Printblad: vouwblad NL → EN', go: 'print' } ] },
  { date: '2026-10-27', day: 'di 27 okt', min: 15, title: 'Zinnen 1 t/m 5', note: 'Zinnen hoef je alleen van Engels naar Nederlands te kennen.',
    tasks: [ { id: 'd7a', text: 'Zinnen-puzzel 1–5', go: 'phrases:a' }, { id: 'd7b', text: 'Typ-chef alle woorden (EN → NL)', go: 'type:all:en' } ] },
  { date: '2026-10-28', day: 'wo 28 okt', min: 15, title: 'Zinnen 6 t/m 9 + grammatica', note: 'Uitleg it is / they are: 1 ding of meer dingen?',
    tasks: [ { id: 'd8a', text: 'Zinnen-puzzel 6–9', go: 'phrases:b' }, { id: 'd8b', text: 'Grammatica-uitleg + spel', go: 'grammar' } ] },
  { date: '2026-10-29', day: 'do 29 okt', min: 10, title: 'Kort rondje (\'s avonds)', note: 'Middag niet thuis: 10 minuten is genoeg.', busy: true,
    tasks: [ { id: 'd9a', text: 'Grammatica-spel', go: 'grammar' }, { id: 'd9b', text: 'Lastige woordjes', go: 'tricky' } ] },
  { date: '2026-10-30', day: 'vr 30 okt', min: 0, title: 'Vrije dag', note: 'Grotendeels weg. Even niks. Je hersenen slaan het nu op.', rest: true,
    tasks: [ { id: 'd10a', text: '(Mag) Lastige woordjes, 3 minuten', go: 'tricky', optional: true } ] },
  { date: '2026-10-31', day: 'za 31 okt', min: 20, title: 'Proeftoets 1', note: 'Doe alsof het de echte toets is. Daarna: lastige woordjes nog 1 keer.',
    tasks: [ { id: 'd11a', text: 'Proeftoets', go: 'test' }, { id: 'd11b', text: 'Lastige woordjes', go: 'tricky' }, { id: 'd11c', text: 'Printblad: grammatica + zinnen', go: 'print' } ] },
  { date: '2026-11-01', day: 'zo 1 nov', min: 15, title: 'Generale repetitie', note: 'Laatste keer. Rustig, en op tijd naar bed.',
    tasks: [ { id: 'd12a', text: 'Proeftoets nog een keer', go: 'test' }, { id: 'd12b', text: 'Printblad: proeftoets op papier', go: 'print' } ] },
  { date: '2026-11-02', day: 'ma 2 nov', min: 5, title: 'TOETSDAG', note: 'Ontbijten, 5 minuten warm draaien en dan: jij kunt dit.', test: true,
    tasks: [ { id: 'd13a', text: '(Mag) 5 min warm draaien: luister-spel', go: 'listen:all', optional: true } ] }
];
