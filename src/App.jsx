import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SPEED_DURATION_SECONDS = 60;
const SPEED_TARGET_WORDS = 220;

const LESSON_SETS = {
  en: [
    {
      id: "fj-easy",
      level: "1A",
      section: "Find F and J",
      title: "F and J: Easy",
      focus: "F J",
      difficulty: "Easy",
      keys: ["f", "j"],
      goal: "Feel the home bumps with your index fingers.",
      tutorial: {
        lead: "Place your left index finger on F and your right index finger on J. Most keyboards have small bumps on those two keys.",
        left: "Left index: F",
        right: "Right index: J",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "After each key, let both index fingers settle back onto F and J.",
      },
      text: "f j f j ff jj fj jf f j fj jf ff jj f j fj jf",
    },
    {
      id: "fj-hard",
      level: "1B",
      section: "Find F and J",
      title: "F and J: Harder",
      focus: "F J",
      difficulty: "Harder",
      keys: ["f", "j"],
      goal: "Keep a steady rhythm while switching index fingers.",
      tutorial: {
        lead: "Keep your left index on F and right index on J. The harder drill asks you to switch patterns without looking down.",
        left: "Left index: F",
        right: "Right index: J",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "Say the finger in your head before pressing: left, right, left, right.",
      },
      text: "ff jj fj jf f j jj ff jf fj ff jj fj jf j f ff jj jf fj f j jj ff fj jf",
    },
    {
      id: "dk-easy",
      level: "2A",
      section: "Add D and K",
      title: "D and K: Easy",
      focus: "D K",
      difficulty: "Easy",
      keys: ["f", "j", "d", "k"],
      goal: "Keep index fingers returning to F and J.",
      tutorial: {
        lead: "Rest fingers on A S D F and J K L ;. Use your left middle finger for D and right middle finger for K.",
        left: "Left middle: D",
        right: "Right middle: K",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "Your index fingers still rest on F and J while the middle fingers move.",
      },
      text: "d k d k f j d k df jk d f k j dk fj fd jk",
    },
    {
      id: "dk-hard",
      level: "2B",
      section: "Add D and K",
      title: "D and K: Harder",
      focus: "D K",
      difficulty: "Harder",
      keys: ["f", "j", "d", "k"],
      goal: "Alternate index and middle fingers without moving your hands.",
      tutorial: {
        lead: "Left hand owns D and F. Right hand owns J and K. Keep your wrists quiet and let only the fingers move.",
        left: "Left: D with middle, F with index",
        right: "Right: J with index, K with middle",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "If you miss, slow down and rebuild the hand shape.",
      },
      text: "d k f j dk fj fd jk d f k j df kj dk fj kd jf fd jk d k f j dk fj fd jk",
    },
    {
      id: "sl-easy",
      level: "3A",
      section: "Add S and L",
      title: "S and L: Easy",
      focus: "S L",
      difficulty: "Easy",
      keys: ["f", "j", "d", "k", "s", "l"],
      goal: "Let each finger own one home-row key.",
      tutorial: {
        lead: "Add your ring fingers: left ring finger on S, right ring finger on L. Keep the rest of the home row lightly touching.",
        left: "Left ring: S",
        right: "Right ring: L",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "Ring fingers can feel slower at first. Accuracy matters more than speed.",
      },
      text: "s l s l d k f j sl dk fj ls s l d k sl dk fj",
    },
    {
      id: "sl-hard",
      level: "3B",
      section: "Add S and L",
      title: "S and L: Harder",
      focus: "S L",
      difficulty: "Harder",
      keys: ["f", "j", "d", "k", "s", "l"],
      goal: "Mix three fingers on each hand while keeping the home row shape.",
      tutorial: {
        lead: "Your left hand now uses S D F. Your right hand uses J K L. Keep each finger hovering over its own key.",
        left: "Left: S ring, D middle, F index",
        right: "Right: J index, K middle, L ring",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "Return to the home row after every small reach.",
      },
      text: "s l d k f j sl dk fj ls kd jf s l sl dk fj ls kd jf s d f j k l fj dk sl jf kd ls",
    },
    {
      id: "home-easy",
      level: "4A",
      section: "Full Home Row",
      title: "Home Row: Easy",
      focus: "A ;",
      difficulty: "Easy",
      keys: ["a", "s", "d", "f", "j", "k", "l", ";"],
      goal: "Build the full home-row shape slowly.",
      tutorial: {
        lead: "Add pinkies: left pinky on A, right pinky on ;. Now every home-row finger has a resting key.",
        left: "Left hand: A S D F",
        right: "Right hand: J K L ;",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "Keep your thumbs relaxed near the spacebar.",
      },
      text: "a s d f j k l ; as df jk l; a s d f j k l ; as df jk l;",
    },
    {
      id: "home-hard",
      level: "4B",
      section: "Full Home Row",
      title: "Home Row: Harder",
      focus: "A ;",
      difficulty: "Harder",
      keys: ["a", "s", "d", "f", "j", "k", "l", ";"],
      goal: "Use the whole home row in short chunks.",
      tutorial: {
        lead: "All eight fingers are now working. Keep the hand shape steady and press each key with its assigned finger.",
        left: "Left hand: A S D F",
        right: "Right hand: J K L ;",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "Do not slide one finger across the row. Let each finger do its own job.",
      },
      text: "a s d f j k l ; as df jk l; fad jak ask fall sad lad flask ask fall dad salad flask as df jk l;",
    },
    {
      id: "words-easy",
      level: "5A",
      section: "Small Words",
      title: "Small Words: Easy",
      focus: "home-row words",
      difficulty: "Easy",
      keys: ["a", "s", "d", "f", "j", "k", "l", ";"],
      goal: "Type tiny words without looking down.",
      tutorial: {
        lead: "Before typing words, reset all fingers on the home row. Read the word first, then type it slowly.",
        left: "Left hand: A S D F",
        right: "Right hand: J K L ;",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "Use your thumb for spaces, then return your fingers to the home row.",
      },
      text: "sad lad dad ask fall sad lad dad ask fall flask",
    },
    {
      id: "words-hard",
      level: "5B",
      section: "Small Words",
      title: "Small Words: Harder",
      focus: "home-row words",
      difficulty: "Harder",
      keys: ["a", "s", "d", "f", "j", "k", "l", ";"],
      goal: "Keep finger placement while typing longer home-row words.",
      tutorial: {
        lead: "Words can tempt you to look down. Keep your eyes on the screen and let the home-row pattern guide you.",
        left: "Left hand: A S D F",
        right: "Right hand: J K L ;",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "Pause between words if your fingers drift.",
      },
      text: "sad lad flask ask fall dad salad flask sad lad flask ask fall dad salad flask ask fall salad flask",
    },
    {
      id: "reach-easy",
      level: "6A",
      section: "First Reaches",
      title: "First Reaches: Easy",
      focus: "E I R U",
      difficulty: "Easy",
      keys: ["a", "s", "d", "f", "j", "k", "l", ";", "e", "i", "r", "u"],
      goal: "Reach up, then come back home.",
      tutorial: {
        lead: "For top-row reaches, move one finger up and bring it back home. Left middle reaches E, left index reaches R, right index reaches U, right middle reaches I.",
        left: "Left: D to E, F to R",
        right: "Right: J to U, K to I",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "The return home is part of the movement. Do not leave fingers floating.",
      },
      text: "e i r u e i r u red kid rude ride e i r u red kid",
    },
    {
      id: "reach-hard",
      level: "6B",
      section: "First Reaches",
      title: "First Reaches: Harder",
      focus: "E I R U",
      difficulty: "Harder",
      keys: ["a", "s", "d", "f", "j", "k", "l", ";", "e", "i", "r", "u"],
      goal: "Use top-row reaches inside short words.",
      tutorial: {
        lead: "Reach up only when needed, then return to A S D F and J K L ; before the next key.",
        left: "Left reaches: E and R",
        right: "Right reaches: U and I",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "Slow down when a word has two reaches in a row.",
      },
      text: "red kid rude ride sure fire like rise red kid rude ride sure fire like rise rude ride fire rise sure kid",
    },
    {
      id: "sentences-easy",
      level: "7A",
      section: "Easy Sentences",
      title: "Sentences: Easy",
      focus: "short sentences",
      difficulty: "Easy",
      keys: ["a", "s", "d", "f", "j", "k", "l", ";", "e", "i", "r", "u", "t", "h", "o", "n"],
      goal: "Keep a gentle rhythm through spaces.",
      tutorial: {
        lead: "For sentences, keep the same home-row setup. Use your thumb for spaces and pause briefly after punctuation.",
        left: "Left hand starts on A S D F",
        right: "Right hand starts on J K L ;",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "Your goal is calm control, not speed.",
      },
      text: "dad is here. i can type. i like a slow start.",
    },
    {
      id: "sentences-hard",
      level: "7B",
      section: "Easy Sentences",
      title: "Sentences: Harder",
      focus: "short sentences",
      difficulty: "Harder",
      keys: ["a", "s", "d", "f", "j", "k", "l", ";", "e", "i", "r", "u", "t", "h", "o", "n"],
      goal: "Hold your hand position through longer phrases.",
      tutorial: {
        lead: "Longer sentences test whether you can keep finger placement while thinking about words.",
        left: "Left hand starts on A S D F",
        right: "Right hand starts on J K L ;",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "When you feel lost, stop, find F and J again, then continue.",
      },
      text: "dad is here. i like a slow start. i can type. i can type a little more. i like a slow and kind start.",
    },
    {
      id: "capitals-intro",
      level: "8",
      section: "Capital Letters",
      title: "Capital Letters: Easy",
      focus: "Shift + letters",
      difficulty: "Easy",
      keys: ["shift", "a", "s", "d", "f", "j", "k", "l", "i", "m", "t"],
      goal: "Use Shift to make the first letter uppercase.",
      tutorial: {
        lead: "Capital letters use a letter key plus Shift. Hold Shift with one pinky, press the letter with the other hand, then let both hands return home.",
        left: "Left pinky: Shift. Left hand letters: A S D F T",
        right: "Right pinky: Shift. Right hand letters: J K L I M",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "Use the opposite hand for Shift when you can. Release Shift right after the capital letter.",
      },
      text: "I am Sam. I like Tim. Dad is here. I can type. I am still calm.",
    },
    {
      id: "speed-1-minute",
      type: "speed",
      level: "9",
      section: "Speed Challenge",
      title: "One Minute Speed",
      focus: "random sentences",
      difficulty: "Challenge",
      keys: ["a", "s", "d", "f", "j", "k", "l", ";", "e", "i", "r", "u", "t", "h", "o", "n", "q", "w", "y", "p", "g", "z", "x", "c", "v", "b", "m", ",", "."],
      goal: "Type as many complete words as you can in one minute.",
      tutorial: {
        lead: "Set every finger on the home row before you start. This round is about steady speed, so keep your eyes on the sentence and let your thumbs handle spaces.",
        left: "Left hand starts on A S D F",
        right: "Right hand starts on J K L ;",
        leftLabel: "Left hand",
        rightLabel: "Right hand",
        reminder: "The challenge lasts one minute. Calm accuracy usually beats rushing.",
      },
      sentenceBank: [
        "I can type with calm hands.",
        "My fingers return to the home row.",
        "A slow start can become a strong finish.",
        "I read the next word before I press it.",
        "Spaces are typed with my thumb.",
        "Steady practice makes typing feel easier.",
        "I keep my eyes on the screen.",
        "Short words help me build rhythm.",
        "I correct my pace before I lose control.",
        "Each letter has its own finger.",
        "My hands stay relaxed while I type.",
        "Good typing begins with good posture.",
        "I breathe and keep a gentle rhythm.",
        "One minute is enough for a clean score.",
        "I can improve one round at a time.",
        "The next sentence gives me a fresh start.",
        "I type the word that I see.",
        "Accuracy helps speed grow naturally.",
        "My wrists stay quiet and light.",
        "I finish the line without looking down.",
        "I let my fingers find the next key.",
        "A clean word is better than a rushed word.",
        "My shoulders stay loose while I practice.",
        "I follow the sentence from left to right.",
        "Each space gives my hands a reset.",
        "I keep typing even when the line changes.",
        "My goal is a smooth one minute round.",
        "I can slow down and still score well.",
        "The home row is my starting place.",
        "I notice mistakes and return to rhythm.",
        "Small improvements add up each day.",
        "I type softly and keep moving.",
        "The next word is the only word I need.",
        "I keep both hands balanced on the keys.",
        "My fingers move and return home.",
        "I trust the practice more than speed.",
        "One calm round can teach a lot.",
        "I build confidence with every sentence.",
        "I stay patient through the full minute.",
        "Good rhythm makes the keyboard quieter.",
      ],
    },
  ],
  hy: [
    {
      id: "fy-easy",
      level: "1Ա",
      section: "Գտիր Ֆ-ն և Յ-ն",
      title: "Ֆ և Յ․ հեշտ",
      focus: "Ֆ Յ",
      difficulty: "Հեշտ",
      keys: ["ֆ", "յ"],
      goal: "Զգա երկու ցուցամատների հիմնական դիրքը։",
      tutorial: {
        lead: "Միացրու հայերեն ստեղնաշարը։ Ձախ ցուցամատը դիր Ֆ-ի վրա, իսկ աջ ցուցամատը՝ Յ-ի վրա։",
        left: "Ձախ ցուցամատ՝ Ֆ",
        right: "Աջ ցուցամատ՝ Յ",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Յուրաքանչյուր հարվածից հետո ցուցամատները վերադարձրու Ֆ և Յ դիրքերին։",
      },
      text: "ֆ յ ֆ յ ֆֆ յյ ֆյ յֆ ֆ յ ֆյ յֆ ֆֆ յյ",
    },
    {
      id: "fy-hard",
      level: "1Բ",
      section: "Գտիր Ֆ-ն և Յ-ն",
      title: "Ֆ և Յ․ դժվար",
      focus: "Ֆ Յ",
      difficulty: "Դժվար",
      keys: ["ֆ", "յ"],
      goal: "Պահիր հավասար ռիթմ՝ փոխելով ձախ և աջ ցուցամատները։",
      tutorial: {
        lead: "Ձախ ցուցամատը պահիր Ֆ-ի վրա, աջ ցուցամատը՝ Յ-ի վրա։ Այս վարժությունն ավելի երկար է և ավելի խառը։",
        left: "Ձախ ցուցամատ՝ Ֆ",
        right: "Աջ ցուցամատ՝ Յ",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Մտքում ասա՝ ձախ, աջ, ձախ, աջ, հետո սեղմիր ստեղնը։",
      },
      text: "ֆֆ յյ ֆյ յֆ ֆ յ յյ ֆֆ յֆ ֆյ ֆֆ յյ ֆյ յֆ յ ֆ ֆֆ յյ յֆ ֆյ ֆ յ",
    },
    {
      id: "dk-easy",
      level: "2Ա",
      section: "Ավելացրու Դ-ն և Կ-ն",
      title: "Դ և Կ․ հեշտ",
      focus: "Դ Կ",
      difficulty: "Հեշտ",
      keys: ["ֆ", "յ", "դ", "կ"],
      goal: "Միջնամատները շարժիր, իսկ ցուցամատները պահիր իրենց տեղում։",
      tutorial: {
        lead: "Ձախ միջնամատը օգտագործիր Դ-ի համար, աջ միջնամատը՝ Կ-ի համար։ Ցուցամատները մնում են Ֆ-ի և Յ-ի վրա։",
        left: "Ձախ միջնամատ՝ Դ",
        right: "Աջ միջնամատ՝ Կ",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Մի շարժիր ամբողջ ձեռքը․ թող աշխատի միայն պետք եղած մատը։",
      },
      text: "դ կ դ կ ֆ յ դ կ դֆ յկ դ ֆ կ յ դկ ֆյ",
    },
    {
      id: "dk-hard",
      level: "2Բ",
      section: "Ավելացրու Դ-ն և Կ-ն",
      title: "Դ և Կ․ դժվար",
      focus: "Դ Կ",
      difficulty: "Դժվար",
      keys: ["ֆ", "յ", "դ", "կ"],
      goal: "Խառնիր ցուցամատներն ու միջնամատները՝ առանց ձեռքերը տեղաշարժելու։",
      tutorial: {
        lead: "Ձախ ձեռքը աշխատում է Դ և Ֆ ստեղներով, աջ ձեռքը՝ Յ և Կ ստեղներով։ Պահիր հանգիստ դիրք։",
        left: "Ձախ՝ Դ միջնամատով, Ֆ ցուցամատով",
        right: "Աջ՝ Յ ցուցամատով, Կ միջնամատով",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Եթե շփոթվեցիր, դանդաղեցրու և նորից գտիր հիմնական դիրքը։",
      },
      text: "դ կ ֆ յ դկ ֆյ դֆ յկ դ ֆ կ յ դֆ կյ դկ ֆյ կդ յֆ դֆ յկ դ կ ֆ յ",
    },
    {
      id: "sl-easy",
      level: "3Ա",
      section: "Ավելացրու Ս-ն և Լ-ն",
      title: "Ս և Լ․ հեշտ",
      focus: "Ս Լ",
      difficulty: "Հեշտ",
      keys: ["ֆ", "յ", "դ", "կ", "ս", "լ"],
      goal: "Յուրաքանչյուր մատ թող ունենա իր ստեղնը։",
      tutorial: {
        lead: "Ավելացրու մատնեմատները․ ձախ մատնեմատը՝ Ս-ի համար, աջ մատնեմատը՝ Լ-ի համար։",
        left: "Ձախ մատնեմատ՝ Ս",
        right: "Աջ մատնեմատ՝ Լ",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Մատնեմատները սկզբում կարող են դանդաղ լինել․ կարևորը ճիշտությունն է։",
      },
      text: "ս լ ս լ դ կ ֆ յ սլ դկ ֆյ լս ս լ դ կ",
    },
    {
      id: "sl-hard",
      level: "3Բ",
      section: "Ավելացրու Ս-ն և Լ-ն",
      title: "Ս և Լ․ դժվար",
      focus: "Ս Լ",
      difficulty: "Դժվար",
      keys: ["ֆ", "յ", "դ", "կ", "ս", "լ"],
      goal: "Խառնիր երեք մատ ձախ ձեռքում և երեք մատ աջ ձեռքում։",
      tutorial: {
        lead: "Ձախ ձեռքը օգտագործում է Ս Դ Ֆ, իսկ աջ ձեռքը՝ Յ Կ Լ։ Յուրաքանչյուր մատը պահիր իր ստեղնի մոտ։",
        left: "Ձախ՝ Ս, Դ, Ֆ",
        right: "Աջ՝ Յ, Կ, Լ",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Յուրաքանչյուր հարվածից հետո վերադարձիր հիմնական շարքին։",
      },
      text: "ս լ դ կ ֆ յ սլ դկ ֆյ լս կդ յֆ ս լ սլ դկ ֆյ լս կդ յֆ ս դ ֆ յ կ լ",
    },
    {
      id: "home-easy",
      level: "4Ա",
      section: "Հիմնական շարք",
      title: "Հիմնական շարք․ հեշտ",
      focus: "Ա ;",
      difficulty: "Հեշտ",
      keys: ["ա", "ս", "դ", "ֆ", "յ", "կ", "լ", ";"],
      goal: "Կառուցիր ամբողջ հիմնական շարքի դիրքը։",
      tutorial: {
        lead: "Ավելացրու ճկույթները․ ձախ ճկույթը՝ Ա-ի համար, աջ ճկույթը՝ վերջակետի/կետադրության դիրքի համար։",
        left: "Ձախ ձեռք՝ Ա Ս Դ Ֆ",
        right: "Աջ ձեռք՝ Յ Կ Լ ;",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Բութ մատները հանգիստ պահիր բացատի մոտ։",
      },
      text: "ա ս դ ֆ յ կ լ ; աս դֆ յկ լ; ա ս դ ֆ յ կ լ ;",
    },
    {
      id: "home-hard",
      level: "4Բ",
      section: "Հիմնական շարք",
      title: "Հիմնական շարք․ դժվար",
      focus: "Ա ;",
      difficulty: "Դժվար",
      keys: ["ա", "ս", "դ", "ֆ", "յ", "կ", "լ", ";"],
      goal: "Օգտագործիր ամբողջ հիմնական շարքը փոքր խմբերով։",
      tutorial: {
        lead: "Բոլոր ութ մատները հիմա աշխատում են։ Մի սահեցրու մեկ մատը ամբողջ շարքով․ ամեն մատ ունի իր գործը։",
        left: "Ձախ ձեռք՝ Ա Ս Դ Ֆ",
        right: "Աջ ձեռք՝ Յ Կ Լ ;",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Ձեռքի դիրքը պահիր հանգիստ և կայուն։",
      },
      text: "ա ս դ ֆ յ կ լ ; աս դֆ յկ լ; դաս լաս սալ դաս ֆալ յակ աս դֆ յկ լ;",
    },
    {
      id: "words-easy",
      level: "5Ա",
      section: "Փոքր բառեր",
      title: "Փոքր բառեր․ հեշտ",
      focus: "հիմնական բառեր",
      difficulty: "Հեշտ",
      keys: ["ա", "ս", "դ", "ֆ", "յ", "կ", "լ", ";"],
      goal: "Մուտքագրիր փոքր բառեր՝ առանց ներքև նայելու։",
      tutorial: {
        lead: "Բառը նախ կարդա, հետո դանդաղ մուտքագրիր։ Բացատի համար օգտագործիր բութ մատը։",
        left: "Ձախ ձեռք՝ Ա Ս Դ Ֆ",
        right: "Աջ ձեռք՝ Յ Կ Լ ;",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Բառերի միջև կանգ առ, եթե մատները կորցնում են դիրքը։",
      },
      text: "դաս սալ լավ դաս սալ լավ դաս սալ",
    },
    {
      id: "words-hard",
      level: "5Բ",
      section: "Փոքր բառեր",
      title: "Փոքր բառեր․ դժվար",
      focus: "հիմնական բառեր",
      difficulty: "Դժվար",
      keys: ["ա", "ս", "դ", "ֆ", "յ", "կ", "լ", ";"],
      goal: "Պահիր մատների դիրքը ավելի երկար բառերի ընթացքում։",
      tutorial: {
        lead: "Բառերը կարող են ստիպել նայել ստեղնաշարին։ Աչքերդ պահիր էկրանին և վստահիր մատների դիրքին։",
        left: "Ձախ ձեռք՝ Ա Ս Դ Ֆ",
        right: "Աջ ձեռք՝ Յ Կ Լ ;",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Եթե շեղվեցիր, նորից գտիր Ֆ-ն և Յ-ն։",
      },
      text: "դաս սալ լավ դասական սալիկ լավ դաս սալ լավ դասական սալիկ լավ դաս",
    },
    {
      id: "reach-easy",
      level: "6Ա",
      section: "Առաջին բարձր շարժումներ",
      title: "Բարձր շարժումներ․ հեշտ",
      focus: "Ե Ի Ռ Ր",
      difficulty: "Հեշտ",
      keys: ["ա", "ս", "դ", "ֆ", "յ", "կ", "լ", ";", "ե", "ի", "ռ", "ր"],
      goal: "Բարձրացրու մատը և վերադարձիր հիմնական դիրքին։",
      tutorial: {
        lead: "Բարձր շարքի համար մեկ մատը բարձրացրու, սեղմիր, հետո վերադարձրու հիմնական դիրքին։",
        left: "Ձախ շարժումներ՝ Ե և Ռ",
        right: "Աջ շարժումներ՝ Ի և Ր",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Վերադարձը շարժման մաս է․ մատները օդում մի թող։",
      },
      text: "ե ի ռ ր ե ի ռ ր սիր դաս արագ լիր ե ի ռ ր",
    },
    {
      id: "reach-hard",
      level: "6Բ",
      section: "Առաջին բարձր շարժումներ",
      title: "Բարձր շարժումներ․ դժվար",
      focus: "Ե Ի Ռ Ր",
      difficulty: "Դժվար",
      keys: ["ա", "ս", "դ", "ֆ", "յ", "կ", "լ", ";", "ե", "ի", "ռ", "ր"],
      goal: "Օգտագործիր բարձր շարժումները կարճ բառերի մեջ։",
      tutorial: {
        lead: "Բարձրացիր միայն երբ պետք է, հետո անմիջապես վերադարձիր հիմնական շարքին։",
        left: "Ձախ շարժումներ՝ Ե և Ռ",
        right: "Աջ շարժումներ՝ Ի և Ր",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Երկու բարձր շարժում անընդմեջ լինելու դեպքում դանդաղեցրու։",
      },
      text: "սիր արագ լիր դասեր իրար սիր արագ լիր դասեր իրար արագ լիր սիր դասեր",
    },
    {
      id: "sentences-easy",
      level: "7Ա",
      section: "Կարճ նախադասություններ",
      title: "Նախադասություններ․ հեշտ",
      focus: "կարճ նախադասություններ",
      difficulty: "Հեշտ",
      keys: ["ա", "ս", "դ", "ֆ", "յ", "կ", "լ", ";", "ե", "ի", "ռ", "ր", "տ", "հ", "ո", "ն"],
      goal: "Պահիր մեղմ ռիթմ բացատների ընթացքում։",
      tutorial: {
        lead: "Նախադասության ժամանակ նույն հիմնական դիրքն օգտագործիր։ Բացատի համար օգտագործիր բութ մատը։",
        left: "Ձախ ձեռքը սկսում է Ա Ս Դ Ֆ դիրքից",
        right: "Աջ ձեռքը սկսում է Յ Կ Լ ; դիրքից",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Նպատակը հանգիստ վերահսկումն է, ոչ թե արագությունը։",
      },
      text: "ես լավ եմ։ ես գրում եմ։",
    },
    {
      id: "sentences-hard",
      level: "7Բ",
      section: "Կարճ նախադասություններ",
      title: "Նախադասություններ․ դժվար",
      focus: "կարճ նախադասություններ",
      difficulty: "Դժվար",
      keys: ["ա", "ս", "դ", "ֆ", "յ", "կ", "լ", ";", "ե", "ի", "ռ", "ր", "տ", "հ", "ո", "ն"],
      goal: "Պահիր ձեռքի դիրքը ավելի երկար արտահայտությունների ընթացքում։",
      tutorial: {
        lead: "Երկար նախադասությունը ստուգում է՝ արդյոք կարող ես պահել մատների դիրքը, երբ մտածում ես բառերի մասին։",
        left: "Ձախ ձեռքը սկսում է Ա Ս Դ Ֆ դիրքից",
        right: "Աջ ձեռքը սկսում է Յ Կ Լ ; դիրքից",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Եթե կորցրեցիր դիրքը, կանգ առ, գտիր Ֆ-ն և Յ-ն, հետո շարունակիր։",
      },
      text: "ես լավ եմ։ ես գրում եմ դանդաղ։ ես կարող եմ գրել ավելի երկար։",
    },
    {
      id: "capitals-intro",
      level: "8",
      section: "Մեծատառեր",
      title: "Մեծատառեր․ հեշտ",
      focus: "Shift և տառեր",
      difficulty: "Հեշտ",
      keys: ["shift", "ե", "ս", "դ", "ֆ", "լ", "ա", "վ", "գ", "ր", "մ"],
      goal: "Օգտագործիր Shift-ը՝ առաջին տառը մեծատառ դարձնելու համար։",
      tutorial: {
        lead: "Մեծատառերի համար պահիր Shift-ը մեկ ճկույթով և սեղմիր տառը մյուս ձեռքով։ Հետո բաց թող Shift-ը և վերադարձիր հիմնական դիրքին։",
        left: "Ձախ ճկույթ՝ Shift։ Ձախ ձեռքի տառեր՝ Ե Ս Դ Ֆ",
        right: "Աջ ճկույթ՝ Shift։ Աջ ձեռքի տառեր՝ Լ Վ Գ Ր Մ",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Մեծատառից հետո անմիջապես բաց թող Shift-ը, որպեսզի հաջորդ տառը փոքրատառ լինի։",
      },
      text: "Ես լավ եմ։ Ես գրում եմ։ Դասը հեշտ է։ Ես կարող եմ գրել։",
    },
    {
      id: "speed-1-minute",
      type: "speed",
      level: "9",
      section: "Արագության փորձ",
      title: "Մեկ րոպեի արագություն",
      focus: "պատահական նախադասություններ",
      difficulty: "Փորձ",
      keys: ["ա", "ս", "դ", "ֆ", "յ", "կ", "լ", ";", "ե", "ի", "ռ", "ր", "տ", "հ", "ո", "ն", "ք", "ւ", "պ", "գ", "զ", "ց", "խ", "վ", "բ", "մ", ",", "."],
      goal: "Մեկ րոպեում մուտքագրիր որքան կարող ես շատ ամբողջական բառ։",
      tutorial: {
        lead: "Սկսելուց առաջ բոլոր մատները դիր հիմնական շարքի վրա։ Այս փորձի նպատակն է հանգիստ արագությունը, ոչ թե շտապելը։",
        left: "Ձախ ձեռքը սկսում է Ա Ս Դ Ֆ դիրքից",
        right: "Աջ ձեռքը սկսում է Յ Կ Լ ; դիրքից",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Փորձը տևում է մեկ րոպե։ Ճիշտ ու հանգիստ մուտքագրումը սովորաբար ավելի լավ արդյունք է տալիս։",
      },
      sentenceBank: [
        "Ես գրում եմ հանգիստ ձեռքերով։",
        "Իմ մատները վերադառնում են հիմնական շարքին։",
        "Դանդաղ սկիզբը կարող է դառնալ ուժեղ ավարտ։",
        "Ես կարդում եմ հաջորդ բառը և հետո սեղմում։",
        "Բացատը սեղմում եմ բութ մատով։",
        "Կայուն վարժությունը հեշտացնում է մուտքագրումը։",
        "Աչքերս պահում եմ էկրանին։",
        "Կարճ բառերը օգնում են պահել ռիթմը։",
        "Ես դանդաղեցնում եմ, երբ կորցնում եմ վերահսկումը։",
        "Յուրաքանչյուր տառ ունի իր մատը։",
        "Ձեռքերս մնում են հանգիստ։",
        "Ճիշտ դիրքը օգնում է արագ գրել։",
        "Ես շնչում եմ և պահում մեղմ ռիթմ։",
        "Մեկ րոպեն բավարար է մաքուր արդյունքի համար։",
        "Յուրաքանչյուր փորձից հետո կարող եմ լավանալ։",
        "Հաջորդ նախադասությունը նոր սկիզբ է տալիս։",
        "Ես գրում եմ այն բառը, որը տեսնում եմ։",
        "Ճշտությունը բնական կերպով մեծացնում է արագությունը։",
        "Դաստակներս մնում են թեթև ու հանգիստ։",
        "Ես ավարտում եմ տողը առանց ներքև նայելու։",
        "Թող մատներս գտնեն հաջորդ ստեղնը։",
        "Ճիշտ բառը ավելի լավ է, քան շտապ բառը։",
        "Ուսերս մնում են ազատ, երբ վարժվում եմ։",
        "Ես հետևում եմ նախադասությանը ձախից աջ։",
        "Յուրաքանչյուր բացատ օգնում է նորից դասավորվել։",
        "Ես շարունակում եմ գրել, երբ տողը փոխվում է։",
        "Իմ նպատակը հանգիստ մեկ րոպե է։",
        "Կարող եմ դանդաղել և լավ արդյունք ստանալ։",
        "Հիմնական շարքը իմ մեկնարկային տեղն է։",
        "Ես նկատում եմ սխալը և վերադառնում ռիթմին։",
        "Փոքր առաջընթացը օրեցօր մեծանում է։",
        "Ես մեղմ եմ սեղմում և շարունակում եմ շարժվել։",
        "Հաջորդ բառը միակ բառն է, որի մասին մտածում եմ։",
        "Երկու ձեռքերս պահում եմ հավասարակշռված։",
        "Մատներս շարժվում են և վերադառնում իրենց տեղը։",
        "Ես վստահում եմ վարժությանը, ոչ թե շտապելուն։",
        "Մեկ հանգիստ փորձը կարող է շատ բան սովորեցնել։",
        "Յուրաքանչյուր նախադասությամբ վստահություն եմ հավաքում։",
        "Ամբողջ րոպեի ընթացքում մնում եմ համբերատար։",
        "Լավ ռիթմը ստեղնաշարը դարձնում է ավելի հանգիստ։",
      ],
    },
  ],
};

