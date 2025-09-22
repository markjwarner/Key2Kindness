import React, { Component } from "react";
import { group, id, platform, getCachedIds } from "../pages/LoginPage";
import TextBoxComponent from "../components/TextBoxComponent";
import TextRecComponent from "../components/TextRecComponent";
import GetHateTyping from "../components/GetHateTypingComponent";
// import {HateStatus, prob} from  "../components/GetHateTypingComponent";
import KeyboardComponent from "./KeyboardComponent";
import WhatsappComp from "../components/WhatsappComponent";
import TwitterComp from "../components/TwitterComponent";
import ToolTipPopUp from "../components/ToolTipPopUp";
import { postLog } from "../logging";
import { ConsoleView, isIOS } from "react-device-detect";
import axios from 'axios';
import GetHateOnSubmit from "./GetHateOnSubmitComponent.js";
import Scenario from "./Scenario_DescriptionComponent";
const dotenv = require('dotenv').config();

//The base url of the API
export const API_URL =
 "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=" + process.env.REACT_APP_API_KEY;

let showTextRec = false; //this boolean value decides if the text area appears or not
const result_start = [<li key='cursor' id='cursorId' className='cursor character'> </li>];
var selectedIndex; // stores the current index of the the messages thread
let showHate = true;
// The following variables store the response values returned by the API

let RenderThread;
var updateHateData;
var getHateData;

export const TIMING_DELAY = 30; // friction timing delay in seconds
export const TOXICITY_THRESHOLD = 0.60; //threshold for the toxicity score to be considered inapropriate
/* If more threads are created, please increase the array e.g. [0,1,2,3,4,5] */

