# Pfau: DM as a production architecture

Deck: `slides/w5-dm-production.qmd`. Dated October 2, 2026. Class length:
75 minutes. The central objective is to explain how Pfau puts DM to work
inside a production model, and why the distinction between abstract
structure and pronunciation helps explain speech errors.

Present the ideas without author names in slide titles, running text, or
comparison tables. Keep source attributions in speaker notes and collect
credits on the final reference slides. This applies to both Pfau and
Goryczka; their relevant material remains in the lesson.

| Minutes | Material |
|---|---|
| 0 to 22 | Ordinary DM tree, operations, then three exercise/answer pairs |
| 22 to 30 | Production/DM connection, the Formulator, early root identity |
| 30 to 50 | Fourteen short builds of Die Katzen schnurren |
| 50 to 65 | Selection errors, tense stranding, category exchange, paired error exercise |
| 65 to 75 | Separate stores, control, discussion, and exit ticket |

Each word exercise now precedes its answer on a separate slide. Ask for
syntactic structure, contextual realization rules, and relevant phonological
changes before displaying the trees.

The German walkthrough separates the message, input selection, nP, NumP,
DP, predicate, tense, main-clause movement, Agr insertion, feature copying
and case assignment, Fusion, root realization, functional realization, and
articulation. The notation modernizes the original LP/licensing analysis.
The fourteen teaching steps do not claim fourteen measured processing stages.

The main lesson ends at the exit ticket. After the source slides and
“Further reading: possible implementations,” a separate twelve-slide
extension develops the vector version and an LLM experiment proposal.
Allow additional time or use it in a later discussion; it is outside the
75-minute main lesson. No agreement-attraction example is used.

## Main teaching sequence

1. Connect production's grammatical and phonological encoding to DM's
   distinction between abstract structures and their realization.
2. Locate the DM mechanisms inside Pfau's Formulator. Distinguish stores
   supplying representations from operations on those representations.
3. Build Pfau's Die Katzen schnurren derivation one addition at a time.
   Distinguish adding Agr from copying into it and from fusing it with T.
   Distinguish nominal /katsə/ + /n/ from verbal /ʃnʊr/ + /ən/.
4. Introduce a conceptual selection error, then show an anticipated root
   receiving the correct past realization in an unintended context.
5. Make the crucial distinction explicit: [past] survives, while the sound
   of its realization changes from versuch-te to kam.
6. Connect root category flexibility to the earlier record and nominalization
   exercises through the Blick/Wurf exchange.
7. Have students analyze schien ... zu drohen becoming drohte ... zu scheinen.
8. Present Goryczka as a development of the same production question.

## Sources and simplifications

The full Pfau (2000) dissertation, *Features and Categories in Language
Production*, has now been downloaded outside the repository and checked
directly. Its table of contents does not match the body pagination of this
PDF; use section, figure, and example numbers, with PDF page numbers where
needed. The original book-specific references below document the earlier
use of Goryczka's summary. They are not claims that the full 2009 book was
independently consulted.

Direct checks in the dissertation:

- Early root identity: §4.2.1, “Non-Random Insertion: Distinguishing Cats
  from Dogs.”
- Semantic perseveration: §4.2.2, (4-11a), PDF page 149.
- Wurf/geblickt: §4.5.2, (4-55b), PDF page 231. Qualifications involving
  richer nominal structure appear in §4.5.3, PDF pages 239 to 240.
- Schien/drohte: §4.6, (4-68a).
- Ordinary grammatical operations and accommodation: §4.7.1.
- Integrated architecture and cats-purring derivation: chapter 5,
  (5-1), (5-2), and (5-4), PDF pages 295 to 310. The identification of DM
  with the Formulator is explicit on PDF page 302.

The kam/versuchte example remains sourced through Goryczka's account of
the 2009 book. The dissertation contains a different kam example involving
tense perseveration; do not substitute its citation for the anticipation
example used in class.

- Goryczka (2025), pp. 104 to 108: the opening operation analyses. Fusion
  uses an Italian present-tense subtree. Fission uses an explicitly invented
  paradigm, with an Italian proposal in the notes. Spanish spurious-se is
  simplified to third-person singular clitics with DAT deletion at PF.
- Goryczka (2025), §3.2.3, especially pp. 113 to 121: the central Pfau section.
  Pfau (2009), pp. 302 to 309: worked utterance and architecture, discussed
  on pp. 120 to 121 of Goryczka. The architecture drawing displays the route
  toward pronunciation and omits LF. List 1 supplies roots and features;
  List 2 supplies Vocabulary Items.
- The Die Katzen schnurren tree is abbreviated, with surface subject position
  and omitted movement, CP/V2 structure, and argument-introduction details.
  It illustrates what kinds of objects syntax manipulates. It is not a
  complete derivation of German word order. The realization table gives
  resulting words, not a proposed inventory of whole-word Vocabulary Items.
