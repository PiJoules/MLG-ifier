



// only perform certain actions once
// keep track of if perfomred by adding a unique element to the dom
var MLGchecker = "xXx_mlg_checker_xXx";

// Replace sources of all images
var images = [
	"http://i.imgur.com/spEe2uf.jpg",
	"http://i.imgur.com/hsGl9J0.png",
	"http://i.imgur.com/SoE7jVi.jpg",
	"http://i.imgur.com/reZXpqs.jpg",
	"http://i.imgur.com/8EHkaox.jpg",
	"http://i.imgur.com/ymU48Db.gif",
	"http://puu.sh/3ObVc.gif",
	"http://puu.sh/41mIF.gif",
	"http://puu.sh/41mMg.gif",
	"http://puu.sh/41mP0.gif",
	"http://puu.sh/41mQ5.gif",
	"http://i.imgur.com/n41tcFI.gif",
	"http://i.imgur.com/e9unmW9.png",
	"http://s3-ec.buzzfed.com/static/enhanced/webdr06/2013/6/12/10/enhanced-buzz-16022-1371047559-13.jpg",
	"http://i.imgur.com/oTxFnjp.png",
	"http://i.imgur.com/nC9Sluu.gif",
	"http://i.imgur.com/b87y0Vp.gif",
	"http://i.imgur.com/QNy5cAF.png",
	"http://i.imgur.com/op9PWrr.gif",
	"http://i.imgur.com/5Ro9KS9.gif?1",
	"http://i.imgur.com/6tzgjkR.png",
	"http://i.imgur.com/Sm86W97.png?1",
    "http://i.ytimg.com/vi/N7W_ilTM1_w/maxresdefault.jpg",
    "http://i.imgur.com/t4vrAy0.png",
    "http://i.imgur.com/cmsXNAK.jpg",
    "http://i.imgur.com/lnQKKNY.gif",
    "http://i.imgur.com/1Fa8BPq.jpg",
    "http://i.imgur.com/s2RN7HK.jpg",
    "http://i.imgur.com/3Cn6ug0.png",
    "http://files.gamebanana.com/img/ico/sprays/538acd5a7838b.gif" // the sanic one
];

var sounds = [
    "airhorn.mp3",
    "If You Know What I Mean.m4a",
    "DAMN SON WHERED YOU FIND THIS.mp3",
    "Oh Baby A Triple.mp3",
    "SMOKE WEEK EVERYDAY.mp3",
    "SANIC.mp3"
];

/*
"Autumn Blaze" colors (straignt from http://www.colourlovers.com/palette/2996458/autumn_blaze)
Sam Loomis (whiteish): F9F7F6
Vanilla Scoop (skin colorish): FBF5D7
run in the sun (yellow orange ish): FFDD49
Cheddar Please (orangeish): FCBD49
light green weed: 7ABA71
*/
var weedColors = [
    [249,247,246],
    [251,245,215],
    [255,221,73],
    [252,189,73],
    [122,186,113]
];


// word replacements
// Penn Treebank POS tags: https://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html
var treeBank = {
	/* Adjectives */ "JJ": ["dank", "MLG", "euphoric", "( ͡° ͜ʖ ͡°)", "bestselling"],
	/* Adjective, comparative */ "JJR": ["danker", "more MLG", "( ͡° ͜ʖ ͡°)"],
	/* Adjective, superlative */ "JJS": ["dankinest", "MLG-inest", "( ͡° ͜ʖ ͡°)"],
	/* Noun, singular */ "NN": ["dankineer", "pineapple", "Gurl", "m8", "m9", "m80", "parody", "subreddit", "meme", "scrub", "mountain dew", "weed", "blunt", "ebola", "fedora", "trilby", "9/11", "( ͡° ͜ʖ ͡°)", "johnbob", "9gag", "9gagger"],
	/* Noun, plural */ "NNS": ["dankineers", "pineapples", "Gurlz", "m80s", "m89s", "memes", "scrubs", "doritos", "jimmies", "trilbies", "( ͡° ͜ʖ ͡°)", "johbobs", "9gaggers"],
	/* Proper noun, singular */ "NNP": ["Sp00nr", "Reddit", "Le Reddit Armie", "Snipars", "Vagabonds", "M'lady", "Good Sir", "9/11", "( ͡° ͜ʖ ͡°)", "Milton Dew", "Megatokyo", "Rush Limbaugh"],
	/* Verb, past tense */ "VBD": ["rekt", "upboated", "rekm8ed", "rustled", "( ͡° ͜ʖ ͡°)", "robbled", "flustered"],
	/* Verb, non-3rd person singular present */ "VBP": ["transl8", "feel", "upboat", "upvote", "rip", "rekm8", "rustle", "( ͡° ͜ʖ ͡°)", "robble", "fluster"],
	/* Verb, 3rd person singular present */ "VBZ": ["rekts", "upboats", "rustles", "( ͡° ͜ʖ ͡°)", "robbles", "flusters"]
};