/* nice colours for group member names
red = #e10000
green = #217202
purple = #b7008e
brown = #865200
*/
const whatsapp_message_array_size = [0, 1, 2];
const whatsappThreads = [

/* PART 1 (Free response) */
/* ################################
/*
    {
        name: "Mum's Birthday",
        status: "online",
        type: "group",
        avatar_url: "https://static.vecteezy.com/system/resources/previews/000/626/222/original/vector-birthday-cake-flat-icon-with-long-shadow.jpg",
        scenario: "You are in a family WhatsApp group organising a family event. Your siblings make hurtful comments about your partner. Please read the thread history and respond as if you were the one in this group chat.",
        messages: [
            { type: "received", name: "Dad",                name_colour: "#217202", time: "17:11", message: "Hey kids, I'm planning a surprise birthday for your Mum on the 3rd. I've booked the usual function room and arranged the food and drink already. We just need to send invites out. I trust you can all make that date ok?" },
            { type: "sent",     name: "You",                                        time: "17:21", message: "Hey Dad, thanks for organising mum will be really happy we're all getting together." },
            { type: "sent",     name: "You",                                        time: "17:23", message: "I can make it, and so can Alex! Both looking forward to it." },
            { type: "received", name: "Jess (sister)",     name_colour: "#e10000", time: "",      message: "hmm, you're bringing Alex? Are we bringing partners?" },
            { type: "received", name: "Dad",                name_colour: "#217202", time: "17:24", message: "Yes, you can bring partners if you want" },
            { type: "received", name: "Jess (sister)",     name_colour: "#e10000", time: "",      message: "why? maybe no partners Dad?" },
            { type: "received", name: "Dad",                name_colour: "#217202", time: "", message: "It's up to you all to sort this out, I am easy either way" },
            { type: "received", name: "James (brother)",    name_colour: "#b7008e", time: "", message: "I'm happy coming just by myself" },
            { type: "sent",     name: "You",                                        time: "", message: "Well yeah, but neither of you two have partners to bring and I do. What's the issue with me bringing Alex?" },
            { type: "received", name: "Jess (sister)",     name_colour: "#e10000", time: "", message: "Alex doesn't exactly \"fit in\"" },
            { type: "sent",     name: "You",                                        time: "", message: "???" },
            { type: "received", name: "James (brother)",   name_colour: "#b7008e", time: "", message: "...doesn't fit in personality or physically" },
            { type: "received", name: "Dad",                name_colour: "#217202", time: "", message: "lol come on now you two" },
            { type: "sent",     name: "You",                                        time: "", message: "???????!" },
            { type: "received", name: "James (brother)",   name_colour: "#b7008e", time: "", message: "Dad, if Alex is coming you better make sure there's a decent amount of food on" },
            { type: "received", name: "Jess (sister)",     name_colour: "#e10000", time: "", message: "bahahahahahahahaha" },
            { type: "sent",     name: "You",                                            time: "", message: "What do you mean by that James??" },
            { type: "received", name: "Dad",                name_colour: "#217202", time: "", message: "lol you two are terrible" },
            { type: "received", name: "Jess (sister)",     name_colour: "#e10000", time: "", message: "Well, Alex is hardly what you would call a \"normal weight\"" },
            { type: "received", name: "James (brother)",   name_colour: "#b7008e", time: "", message: "I think the word you're looking for is fat Jess" },
            { type: "received", name: "Jess (sister)",     name_colour: "#e10000", time: "", message: "fat as.....f" },
            { type: "received", name: "Jess (sister)",     name_colour: "#e10000", time: "", message: "Dad, I'm sorry but if partners are invited im not coming" },
            { type: "received", name: "Dad",                name_colour: "#217202", time: "", message: "Ok then, perhaps we can say no partners?" },
            { type: "received", name: "Jess (sister)",     name_colour: "#e10000", time: "", message: "perfect works for me, that ok with everyone?" },
            { type: "received", name: "Dad",                name_colour: "#217202", time: "", message: "It would be cheaper that way" },

        ]
    },

    {
        name: "Uncle M",
        status: "online",
        type: "private",
        avatar_url: "https://cdn.flippednormals.com/wp-content/uploads/2019/02/01180312/render_003.jpg",
        scenario: "You are having a conversation with a member of your family and they make comments that suggest that you are not as valued and successful as the family had hoped. They suggest that the family is disappointed in you. Please read the thread history and respond as if you were the one in this chat.",
        messages: [
            { type: "sent", time: "", message: "Hey, just thought you should know ive been made redundant from work so will not be working for a bit"},
            { type: "received", time: "", message: "hmm, can't say I'm too surprised if I am honest"},
            { type: "received", time: "", message: "Why?"},
            { type: "sent", time: "", message: "Why what?"},
            { type: "received", time: "", message: "Why were you sacked??"},
            { type: "sent", time: "", message: "I wasn't sacked I was made redundant"},
            { type: "received", time: "", message: "yes but not everyone was sacked, right? so why you?" },
            { type: "received", time: "", message: "Were you not pulling your weight?" },
            { type: "sent", time: "", message: "No, they needed to cut costs and had to let people go"},
            { type: "received", time: "", message: "I understand that, I'm just wondering why they let YOU go,  and not someone else?"},
            { type: "received", time: "", message: "You really need to work a lot harder in the future. No one else in our family has ever been sacked from their job...only you..."},
            { type: "sent", time: "", message: "Not sacked! I was made redundant"},
            { type: "received", time: "", message: "but there is really no difference is there? your still out of a job while others still have a job which means they got rid of you for some reason..."},
            { type: "received", time: "", message: "being a bit useless? You really are a waste of space sometimes, everyone in this family is very disappointed in you"},
        ]
    },

    {
        name: "Ex",
        status: "online",
        type: "private",
        avatar_url: "https://betsysharp.files.wordpress.com/2010/03/broken-heart.jpg",
        scenario: "Your ex has messaged you and made unreasonable demands, being rude and inconsiderate. Please read the thread history and respond as if you were the one in this chat.",
        messages: [
            { type: "sent", time: "", message: "Hey, just to let you know this is my new number (new phone). I've still got some of your things at mine, if you want to get them at some point?"},
            { type: "received", time: "", message: "I'll send someone to come pick them up at some point. You also owe me money!"},
            { type: "sent", time: "", message: "What money do I owe you?"},
            { type: "received", time: "", message: "Where do I start? You always like to shop at Waitrose, and I spent a f**king fortune there while we were dating...so call that £300. The gift I got you for your birthday I want back, or cash for it. You also owe me for all of the dinners I got for you when we were out and about." },
            { type: "received", time: "", message: "So, I want the present and £1k cash...and my stuff"},
            { type: "sent", time: "", message: "Oh wow, are you actually serious?"},
            { type: "received", time: "", message: "I'm dead fucking serious."},
            { type: "sent", time: "", message: "You were living at my flat, rent free for well over 6 months..."},
            { type: "received", time: "", message: "Yeah because you wanted me there, practially begged me to be there, I didn't ask to be there"},
            { type: "sent", time: "", message: "You didn't have anywhere to live, I offered you to stay at mine and never did I once ask for any rent, or payment or anything"},
            { type: "received", time: "", message: " also the Sky TV, I paid for the Sky TV box which was £43 per month with everything and i had to pay for 1 year so that's £550 if you include the setup"},
            { type: "sent", time: "", message: "You wanted the Sky TV? I didn't even want it!?"},
            { type: "received", time: "", message: "If i didn't have Sky to watch I would have been completely unstimulated"},
            { type: "received", time: "", message: "so £1,550 + the gift back + my stuff, and I want you to stay away from me and our friends (my friends now) ...thanks!"},


        ]
    },


/* PART 2 (Pre/Post) */
/* ################################
*/

    {
        name: "Michael (Flat 4b)",
        status: "online",
        type: "private",
        avatar_url: "https://www.hairdohairstyle.com/wp-content/uploads/2019/07/2-Line-Angled-Beard.jpg",
        scenario: "You are messaging your neighbour about unreasonable noise levels coming from their house. This is not the first time you have complained to them. You've also previously complained to the local authority and the police but they have been unable to help. Please read the thread history and respond as if you were the one in this chat.",
        messages: [
            { type: "sent", time: "08:11", message: "Hi Michael" },
            { type: "received",     time: "08:21", message: "What is it now?" },
            { type: "sent", time: "08:30", message: "Not wanting to moan again but the noise coming from your place was ridiculous last night. It kept me and my kids up. Can you please keep the noise to a minimum?" },
            { type: "received",     time: "08:35", message: "what noise? no noise from here last night apart from a bit of quiet music...it's my home I can do what I like inside it" },
            { type: "sent", time: "08:42", message: "I'm not saying you can't have a bit of fun but a little consideration for people around you would be good, especially as we have young kids" },
            { type: "received",     time: "08:58", message: "It's not my fault you've got kids. you should try letting your hair down and having a bit of fun now and then." },
            { type: "sent", time: "08:11", message: "no need to be rude, all I'm asking is that you be a bit more considerate and keep the noise down, especially during the week" },
            { type: "received",     time: "09:21", message: "I'll do what I can" },
            { type: "received", time: "09:41", message: "Ohh and not wanting to moan or anything but could you keep your screaming crying kids noise to a minimum, I'm trying to get some well earned rest and it's all I can hear" },
            { type: "sent",     time: "09:59", message: "I can't help my kids crying I'm afraid, they're kids" },
            { type: "received",     time: "10:21", message: "Do you're best" },
            { type: "sent", time: "20:45", message: "Michael, please can you turn the music down my kids have literally just gone to bed and now they can't sleep because of the thumping music" },
            { type: "received",     time: "20:50", message: "hahaha dear oh shitting dear, well perhaps you and your family should  move house to a more \"considerate\" area..." },
            { type: "sent", time: "20:58", message: "We're not going anywhere and I'm going to ignore your veiled threat for now, please turn the music down or I'll be forced to speak to the authorities again" },
            { type: "received",     time: "21:09", message: "ok, I've turned it down now" },
            { type: "sent", time: "21:11", message: "It's louder!!!" },
            { type: "received",     time: "21:20", message: "I'm going to have to speak to you tomorrow, I'm too busy enjoying my life over here. Make sure you keep your kids quiet so i can enjoy myself" },
            { type: "received", time: "21:22", message: "I hope your kids like house music, lol" },
        ]
    },

    {
        name: "Jamie",
        status: "online",
        type: "private",
        avatar_url: "https://cdn-s3.touchofmodern.com/products/000/083/402/6b80a4ff7f8725018a7395ab2459d09e_large.jpg?1398720331",
        scenario: "Jamie is someone who has recently introduced themselves into your friendship group. He has indicated to you recently that he does not like you but never said it explicitly. He has been spending a lot of time with one of your close friends, Ash. You have known Ash for most of your life as you grew up together. One day, Jamie messages you accusing you of upsetting Ash. Please read the thread history and respond as if you were the one in this chat.",
        messages: [
            { type: "received",     time: "07:21", message: "Hey, I just got off the phone with Ash who was v upset, what's happened?" },
            { type: "sent", time: "07:45", message: "I don't know, how's Ash now?" },
            { type: "received",     time: "08:12", message: "You must have said something, people don't just get upset for no reason and you were the last to speak to Ash so...." },
            { type: "received",     time: "08:13", message: "Ash is one of my best friends so I'd like to know what went on please" },
            { type: "received",     time: "08:15", message: "Don't contact Ash ok, whatever you said or did it's hurt and been very upsetting" },
            { type: "sent", time: "09:01", message: "huh? Ash is my friend too, don't tell me who I can and can't contact!" },
            { type: "sent", time: "09:05", message: "You've known Ash for a few months!? I've known Ash my whole life" },
            { type: "received", time: "10:17", message: "I don't care how long you've known each other, just give it a rest and stay away" },
            { type: "sent", time: "10:33", message: "Jamie what are you talking about and why are you acting like this. Where is this coming from? I've not said or done anything, I'm confused?" },
            { type: "received", time: "10:39", message: "Sure, you just \"happen\" to see Ash, and then soon after Ash is upset, depressed etc..I don't know what you've done or said but I'm sure that you know what you've done" },
            { type: "received", time: "10:55", message: "I always thought you were conniving and not a real friend, this proves it" },
            { type: "sent", time: "20:51", message: "So I heard about what actually happened to Ash...it had nothing to do with me! Perhaps an apologise is due?" },
            { type: "received", time: "21:11", message: "It might not have been you this time but I stand by what I said, you're conniving and a crap friend and you need to stay away from Ash, and from me. Ash can't see what you're like, but I can..." },

        ]
    },

    {
        name: "Fwends!",
        status: "online",
        type: "group",
        avatar_url: "http://images6.fanpop.com/image/photos/39700000/BTS-Group-Photo-2016-bts-39724613-1200-1200.jpg",
        scenario: "You are part of a group chat with a number of people from a local club that you used to belong to. The group chat is still active, but not as much as it used to be as many of the group members no longer live near each other. Occasionally group members post relevant stories, or share news. However, some of the members have recently started sharing jokes that you've found inappropriate. These have been jokes about people with certain disabilities, as well as jokes about immigration and migrants coming to the UK. Please read the thread history and respond as if you were the one in this group chat.",
        messages: [
            { type: "received", name: "Ali",                name_colour: "#217202", time: "17:11", message: "hey heard this joke the other day...." },
            { type: "received",     name: "Jezz",         name_colour: "#e10000", time: "",    time: "17:21", message: "lol go on ..." },
            { type: "received", name: "Ali",                name_colour: "#217202", time: "17:11", message: "<offensive joke about migrants>" },
            { type: "received", name: "Jezz",     name_colour: "#e10000", time: "",      message: "bahahahahahahahaha" },
            { type: "received", name: "Simon",                name_colour: "#b7008e", time: "17:24", message: "LOL" },
            { type: "sent",     name: "You",                                        time: "17:21", message: "hmmm, not sure we should be making jokes out of migrants, especially at the moments, not that funny and not appropriate..." },
            { type: "received", name: "Ali",     name_colour: "#217202", time: "",      message: "Bah lighten up...it's only a joke!" },
            { type: "sent",     name: "You",                                        time: "17:21", message: "Yeah it's a joke but people are actually getting killed, children are getting killed so yeah....not that funny" },
            { type: "received", name: "Ali",                name_colour: "#217202", time: "", message: "Freedom of speech! We can make jokes about anything we like" },
            { type: "sent",     name: "You",                                        time: "", message: "I'd rather you just didn't make jokes about this subject at the expense of these poor people" },
            { type: "received", name: "Jezz",    name_colour: "#e10000", time: "", message: "This is a private chat, so just relax and have a fucking laugh" },
            { type: "received", name: "Ali",     name_colour: "#217202", time: "", message: "Yeah, seriously you need to chill the fuck out and stop worrying so much about these people, not worth it." },
            { type: "received", name: "Ali",     name_colour: "#217202", time: "", message: "<offensive joke about a disabled migrant>" },
            { type: "received", name: "Jezz",   name_colour: "#e10000", time: "", message: "hahahahahahah!! OMG stop it you're killing me haha" },
            { type: "received", name: "Simon",                name_colour: "#b7008e", time: "", message: "hahaha" },
        ]
    },






];