const KEYBOARD_ROWS = {
  en: [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
    ["z", "x", "c", "v", "b", "n", "m", ",", "."],
  ],
  hy: [
    ["ք", "ո", "ե", "ռ", "տ", "ը", "ւ", "ի", "օ", "պ"],
    ["ա", "ս", "դ", "ֆ", "գ", "հ", "յ", "կ", "լ", ";"],
    ["զ", "ց", "խ", "վ", "բ", "ն", "մ", ",", "."],
  ],
};

const COPY = {
  en: {
    appName: "First Keys",
    appSubtitle: "Typing tutor for the first hour.",
    languageLabel: "Language",
    english: "English",
    armenian: "Հայերեն",
    lesson: "Lesson",
    start: "Start",
    ready: "Ready",
    pause: "Pause",
    previousLesson: "Previous lesson",
    nextLesson: "Next lesson",
    restartLesson: "Restart lesson",
    wpm: "WPM",
    accuracy: "Accuracy",
    streak: "Streak",
    score: "Score",
    words: "words",
    time: "Time",
    rounds: "Rounds",
    bestWpm: "Best WPM",
    bestAccuracy: "Best Acc.",
    bestStreak: "Best Streak",
    savedRounds: "practice rounds saved on this browser",
    howToPractice: "How to practice",
    steps: ["Press Start to get ready.", "The timer begins on your first key.", "Finish with accuracy before speed."],
    tutorialTitle: "Finger placement before you type",
    visualKeyboard: "Visual keyboard",
    keyboardMeta: "Home row stays centered",
    keyboardLayoutLabel: "Keyboard",
    keyboardLayoutRegular: "Regular Eastern Armenian",
    keyboardLayoutLegacy: "Eastern Armenian Legacy",
    keyboardLayoutNote: "",
    leftHand: "Left hand",
    rightHand: "Right hand",
    pressStart: "Press Start, then type the highlighted key.",
    pressFirstKey: "Timer is ready. Press the first key to begin.",
    speedStart: "Press Start for a one minute speed challenge.",
    speedReady: "Timer is ready. Press the first key to start the minute.",
    speedRunning: "Type as many complete words as you can.",
    speedComplete: "Time is up. Here is your one minute score.",
    nextKey: "Next key:",
    tryAgain: "Try",
    again: "again.",
    complete: "Round complete. Nice and steady.",
    lastKey: "Last key:",
    eyes: "Keep your eyes on the screen.",
    modalTitle: "Lesson complete",
    modalSubtitle: "Here is how that round went.",
    nextPrompt: "Ready for the next lesson?",
    nextButton: "Next lesson",
    stayButton: "Try again",
    doneButton: "Finish",
    close: "Close",
    seconds: "s",
    space: "space",
  },
  hy: {
    appName: "Առաջին ստեղներ",
    appSubtitle: "Ստեղնաշարի դասեր սկսնակների համար։",
    languageLabel: "Լեզու",
    english: "English",
    armenian: "Հայերեն",
    lesson: "Դաս",
    start: "Սկսել",
    ready: "Պատրաստ",
    pause: "Դադար",
    previousLesson: "Նախորդ դաս",
    nextLesson: "Հաջորդ դաս",
    restartLesson: "Նորից սկսել",
    wpm: "Բ/ր",
    accuracy: "Ճշտություն",
    streak: "Շարք",
    score: "Արդյունք",
    words: "բառ",
    time: "Ժամանակ",
    rounds: "Փորձեր",
    bestWpm: "Լավագույն Բ/ր",
    bestAccuracy: "Լավագույն ճշտ.",
    bestStreak: "Լավագույն շարք",
    savedRounds: "պահված փորձ այս դիտարկիչում",
    howToPractice: "Ինչպես վարժվել",
    steps: ["Սեղմիր «Սկսել»՝ պատրաստվելու համար։", "Ժամաչափը սկսվում է առաջին ստեղնից։", "Նախ աշխատիր ճշտության վրա, հետո՝ արագության։"],
    keyboardSetupTitle: "Հայերեն ստեղնաշարի կարգավորում",
    keyboardSetupIntro: "Windows-ում կարող ես ավելացնել երկու տարբերակն էլ և փոխել դրանց միջև առաջադրանքից առաջ։",
    keyboardSetupSteps: [
      "Բացիր Կարգավորումներ → Ժամանակ և լեզու → Լեզու և տարածաշրջան։",
      "Ավելացրու կամ ընտրիր Հայերեն լեզուն, հետո բացիր Ստեղնաշարեր բաժինը։",
      "Ավելացրու սովորական արևելահայերեն դասավորությունը։",
      "Ավելացրու նաև ավանդական արևելահայերեն դասավորությունը։",
      "Փոխելու համար օգտագործիր Windows + Space կամ լեզվի ընտրիչը էկրանի ներքևում։",
    ],
    keyboardLayoutsTitle: "Օգտագործիր երկու դասավորությունը",
    keyboardLayouts: ["Սովորական արևելահայերեն", "Ավանդական արևելահայերեն"],
    tutorialTitle: "Մատների դիրքը մուտքագրելուց առաջ",
    visualKeyboard: "Տեսողական ստեղնաշար",
    keyboardMeta: "Հիմնական շարքը կենտրոնում է",
    keyboardLayoutLabel: "Ստեղնաշար",
    keyboardLayoutRegular: "Սովորական արևելահայերեն",
    keyboardLayoutLegacy: "Ավանդական արևելահայերեն",
    keyboardLayoutNote: "Փոխիր նաև Windows-ի ստեղնաշարը, որպեսզի մուտքագրված նիշերը համընկնեն։",
    leftHand: "Ձախ ձեռք",
    rightHand: "Աջ ձեռք",
    pressStart: "Սեղմիր «Սկսել», հետո մուտքագրիր նշված նիշը։",
    pressFirstKey: "Ժամաչափը պատրաստ է։ Սեղմիր առաջին ստեղնը։",
    speedStart: "Սեղմիր «Սկսել»՝ մեկ րոպեի արագության փորձի համար։",
    speedReady: "Ժամաչափը պատրաստ է։ Սեղմիր առաջին ստեղնը՝ րոպեն սկսելու համար։",
    speedRunning: "Մուտքագրիր որքան կարող ես շատ ամբողջական բառ։",
    speedComplete: "Ժամանակը լրացավ։ Ահա քո մեկ րոպեի արդյունքը։",
    nextKey: "Հաջորդ նիշը՝",
    tryAgain: "Կրկին փորձիր",
    again: "։",
    complete: "Դասն ավարտվեց։ Շատ լավ։",
    lastKey: "Վերջին ստեղնը՝",
    eyes: "Աչքերդ պահիր էկրանին։",
    modalTitle: "Դասն ավարտվեց",
    modalSubtitle: "Ահա այս փորձի արդյունքը։",
    nextPrompt: "Պատրա՞ստ ես հաջորդ դասին։",
    nextButton: "Հաջորդ դասը",
    stayButton: "Կրկին փորձել",
    doneButton: "Ավարտել",
    close: "Փակել",
    seconds: "վ",
    space: "բացատ",
  },
};