- Semantic perseveration: anbellen for anbinden, Pfau (2009), p. 11;
  Goryczka p. 113, (58b). The English sentences are translations.
- Root anticipation and tense stranding: kam for versuchte, Pfau (2009),
  p. 17; Goryczka pp. 117 to 119, (61a)/(63a).
- Category exchange: einen Wurf geblickt for einen Blick geworfen,
  Goryczka p. 119, (63c), citing Pfau. The diagrams isolate n/v contexts
  and omit the higher participial structure. The intended idiomatic meaning
  is “I cast a glance.”
- Paired exercise: es drohte zu scheinen for es schien zu drohen,
  Goryczka p. 117, (61b), citing Pfau. Root exchange leaves past in the finite
  position. Both changed pronunciations follow the new contexts.
- Goryczka §6.1, pp. 269 to 278, Figure 44: separate root and feature lists,
  cognitive control, feedback, and local phonology. Distinguish overt
  self-correction from automatic feedback in activation models.
- The earlier Pfau thesis chapter provides additional direct discussion of
  the grammar/production connection and accommodation:
  https://babel.ucsc.edu/~hank/mrg.readings/pfau-ch4.pdf.
  Its pagination differs from the 2009 book.

## Main discussion answers

A specific abstract root must be selected early enough for the message to
control lexical content; late insertion does not mean late determination
of which concept is being expressed.

In the kam error, the root changes but past remains. What is stranded is
not the suffix -te. The error output can be morphologically well-formed
because ordinary realization applies to the altered representation.

In the Blick/Wurf error, the category comes from the new grammatical context.
In the schien/drohte exercise, roots exchange and are realized under the
surviving past and infinitival specifications.

These analyses constrain representations and operation ordering. They do
not by themselves supply exact error rates or uniquely establish DM.

## Vector and LLM extension after the references

Marcus (2013) motivates locally structured treelets and fallible links.
Keshev et al. (2025), §2, supplies outer-product encoding and position-cued
retrieval. The extension adapts those ideas to the same German example:

- Bind node content to structural paths. Store internal labels too if the
  complete labeled tree is to be reconstructed.
- Use W = sum(v_i p_i^T) for a local binding memory; retrieve with W p_i.
- Work through a numerical copy of plural from Num to Agr. The two-coordinate
  content vectors track plural and nonpast; T is outside that matrix slice.
- Make Fusion, Fission, and Impoverishment changes to both sites and content,
  not merely new names for vector addition.
- Retrieve roots and features, then use the Vocabulary to select exponents.

These are teaching constructions, not simulations reported in the readings.
Keshev's paper concatenates root and number in an item vector; separately
binding DM terminals and implementing morphological operations is an extension.
A fixed finite vector space does not provide unlimited exact tree memory.

For LLMs, propose a controlled German number experiment using held-out noun
and verb roots. Extract activations after number information is available;
account for subword segmentation and score full candidate forms. Probe for
number directions, then intervene on candidate subspaces or head outputs.
Compare shifts in plural versus singular continuation preference, with
same-number and unrelated-component controls. A positive probe shows
readability; selective behavioral changes support causal use. Neither alone
establishes DM or a one-to-one mapping from attention heads to syntactic heads.

Primary methodological sources are linked in the final extension slide:
Hewitt & Manning (2019), Lasri et al. (2022), Mueller et al. (2022), and
Amini et al. (2023). No new model experiment has been run or claimed.

## Discussion after step 14: plan from the destination

Five slides immediately after step 14 and before “Now let something go wrong”
ask whether the production plan must follow the order used to teach the derivation. Retain the complete main
lesson and implementation extension. Allow additional discussion time.

The proposed alternative retrieves a familiar subject-initial clause frame,
places the intended cats DP at its destination, and anticipates its lower
positions and the verbal movement chain. Distinguish planning a destination
from syntactic base generation there. The Typst tree is a deliberately rich,
partially specified candidate, not an empirical finding or Pfau's proposal.

Ask students how much they would reserve: dependency links alone, their local
surroundings including relevant complements, or a fuller clause frame with
argument and feature relations. A subject trace is not a head taking its own
complement. Compare reuse of order, dependencies, and complement structure.
Connect back to vectors as roles and links that can precede filled content.

Treat idiom-like familiarity as a hypothesis about structural reuse. Do not
claim an 80 to 90 percent German word-order frequency without a defined
construction, corpus, and source.

## Figures and rendering

Editable figures: `slides/figs/dm-production/trees.typ`.

```sh
python3 slides/figs/dm-production/build.py
quarto render slides/w5-dm-production.qmd
```

The builder uses syntree 0.3.1 and Typst 0.15.1, exporting through
`html.frame` and extracting its inline SVG. Sources and rendered SVGs are
retained so the site build does not require Typst. Reading PDFs remain
outside the repository.