/* If more threads are created, please increase the array e.g. [0,1,2,3,4,5] */
const twitter_message_array_size = [0, 1, 2, 3, 4, 5];
const bbcnews_avatar_url = "https://thumbs.dreamstime.com/z/cat-avatar-illustration-cartoon-45383627.jpg";
const twitterThreads = [
    {//1558866284078587906
        name: "BBC News",
        handle: "@BBCNews",
        avatar_url: bbcnews_avatar_url,
        scenario: "You read a Twitter user's reply to a BBC News post",
        message: "UK Black Pride event returns to London",
        image: "https://pbs.twimg.com/card_img/1558867084053925888/53gdoOLh?format=jpg&name=medium",
        time: "4.20 PM",
        date: "Aug 14",
        location: "London, UK",
        retweets: "76",
        likes: "638",
        replies: [
            {
              name: "British Alba",
              handle: "@BBCNews",
              avatar_url: bbcnews_avatar_url,
              time: "6:20 PM",
              replies: "7",
              retweets: "3",
              likes: "174",
              message: "Racist events should not be allowed.",
            }
        ]
    },
    {//1558143793211359235
        name: "BBC News",
        handle: "@BBCNews",
        avatar_url: bbcnews_avatar_url,
        scenario: "You read a Twitter user's reply to a BBC News post",
        message: "Liz Truss defends energy firms saying profit is not evil",
        image: "https://pbs.twimg.com/card_img/1560385641015394304/R4pR2YlY?format=jpg&name=medium",
        time: "4.20 PM",
        date: "Aug 12",
        location: "London, UK",
        retweets: "76",
        likes: "638",
        replies: [
            {
              name: "Mrs Peel💙 #FBPE #FBPPR #ToriesOut 🇪🇺 🌻🇺🇦",
              handle: "@EmmaPee36347650",
              avatar_url: bbcnews_avatar_url,
              time: "6:20 PM",
              replies: "7",
              retweets: "3",
              likes: "174",
              message: "A truly vile women of Little substance.",
            }
        ]
    },
    {//1560220171314266112
        name: "BBC News",
        handle: "@BBCNews",
        avatar_url: bbcnews_avatar_url,
        scenario: "You read a Twitter user's reply to a BBC News post",
        message: "Amol Rajan to take over from Jeremy Paxman as University Challenge host",
        image: "https://pbs.twimg.com/card_img/1562732691707277312/YkaadFnv?format=jpg&name=medium",
        time: "4.20 PM",
        date: "Aug 14",
        location: "London, UK",
        retweets: "76",
        likes: "638",
        replies: [
            {
              name: "janice gregory",
              handle: "@janice1922",
              avatar_url: bbcnews_avatar_url,
              time: "6:20 PM",
              replies: "7",
              retweets: "3",
              likes: "174",
              message: "It would have been a proper surprise had they picked a white male.",
            }
        ]
    },
    {//1559842201110286336
        name: "BBC News",
        handle: "@BBCNews",
        avatar_url: bbcnews_avatar_url,
        scenario: "You read a Twitter user's reply to a BBC News post",
        message: "Police officers violent to women will be dismissed under new guidance",
        image: "https://pbs.twimg.com/card_img/1562265101603729408/I1hsr0J1?format=jpg&name=medium",
        time: "4.20 PM",
        date: "Aug 14",
        location: "London, UK",
        retweets: "76",
        likes: "638",
        replies: [
            {
              name: "David Prime",
              handle: "@prime1959",
              avatar_url: bbcnews_avatar_url,
              time: "6:20 PM",
              replies: "7",
              retweets: "3",
              likes: "174",
              message: "Who would be in the police not allowed to stop people not allowed to defend themselves and not allowed to do their job",
            }
        ]
    },
    {//1558573349516763136
        name: "BBC News",
        handle: "@BBCNews",
        avatar_url: bbcnews_avatar_url,
        scenario: "You read a Twitter user's reply to a BBC News post",
        message: "Climate activists fill golf holes with cement after water ban exemption",
        image: "https://pbs.twimg.com/card_img/1561035660965941248/ckbd92ug?format=jpg&name=medium",
        time: "4.20 PM",
        date: "Aug 14",
        location: "London, UK",
        retweets: "76",
        likes: "638",
        replies: [
            {
              name: "Michael Scotch",
              handle: "@fawltyowls",
              avatar_url: bbcnews_avatar_url,
              time: "6:20 PM",
              replies: "7",
              retweets: "3",
              likes: "174",
              message: "Cement has one of the highest levels of embodied carbon, good job doing your research rich kids",
            }
        ]
    },
    {//1555834950347358209
        name: "BBC News",
        handle: "@BBCNews",
        avatar_url: bbcnews_avatar_url,
        scenario: "You read a Twitter user's reply to a BBC News post",
        message: "Monkeypox: Can we still stop the outbreak?",
        image: "https://pbs.twimg.com/card_img/1560770214798807041/8rVsMWlx?format=jpg&name=medium",
        time: "4.20 PM",
        date: "Aug 14",
        location: "London, UK",
        retweets: "76",
        likes: "638",
        replies: [
            {
              name: "Nicholas Jackson EU citizen 🔶⬛",
              handle: "@npjackson123",
              avatar_url: bbcnews_avatar_url,
              time: "6:20 PM",
              replies: "7",
              retweets: "3",
              likes: "174",
              message: "We haven’t stopped Covid let alone this.",
            }
        ]
    },
]