// Only perform these actions once
if ($("#xXx_mlg_checker_xXx").length === 0){
    $("img:not(#sanic2fast)").each(function(){
        $(this).attr("src", getRandomElement(images)).attr("height","").css("height","auto");
    });
    
    // Get all text nodes on the page and increase the dankness of the text
    var textNodes = textNodesUnder(document.documentElement);
    for (var nodeNum = 0; nodeNum < textNodes.length; nodeNum++) {
        var text = textNodes[nodeNum].nodeValue;
        var words = new Lexer().lex(text);
        var taggedWords = new POSTagger().tag(words);
        for (var i in taggedWords) {
            var taggedWord = taggedWords[i];
            var word = taggedWord[0];
            var tag = taggedWord[1];

            // 50% chance of changing each word
            if (tag in treeBank && Math.random() < 0.5){
                if (Math.random() < 0.1){
                    text = text.replace(word, "xXx_" + word + "_xXx");
                }
                else {
                    var randWord = getRandomElement(treeBank[tag]);

                    // 5% (0.5*0.1) chance of adding xXx_word_xXx to noun
                    if (tag === "NN" || tag === "NNS" || tag === "NNP"){
                        if (Math.random() < 0.05){
                            randWord = "xXx_" + randWord + "_xXx";
                        }
                    }
                    text = text.replace(word, randWord);
                }
            }
        }
    
        text = ayylmao(text);

        textNodes[nodeNum].nodeValue = text;
    }
    
    /* ( ͡° ͜ʖ ͡°) MLG event handling */
    /* "oi u cheeky cunt 1v1 me" --skrillex */
    document.addEventListener("click", function(evt) {
        evt = (evt || event);
        mark(evt.clientX, evt.clientY);
        causeSeizure();
    });

    window.addEventListener("scroll", function(evt) {
        /* rate limit for smooth scrolling */
        if (Date.now() - scrollTime < 50) return;
        scrollTime = Date.now();
        hornAudio.pause();
        hornAudio.currentTime = 0;
        hornAudio.play();
        intensifyScrolling();
    });

    window.addEventListener("contextmenu", function(evt) {
        damnAudio.pause();
        damnAudio.currentTime = 0;
        damnAudio.play();    
        causeSeizure();
    });

    /* ( ͡° ͜ʖ ͡°) MLG copy-and-paste solutions from the internet */
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = "* { font-family: \"Comic Sans MS\" !important; }";
    document.body.appendChild(css);
}


function addSound(id, src){
    if ($("#" + id).length)
        changeSound(id,src)
    else
        $("body").append('<audio id="' + id + '" src="' + src + '" preload="auto"></audio>');
}

function removeSound(id){
    $("#" + id).remove();
}

function playSound(id){
    $('#' + id)[0].play();
}

function changeSound(id, sound){
    $("#" + id).attr("src", sound);
}

function getRandomElement(items){
	return items[Math.floor(Math.random()*items.length)];
}

function runSanic(){
    $("#sanic2fast").animate({left: $(window).width()}, 2000, "linear", function(){
        $("#sanic2fast").css("left","-256px");
    });
}

function ayylmao(text){
    // Replace "ay" with ayy lmao
    var lines = text.split(/[ ]+/); // Split on spaces
    for (i = 0; i < lines.length; i++) { 
        var word = lines[i];
        if (word.length > 2 && word.substring(word.length-2, word.length)=="ay") {
            word = word + "y lmao";
            text = text.replace(lines[i], word);
        }
    }
    return text;
}

function textNodesUnder(node){
    // Shamelessly stolen from stack overflow
    var all = [];
    for (node = node.firstChild; node; node = node.nextSibling) {
        if (node.nodeType == 3) // If it is a text node
            all.push(node);
        else
            all = all.concat(textNodesUnder(node));
    }
    return all;
}

// Audio tag for playing sound
var randSound = getRandomElement(sounds);
var initRandSoundID = "initSound";
if (typeof chrome.extension !== "undefined")
    addSound(initRandSoundID, chrome.extension.getURL('sounds/' + randSound));
else
    addSound(initRandSoundID, 'sounds/' + randSound);
playSound(initRandSoundID);

if (!$("#sanic2fast").length)
    $("body").append("<img id='sanic2fast' src='http://files.gamebanana.com/img/ico/sprays/538acd5a7838b.gif' />");

$("#sanic2fast").css({
    "position": "fixed",
    "top": "calc(50% - 128px)",
    "left": "-256px",
    "z-index": "10000000"
});

if (randSound === "SANIC.mp3"){
    runSanic();
}


// Change background image of body
$("body").css({
	"background-image": getRandomElement(images),
	"background-size": "cover",
	"background-position": "center"
});

window.setInterval(function(){
	// 1% chance of playing random sound every 5 seconds
	if (Math.random() < 0.01){
        var nextRandSound = getRandomElement(sounds);
        if (typeof chrome.extension !== "undefined")
            changeSound(initRandSoundID, chrome.extension.getURL('sounds/' + nextRandSound));
        else
            changeSound(initRandSoundID, 'sounds/' + nextRandSound);
		playSound(initRandSoundID);
        
        if (nextRandSound === "SANIC.mp3"){
            runSanic();
        }
	}
}, 5000);


// add the mlg checker
if ($("#xXx_mlg_checker_xXx").length === 0)
    $("body").append("<div id='xXx_mlg_checker_xXx'></div>");

