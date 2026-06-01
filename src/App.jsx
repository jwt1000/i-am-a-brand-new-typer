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
      id: "speed-1-minute",
      type: "speed",
      level: "8",
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
        "i can type with calm hands.",
        "my fingers return to the home row.",
        "a slow start can become a strong finish.",
        "i read the next word before i press it.",
        "spaces are typed with my thumb.",
        "steady practice makes typing feel easier.",
        "i keep my eyes on the screen.",
        "short words help me build rhythm.",
        "i correct my pace before i lose control.",
        "each letter has its own finger.",
        "my hands stay relaxed while i type.",
        "good typing begins with good posture.",
        "i breathe and keep a gentle rhythm.",
        "one minute is enough for a clean score.",
        "i can improve one round at a time.",
        "the next sentence gives me a fresh start.",
        "i type the word that i see.",
        "accuracy helps speed grow naturally.",
        "my wrists stay quiet and light.",
        "i finish the line without looking down.",
        "i let my fingers find the next key.",
        "a clean word is better than a rushed word.",
        "my shoulders stay loose while i practice.",
        "i follow the sentence from left to right.",
        "each space gives my hands a reset.",
        "i keep typing even when the line changes.",
        "my goal is a smooth one minute round.",
        "i can slow down and still score well.",
        "the home row is my starting place.",
        "i notice mistakes and return to rhythm.",
        "small improvements add up each day.",
        "i type softly and keep moving.",
        "the next word is the only word i need.",
        "i keep both hands balanced on the keys.",
        "my fingers move and return home.",
        "i trust the practice more than speed.",
        "one calm round can teach a lot.",
        "i build confidence with every sentence.",
        "i stay patient through the full minute.",
        "good rhythm makes the keyboard quieter.",
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
      id: "speed-1-minute",
      type: "speed",
      level: "8",
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
        "ես գրում եմ հանգիստ ձեռքերով։",
        "իմ մատները վերադառնում են հիմնական շարքին։",
        "դանդաղ սկիզբը կարող է դառնալ ուժեղ ավարտ։",
        "ես կարդում եմ հաջորդ բառը և հետո սեղմում։",
        "բացատը սեղմում եմ բութ մատով։",
        "կայուն վարժությունը հեշտացնում է մուտքագրումը։",
        "աչքերս պահում եմ էկրանին։",
        "կարճ բառերը օգնում են պահել ռիթմը։",
        "ես դանդաղեցնում եմ, երբ կորցնում եմ վերահսկումը։",
        "յուրաքանչյուր տառ ունի իր մատը։",
        "ձեռքերս մնում են հանգիստ։",
        "ճիշտ դիրքը օգնում է արագ գրել։",
        "ես շնչում եմ և պահում մեղմ ռիթմ։",
        "մեկ րոպեն բավարար է մաքուր արդյունքի համար։",
        "յուրաքանչյուր փորձից հետո կարող եմ լավանալ։",
        "հաջորդ նախադասությունը նոր սկիզբ է տալիս։",
        "ես գրում եմ այն բառը, որը տեսնում եմ։",
        "ճշտությունը բնական կերպով մեծացնում է արագությունը։",
        "դաստակներս մնում են թեթև ու հանգիստ։",
        "ես ավարտում եմ տողը առանց ներքև նայելու։",
        "թող մատներս գտնեն հաջորդ ստեղնը։",
        "ճիշտ բառը ավելի լավ է, քան շտապ բառը։",
        "ուսերս մնում են ազատ, երբ վարժվում եմ։",
        "ես հետևում եմ նախադասությանը ձախից աջ։",
        "յուրաքանչյուր բացատ օգնում է նորից դասավորվել։",
        "ես շարունակում եմ գրել, երբ տողը փոխվում է։",
        "իմ նպատակը հանգիստ մեկ րոպե է։",
        "կարող եմ դանդաղել և լավ արդյունք ստանալ։",
        "հիմնական շարքը իմ մեկնարկային տեղն է։",
        "ես նկատում եմ սխալը և վերադառնում ռիթմին։",
        "փոքր առաջընթացը օրեցօր մեծանում է։",
        "ես մեղմ եմ սեղմում և շարունակում եմ շարժվել։",
        "հաջորդ բառը միակ բառն է, որի մասին մտածում եմ։",
        "երկու ձեռքերս պահում եմ հավասարակշռված։",
        "մատներս շարժվում են և վերադառնում իրենց տեղը։",
        "ես վստահում եմ վարժությանը, ոչ թե շտապելուն։",
        "մեկ հանգիստ փորձը կարող է շատ բան սովորեցնել։",
        "յուրաքանչյուր նախադասությամբ վստահություն եմ հավաքում։",
        "ամբողջ րոպեի ընթացքում մնում եմ համբերատար։",
        "լավ ռիթմը ստեղնաշարը դարձնում է ավելի հանգիստ։",
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
    armenian: "Armenian",
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
    stayButton: "Practice again",
    doneButton: "Finish",
    close: "Close",
    seconds: "s",
    space: "space",
  },
  hy: {
    appName: "Առաջին ստեղներ",
    appSubtitle: "Ստեղնաշարի դասեր սկսնակների համար։",
    languageLabel: "Լեզու",
    english: "Անգլերեն",
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
    stayButton: "Կրկնել դասը",
    doneButton: "Ավարտել",
    close: "Փակել",
    seconds: "վ",
    space: "բացատ",
  },
};