class TaskComponent extends Component {

    constructor() {
        super();

        updateHateData = this.updateHateData.bind(this);

        var thread_type = platform === 0 ?  "twitter" : "whatsapp" //selects the type of the platform
        // Store the state in local storagge
        thread_type = localStorage.getItem('thread_type') === null ? thread_type : JSON.parse(localStorage.getItem("thread_type"));
        localStorage.setItem("thread_type", JSON.stringify(thread_type));

        localStorage.setItem("result_start", JSON.stringify(result_start));
        let result = localStorage.getItem('result') === null ? JSON.parse(localStorage.getItem('result_start')) : JSON.parse(localStorage.getItem('result'));
        var fontCase = localStorage.getItem('fontCase') === null ? "uppercase" : JSON.parse(localStorage.getItem("fontCase"));
        var setshift = localStorage.getItem('setshift') === null ? true : JSON.parse(localStorage.getItem("setshift"));
        var capsLock = localStorage.getItem('capsLock') === null ? false : JSON.parse(localStorage.getItem("capsLock"));
        var scenario_status = localStorage.getItem('scenario_status') === null ? true : JSON.parse(localStorage.getItem("scenario_status"));
        var GetHateOnSubmit_status = localStorage.getItem('GetHateOnSubmit_status') === null ? false : JSON.parse(localStorage.getItem("GetHateOnSubmit_status"));
        var HateStatus = localStorage.getItem('HateStatus') === null ? "not hate" : JSON.parse(localStorage.getItem("HateStatus"));
        var prob = localStorage.getItem('prob') === null ? 0 : JSON.parse(localStorage.getItem("prob"));
        var insult = localStorage.getItem('insult') === null ? 0 : JSON.parse(localStorage.getItem("insult"));
        var threat = localStorage.getItem('threat') === null ? 0 : JSON.parse(localStorage.getItem("threat"));
        var severe_toxicity = localStorage.getItem('severe_toxicity') === null ? 0 : JSON.parse(localStorage.getItem("severe_toxicity"));
        var identity_attack = localStorage.getItem('identity_attack') === null ? 0 : JSON.parse(localStorage.getItem("identity_attack"));
        var profanity = localStorage.getItem('profanity') === null ? 0 : JSON.parse(localStorage.getItem("profanity"));

        var textBeforeCursor = localStorage.getItem('textBeforeCursor') === null ? "" : JSON.parse(localStorage.getItem("textBeforeCursor"));
        var showHideKeyboard = localStorage.getItem('showHideKeyboard') === null ? false : JSON.parse(localStorage.getItem("showHideKeyboard"));
        let whatsapp_message_completed = localStorage.getItem('whatsapp_message_completed') === null ? whatsapp_message_array_size : JSON.parse(localStorage.getItem('whatsapp_message_completed'));
        let twitter_message_completed = localStorage.getItem('twitter_message_completed') === null ? twitter_message_array_size : JSON.parse(localStorage.getItem('twitter_message_completed'));

        // First round logical: Only split the whatsapp/twitter message arrays if its the first round

        let whatsapp_rand = Math.floor(Math.random() * ((Object.keys(whatsappThreads).length - 1) - 0 + 1)) + 0;
        let twitter_rand = Math.floor(Math.random() * ((Object.keys(twitterThreads).length - 1) - 0 + 1)) + 0;

        if (localStorage.getItem('whatsapp_current_msg') === null || localStorage.getItem('twitter_current_msg') === null) {
            var indx_whatsapp = whatsapp_message_completed.indexOf(whatsapp_rand);
            whatsapp_message_completed.splice(indx_whatsapp, 1);
            var whatsapp_msg_count = 0;
            var whatsapp_current_msg = whatsapp_rand;
            localStorage.setItem("whatsapp_current_msg", JSON.stringify(whatsapp_rand));
            localStorage.setItem("whatsapp_msg_count", JSON.stringify(whatsapp_msg_count));
            localStorage.setItem("whatsapp_message_completed", JSON.stringify(whatsapp_message_completed));

            var indx_twitter = twitter_message_completed.indexOf(twitter_rand);
            twitter_message_completed.splice(indx_twitter, 1);
            var twitter_msg_count = 0;
            var twitter_current_msg = twitter_rand;
            localStorage.setItem("twitter_current_msg", JSON.stringify(twitter_rand));
            localStorage.setItem("twitter_msg_count", JSON.stringify(twitter_msg_count));
            localStorage.setItem("twitter_message_completed", JSON.stringify(twitter_message_completed));
        }

        else {
            var whatsapp_current_msg = JSON.parse(localStorage.getItem("whatsapp_current_msg"));
            whatsapp_message_completed = JSON.parse(localStorage.getItem("whatsapp_message_completed"));
            var whatsapp_msg_count = JSON.parse(localStorage.getItem("whatsapp_msg_count"));
            var twitter_current_msg = JSON.parse(localStorage.getItem("twitter_current_msg"));
            twitter_message_completed = JSON.parse(localStorage.getItem("twitter_message_completed"));
            var twitter_msg_count = JSON.parse(localStorage.getItem("twitter_msg_count"));
        }

        this.state = {
            showHideKeyboard: showHideKeyboard,    //whether the keyboard and suggestions are visible
            highlightedTT: "Tweet",    //Which element (in practice mode) is highlighted/flashing red
            fontCase: fontCase,     //the casing for the keyboard. Can be uppercase, lowercase, numsymb or symbols
            lastImage: false,          //set to true when on the last image to prevent a further cycle and to escape to exit app
            setshift: setshift,            //is the shift key active?
            capsLock: capsLock,           //is capslock on?
            //result: [<li key="cursor" id="cursorId" className='cursor character'> </li>],  //the html result of li's which will always contain at least the cursor
            result: result,
            tutorial: true,            //tutorial/practice mode
            showPU: null,               //show the popup? Whilst anything other than true the popup won't be shown
            charCount: 280,            //the number of characters in the response cannot be more than 280. Changing this number will change this rule
            textBeforeCursor: textBeforeCursor,      //the text before the cursor in string form
            whatsapp_msg_count: whatsapp_msg_count, //store the number of messages that have been completed in whatsapp thread
            whatsapp_thread_finish: false, //  checks if the whatsapp thread is completed
            twitter_msg_count: twitter_msg_count, //store the number of messages that have been completed in twitter thread
            twitter_thread_finish: false, //  checks if the twitter thread is completed
            thread_type: thread_type, // store the type of thread (whatsapp or twitter)
            whatsapp_current_msg: whatsapp_current_msg, // The index number of current message in whatsapp thread
            twitter_current_msg: twitter_current_msg, // The index number of current message in twitter thread
            msg_div_style: null,
            whatsapp_message_completed: whatsapp_message_completed,
            twitter_message_completed: twitter_message_completed,
            //The intervention type can be:
            //0: This means that there will be no intervension
            //1: Banner appears on top of keyboard with abtract message (low Friction)
            //2: Disable keyboard with abstract message for n seconds if hate is detected while typing (high friction)
            //3: Banner appears on top of keyboard with explicit message (low Friction)
            //4: Disable keyboard with explicit message for n seconds if hate is detected while typing (high friction)
            //5: Pop up with abstract message (Low friction)
            //6: Pop up with wait and abstract message (High Friction)
            //7: Pop up with explicit message (Low friction)
            //8: Pop up with wait and explicit message (High Friction)
            interventionType: group,
            HateStatus: HateStatus,// will store the label assigned from the server
            prob: prob, // will store the probability returned by the server
            GetHateOnSubmit_status: GetHateOnSubmit_status,
            scenario_status: scenario_status,
            insult: insult,
            threat: threat,
            severe_toxicity: severe_toxicity,
            identity_attack: identity_attack,
            profanity: profanity


        };

    }