const STORAGE_KEY = "first-keys-progress-v2";
const LANGUAGE_STORAGE_KEY = "first-keys-language";
const ARMENIAN_KEYBOARD_STORAGE_KEY = "first-keys-armenian-keyboard-layout-v2";
const EMPTY_PROGRESS = {};
const ARMENIAN_KEYBOARD_ROWS = {
  regular: [
    ["՝", "է", "թ", "փ", "ձ", "ջ", "ւ", "և", "ր", "չ", "ճ", "-", "ժ"],
    ["ք", "ո", "ե", "ռ", "տ", "ը", "ւ", "ի", "օ", "պ", "խ", "ծ"],
    ["ա", "ս", "դ", "ֆ", "գ", "հ", "յ", "կ", "լ", ";", "'", "շ"],
    ["զ", "ղ", "ց", "վ", "բ", "ն", "մ", ",", ".", "/"],
  ],
  legacy: [
    ["՝", "1", "ձ", "յ", "3", "՛", ",", "-", "և", ".", "«", "»", "օ", "ռ", "ժ"],
    ["խ", "ւ", "է", "ր", "տ", "ե", "ը", "ի", "ո", "պ", "չ", "ջ"],
    ["ա", "ս", "դ", "ֆ", "ք", "հ", "ճ", "կ", "լ", "թ", "փ"],
    ["զ", "ց", "գ", "վ", "բ", "ն", "մ", "շ", "ղ", "ծ"],
  ],
};
const ARMENIAN_LAYOUT_CONFIGS = {
  regular: {
    id: "regular",
    homeLeft: ["ա", "ս", "դ", "ֆ", "գ"],
    homeRight: ["հ", "յ", "կ", "լ", "շ"],
    leftIndex: "ֆ",
    rightIndex: "յ",
    leftMiddle: "դ",
    rightMiddle: "կ",
    leftRing: "ս",
    rightRing: "լ",
    lower: ["զ", "ղ", "ց", "վ", "բ", "ն", "մ"],
    upper: ["ք", "ո", "ե", "ռ", "տ", "ը", "ւ", "ի", "օ", "պ", "խ", "ծ"],
    top: ["է", "թ", "փ", "ձ", "ջ", "ւ", "և", "ր", "չ", "ճ", "ժ"],
    topFocus: "Է Թ Փ Ձ Ջ Ւ ԵՎ Ր Չ Ճ Ժ",
  },
  legacy: {
    id: "legacy",
    homeLeft: ["ա", "ս", "դ", "ֆ", "ք"],
    homeRight: ["հ", "ճ", "կ", "լ", "թ", "փ"],
    leftIndex: "ֆ",
    rightIndex: "ճ",
    leftMiddle: "դ",
    rightMiddle: "կ",
    leftRing: "ս",
    rightRing: "լ",
    lower: ["զ", "ց", "գ", "վ", "բ", "ն", "մ", "շ", "ղ", "ծ"],
    upper: ["խ", "ւ", "է", "ր", "տ", "ե", "ը", "ի", "ո", "պ", "չ", "ջ"],
    top: ["ձ", "յ", "և", "օ", "ռ", "ժ"],
    topFocus: "Ձ Յ ԵՎ Օ Ռ Ժ",
  },
};
const ARMENIAN_ALPHABET_KEYS = ["ա", "բ", "գ", "դ", "ե", "զ", "է", "ը", "թ", "ժ", "ի", "լ", "խ", "ծ", "կ", "հ", "ձ", "ղ", "ճ", "մ", "յ", "ն", "շ", "ո", "չ", "պ", "ջ", "ռ", "ս", "վ", "տ", "ր", "ց", "ւ", "փ", "ք", "օ", "ֆ", "և"];
const ARMENIAN_SPEED_SENTENCES = [
  "Ես գրում եմ հանգիստ ձեռքերով։",
  "Իմ մատները վերադառնում են հիմնական շարքին։",
  "Դանդաղ սկիզբը կարող է դառնալ ուժեղ ավարտ։",
  "Ես կարդում եմ հաջորդ բառը և հետո սեղմում։",
  "Բացատը սեղմում եմ բութ մատով։",
  "Կայուն վարժությունը հեշտացնում է մուտքագրումը։",
  "Աչքերս պահում եմ էկրանին։",
  "Կարճ բառերը օգնում են պահել ռիթմը։",
  "Ես դանդաղեցնում եմ, երբ կորցնում եմ վերահսկումը։",
  "Յուրաքանչյուր տառ ունի իր մատը։",
  "Ձեռքերս մնում են հանգիստ։",
  "Ճիշտ դիրքը օգնում է արագ գրել։",
  "Ես շնչում եմ և պահում մեղմ ռիթմ։",
  "Մեկ րոպեն բավարար է մաքուր արդյունքի համար։",
  "Յուրաքանչյուր փորձից հետո կարող եմ լավանալ։",
  "Հաջորդ նախադասությունը նոր սկիզբ է տալիս։",
  "Ես գրում եմ այն բառը, որը տեսնում եմ։",
  "Ճշտությունը բնական կերպով մեծացնում է արագությունը։",
  "Դաստակներս մնում են թեթև ու հանգիստ։",
  "Ես ավարտում եմ տողը առանց ներքև նայելու։",
  "Թող մատներս գտնեն հաջորդ ստեղնը։",
  "Ճիշտ բառը ավելի լավ է, քան շտապ բառը։",
  "Ուսերս մնում են ազատ, երբ վարժվում եմ։",
  "Ես հետևում եմ նախադասությանը ձախից աջ։",
  "Յուրաքանչյուր բացատ օգնում է նորից դասավորվել։",
  "Ես շարունակում եմ գրել, երբ տողը փոխվում է։",
  "Իմ նպատակը հանգիստ մեկ րոպե է։",
  "Կարող եմ դանդաղել և լավ արդյունք ստանալ։",
  "Հիմնական շարքը իմ մեկնարկային տեղն է։",
  "Ես նկատում եմ սխալը և վերադառնում ռիթմին։",
  "Փոքր առաջընթացը օրեցօր մեծանում է։",
  "Ես մեղմ եմ սեղմում և շարունակում եմ շարժվել։",
  "Հաջորդ բառը միակ բառն է, որի մասին մտածում եմ։",
  "Երկու ձեռքերս պահում եմ հավասարակշռված։",
  "Մատներս շարժվում են և վերադառնում իրենց տեղը։",
  "Ես վստահում եմ վարժությանը, ոչ թե շտապելուն։",
  "Մեկ հանգիստ փորձը կարող է շատ բան սովորեցնել։",
  "Յուրաքանչյուր նախադասությամբ վստահություն եմ հավաքում։",
  "Ամբողջ րոպեի ընթացքում մնում եմ համբերատար։",
  "Լավ ռիթմը ստեղնաշարը դարձնում է ավելի հանգիստ։",
];

