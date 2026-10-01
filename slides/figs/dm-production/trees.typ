#import "@preview/syntree:0.3.1": tree

#set text(font: "Helvetica Neue", size: 20pt, fill: rgb("1a1a1a"))
#let red = rgb("8c1515")
#let blue = rgb("245b75")
#let t = tree.with(child-spacing: 28pt, layer-spacing: 34pt, stroke: 1pt)
#let f(body) = text(fill: red, body)
#let panel(title, body, caption) = stack(dir: ttb, spacing: 22pt,
  text(size: 17pt, weight: "bold", fill: blue, title), body,
  text(size: 16pt, caption))
#let pair(left, right) = grid(columns: (1fr, 45pt, 1fr), align: center + top,
  gutter: 12pt, left, grid.cell(align: center + horizon, text(size: 30pt, fill: red)[→]), right)
#let cat-n = t([nP], [√KATZ], [n])
#let cat-num = t([NumP], cat-n, [Num\ [plural]])
#let cat-dp = t([DP], [D\ [definite]], cat-num)
#let cat-subject = t([DP], [D + Num + n + √KATZ], roof: true)
#let cat-vp = t([vP], cat-subject, t([v′], [√SCHNURR], [v]))
#let key = sys.inputs.at("figure", default: "normal")
#let diagram = if key == "normal" {
  pair(
    panel([Syntactic structure], t([NumP], t([nP], [√CAT], [n]), f([Num\ [plural]])), [Roots and features, before pronunciation]),
    panel([Vocabulary Insertion], t([NumP], t([nP], [√CAT\ /kæt/], [n\ ∅]), f([Num\ [plural]\ /z/])), [Phonology: /kæt-z/ → [kæts]]))
} else if key == "fusion" {
  pair(
    panel([Two terminals], t([X], [v…], t([Y], f([T\ [present]]), f([φ\ [2, plural]]))), [Local PF structure]),
    panel([One terminal], t([X], [v…], f([T/φ\ [present, 2, plural]])), [One insertion site: -te]))
} else if key == "fission" {
  pair(
    panel([One terminal], t([X], [stem], f([Agr\ [1, plural]])), [Toy paradigm: one agreement bundle]),
    panel([Two terminals], t([X], [stem], t([Agr], f([Person\ [1]]), f([Number\ [plural]]))), [Two insertion sites: ka + mu]))
} else if key == "impoverishment" {
  pair(
    panel([Before deletion], t([Clitic group], f([Cl\ [3, sg, DAT]]), [Cl\ [3, sg, ACC]]), [DAT would license le]),
    panel([After deletion at PF], t([Clitic group], f([Cl\ [3, sg]]), [Cl\ [3, sg, ACC]]), [Elsewhere se + accusative lo]))
} else if key == "record" {
  pair(panel([Noun], t([nP], [√RECORD], f([n])), [REcord]),
    panel([Verb], t([vP], [√RECORD], f([v])), [reCORD]))
} else if key == "separate" {
  pair(panel([Adjective], t([aP], [√SEPARATE], f([a])), [separate: final /ət/]),
    panel([Verb], t([vP], [√SEPARATE], f([v])), [separate: final /eɪt/]))
} else if key == "nominalizations" {
  grid(columns: (1fr, 1fr, 1fr), gutter: 30pt, align: center + top,
    panel([arrival], t([nP], [√ARRIVE], f([n\ -al])), [arriv- + -al]),
    panel([collection], t([nP], [√COLLECT], f([n\ -ion])), [collect- + -ion]),
    panel([destruction], t([nP], [√DESTROY], f([n\ -ion])), [destruct- + -ion]))
} else if key == "pfau-error" {
  pair(panel([Intended local structure], t([TP], t([vP], [√VERSUCH\ ‘try’], [v]), f([T\ [past]])), [versuch-te: ‘tried’]),
    panel([Root anticipation], t([TP], t([vP], [√KOMM\ ‘come’], [v]), f([T\ [past]])), [kam: ‘came’]))
} else if key == "pfau-architecture" {
  let card(title, body, width) = block(width: width, inset: 13pt,
    radius: 5pt, stroke: rgb("d3c8bc"), fill: rgb("f4f1ea"))[
    #align(center)[#text(size: 18pt, weight: "bold", fill: blue, title)
    #v(10pt)
    #text(size: 17pt, body)]
  ]
  grid(columns: (135pt, 24pt, 120pt, 24pt, 320pt, 24pt, 135pt),
    align: center + horizon, gutter: 2pt,
    card([Conceptualizer], [Message\ and concepts], 135pt), [→],
    card([List 1], [Roots +\ features], 120pt), [→],
    card([Formulator], [Syntax\ ↓\ Morphological Structure\ ↓\ Vocabulary Insertion ← List 2\ ↓\ Phonology], 320pt), [→],
    card([Articulator], [Spoken\ utterance], 135pt))
} else if key == "cat-n" {
  t([nP], [√KATZ], f([n]))
} else if key == "cat-num" {
  t([NumP], cat-n, f([Num\ [plural]]))
} else if key == "cat-dp" {
  t([DP], f([D\ [definite]]), cat-num)
} else if key == "cat-vp" {
  t([vP], cat-subject, t([v′], [√SCHNURR], f([v])))
} else if key == "cat-tp" {
  t([TP], cat-vp, f([T\ [−past]]))
} else if key == "cat-movement" {
  t([CP], f([DPᵢ]), t([C′], f([C\ √SCHNURR + v + T]),
    t([TP], [tᵢ … tᵥ … tₜ], roof: true)))
} else if key == "cat-agr" {
  pair(panel([Syntactic output: local head], t([T], [v…], [T\ [−past]]), [No Agr terminal yet]),
    panel([Add an agreement terminal], t([T], [v…], t([T], [T\ [−past]], f([Agr\ [  ]]))), [Agr is a sister of T]))
} else if key == "cat-copy" {
  pair(panel([Subject domain], t([DP\ [NOM]], f([D\ [definite, plural]]),
      [NumP\ [plural]\ …√KATZ…]), [D receives plural; the DP receives case]),
    panel([Verbal domain], t([T], [v…], t([T], [T\ [−past]], f([Agr\ [plural]]))),
      [Copy the subject’s plural feature to Agr]))
} else if key == "pfau-fusion" {
  pair(panel([Before Fusion], t([X], [v…], t([Y], f([T\ [−past]]), f([Agr\ [plural]]))), [Two realization sites]),
    panel([After Fusion], t([X], [v…], f([T/Agr\ [−past, plural]])), [One site for finite inflection]))
} else if key == "pfau-category" {
  pair(panel([Intended roots in context], grid(columns: (1fr, 1fr), gutter: 25pt,
      t([nP], [√BLICK], f([n])), t([vP], [√WERF], f([v]))), [Blick ‘glance’ … geworfen ‘thrown’]),
    panel([Exchanged roots in context], grid(columns: (1fr, 1fr), gutter: 25pt,
      t([nP], [√WERF], f([n])), t([vP], [√BLICK], f([v]))), [Wurf ‘throw’ … geblickt ‘glanced’]))
} else if key == "planned-frame" {
  let p = tree.with(child-spacing: 24pt, layer-spacing: 23pt, stroke: 1pt)
  p([CP], f([DPᵢ\ cats; internals open]),
    p([C′], f([C\ □ + v + T]),
      p([TP], [tᵢ], p([T′],
        p([vP], [tᵢ], p([v′], [√□], [tᵥ])), [tₜ]))))
} else if key == "tree-code" {
  t([NumP\ #f[ε]], t([nP\ #f[L]], [√KATZ\ #f[LL]], [n\ #f[LR]]),
    [Num[plural]\ #f[R]])
} else {
  panic("Unknown figure: " + key)
}

#html.frame(block(width: 860pt, inset: 24pt, fill: white)[#align(center, diagram)])