    // this function is designed to set the state of hate probabilities
    updateHateData(type, value) {
        this.setState({
            [type]: value
        })
        localStorage.setItem(type, JSON.stringify(value));
        console.log("Type: " + type + " Value: " + this.state.[type])
    }

    // handles a button tap and calls the correct function
    onKeyPress = (button = "") => {
        switch (button) {
            case "{clear}":
                this.reset();
                break;
            case "{backspace}":
                this.backspace();
                break;
            case "{space}":
                this.enterchar('\xa0');
                break;
            case "{shift}":
                break;
            case "{darkshift}":
                break;
            case "{numbers}": case "{abc}": case "{symbols}": case "{moresymbols}":
                break;
            case "{hideKbd}":
                this.toggleKB(true);
                break;
            case "{enter}":
                this.reset();
                break;
            //if the button value hasn't matched any of the above criteria, enter the value as a new letter
            default:
                this.enterchar(button);
                break;
        }
    }

    //this function handles a tap on a key on the keyboard that results in a new letter/number/special chat
    enterchar = (button) => {
        //each li in the UI requires a unique id for moving the cursor (get the clicked on element and move the cursor there)
        let uniqueID = new Date().getTime();
        //the newResult will become the new response but starts out as the original
        let newResult = this.state.result;
        /*
            The new character entered exists as the below SPAN, where {button} is the value. The onlick value is movecursor, when this LI
            is clicked on the cursor is moved behind it.
         */
        let newChar = <span onClick={() => this.moveCursor(newChar)}
            className="character"
            id={'char-' + uniqueID}>
            {button}
        </span>;
        //add the new letter to newResult

        newResult.splice(this.getCursorPos(), 0, newChar);
        //update the state with the changes developed in this function
        this.setState({
            result: newResult,
            charCount: 281 - newResult.length,
            textBeforeCursor: this.textBeforeCursor(newResult),
            setshift: false
        });
        localStorage.setItem("result", JSON.stringify(this.state.result));
        localStorage.setItem("setshift", JSON.stringify(this.state.setshift));
        localStorage.setItem("textBeforeCursor", JSON.stringify(this.state.textBeforeCursor));
    };

    //this function returns the position of the cursor as an int
    getCursorPos = () => {
        let list = this.state.result;
        for (let i in list) {
            if (list[i].props.id === "cursorId") {
                return parseInt(i);
            }
        }
    };

    //returns the index of an item in an array
    getArrIndex = (item, array) => {
        for (let i in array) {
            if (array[i].props.id === item.props.id) {
                return i;
            }
        }
        return false;
    };

    //returns the text as a string, of the result infront of the cursor
    textBeforeCursor = (resultArr) => {
        let resultString = "";
        for (let i = 0; i < this.getCursorPos(); i++) {
            resultString = resultArr[i].props.children === '\xa0' ? resultString + " " : resultString + resultArr[i].props.children;
        }
        return resultString;
    };

    //function to move the position of the cursor to the position held by a given element
    moveCursor = (elem) => {
        let newResult = this.state.result;
        let newPos = this.getArrIndex(elem, newResult);
        newResult.splice(this.getCursorPos(), 1);
        let cursor = <span id="cursorId" className='cursor character'></span>;
        newResult.splice(newPos, 0, cursor);
        this.setState({
            result: newResult
        });
        localStorage.setItem("result", JSON.stringify(newResult));
    };

    // reset text.before.cursor to refresh text suggestions
    reset = () => {
        this.setState({
            result: [<li id="cursorId" className='cursor character'> </li>],
            textBeforeCursor: ""
        })
        localStorage.setItem("result", JSON.stringify(this.state.result));
    };

    //handles a backsapce
    backspace = () => {
        let cursorPos = this.getCursorPos();
        if (cursorPos === 1) {
            this.setState({
                fontCase: 'uppercase',
                setshift: true,            //is the shift key active?
                capsLock: false           //is capslock on?
            })
            localStorage.setItem("fontCase", JSON.stringify(this.state.fontCase));
            localStorage.setItem("capsLock", JSON.stringify(this.state.capsLock));
            localStorage.setItem("setshift", JSON.stringify(this.state.setshift));
        };
        if (cursorPos !== 0) {
            let result = this.state.result;
            result.splice(cursorPos - 1, 1);
            if (result.length !== 0) {
                this.setState({
                    result: result,
                    charCount: 281 - result.length,
                    textBeforeCursor: this.textBeforeCursor(result),
                });
                localStorage.setItem("result", JSON.stringify(result));
            }
        }
    };