function uniqueKeys(keys) {
  return Array.from(new Set(keys.filter(Boolean)));
}

function upperArmenianKey(key) {
  return key === "և" ? "ԵՎ" : key.toLocaleUpperCase("hy-AM");
}

function keyListLabel(keys) {
  return keys.map(upperArmenianKey).join(" ");
}

function repeatedDrill(keys, cycles = 2) {
  const output = [];
  for (let cycle = 0; cycle < cycles; cycle += 1) {
    output.push(...keys);
    output.push(...keys.slice().reverse());
  }
  return output.join(" ");
}

function pairText(left, right, hard = false) {
  const easyParts = [left, right, left, right, `${left}${left}`, `${right}${right}`, `${left}${right}`, `${right}${left}`, left, right, `${left}${right}`, `${right}${left}`, `${left}${left}`, `${right}${right}`];
  const hardParts = [...easyParts, `${right}${left}`, `${left}${right}`, right, left, `${left}${left}`, `${right}${right}`, `${left}${right}`, `${right}${left}`, left, right];
  return (hard ? hardParts : easyParts).join(" ");
}

function makeArmenianLessons(config) {
  const homeKeys = uniqueKeys([...config.homeLeft, ...config.homeRight]);
  const allLetterKeys = uniqueKeys([...homeKeys, ...config.lower, ...config.upper, ...config.top]);
  const allCoverageKeys = uniqueKeys([...allLetterKeys, ...ARMENIAN_ALPHABET_KEYS]);
  const layoutPrefix = config.id === "legacy" ? "legacy" : "regular";

  return [
    {
      id: `${layoutPrefix}-index-easy`,
      level: "1Ա",
      section: `Գտիր ${upperArmenianKey(config.leftIndex)}-ն և ${upperArmenianKey(config.rightIndex)}-ն`,
      title: `${upperArmenianKey(config.leftIndex)} և ${upperArmenianKey(config.rightIndex)}․ հեշտ`,
      focus: `${upperArmenianKey(config.leftIndex)} ${upperArmenianKey(config.rightIndex)}`,
      difficulty: "Հեշտ",
      keys: [config.leftIndex, config.rightIndex],
      goal: "Զգա երկու ցուցամատների հիմնական դիրքը։",
      tutorial: {
        lead: `Միացրու հայերեն ստեղնաշարը։ Ձախ ցուցամատը դիր ${upperArmenianKey(config.leftIndex)}-ի վրա, իսկ աջ ցուցամատը՝ ${upperArmenianKey(config.rightIndex)}-ի վրա։`,
        left: `Ձախ ցուցամատ՝ ${upperArmenianKey(config.leftIndex)}`,
        right: `Աջ ցուցամատ՝ ${upperArmenianKey(config.rightIndex)}`,
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: `Յուրաքանչյուր հարվածից հետո ցուցամատները վերադարձրու ${upperArmenianKey(config.leftIndex)} և ${upperArmenianKey(config.rightIndex)} դիրքերին։`,
      },
      text: pairText(config.leftIndex, config.rightIndex, false),
    },
    {
      id: `${layoutPrefix}-index-hard`,
      level: "1Բ",
      section: `Գտիր ${upperArmenianKey(config.leftIndex)}-ն և ${upperArmenianKey(config.rightIndex)}-ն`,
      title: `${upperArmenianKey(config.leftIndex)} և ${upperArmenianKey(config.rightIndex)}․ դժվար`,
      focus: `${upperArmenianKey(config.leftIndex)} ${upperArmenianKey(config.rightIndex)}`,
      difficulty: "Դժվար",
      keys: [config.leftIndex, config.rightIndex],
      goal: "Պահիր հավասար ռիթմ՝ փոխելով ձախ և աջ ցուցամատները։",
      tutorial: {
        lead: `Ձախ ցուցամատը պահիր ${upperArmenianKey(config.leftIndex)}-ի վրա, աջ ցուցամատը՝ ${upperArmenianKey(config.rightIndex)}-ի վրա։ Այս վարժությունն ավելի երկար է և ավելի խառը։`,
        left: `Ձախ ցուցամատ՝ ${upperArmenianKey(config.leftIndex)}`,
        right: `Աջ ցուցամատ՝ ${upperArmenianKey(config.rightIndex)}`,
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Մտքում ասա՝ ձախ, աջ, ձախ, աջ, հետո սեղմիր ստեղնը։",
      },
      text: pairText(config.leftIndex, config.rightIndex, true),
    },
    {
      id: `${layoutPrefix}-middle-easy`,
      level: "2Ա",
      section: `Ավելացրու ${upperArmenianKey(config.leftMiddle)}-ն և ${upperArmenianKey(config.rightMiddle)}-ն`,
      title: `${upperArmenianKey(config.leftMiddle)} և ${upperArmenianKey(config.rightMiddle)}․ հեշտ`,
      focus: `${upperArmenianKey(config.leftMiddle)} ${upperArmenianKey(config.rightMiddle)}`,
      difficulty: "Հեշտ",
      keys: [config.leftIndex, config.rightIndex, config.leftMiddle, config.rightMiddle],
      goal: "Միջնամատները շարժիր, իսկ ցուցամատները պահիր իրենց տեղում։",
      tutorial: {
        lead: `Ձախ միջնամատը օգտագործիր ${upperArmenianKey(config.leftMiddle)}-ի համար, աջ միջնամատը՝ ${upperArmenianKey(config.rightMiddle)}-ի համար։ Ցուցամատները մնում են ${upperArmenianKey(config.leftIndex)}-ի և ${upperArmenianKey(config.rightIndex)}-ի վրա։`,
        left: `Ձախ միջնամատ՝ ${upperArmenianKey(config.leftMiddle)}`,
        right: `Աջ միջնամատ՝ ${upperArmenianKey(config.rightMiddle)}`,
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Մի շարժիր ամբողջ ձեռքը․ թող աշխատի միայն պետք եղած մատը։",
      },
      text: `${pairText(config.leftMiddle, config.rightMiddle, false)} ${config.leftIndex} ${config.rightIndex} ${config.leftMiddle}${config.leftIndex} ${config.rightIndex}${config.rightMiddle}`,
    },
    {
      id: `${layoutPrefix}-middle-hard`,
      level: "2Բ",
      section: `Ավելացրու ${upperArmenianKey(config.leftMiddle)}-ն և ${upperArmenianKey(config.rightMiddle)}-ն`,
      title: `${upperArmenianKey(config.leftMiddle)} և ${upperArmenianKey(config.rightMiddle)}․ դժվար`,
      focus: `${upperArmenianKey(config.leftMiddle)} ${upperArmenianKey(config.rightMiddle)}`,
      difficulty: "Դժվար",
      keys: [config.leftIndex, config.rightIndex, config.leftMiddle, config.rightMiddle],
      goal: "Խառնիր ցուցամատներն ու միջնամատները՝ առանց ձեռքերը տեղաշարժելու։",
      tutorial: {
        lead: `Ձախ ձեռքը աշխատում է ${upperArmenianKey(config.leftMiddle)} և ${upperArmenianKey(config.leftIndex)} ստեղներով, աջ ձեռքը՝ ${upperArmenianKey(config.rightIndex)} և ${upperArmenianKey(config.rightMiddle)} ստեղներով։`,
        left: `Ձախ՝ ${upperArmenianKey(config.leftMiddle)} միջնամատով, ${upperArmenianKey(config.leftIndex)} ցուցամատով`,
        right: `Աջ՝ ${upperArmenianKey(config.rightIndex)} ցուցամատով, ${upperArmenianKey(config.rightMiddle)} միջնամատով`,
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Եթե շփոթվեցիր, դանդաղեցրու և նորից գտիր հիմնական դիրքը։",
      },
      text: repeatedDrill([config.leftMiddle, config.rightMiddle, config.leftIndex, config.rightIndex], 4),
    },
    {
      id: `${layoutPrefix}-ring-easy`,
      level: "3Ա",
      section: `Ավելացրու ${upperArmenianKey(config.leftRing)}-ն և ${upperArmenianKey(config.rightRing)}-ն`,
      title: `${upperArmenianKey(config.leftRing)} և ${upperArmenianKey(config.rightRing)}․ հեշտ`,
      focus: `${upperArmenianKey(config.leftRing)} ${upperArmenianKey(config.rightRing)}`,
      difficulty: "Հեշտ",
      keys: [config.leftIndex, config.rightIndex, config.leftMiddle, config.rightMiddle, config.leftRing, config.rightRing],
      goal: "Յուրաքանչյուր մատ թող ունենա իր ստեղնը։",
      tutorial: {
        lead: `Ավելացրու մատնեմատները․ ձախ մատնեմատը՝ ${upperArmenianKey(config.leftRing)}-ի համար, աջ մատնեմատը՝ ${upperArmenianKey(config.rightRing)}-ի համար։`,
        left: `Ձախ մատնեմատ՝ ${upperArmenianKey(config.leftRing)}`,
        right: `Աջ մատնեմատ՝ ${upperArmenianKey(config.rightRing)}`,
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Մատնեմատները սկզբում կարող են դանդաղ լինել․ կարևորը ճիշտությունն է։",
      },
      text: repeatedDrill([config.leftRing, config.rightRing, config.leftMiddle, config.rightMiddle, config.leftIndex, config.rightIndex], 2),
    },
    {
      id: `${layoutPrefix}-ring-hard`,
      level: "3Բ",
      section: `Ավելացրու ${upperArmenianKey(config.leftRing)}-ն և ${upperArmenianKey(config.rightRing)}-ն`,
      title: `${upperArmenianKey(config.leftRing)} և ${upperArmenianKey(config.rightRing)}․ դժվար`,
      focus: `${upperArmenianKey(config.leftRing)} ${upperArmenianKey(config.rightRing)}`,
      difficulty: "Դժվար",
      keys: [config.leftIndex, config.rightIndex, config.leftMiddle, config.rightMiddle, config.leftRing, config.rightRing],
      goal: "Խառնիր երեք մատ ձախ ձեռքում և երեք մատ աջ ձեռքում։",
      tutorial: {
        lead: `Ձախ ձեռքը օգտագործում է ${upperArmenianKey(config.leftRing)} ${upperArmenianKey(config.leftMiddle)} ${upperArmenianKey(config.leftIndex)}, իսկ աջ ձեռքը՝ ${upperArmenianKey(config.rightIndex)} ${upperArmenianKey(config.rightMiddle)} ${upperArmenianKey(config.rightRing)}։`,
        left: `Ձախ՝ ${upperArmenianKey(config.leftRing)}, ${upperArmenianKey(config.leftMiddle)}, ${upperArmenianKey(config.leftIndex)}`,
        right: `Աջ՝ ${upperArmenianKey(config.rightIndex)}, ${upperArmenianKey(config.rightMiddle)}, ${upperArmenianKey(config.rightRing)}`,
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Յուրաքանչյուր հարվածից հետո վերադարձիր հիմնական շարքին։",
      },
      text: repeatedDrill([config.leftRing, config.rightRing, config.leftMiddle, config.rightMiddle, config.leftIndex, config.rightIndex], 4),
    },
    {
      id: `${layoutPrefix}-home-easy`,
      level: "4Ա",
      section: "Հիմնական շարք",
      title: "Հիմնական շարք․ հեշտ",
      focus: keyListLabel(homeKeys),
      difficulty: "Հեշտ",
      keys: homeKeys,
      goal: "Կառուցիր ամբողջ հիմնական շարքի դիրքը։",
      tutorial: {
        lead: "Հիմա ամբողջ հիմնական շարքն է աշխատում։ Ամեն մատ թող մնա իր ստեղնի մոտ։",
        left: `Ձախ ձեռք՝ ${keyListLabel(config.homeLeft)}`,
        right: `Աջ ձեռք՝ ${keyListLabel(config.homeRight)}`,
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Բութ մատները հանգիստ պահիր բացատի մոտ։",
      },
      text: repeatedDrill(homeKeys, 2),
    },
    {
      id: `${layoutPrefix}-home-hard`,
      level: "4Բ",
      section: "Հիմնական շարք",
      title: "Հիմնական շարք․ դժվար",
      focus: keyListLabel(homeKeys),
      difficulty: "Դժվար",
      keys: homeKeys,
      goal: "Օգտագործիր ամբողջ հիմնական շարքը փոքր խմբերով։",
      tutorial: {
        lead: "Բոլոր հիմնական մատները հիմա աշխատում են։ Մի սահեցրու մեկ մատը ամբողջ շարքով․ ամեն մատ ունի իր գործը։",
        left: `Ձախ ձեռք՝ ${keyListLabel(config.homeLeft)}`,
        right: `Աջ ձեռք՝ ${keyListLabel(config.homeRight)}`,
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Ձեռքի դիրքը պահիր հանգիստ և կայուն։",
      },
      text: repeatedDrill(homeKeys, 4),
    },
    {
      id: `${layoutPrefix}-lower-easy`,
      level: "5Ա",
      section: "Ներքևի շարք",
      title: "Ներքևի շարք․ հեշտ",
      focus: keyListLabel(config.lower),
      difficulty: "Հեշտ",
      keys: uniqueKeys([...homeKeys, ...config.lower]),
      goal: "Սովորիր ներքևի շարքի հայկական տառերը։",
      tutorial: {
        lead: "Ներքևի շարքի համար մատը իջեցրու, սեղմիր, հետո վերադարձրու հիմնական շարքին։",
        left: `Ձախ կողմ՝ ${keyListLabel(config.lower.slice(0, Math.ceil(config.lower.length / 2)))}`,
        right: `Աջ կողմ՝ ${keyListLabel(config.lower.slice(Math.ceil(config.lower.length / 2)))}`,
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Իջնելուց հետո անպայման վերադարձիր հիմնական դիրքին։",
      },
      text: repeatedDrill(config.lower, 2),
    },
    {
      id: `${layoutPrefix}-lower-hard`,
      level: "5Բ",
      section: "Ներքևի շարք",
      title: "Ներքևի շարք․ դժվար",
      focus: keyListLabel(config.lower),
      difficulty: "Դժվար",
      keys: uniqueKeys([...homeKeys, ...config.lower]),
      goal: "Խառնիր ներքևի շարքը հիմնական շարքի հետ։",
      tutorial: {
        lead: "Ներքևի շարքի տառերը խառնիր հիմնական շարքի հետ՝ առանց ձեռքի դիրքը կորցնելու։",
        left: `Ձախ կողմ՝ ${keyListLabel(config.lower.slice(0, Math.ceil(config.lower.length / 2)))}`,
        right: `Աջ կողմ՝ ${keyListLabel(config.lower.slice(Math.ceil(config.lower.length / 2)))}`,
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Եթե շեղվեցիր, նորից գտիր ցուցամատների հիմնական ստեղները։",
      },
      text: repeatedDrill(uniqueKeys([...config.lower, ...homeKeys]), 3),
    },
    {
      id: `${layoutPrefix}-upper-easy`,
      level: "6Ա",
      section: "Վերին տառային շարք",
      title: "Վերին շարք․ հեշտ",
      focus: keyListLabel(config.upper),
      difficulty: "Հեշտ",
      keys: uniqueKeys([...homeKeys, ...config.upper]),
      goal: "Բարձրացրու մատը և վերադարձիր հիմնական դիրքին։",
      tutorial: {
        lead: "Վերին շարքի համար մեկ մատը բարձրացրու, սեղմիր, հետո վերադարձրու հիմնական դիրքին։",
        left: `Ձախ կողմ՝ ${keyListLabel(config.upper.slice(0, Math.ceil(config.upper.length / 2)))}`,
        right: `Աջ կողմ՝ ${keyListLabel(config.upper.slice(Math.ceil(config.upper.length / 2)))}`,
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Վերադարձը շարժման մաս է․ մատները օդում մի թող։",
      },
      text: repeatedDrill(config.upper, 2),
    },
    {
      id: `${layoutPrefix}-upper-hard`,
      level: "6Բ",
      section: "Վերին տառային շարք",
      title: "Վերին շարք․ դժվար",
      focus: keyListLabel(config.upper),
      difficulty: "Դժվար",
      keys: uniqueKeys([...homeKeys, ...config.upper]),
      goal: "Խառնիր վերին շարքը հիմնական շարքի հետ։",
      tutorial: {
        lead: "Բարձրացիր միայն երբ պետք է, հետո անմիջապես վերադարձիր հիմնական շարքին։",
        left: `Ձախ կողմ՝ ${keyListLabel(config.upper.slice(0, Math.ceil(config.upper.length / 2)))}`,
        right: `Աջ կողմ՝ ${keyListLabel(config.upper.slice(Math.ceil(config.upper.length / 2)))}`,
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Երկու բարձր շարժում անընդմեջ լինելու դեպքում դանդաղեցրու։",
      },
      text: repeatedDrill(uniqueKeys([...config.upper, ...homeKeys]), 3),
    },
    {
      id: `${layoutPrefix}-top-easy`,
      level: "7Ա",
      section: "Մնացած հայկական տառերը",
      title: "Մնացած տառեր․ հեշտ",
      focus: config.topFocus,
      difficulty: "Հեշտ",
      keys: uniqueKeys([...homeKeys, ...config.top]),
      goal: "Ավելացրու մնացած հայկական տառերը։",
      tutorial: {
        lead: "Այս դասը լրացնում է հայկական տառերի հավաքածուն։ Շարժումը դանդաղ արա և վերադարձիր հիմնական շարքին։",
        left: `Տառեր՝ ${keyListLabel(config.top)}`,
        right: "Երկու ձեռքն էլ կարող է աշխատել՝ ըստ ստեղնի դիրքի",
        leftLabel: "Լրացուցիչ տառեր",
        rightLabel: "Ձեռքի դիրք",
        reminder: "Այս դասից հետո հայկական բոլոր տառերը արդեն հանդիպել են վարժություններում։",
      },
      text: repeatedDrill(config.top, 3),
    },
    {
      id: `${layoutPrefix}-top-hard`,
      level: "7Բ",
      section: "Մնացած հայկական տառերը",
      title: "Մնացած տառեր․ դժվար",
      focus: config.topFocus,
      difficulty: "Դժվար",
      keys: uniqueKeys([...homeKeys, ...config.upper, ...config.lower, ...config.top]),
      goal: "Խառնիր բոլոր հայկական տառերը փոքր խմբերով։",
      tutorial: {
        lead: "Հիմա խառնում ենք բոլոր սովորած տառերը։ Աչքերդ պահիր էկրանին և աշխատիր հանգիստ ռիթմով։",
        left: `Տառեր՝ ${keyListLabel(config.top)}`,
        right: "Բոլոր շարքերից կտեսնես տառեր",
        leftLabel: "Լրացուցիչ տառեր",
        rightLabel: "Կրկնություն",
        reminder: "Եթե մի տառ դժվար է, ավարտից հետո կրկնիր այս դասը։",
      },
      text: repeatedDrill(allLetterKeys, 2),
    },
    {
      id: `${layoutPrefix}-alphabet-easy`,
      level: "8Ա",
      section: "Ամբողջ այբուբեն",
      title: "Այբուբեն․ հեշտ",
      focus: "բոլոր տառերը",
      difficulty: "Հեշտ",
      keys: allCoverageKeys,
      goal: "Վերանայիր հայկական բոլոր տառերը։",
      tutorial: {
        lead: "Սա ամբողջական ստուգում է․ հայկական ամեն տառ պետք է առնվազն մեկ անգամ հայտնվի։",
        left: "Տառերը գալիս են փոքր խմբերով",
        right: "Դանդաղությունը թույլատրելի է",
        leftLabel: "Այբուբեն",
        rightLabel: "Կրկնություն",
        reminder: "Ճշտությունը հիմա ավելի կարևոր է, քան արագությունը։",
      },
      text: repeatedDrill(ARMENIAN_ALPHABET_KEYS, 1),
    },
    {
      id: `${layoutPrefix}-alphabet-hard`,
      level: "8Բ",
      section: "Ամբողջ այբուբեն",
      title: "Այբուբեն․ դժվար",
      focus: "բոլոր տառերը",
      difficulty: "Դժվար",
      keys: allCoverageKeys,
      goal: "Կրկնիր ամբողջ այբուբենը ավելի երկար շարքով։",
      tutorial: {
        lead: "Այս երկար դասը ստուգում է՝ արդյոք ոչ մի հայկական տառ չի մնացել բաց թողնված։",
        left: "Բոլոր տառերը կրկնվում են",
        right: "Պահիր հիմնական դիրքը",
        leftLabel: "Այբուբեն",
        rightLabel: "Կրկնություն",
        reminder: "Կանգ առ միայն այնքան, որքան պետք է ճիշտ տառը գտնելու համար։",
      },
      text: repeatedDrill(ARMENIAN_ALPHABET_KEYS, 2),
    },
    {
      id: `${layoutPrefix}-capitals-easy`,
      level: "9Ա",
      section: "Մեծատառեր",
      title: "Մեծատառեր․ հեշտ",
      focus: "Shift և տառեր",
      difficulty: "Հեշտ",
      keys: uniqueKeys(["shift", ...homeKeys, "ե", "ս", "լ", "վ", "գ", "ր", "մ"]),
      goal: "Օգտագործիր Shift-ը՝ առաջին տառը մեծատառ դարձնելու համար։",
      tutorial: {
        lead: "Մեծատառերի համար պահիր Shift-ը մեկ ճկույթով և սեղմիր տառը մյուս ձեռքով։ Հետո բաց թող Shift-ը և վերադարձիր հիմնական դիրքին։",
        left: "Ձախ ճկույթ՝ Shift",
        right: "Աջ ճկույթ՝ Shift",
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Մեծատառից հետո անմիջապես բաց թող Shift-ը, որպեսզի հաջորդ տառը փոքրատառ լինի։",
      },
      text: "Ես լավ եմ։ Ես գրում եմ։ Դասը հեշտ է։ Ես կարող եմ գրել։",
    },
    {
      id: `${layoutPrefix}-capitals-hard`,
      level: "9Բ",
      section: "Մեծատառեր",
      title: "Մեծատառեր․ դժվար",
      focus: "Shift և տառեր",
      difficulty: "Դժվար",
      keys: uniqueKeys(["shift", ...allCoverageKeys]),
      goal: "Մեծատառերով սկսիր ավելի երկար նախադասություններ։",
      tutorial: {
        lead: "Օգտագործիր հակառակ ձեռքի Shift-ը, երբ կարող ես։ Այս դասը երկար է, բայց դեռ աշխատիր հանգիստ։",
        left: "Ձախ կամ աջ ճկույթ՝ Shift",
        right: "Տառը սեղմում է հակառակ ձեռքը, երբ հնարավոր է",
        leftLabel: "Shift",
        rightLabel: "Տառեր",
        reminder: "Եթե Shift-ը պահած մնաց, կանգ առ և նորից սկսիր ճիշտ դիրքից։",
      },
      text: "Ես սովորում եմ հայերեն մուտքագրել։ Ճիշտ դիրքը օգնում է արագ գրել։ Յուրաքանչյուր տառ ունի իր մատը։",
    },
    {
      id: `${layoutPrefix}-speed-1-minute`,
      type: "speed",
      level: "10",
      section: "Արագության փորձ",
      title: "Մեկ րոպեի արագություն",
      focus: "պատահական նախադասություններ",
      difficulty: "Փորձ",
      keys: uniqueKeys([...allCoverageKeys, ",", ".", "։"]),
      goal: "Մեկ րոպեում մուտքագրիր որքան կարող ես շատ ամբողջական բառ։",
      tutorial: {
        lead: "Սկսելուց առաջ բոլոր մատները դիր հիմնական շարքի վրա։ Այս փորձի նպատակն է հանգիստ արագությունը, ոչ թե շտապելը։",
        left: `Ձախ ձեռքը սկսում է ${keyListLabel(config.homeLeft)} դիրքից`,
        right: `Աջ ձեռքը սկսում է ${keyListLabel(config.homeRight)} դիրքից`,
        leftLabel: "Ձախ ձեռք",
        rightLabel: "Աջ ձեռք",
        reminder: "Փորձը տևում է մեկ րոպե։ Ճիշտ ու հանգիստ մուտքագրումը սովորաբար ավելի լավ արդյունք է տալիս։",
      },
      sentenceBank: ARMENIAN_SPEED_SENTENCES,
    },
  ];
}