const STORAGE_KEY = "first-keys-progress-v2";
const LANGUAGE_STORAGE_KEY = "first-keys-language";
const ARMENIAN_KEYBOARD_STORAGE_KEY = "first-keys-armenian-keyboard-layout";
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
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v7h7" />
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
    return stored === "legacy" ? "legacy" : "regular";
  } catch {
    return "regular";
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function progressKey(language, lessonId) {
  return `${language}:${lessonId}`;
}

function formatKey(key, copy) {
  if (key === " ") return copy.space;
  if (!key) return "";
  return key.toLocaleUpperCase();
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
  const promptChars = useMemo(
    () =>
      promptText.split("").map((char, index) => ({
        char,
        status: index < position ? "done" : index === position ? "current" : "waiting",
      })),
    [promptText, position]
  );

  useEffect(() => {
    currentCharRef.current?.scrollIntoView({ block: "center", inline: "nearest" });
  }, [position]);

  return (
    <div className="prompt-panel">
      <div className="prompt-header">
        <p>{lesson.goal}</p>
        <span>{completion}%</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${completion}%` }} />
      </div>
      <div className="typing-line" aria-label={lesson.goal}>
        {promptChars.map((item, index) => (
          <span className={`prompt-char ${item.status} ${item.char === " " ? "space" : ""}`} key={`${index}-${item.char}`} ref={item.status === "current" ? currentCharRef : undefined}>
            {item.char === " " ? "\u00a0" : item.char}
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

function FingerTutorial({ lesson, copy }) {
  return (
    <section className="finger-tutorial" aria-label={copy.tutorialTitle}>
      <div className="tutorial-heading">
        <span>{lesson.difficulty}</span>
        <h3>{copy.tutorialTitle}</h3>
      </div>
      <p>{lesson.tutorial.lead}</p>
      <div className="finger-map">
        <div>
          <strong>{lesson.tutorial.left}</strong>
          <span>{lesson.tutorial.leftLabel}</span>
        </div>
        <div>
          <strong>{lesson.tutorial.right}</strong>
          <span>{lesson.tutorial.rightLabel}</span>
        </div>
      </div>
      <p className="tutorial-reminder">{lesson.tutorial.reminder}</p>
    </section>
  );
}

function VisualKeyboard({ keyboardRows, expectedKey, lessonKeys, lastKey, lastResult, copy, keyboardMeta }) {
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
              const keyClasses = [
                "keycap",
                lessonKeys.includes(key) ? "lesson-key" : "",
                key === expectedKey ? "expected" : "",
                key === lastKey ? lastResult : "",
                key === "f" || key === "j" || key === "ֆ" || key === "յ" ? "home-anchor" : "",
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
            <button className="primary-button" type="button" onClick={isRunning || isArmed ? onPause : onStart}>
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

      <FingerTutorial lesson={lesson} copy={copy} />
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
  const [isArmed, setIsArmed] = useState(false);
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

  const lessons = LESSON_SETS[language];
  const lesson = lessons[lessonIndex];
  const lessonText = getLessonText(lesson, speedText);
  const copy = COPY[language];
  const keyboardRows = language === "hy" ? ARMENIAN_KEYBOARD_ROWS[armenianKeyboardLayout] : KEYBOARD_ROWS.en;
  const keyboardMeta = language === "hy" ? copy[armenianKeyboardLayout === "legacy" ? "keyboardLayoutLegacy" : "keyboardLayoutRegular"] : copy.keyboardMeta;

  runtimeRef.current = {
    language,
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

  const resetRound = useCallback((nextLessonIndex = lessonIndex, shouldArm = false) => {
    const nextLesson = LESSON_SETS[language][nextLessonIndex];
    prepareSpeedPrompt(nextLesson);
    speedFinishInProgressRef.current = false;
    setLessonIndex(nextLessonIndex);
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
  }, [language, lessonIndex, prepareSpeedPrompt]);

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
    resetRound(index, false);
  }, [resetRound]);

  const moveLesson = useCallback((direction) => {
    resetRound(clamp(lessonIndex + direction, 0, lessons.length - 1), false);
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
    setIsArmed(false);
    setIsRunning(false);
    setLastKey(null);
    setLastResult("idle");
    setCompletionStats(null);
    setSpeedText("");
  }, []);

  const changeArmenianKeyboardLayout = useCallback((nextLayout) => {
    setArmenianKeyboardLayout(nextLayout === "legacy" ? "legacy" : "regular");
  }, []);

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

      const activeLesson = LESSON_SETS[snapshot.language][snapshot.lessonIndex];
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

      const activeLessons = LESSON_SETS[snapshot.language];
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
        onNextLesson={() => resetRound(clamp(lessonIndex + 1, 0, lessons.length - 1), false)}
        onPracticeAgain={() => resetRound(lessonIndex, true)}
        onClose={() => setCompletionStats(null)}
      />
    </main>
  );
}