    //toggle the show/hide of the keyboard
    toggleKB = () => {
        if (this.state.showHideKeyboard === true) {
            this.setState({
                showHideKeyboard: !this.state.showHideKeyboard,
            });
            localStorage.setItem("showHideKeyboard", JSON.parse(false));
        }
        else {
            this.setState({
                showHideKeyboard: !this.state.showHideKeyboard,
            });
            localStorage.setItem("showHideKeyboard", JSON.parse(true));
        }
    };

    openKB = () => {
        if (this.state.showHideKeyboard === false) {
            this.toggleKB();
        }
    };

    closeKB = () => {
        if (this.state.showHideKeyboard === true) {
            this.toggleKB();
        }
    };

    //returns the styling for the blue show keyboard button
    kbImageStyle = () => {
        return this.state.showHideKeyboard ? ' hide' : '';
    };

    kbButtonStyle = () => {
        return this.state.showHideKeyboard ? ' kbhide' : ' revealKB';
    };

    //function to hide the toolTip PopUp
    Hide_Tool_Tip = () => {
        this.setState({
            showPU: false
        });
    };

    hide_GetHateOnSubmit = () => {
        this.setState({
            GetHateOnSubmit_status: false
        });
        localStorage.setItem("GetHateOnSubmit_status", JSON.stringify(false));
    }

