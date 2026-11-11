// LING 449U: PCIbex assignment
//
// Sentence recall task, after Hill & Momma (2024).
// Each trial: read the Target aloud, read the Prime aloud, then recall one of them from a cue.
// The cue is the verb of the Target (experimental trials) or of the Prime (filler trials).
// Three prime conditions (see items.csv):
//   control      The pilot walks in the hangar with the crew.
//   tense        The pilot walked in the hangar with the crew.
//   preposition  The pilot walks from the hangar with the crew.
// What we score: on experimental trials, does the present tense Target come back in the past tense?
//
// This script does not work yet. Every place you need to edit is marked with <-----
// There are 15 of them, numbered in order.
//   FILL IN: replace XXXXXXXXXX with the right thing.
//   BUG:     the line runs (or almost runs) but does the wrong thing. Fix it.
// Open items.csv first: you need its column names.
// Do not change anything that is not marked.

PennController.ResetPrefix(null) // Shorten command names (keep this)
// DebugOff()   // Leave this line switched off while you work: you need the debugger.

// The order of the experiment. Each name here is the label of a trial below.
Sequence("welcome", "consent", "demographics", "recorder", "instructions",
         XXXXXXXXXX,                        // <----- 1. FILL IN: the practice trials come here
         "start",
         XXXXXXXXXX("experiment"),          // <----- 2. FILL IN: the experimental trials should come in a random order
         "send", "end")

newTrial("welcome",
    newText(`<p>Welcome!</p>
             <p>This is a short experiment for LING 449U. It takes about 15 minutes.</p>
             <p>You will need a microphone and a quiet place.</p>`)
        .css("font-size", "20px")
        .print()
    ,
    newButton(XXXXXXXXXX)                   // <----- 3. FILL IN: the text on the button
        .print()
        .wait()
)

newTrial("consent",
    newText(`<p><b>Consent</b></p>
             <p>In this experiment you will read sentences aloud and repeat them from memory.</p>
             <p>Your voice will be recorded. The recordings stay on your computer:
                you download them yourself at the end.</p>
             <p>Your age, your native language, and the order of your trials are saved
                on the PCIbex Farm server. Your name is not collected.</p>
             <p>Taking part is voluntary. You can stop at any time by closing this window.</p>`)
        .css("font-size", "20px")
        .print()
    ,
    newButton("I agree to take part")       // <----- 4. BUG: this page flashes by before anyone can read it
        .print()
)

newTrial("demographics",
    newText("<p>How old are you?</p>")
        .print()
    ,
    newTextInput("age")
        .log()
        .print()
    ,
    newText("<p>What is your native language (or languages)?</p>")
        .print()
    ,
    newTextInput("language")                // <----- 5. BUG: the answer to this question never shows up in the results file
        .print()
    ,
    newText("<p></p>")
        .print()
    ,
    newButton("Continue")
        .print()
        .wait()
)

// Asks for permission to use the microphone.
// We have no server to save recordings on, so this address is a placeholder.
// You will download your recordings yourself on the last page.
InitiateRecorder("https://no.server/upload.php",
    "This experiment records your voice. Please allow access to your microphone.")
    .label("recorder")

newTrial("instructions",
    newText(`<p>In each trial you will see two sentences, one after the other.</p>
             <p>Read each sentence ALOUD and try to remember it.</p>
             <p>Then you will see a single word in red.</p>
             <p>Say ALOUD the sentence that this word came from.</p>
             <p>Everything moves on by itself. The first five trials are practice.</p>
             <p>At the end you will see an upload error. That is expected:
                click the message to download your recordings.</p>`)
        .css("font-size", "20px")
        .print()
    ,
    newButton("Click when you are ready to begin")
        .print()
        .wait()
)

newTrial("start",
    newText("<p>That was the practice. The experiment starts now.</p>")
        .css("font-size", "20px")
        .print()
    ,
    newButton("Begin")
        .print()
        .wait()
)

// One trial is built for every row of the table.
// row.NAME gives you the value in the column called NAME.
Template(XXXXXXXXXX,                        // <----- 6. FILL IN: the name of the table file
    row =>
    newTrial(row.type,

        // 1. Target sentence: on the screen for 5 seconds
        newText("target", row.XXXXXXXXXX)   // <----- 7. FILL IN: which column?
            .css("font-size", "28px")
            .print("center at 50%", "middle at 50%")
        ,
        newTimer("target.time", 5000).wait()    // <----- 8. BUG: the experiment freezes on the first sentence
        ,
        getText("target").remove()
        ,
        newTimer("blank1", 500).start().wait()
        ,

        // 2. Prime sentence: on the screen for 5 seconds
        newText("prime", row.XXXXXXXXXX)    // <----- 9. FILL IN: which column?
            .css("font-size", "28px")
            .print("center at 50%", "middle at 50%")
        ,
        newTimer("prime.time", XXXXXXXXXX).start().wait()   // <----- 10. FILL IN: 5 seconds
        ,
        getText("target").remove()          // <----- 11. BUG: the prime sentence stays on the screen during recall
        ,
        newTimer("blank2", 500).start().wait()
        ,

        // 3. Cue: recall the Target or the Prime, with 6 seconds to say it. The recording file is named after the item and condition.
        newMediaRecorder("item" + row.item + "_" + row.condition, "audio")
            .XXXXXXXXXX()                   // <----- 12. FILL IN: start recording
        ,
        newText("cue", row.cue)
            .css("font-size", "28px")
            .color(XXXXXXXXXX)              // <----- 13. FILL IN: the cue is red
            .print("center at 50%", "middle at 50%")
        // <----- 14. BUG: something is missing between the element above and the element below
        newTimer("recall.time", 6000).start().wait()
        ,
        getMediaRecorder("item" + row.item + "_" + row.condition)
            .stop()
    )
    .log("item", row.item)
    .log("condition", XXXXXXXXXX)           // <----- 15. FILL IN: save the condition of this trial in the results file
    .log("target", row.target)
    .log("prime", row.prime)
    .log("cue", row.cue)
    .log("recall", row.recall)      // which sentence the cue asks for: target or prime
)

SendResults("send")

newTrial("end",
    newText("<p>This is the end of the experiment. Thank you!</p>")
        .print()
    ,
    newText(DownloadRecordingButton("Click here to download your recordings"))
        .print()
    ,
    newButton("waitforever").wait() // Not printed: wait on this page forever
)