const ARMENIAN_LESSON_SETS_BY_LAYOUT = {
  regular: makeArmenianLessons(ARMENIAN_LAYOUT_CONFIGS.regular),
  legacy: makeArmenianLessons(ARMENIAN_LAYOUT_CONFIGS.legacy),
};
const ICON_PATHS = {
  activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  arrowRight: <path d="M5 12h14M13 5l7 7-7 7" />,
  check: <path d="M20 6 9 17l-5-5" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  keyboard: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h.01M11 9h.01M15 9h.01M19 9h.01M7 13h.01M11 13h.01M15 13h.01M19 13h.01M8 17h8" />
    </>
  ),
  pause: <path d="M8 5v14M16 5v14" />,
  play: <path d="m8 5 11 7-11 7z" />,
  restart: (
    <>
      <path d="M3 12a9 9 0 0 1 15.4-6.3L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.4 6.3L3 16" />
      <path d="M3 21v-5h5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M5 5H3v3a4 4 0 0 0 4 4M19 5h2v3a4 4 0 0 1-4 4" />
    </>
  ),
};

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}

function loadLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === "hy" ? "hy" : "en";
  } catch {
    return "en";
  }
}

function loadArmenianKeyboardLayout() {
  try {
    const stored = localStorage.getItem(ARMENIAN_KEYBOARD_STORAGE_KEY);
    return stored === "regular" ? "regular" : "legacy";
  } catch {
    return "legacy";
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function progressKey(language, lessonId) {
  return `${language}:${lessonId}`;
}

function getLessonsForLanguage(language, armenianKeyboardLayout) {
  if (language !== "hy") return LESSON_SETS.en;
  return ARMENIAN_LESSON_SETS_BY_LAYOUT[armenianKeyboardLayout] || ARMENIAN_LESSON_SETS_BY_LAYOUT.legacy;
}

function formatKey(key, copy) {
  if (key === " ") return copy.space;
  if (!key) return "";
  return key.toLocaleUpperCase();
}

function normalizeKey(key) {
  if (!key) return "";
  return key.toLocaleLowerCase();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function shuffledItems(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function buildSpeedPrompt(sentenceBank, previousLead) {
  const sentences = Array.isArray(sentenceBank) ? sentenceBank : [];
  const parts = [];

  while (countWords(parts.join(" ")) < SPEED_TARGET_WORDS && sentences.length > 0) {
    const batch = shuffledItems(sentences);
    if (previousLead && batch.length > 1 && batch[0] === previousLead) {
      [batch[0], batch[1]] = [batch[1], batch[0]];
    }
    parts.push(...batch);
    previousLead = "";
  }

  return {
    lead: parts[0] || "",
    text: parts.join(" "),
  };
}

function getLessonText(lesson, speedText) {
  return lesson.type === "speed" ? speedText : lesson.text;
}

function countScoredWords(typedText, isCompleteText) {
  const trimmed = typedText.trim();
  if (!trimmed) return 0;

  const words = trimmed.split(/\s+/).filter(Boolean);
  const endsAtWordBoundary = /[\s.,!?;:։]$/.test(typedText);
  return !isCompleteText && !endsAtWordBoundary ? Math.max(words.length - 1, 0) : words.length;
}

function getStats({ correctCount, errors, elapsedSeconds, position, targetLength }) {
  const attempts = correctCount + errors;
  const accuracy = attempts === 0 ? 100 : Math.round((correctCount / attempts) * 100);
  const minutes = Math.max(elapsedSeconds / 60, 1 / 60);
  const wpm = elapsedSeconds === 0 ? 0 : Math.round(correctCount / 5 / minutes);
  const completion = targetLength <= 0 ? 0 : Math.round((position / targetLength) * 100);
  return { accuracy, wpm, completion };
}

function Icon({ name }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {ICON_PATHS[name]}
    </svg>
  );
}

function Metric({ iconName, label, value }) {
  return (
    <div className="metric">
      <span className="metric-icon">
        <Icon name={iconName} />
      </span>
      <span>
        <strong>{value}</strong>
        <small>{label}</small>
      </span>
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div className="summary-item">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function LanguageSwitcher({ language, copy, onLanguageChange }) {
  return (
    <div className="language-switcher" aria-label={copy.languageLabel}>
      <span>{copy.languageLabel}</span>
      <div className="language-options">
        <button className={language === "en" ? "selected" : ""} type="button" onClick={() => onLanguageChange("en")}>
          {copy.english}
        </button>
        <button className={language === "hy" ? "selected" : ""} type="button" onClick={() => onLanguageChange("hy")}>
          {copy.armenian}
        </button>
      </div>
    </div>
  );
}

function ArmenianKeyboardSwitcher({ keyboardLayout, copy, onKeyboardLayoutChange }) {
  return (
    <div className="keyboard-layout-switcher" aria-label={copy.keyboardLayoutLabel}>
      <span>{copy.keyboardLayoutLabel}</span>
      <div className="keyboard-layout-options">
        <button className={keyboardLayout === "regular" ? "selected" : ""} type="button" onClick={() => onKeyboardLayoutChange("regular")}>
          {copy.keyboardLayoutRegular}
        </button>
        <button className={keyboardLayout === "legacy" ? "selected" : ""} type="button" onClick={() => onKeyboardLayoutChange("legacy")}>
          {copy.keyboardLayoutLegacy}
        </button>
      </div>
    </div>
  );
}

function LessonRail({ language, lessons, lessonIndex, progress, copy, onChooseLesson }) {
  return (
    <aside className="lesson-rail" aria-label={copy.lesson}>
      <div className="brand-block">
        <div className="brand-mark">
          <Icon name="keyboard" />
        </div>
        <div>
          <h1>{copy.appName}</h1>
          <p>{copy.appSubtitle}</p>
        </div>
      </div>
      <nav className="lesson-list">
        {lessons.map((lesson, index) => {
          const completed = (progress[progressKey(language, lesson.id)]?.rounds || 0) > 0;
          return (
            <button
              className={`lesson-button ${index === lessonIndex ? "selected" : ""}`}
              key={lesson.id}
              onClick={() => onChooseLesson(index)}
              type="button"
            >
              <span className="lesson-number">{lesson.level}</span>
              <span className="lesson-copy">
                <strong>{lesson.title}</strong>
                <span>{lesson.focus}</span>
              </span>
              <span className="lesson-check">{completed ? <Icon name="check" /> : null}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function PromptPanel({ lesson, promptText, position, completion, lastKey, lastResult, statusMessage, copy }) {
  const currentCharRef = useRef(null);
  const promptWordGroups = useMemo(() => {
    let charIndex = 0;
    const groups = promptText.match(/\S+\s*|\s+/g) || [];

    return groups.map((group, groupIndex) => {
      const chars = group.split("").map((char) => {
        const index = charIndex;
        charIndex += 1;
        return {
          char,
          index,
          status: index < position ? "done" : index === position ? "current" : "waiting",
        };
      });

      return { id: `${groupIndex}-${chars[0]?.index || 0}`, chars };
    });
  }, [promptText, position]);

  useEffect(() => {
    currentCharRef.current?.scrollIntoView({ block: "center", inline: "nearest" });
  }, [position]);

  return (
    <div className="prompt-panel">
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${completion}%` }} />
      </div>
      <div className="typing-line" aria-label={lesson.goal}>
        {promptWordGroups.map((group) => (
          <span className="prompt-word" key={group.id}>
            {group.chars.map((item) => (
              <span className={`prompt-char ${item.status} ${item.char === " " ? "space" : ""}`} key={`${item.index}-${item.char}`} ref={item.status === "current" ? currentCharRef : undefined}>
                {item.char === " " ? "\u00a0" : item.char}
              </span>
            ))}
          </span>
        ))}
      </div>
      <div className={`feedback ${lastResult}`}>
        <span>{statusMessage}</span>
        <span>{lastKey ? `${copy.lastKey} ${formatKey(lastKey, copy)}` : copy.eyes}</span>
      </div>
    </div>
  );
}

function VisualKeyboard({ keyboardRows, expectedKey, lessonKeys, lastKey, lastResult, copy, keyboardMeta }) {
  const normalizedLessonKeys = lessonKeys.map(normalizeKey);
  return (
    <div className="keyboard-panel" aria-label={copy.visualKeyboard}>
      <div className="keyboard-meta">
        <span>{copy.visualKeyboard}</span>
        <span>{keyboardMeta}</span>
      </div>
      <div className="keyboard-rows">
        {keyboardRows.map((row, rowIndex) => (
          <div className={`keyboard-row row-${rowIndex}`} key={row.join("")} style={{ "--key-count": row.length }}>
            {row.map((key) => {
              const normalizedKey = normalizeKey(key);
              const normalizedExpectedKey = normalizeKey(expectedKey);
              const normalizedLastKey = normalizeKey(lastKey);
              const keyClasses = [
                "keycap",
                normalizedLessonKeys.includes(normalizedKey) ? "lesson-key" : "",
                normalizedKey === normalizedExpectedKey ? "expected" : "",
                normalizedKey === normalizedLastKey ? lastResult : "",
                (rowIndex === 1 && (key === "f" || key === "j")) || (rowIndex === 2 && (key === "ֆ" || key === "յ" || key === "ճ")) ? "home-anchor" : "",
              ].join(" ");
              return (
                <span className={keyClasses} key={key}>
                  {formatKey(key, copy)}
                </span>
              );
            })}
          </div>
        ))}
        <div className="keyboard-row space-row">
          <span className={`keycap spacebar ${expectedKey === " " ? "expected" : ""} ${lastKey === " " ? lastResult : ""}`}>{formatKey(" ", copy)}</span>
        </div>
      </div>
    </div>
  );
}

function PracticeSurface({
  language,
  lessons,
  lesson,
  lessonIndex,
  lessonText,
  position,
  correctCount,
  errors,
  elapsedSeconds,
  streak,
  isRunning,
  isArmed,
  lastKey,
  lastResult,
  copy,
  keyboardRows,
  keyboardMeta,
  armenianKeyboardLayout,
  onStart,
  onPause,
  onRestart,
  onMoveLesson,
  onLanguageChange,
  onArmenianKeyboardLayoutChange,
}) {
  const isSpeedLesson = lesson.type === "speed";
  const expectedKey = lessonText[position] || "";
  const stats = getStats({
    correctCount,
    errors,
    elapsedSeconds,
    position,
    targetLength: lessonText.length,
  });
  const completion = isSpeedLesson ? Math.min(100, Math.round((elapsedSeconds / SPEED_DURATION_SECONDS) * 100)) : stats.completion;
  const timeValue = isSpeedLesson ? Math.max(SPEED_DURATION_SECONDS - elapsedSeconds, 0) : elapsedSeconds;
  const statusMessage =
    isSpeedLesson && elapsedSeconds >= SPEED_DURATION_SECONDS
      ? copy.speedComplete
      : !isSpeedLesson && position === lessonText.length
      ? copy.complete
      : lastResult === "wrong"
        ? `${copy.tryAgain} ${formatKey(expectedKey, copy)}${copy.again}`
        : isRunning
          ? isSpeedLesson
            ? copy.speedRunning
            : `${copy.nextKey} ${formatKey(expectedKey, copy)}`
          : isArmed
            ? isSpeedLesson
              ? copy.speedReady
              : copy.pressFirstKey
            : isSpeedLesson
              ? copy.speedStart
              : copy.pressStart;
  const buttonText = isRunning ? copy.pause : isArmed ? copy.ready : copy.start;
  const buttonIcon = isRunning ? "pause" : "play";

  return (
    <section className="practice-surface" aria-label={copy.appName}>
      <header className="topbar">
        <div>
          <p className="lesson-label">
            {copy.lesson} {lesson.level}
          </p>
          <h2>{lesson.title}</h2>
        </div>
        <div className="topbar-controls">
          <LanguageSwitcher language={language} copy={copy} onLanguageChange={onLanguageChange} />
          {language === "hy" ? <ArmenianKeyboardSwitcher keyboardLayout={armenianKeyboardLayout} copy={copy} onKeyboardLayoutChange={onArmenianKeyboardLayoutChange} /> : null}
          <div className="topbar-actions">
            <button className="icon-button" type="button" onClick={() => onMoveLesson(-1)} disabled={lessonIndex === 0} aria-label={copy.previousLesson} title={copy.previousLesson}>
              <Icon name="chevronLeft" />
            </button>
            <button className="primary-button" type="button" onClick={isRunning ? onPause : onStart}>
              <Icon name={buttonIcon} />
              {buttonText}
            </button>
            <button className="icon-button" type="button" onClick={onRestart} aria-label={copy.restartLesson} title={copy.restartLesson}>
              <Icon name="restart" />
            </button>
            <button className="icon-button" type="button" onClick={() => onMoveLesson(1)} disabled={lessonIndex === lessons.length - 1} aria-label={copy.nextLesson} title={copy.nextLesson}>
              <Icon name="chevronRight" />
            </button>
          </div>
        </div>
      </header>

      <div className="metrics-strip" aria-label={copy.time}>
        <Metric iconName="activity" label={copy.wpm} value={stats.wpm} />
        <Metric iconName="target" label={copy.accuracy} value={`${stats.accuracy}%`} />
        <Metric iconName="trophy" label={copy.streak} value={streak} />
        <Metric iconName="clock" label={copy.time} value={`${timeValue}${copy.seconds}`} />
      </div>

      <PromptPanel lesson={lesson} promptText={lessonText} position={position} completion={completion} lastKey={lastKey} lastResult={lastResult} statusMessage={statusMessage} copy={copy} />
      <VisualKeyboard keyboardRows={keyboardRows} expectedKey={expectedKey} lessonKeys={lesson.keys} lastKey={lastKey} lastResult={lastResult} copy={copy} keyboardMeta={keyboardMeta} />
    </section>
  );
}

function ProgressPanel({ language, lessons, progress, lesson, bestStreak, copy, armenianKeyboardLayout }) {
  const lessonProgress = progress[progressKey(language, lesson.id)] || { rounds: 0, bestWpm: 0, bestAccuracy: 0 };
  const totalRounds = lessons.reduce((sum, item) => sum + (progress[progressKey(language, item.id)]?.rounds || 0), 0);

  return (
    <aside className="progress-panel" aria-label={copy.savedRounds}>
      <div className="coach-note">
        <h3>{lesson.section}</h3>
        <p>{lesson.tutorial.reminder}</p>
      </div>
      <div className="summary-grid">
        <Summary label={copy.rounds} value={lessonProgress.rounds} />
        <Summary label={copy.bestWpm} value={lessonProgress.bestWpm} />
        <Summary label={copy.bestAccuracy} value={`${lessonProgress.bestAccuracy || 0}%`} />
        <Summary label={copy.bestStreak} value={bestStreak} />
      </div>
      <div className="total-progress">
        <div>
          <strong>{totalRounds}</strong>
          <span>{copy.savedRounds}</span>
        </div>
        <div className="mini-bars" aria-hidden="true">
          {lessons.map((item) => (
            <span className={(progress[progressKey(language, item.id)]?.rounds || 0) > 0 ? "filled" : ""} key={item.id} />
          ))}
        </div>
      </div>
      <div className="next-step">
        <h3>{copy.howToPractice}</h3>
        <ol>
          {copy.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      {language === "hy" ? (
        <div className="keyboard-setup">
          <h3>{copy.keyboardSetupTitle}</h3>
          <p>{copy.keyboardSetupIntro}</p>
          <div className="layout-pills">
            {copy.keyboardLayouts.map((layout, index) => (
              <span className={(index === 0 && armenianKeyboardLayout === "regular") || (index === 1 && armenianKeyboardLayout === "legacy") ? "selected" : ""} key={layout}>
                {layout}
              </span>
            ))}
          </div>
          <p className="layout-note">{copy.keyboardLayoutNote}</p>
          <h4>{copy.keyboardLayoutsTitle}</h4>
          <ol>
            {copy.keyboardSetupSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ) : null}
    </aside>
  );
}

function CompletionModal({ stats, copy, hasNextLesson, onNextLesson, onPracticeAgain, onClose }) {
  if (!stats) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="stats-modal" role="dialog" aria-modal="true" aria-labelledby="completion-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label={copy.close}>
          ×
        </button>
        <p className="lesson-label">{stats.lessonTitle}</p>
        <h2 id="completion-title">{copy.modalTitle}</h2>
        <p>{stats.type === "speed" ? copy.speedComplete : copy.modalSubtitle}</p>
        <div className="modal-stats">
          {stats.type === "speed" ? <Summary label={copy.score} value={`${stats.score} ${copy.words}`} /> : <Summary label={copy.wpm} value={stats.wpm} />}
          <Summary label={copy.accuracy} value={`${stats.accuracy}%`} />
          <Summary label={copy.time} value={`${stats.elapsedSeconds}${copy.seconds}`} />
          {stats.type === "speed" ? <Summary label={copy.wpm} value={stats.wpm} /> : <Summary label={copy.streak} value={stats.bestStreak} />}
        </div>
        <div className="modal-actions">
          <button className="secondary-button" type="button" onClick={onPracticeAgain}>
            <Icon name="restart" />
            {copy.stayButton}
          </button>
          {hasNextLesson ? (
            <button className="primary-button" type="button" onClick={onNextLesson}>
              {copy.nextButton}
              <Icon name="arrowRight" />
            </button>
          ) : (
            <button className="primary-button" type="button" onClick={onClose}>
              {copy.doneButton}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState(loadLanguage);
  const [armenianKeyboardLayout, setArmenianKeyboardLayout] = useState(loadArmenianKeyboardLayout);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [errors, setErrors] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isArmed, setIsArmed] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [lastKey, setLastKey] = useState(null);
  const [lastResult, setLastResult] = useState("idle");
  const [progress, setProgress] = useState(loadProgress);
  const [completionStats, setCompletionStats] = useState(null);
  const [speedText, setSpeedText] = useState("");
  const appRef = useRef(null);
  const runtimeRef = useRef(null);
  const lastSpeedLeadRef = useRef("");
  const speedFinishInProgressRef = useRef(false);

  const lessons = getLessonsForLanguage(language, armenianKeyboardLayout);
  const lesson = lessons[lessonIndex];
  const lessonText = getLessonText(lesson, speedText);
  const copy = COPY[language];
  const keyboardRows = language === "hy" ? ARMENIAN_KEYBOARD_ROWS[armenianKeyboardLayout] : KEYBOARD_ROWS.en;
  const keyboardMeta = language === "hy" ? copy[armenianKeyboardLayout === "legacy" ? "keyboardLayoutLegacy" : "keyboardLayoutRegular"] : copy.keyboardMeta;

  runtimeRef.current = {
    language,
    armenianKeyboardLayout,
    lessonIndex,
    position,
    correctCount,
    errors,
    streak,
    bestStreak,
    startedAt,
    elapsedSeconds,
    isArmed,
    isRunning,
    lessonText,
  };

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language === "hy" ? "hy" : "en";
  }, [language]);

  useEffect(() => {
    localStorage.setItem(ARMENIAN_KEYBOARD_STORAGE_KEY, armenianKeyboardLayout);
  }, [armenianKeyboardLayout]);

  useEffect(() => {
    if (!isRunning || !startedAt) return undefined;
    const timer = window.setInterval(() => {
      const nextElapsed = Math.floor((Date.now() - startedAt) / 1000);
      setElapsedSeconds(lesson.type === "speed" ? Math.min(nextElapsed, SPEED_DURATION_SECONDS) : nextElapsed);
    }, 250);
    return () => window.clearInterval(timer);
  }, [isRunning, lesson.type, startedAt]);

  const prepareSpeedPrompt = useCallback((targetLesson) => {
    if (targetLesson?.type !== "speed") {
      setSpeedText("");
      return "";
    }

    const nextPrompt = buildSpeedPrompt(targetLesson.sentenceBank, lastSpeedLeadRef.current);
    lastSpeedLeadRef.current = nextPrompt.lead;
    setSpeedText(nextPrompt.text);
    return nextPrompt.text;
  }, []);

  const resetRound = useCallback((nextLessonIndex = lessonIndex, shouldArm = true) => {
    const activeLessons = getLessonsForLanguage(language, armenianKeyboardLayout);
    const safeLessonIndex = clamp(nextLessonIndex, 0, activeLessons.length - 1);
    const nextLesson = activeLessons[safeLessonIndex];
    prepareSpeedPrompt(nextLesson);
    speedFinishInProgressRef.current = false;
    setLessonIndex(safeLessonIndex);
    setPosition(0);
    setCorrectCount(0);
    setErrors(0);
    setStreak(0);
    setBestStreak(0);
    setElapsedSeconds(0);
    setStartedAt(null);
    setIsArmed(shouldArm);
    setIsRunning(false);
    setLastKey(null);
    setLastResult("idle");
    setCompletionStats(null);
    window.requestAnimationFrame(() => appRef.current?.focus());
  }, [armenianKeyboardLayout, language, lessonIndex, prepareSpeedPrompt]);

  const startLesson = useCallback(() => {
    if (lesson.type === "speed" && !speedText) {
      prepareSpeedPrompt(lesson);
    }
    speedFinishInProgressRef.current = false;
    setIsArmed(true);
    setIsRunning(false);
    setStartedAt(null);
    setElapsedSeconds(0);
    setLastKey(null);
    setLastResult("idle");
    setCompletionStats(null);
    window.requestAnimationFrame(() => appRef.current?.focus());
  }, [lesson, prepareSpeedPrompt, speedText]);

  const pauseLesson = useCallback(() => {
    setIsRunning(false);
    setIsArmed(false);
  }, []);

  const restartLesson = useCallback(() => {
    resetRound(lessonIndex, true);
  }, [lessonIndex, resetRound]);

  const chooseLesson = useCallback((index) => {
    resetRound(index, true);
  }, [resetRound]);

  const moveLesson = useCallback((direction) => {
    resetRound(clamp(lessonIndex + direction, 0, lessons.length - 1), true);
  }, [lessonIndex, lessons.length, resetRound]);

  const changeLanguage = useCallback((nextLanguage) => {
    speedFinishInProgressRef.current = false;
    setLanguage(nextLanguage);
    setLessonIndex(0);
    setPosition(0);
    setCorrectCount(0);
    setErrors(0);
    setStreak(0);
    setBestStreak(0);
    setElapsedSeconds(0);
    setStartedAt(null);
    setIsArmed(true);
    setIsRunning(false);
    setLastKey(null);
    setLastResult("idle");
    setCompletionStats(null);
    setSpeedText("");
  }, []);

  const changeArmenianKeyboardLayout = useCallback((nextLayout) => {
    const safeLayout = nextLayout === "regular" ? "regular" : "legacy";
    const nextLesson = getLessonsForLanguage("hy", safeLayout)[0];
    prepareSpeedPrompt(nextLesson);
    speedFinishInProgressRef.current = false;
    setArmenianKeyboardLayout(safeLayout);
    setLessonIndex(0);
    setPosition(0);
    setCorrectCount(0);
    setErrors(0);
    setStreak(0);
    setBestStreak(0);
    setElapsedSeconds(0);
    setStartedAt(null);
    setIsArmed(true);
    setIsRunning(false);
    setLastKey(null);
    setLastResult("idle");
    setCompletionStats(null);
    setSpeedText("");
    window.requestAnimationFrame(() => appRef.current?.focus());
  }, [prepareSpeedPrompt]);

  const completeLesson = useCallback((finishedLanguage, finishedLesson, finalCorrectCount, finalErrors, finalElapsedSeconds, finalPosition, finalBestStreak, targetTextOverride = "") => {
    const targetText = targetTextOverride || finishedLesson.text || "";
    const stats = getStats({
      correctCount: finalCorrectCount,
      errors: finalErrors,
      elapsedSeconds: finalElapsedSeconds,
      position: finalPosition,
      targetLength: targetText.length,
    });
    const score = finishedLesson.type === "speed" ? countScoredWords(targetText.slice(0, finalPosition), finalPosition >= targetText.length) : null;
    setProgress((current) => {
      const key = progressKey(finishedLanguage, finishedLesson.id);
      const existing = current[key] || { rounds: 0, bestWpm: 0, bestAccuracy: 0 };
      return {
        ...current,
        [key]: {
          rounds: existing.rounds + 1,
          bestWpm: Math.max(existing.bestWpm, stats.wpm),
          bestAccuracy: Math.max(existing.bestAccuracy, stats.accuracy),
        },
      };
    });
    setCompletionStats({
      type: finishedLesson.type,
      lessonTitle: finishedLesson.title,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      elapsedSeconds: finalElapsedSeconds,
      bestStreak: finalBestStreak,
      score,
    });
    setIsRunning(false);
    setIsArmed(false);
  }, []);

  useEffect(() => {
    if (!isRunning || !startedAt || lesson.type !== "speed") return undefined;
    const timer = window.setInterval(() => {
      const snapshot = runtimeRef.current;
      if (!snapshot?.startedAt || speedFinishInProgressRef.current) return;

      const nextElapsed = Math.floor((Date.now() - snapshot.startedAt) / 1000);
      if (nextElapsed < SPEED_DURATION_SECONDS) return;

      const activeLesson = getLessonsForLanguage(snapshot.language, snapshot.armenianKeyboardLayout)[snapshot.lessonIndex];
      speedFinishInProgressRef.current = true;
      setElapsedSeconds(SPEED_DURATION_SECONDS);
      completeLesson(
        snapshot.language,
        activeLesson,
        snapshot.correctCount,
        snapshot.errors,
        SPEED_DURATION_SECONDS,
        snapshot.position,
        snapshot.bestStreak,
        snapshot.lessonText
      );
    }, 250);

    return () => window.clearInterval(timer);
  }, [completeLesson, isRunning, lesson.type, startedAt]);

  useEffect(() => {
    function handleKeyDown(event) {
      const snapshot = runtimeRef.current;
      if (!snapshot?.isArmed && !snapshot?.isRunning) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const key = event.key;
      if (key.length !== 1 && key !== "Backspace" && key !== "Enter") return;
      event.preventDefault();

      const activeLessons = getLessonsForLanguage(snapshot.language, snapshot.armenianKeyboardLayout);
      const activeLesson = activeLessons[snapshot.lessonIndex];
      const activeLessonText = snapshot.lessonText || activeLesson.text || "";
      const expectedKey = activeLessonText[snapshot.position] || "";
      const firstTimedKey = !snapshot.startedAt;
      const activeStartedAt = firstTimedKey ? Date.now() : snapshot.startedAt;

      if (key === "Enter") {
        resetRound(snapshot.lessonIndex, true);
        return;
      }

      if (key === "Backspace") {
        setLastKey("Backspace");
        setLastResult("idle");
        return;
      }

      if (firstTimedKey) {
        setStartedAt(activeStartedAt);
        setElapsedSeconds(0);
        setIsRunning(true);
        setIsArmed(false);
      }

      setLastKey(key);

      if (key === expectedKey) {
        const nextPosition = snapshot.position + 1;
        const nextCorrectCount = snapshot.correctCount + 1;
        const nextStreak = snapshot.streak + 1;
        const nextBestStreak = Math.max(snapshot.bestStreak, nextStreak);
        const nextElapsedSeconds = Math.max(1, Math.ceil((Date.now() - activeStartedAt) / 1000));

        runtimeRef.current = {
          ...snapshot,
          startedAt: activeStartedAt,
          isArmed: false,
          isRunning: true,
          position: nextPosition,
          correctCount: nextCorrectCount,
          streak: nextStreak,
          bestStreak: nextBestStreak,
          elapsedSeconds: nextElapsedSeconds,
        };

        setPosition(nextPosition);
        setCorrectCount(nextCorrectCount);
        setStreak(nextStreak);
        setBestStreak(nextBestStreak);
        setLastResult("correct");

        if (activeLesson.type !== "speed" && nextPosition === activeLessonText.length) {
          setElapsedSeconds(nextElapsedSeconds);
          completeLesson(snapshot.language, activeLesson, nextCorrectCount, snapshot.errors, nextElapsedSeconds, nextPosition, nextBestStreak, activeLessonText);
        }
        return;
      }

      runtimeRef.current = {
        ...snapshot,
        startedAt: activeStartedAt,
        isArmed: false,
        isRunning: true,
        errors: snapshot.errors + 1,
        streak: 0,
      };
      setErrors(snapshot.errors + 1);
      setStreak(0);
      setLastResult("wrong");
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [completeLesson, resetRound]);

  return (
    <main className={`app-shell language-${language}`} tabIndex="-1" ref={appRef}>
      <LessonRail language={language} lessons={lessons} lessonIndex={lessonIndex} progress={progress} copy={copy} onChooseLesson={chooseLesson} />
      <PracticeSurface
        language={language}
        lessons={lessons}
        lesson={lesson}
        lessonIndex={lessonIndex}
        lessonText={lessonText}
        position={position}
        correctCount={correctCount}
        errors={errors}
        elapsedSeconds={elapsedSeconds}
        streak={streak}
        isRunning={isRunning}
        isArmed={isArmed}
        lastKey={lastKey}
        lastResult={lastResult}
        copy={copy}
        keyboardRows={keyboardRows}
        keyboardMeta={keyboardMeta}
        armenianKeyboardLayout={armenianKeyboardLayout}
        onStart={startLesson}
        onPause={pauseLesson}
        onRestart={restartLesson}
        onMoveLesson={moveLesson}
        onLanguageChange={changeLanguage}
        onArmenianKeyboardLayoutChange={changeArmenianKeyboardLayout}
      />
      <ProgressPanel language={language} lessons={lessons} progress={progress} lesson={lesson} bestStreak={bestStreak} copy={copy} armenianKeyboardLayout={armenianKeyboardLayout} />
      <CompletionModal
        stats={completionStats}
        copy={copy}
        hasNextLesson={lessonIndex < lessons.length - 1}
        onNextLesson={() => resetRound(clamp(lessonIndex + 1, 0, lessons.length - 1), true)}
        onPracticeAgain={() => resetRound(lessonIndex, true)}
        onClose={() => setCompletionStats(null)}
      />
    </main>
  );
}