    hide_scenario = () => {
        this.setState({
            scenario_status: false,
        });
        localStorage.setItem("scenario_status", JSON.stringify(false));

    }
    // This function gets the toxicity score from the API
    getToxicity = async (comment) => {
        let hate_status_from_server;
        await axios.post(API_URL, {
            // below is the required input for the perspective API
            comment: {
                text: comment,
            },
            languages: ["en"],
            requestedAttributes: {
                TOXICITY: {},
                INSULT: {},
                THREAT: {},
                SEVERE_TOXICITY: {},
                IDENTITY_ATTACK: {},
                PROFANITY: {}

            }
        })
            // axios uses.then() to read the response into a variable (here that's names response)
            .then(response => {
                // the atributescores inside the response are read into intends (i.e. toxicity, insult, threat)
                const intents = response.data.attributeScores;
                updateHateData('prob', intents['TOXICITY'].summaryScore.value)
                updateHateData('insult', intents['INSULT'].summaryScore.value)
                updateHateData('threat', intents['THREAT'].summaryScore.value)
                updateHateData('severe_toxicity', intents['SEVERE_TOXICITY'].summaryScore.value)
                updateHateData('identity_attack', intents['IDENTITY_ATTACK'].summaryScore.value)
                updateHateData('profanity', intents['PROFANITY'].summaryScore.value)
                updateHateData('HateStatus', (TOXICITY_THRESHOLD - intents['TOXICITY'].summaryScore.value) < 0 ? "hate" : "not hate")
            })
            .catch((error) => {
                // The perspective request failed, put some defensive logic here!
                console.log(error);
            });

        let uniqueID = new Date().getTime(); //generate a unique id and logs the state on server
        postLog({
            "timestamp": uniqueID,
            "eventID": 2,
            "eventType": "hate-monitor",
            "groupID": group,
            "userID": id,
            "message": this.props.textBeforeCursor,
            "toxic": this.state.HateStatus === "hate" ? 1 : 0,
            "probability": this.state.prob,
            "platform": this.props.platform,
            "stimuli": this.state.thread_type === "whatsapp" ? this.state.whatsapp_current_msg : this.state.twitter_current_msg,
            "insult_prob": this.state.insult,
            "threat_prob": this.state.threat,
            "severetoxicity_prob": this.state.severe_toxicity,
            "identityattack_prob": this.state.identity_attack,
            "profanity_prob": this.state.profanity
        }).then(x => {
            console.log("Log: " + this.state.HateStatus + " detected");
        })
    };
    //function handles submitting a response
    submitResponse = async (force) => {

        let textResponse = this.state.result;
        let chars = "";
        //loop through the response, each time extracting the children (character) adding to 'chars'
        for (let i in textResponse) {
            if (!textResponse[i].props.children) continue;
            if (textResponse[i].props.children !== "\xa0") {
                chars += textResponse[i].props.children;
            } else { // MATT: Added this
                chars += " ";
            }
        }
        //format the characters by making it all lower case and removing spaces - this is only used in the practice round
        let formatchars = chars.toLowerCase();
        //formatchars = formatchars.replace("\xa0", "");
        formatchars = formatchars.replace(" ", "").trim(); // MATT: Added this
        //for the logging...
        let eventType = this.props.practice ? "submit-practice" : "submit-response";
        //dont let the response be submitted if its empty
        if (textResponse.length === 1) {
            this.setState({
                //show a popup informing the user
                showPU: true,
                highlightedTT: "No response",

            });
            //kill the function with a null return
            return null;
        }
        //dont let the response be submitted if its too long
        if (textResponse.length > 281 && force === false) {
            this.setState({
                //show a popup informing the user
                showPU: true,
                highlightedTT: "Over Char Limit",

            });
            //kill the function with a null return
            return null;
        }
        // only run when not forcing submit
        if (force == false) {
            if (this.state.interventionType >= 5 && this.state.interventionType <= 8) {
                await this.getToxicity(this.state.textBeforeCursor);
                if (this.state.HateStatus === "hate") {
                    this.setState({
                        GetHateOnSubmit_status: true,
                    });
                    localStorage.setItem("GetHateOnSubmit_status", JSON.stringify(true));
                    // Log that the intervention was triggered
                    let uniqueID = new Date().getTime();
                    postLog({
                        "timestamp": uniqueID,
                        "eventID": 3,
                        "eventType": "intervention",
                        "groupID": group,
                        "userID": id,
                        "message": this.state.textBeforeCursor,
                        "toxic": this.state.HateStatus === "hate" ? 1 : 0,
                        "probability": this.state.prob,
                        "platform": this.props.platform,
                        "stimuli": this.state.thread_type === "whatsapp" ? this.state.whatsapp_current_msg : this.state.twitter_current_msg,
                        "insult_prob": this.state.insult,
                        "threat_prob": this.state.threat,
                        "severetoxicity_prob": this.state.severe_toxicity,
                        "identityattack_prob": this.state.identity_attack,
                        "profanity_prob": this.state.profanity
                    }).then(x => {
                        console.log("Log: Hate Detected:");
                    })

                    //kill the function with a null return

                    return null;
                }
            }
        }
        // check to make sure the response isn't empty
        if (formatchars !== "" || force === true) {
            //send the response to the log
            await this.getToxicity(this.state.textBeforeCursor);
            let uniqueID = new Date().getTime();
            postLog({
                "timestamp": uniqueID,
                "eventID": 2,
                "eventType": eventType,
                "groupID": group,
                "userID": id,
                "message": this.state.textBeforeCursor,
                "toxic": this.state.HateStatus === "hate" ? 1 : 0,
                "probability": this.state.prob,
                "platform": this.props.platform,
                "stimuli": this.state.thread_type === "whatsapp" ? this.state.whatsapp_current_msg : this.state.twitter_current_msg,
                "insult_prob": this.state.insult,
                "threat_prob": this.state.threat,
                "severetoxicity_prob": this.state.severe_toxicity,
                "identityattack_prob": this.state.identity_attack,
                "profanity_prob": this.state.profanity
            }).then(x => {
                console.log("Log: Posted (sent)");
                //reset the response result
                this.reset();
                //show the confirmation of the submission
                this.showSubmitted();
                //wait 1500ms then hide the confirmation then change the image and hide the keyboard
                setTimeout(

                    function () {
                        //check if all the messages in twitter and whatsapp thread are completed
                        if (this.state.whatsapp_msg_count === (Object.keys(whatsappThreads).length - 1) && this.state.twitter_msg_count === (Object.keys(twitterThreads).length - 1)) {
                            //redirect to exit link
                            this.props.history.push('/exit')
                        }
                        else if (this.state.thread_type === "whatsapp") {
                            //check if all the messages in the whatsapp thread are already displayed
                            if (this.state.whatsapp_msg_count === (Object.keys(whatsappThreads).length - 1)) {
                                console.log("***************************WA msg count is finished : " + this.state.whatsapp_msg_count);
                                if (this.state.twitter_msg_count === 0) {
                                    //change the type of thread
                                    this.setState({
                                        GetHateOnSubmit_status: false,
                                        thread_type: "twitter",
                                    });
                                    this.toggleKB();
                                    localStorage.setItem("thread_type", JSON.stringify(this.state.thread_type));
                                    localStorage.setItem("GetHateOnSubmit_status", JSON.stringify(false));

                                }
                            }
                            else {

                                console.log("***************************WA msg count is : " + this.state.whatsapp_msg_count);
                                //generate a random index and increment the whatsapp message count
                                this.Generate_RandomIndex_whatsapp();
                                this.setState({
                                    GetHateOnSubmit_status: false,
                                    whatsapp_msg_count: this.state.whatsapp_msg_count + 1,
                                });
                                this.toggleKB();
                                localStorage.setItem("whatsapp_msg_count", JSON.stringify(this.state.whatsapp_msg_count));
                                localStorage.setItem("GetHateOnSubmit_status", JSON.stringify(false));
                            }
                        }
                        else {
                            //check if all the messages in the twitter thread are already displayed
                            if (this.state.twitter_msg_count === (Object.keys(twitterThreads).length - 1)) {
                                if (this.state.whatsapp_msg_count === 0) {
                                    //change the type of thread
                                    this.setState({
                                        GetHateOnSubmit_status: false,
                                        thread_type: "whatsapp",
                                    });
                                    this.toggleKB();
                                    localStorage.setItem("thread_type", JSON.stringify(this.state.thread_type));
                                    localStorage.setItem("GetHateOnSubmit_status", JSON.stringify(false));

                                }
                            }
                            else {
                                //generate a random index and increment the twitter message count
                                this.Generate_RandomIndex_twitter();
                                this.setState({
                                    GetHateOnSubmit_status: false,
                                    twitter_msg_count: this.state.twitter_msg_count + 1,
                                });
                                this.toggleKB();
                                localStorage.setItem("twitter_msg_count", JSON.stringify(this.state.twitter_msg_count));
                                localStorage.setItem("GetHateOnSubmit_status", JSON.stringify(false));
                            }
                        }
                    }
                        .bind(this),
                    0
                );
            });

        }
        else {
            //if they did type nothing show a popup to warn the user
            this.setState({
                GetHateOnSubmit_status: false,
                showPU: true,
                highlightedTT: "No response",
            })
            localStorage.setItem("GetHateOnSubmit_status", JSON.stringify(false));
        }
    };
    //show the submitted response confirmation
    showSubmitted = () => {
        this.setState({
            charCount: 280,
            fontCase: "uppercase",     //the casing for the keyboard. Can be uppercase, lowercase, numsymb or symbols
            setshift: true,            //is the shift key active?
            capsLock: false,           //is capslock on?
            scenario_status: true,
            HateStatus: "not hate",
            textBeforeCursor: " "
        });

        localStorage.setItem("fontCase", JSON.stringify(this.state.fontCase));
        localStorage.setItem("capsLock", JSON.stringify(this.state.capsLock));
        localStorage.setItem("setshift", JSON.stringify(this.state.setshift));
        localStorage.setItem("scenario_status", JSON.stringify(this.state.setshift));
        localStorage.setItem("HateStatus", JSON.stringify(this.state.HateStatus));
        localStorage.setItem("textBeforeCursor", JSON.stringify(this.state.textBeforeCursor));
    };
    Generate_RandomIndex_whatsapp = () => {
        //if there is only one message left in the whatsapp thread, then there is no need for random index generation
        if (this.state.whatsapp_message_completed.length == 1) {
            this.setState({
                whatsapp_current_msg: this.state.whatsapp_message_completed[0]
            });
            localStorage.setItem("whatsapp_current_msg", JSON.stringify(this.state.whatsapp_current_msg));
        }
        else {
            //generate a random number b/w 0 and the number of total messages in the whatsapp thread
            let minimum = 0;
            let maximum = (Object.keys(whatsappThreads).length - 1);
            let randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
            //make sure that the generated number is not already used. If so, keep on generating a random number
            while (this.state.whatsapp_message_completed.includes(randomnumber) === false) {
                randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
            }
            var index = this.state.whatsapp_message_completed.indexOf(randomnumber);
            //remove the generated random number from the whatsapp completed messages array and update the local storage
            if (index !== -1) {
                this.state.whatsapp_message_completed.splice(index, 1)
                localStorage.setItem("whatsapp_message_completed", JSON.stringify(this.state.whatsapp_message_completed));
            }
            this.setState({
                whatsapp_current_msg: randomnumber
            });
            localStorage.setItem("whatsapp_current_msg", JSON.stringify(this.state.whatsapp_current_msg));
        }
    }
    Generate_RandomIndex_twitter = () => {
        //if there is only one message left in the twitter thread, then there is no need for random index generation
        if (this.state.twitter_message_completed.length == 1) {
            this.setState({
                twitter_current_msg: this.state.twitter_message_completed[0]
            });
            localStorage.setItem("twitter_current_msg", JSON.stringify(this.state.twitter_current_msg));
        }
        else {
            //generate a random number b/w 0 and the number of total messages in the twitter thread
            let minimum = 0;
            let maximum = (Object.keys(twitterThreads).length - 1);
            let randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
            //make sure that the generated number is not already used. If so, keep on generating a random number
            while (this.state.twitter_message_completed.includes(randomnumber) === false) {
                randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
            }
            var index = this.state.twitter_message_completed.indexOf(randomnumber);
            //remove the generated random number from the whatsapp completed messages array and update the local storage
            if (index !== -1) {
                this.state.twitter_message_completed.splice(index, 1);
                localStorage.setItem("twitter_message_completed", JSON.stringify(this.state.twitter_message_completed));
            }
            this.setState({
                twitter_current_msg: randomnumber
            });
            localStorage.setItem("twitter_current_msg", JSON.stringify(this.state.twitter_current_msg));
        }
    }
    //get the text for the button in the popup
    getBtnText = () => {
        switch (this.state.highlightedTT) {
            case "No response" || "Over Char Limit":
                return "Okay, try again";
            case "Hate Speech":
                return "Revise (Edit)";
            default:
                return "Next";
        }
    };

    render() {

        document.addEventListener('gesturestart', function (e) {
            e.preventDefault();
        });
        document.addEventListener('touchmove', function (event) {
            event = event.originalEvent || event;
            if (event.scale > 1) {
                event.preventDefault();
            }
        }, false);
        //returns the class name for a given component
        function getStyle(component, img) {
            if (img) {
                return "SMImage";
            }
            else {
                return component;
            }


        }
        //toggle the popup
        function showHidePopup(showhide) {
            if (showhide) {
                return ""
            }
            else {
                return "hide"
            }
        }
        //returns the position of the popup on the UI
        function getToolTipPosition(state) {
            return { bottom: '50%', left: '5vw' };
        }
        //returns the text for the popup based on a given value
        function getToolTipText(state) {
            switch (state.highlightedTT) {
                case "Over Char Limit":
                    return "It looks like you have exceeded the 280 character limit. Please keep your response below this length";
                case "No response":
                    return "Please enter a response.";
            }
        }
        function getProb() { //returns the toxicity score
            return this.state.prob;
        }
        // select background style for the threads
        if (this.state.thread_type === "whatsapp") {
            document.body.style.background = '#efe7dd url("https://cloud.githubusercontent.com/assets/398893/15136779/4e765036-1639-11e6-9201-67e728e86f39.jpg") repeat fixed';
        }
        else {
            document.body.style.background = '';
            document.body.style.backgroundColor = 'white';
        }
        //the chat bubble image on the reply button
        const messageImg = {
            backgroundImage: "URL('Images/message.png')"
        };
        // Same for all groups
        const textRec = <TextRecComponent
            classNameProp={getStyle("TextRec")}
            showHide={this.state.showHideKeyboard}
            result={this.state.result}
            textBeforeCursor={this.state.textBeforeCursor}
            id={selectedIndex + 1}

        />;
        // get the hate for the inputted text
        const getHate = <GetHateTyping
            classNameProp={getStyle("getHate")}
            HateStatus={this.state.HateStatus}
            textBeforeCursor={this.state.textBeforeCursor}
            showHide={this.state.showHideKeyboard}
            platform={this.state.thread_type}
            stimuli={this.state.thread_type === "whatsapp" ? this.state.whatsapp_current_msg : this.state.twitter_current_msg}
            updateHateData = {updateHateData.bind(this)}
            getToxicity={() => { this.getToxicity(this.state.textBeforeCursor)}}

        />;

        const getWhatsApp = <WhatsappComp
            thread={whatsappThreads[this.state.whatsapp_current_msg]}
            showHideKeyboard={this.state.showHideKeyboard}
            HateStatus={this.state.HateStatus}
            openKB={() => { this.closeKB()}}
        />

        const getTwitter = <TwitterComp
            thread={twitterThreads[this.state.twitter_current_msg]}
            showHideKeyboard={this.state.showHideKeyboard}
            HateStatus={this.state.HateStatus}
        />
        //based on the value of thread_type, select the component which will be rendered
        let RenderThread;
        if (this.state.thread_type === "whatsapp") {
            RenderThread = getWhatsApp;
        }
        else if (this.state.thread_type === "twitter") {
            RenderThread = getTwitter;
        }

        return (
            <div>
                <div className={this.state.msg_div_style}>
                    {RenderThread}
                </div>
                <div className="keyBoardComponentWrapper">
                    <div className="fix-bottom">
                        <TextBoxComponent classNameProp={getStyle("TextBox")}
                            showHide={this.state.showHideKeyboard}
                            thread_type={this.state.thread_type}
                            openKB={this.openKB}
                            result={this.state.result}
                            submit={() => { this.submitResponse(false) }}
                            lastImage={false}
                            charCount={this.state.charCount}
                        />
                        {showTextRec ? textRec : null}
                        {showHate ? getHate : null}
                        <div className={`keyboardWrapper ${isIOS ? 'ios-kbd' : 'android-kbd'}`}>
                            <KeyboardComponent classNameProp={getStyle("KeyPad")}
                                hideKBStyle={this.state.highlightedTT === "hg-button-hideKbd" ? 'toolTip' : ''}
                                showHide={this.state.showHideKeyboard}
                                history={this.props.history}
                                result={this.state.result}
                                doubleT={this.handleDoubleTap}
                                setshift={this.state.setshift}
                                capsLock={this.state.capsLock}
                                fontCase={this.state.fontCase}
                                onKeyPress={this.onKeyPress}
                            />
                        </div>
                    </div>
                </div>
                {/*<div className="spacer_bottom"></div> */}
                {this.state.thread_type === "twitter" ? <div id="openKB" onClick={() => { this.toggleKB(true) }}
                    className={getStyle("replyBtn", false) + this.kbButtonStyle()}
                    style={messageImg} /> : null}
                <ToolTipPopUp
                    interven={this.state.interventionType}
                    classNameProp={showHidePopup(this.state.showPU)}
                    reponse_type={() => { this.submitResponse(true) }}
                    nextAction={() => { this.Hide_Tool_Tip() }}
                    position={getToolTipPosition(this.state)}
                    hate_status={this.state.HateStatus}
                    text={getToolTipText(this.state)}
                    pu={this.state.showPU}
                    btntext={this.getBtnText()} />
                <Scenario
                    scenario_status={this.state.scenario_status}
                    hide_scenario={() => { this.hide_scenario() }}
                    scenario={this.state.thread_type === "whatsapp" ? whatsappThreads[this.state.whatsapp_current_msg].scenario : twitterThreads[this.state.twitter_current_msg].scenario} />
                <GetHateOnSubmit
                    interventionType={this.state.interventionType}
                    classNameProp={showHidePopup(this.state.GetHateOnSubmit_status)}
                    reponse_type={() => { this.submitResponse(true) }}
                    nextAction={() => { this.hide_GetHateOnSubmit() }}
                    message={this.state.textBeforeCursor}
                    hate_status={this.state.HateStatus}
                    pu={this.state.GetHateOnSubmit_status}
                    prob={this.state.prob}
                    insult={this.state.insult}
                    threat={this.state.threat}
                    severe_toxicity={this.state.severe_toxicity}
                    identity_attack={this.state.identity_attack}
                    profanity={this.state.profanity}
                    btntext={this.getBtnText()} />
            </div>
        );
    }
}
export default TaskComponent;
