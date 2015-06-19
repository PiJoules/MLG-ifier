
// Globals

// only perform certain actions once
// keep track of if performed by adding a unique element to the dom
var MLGchecker = "xXx_mlg_checker_xXx";

var images, sounds;
var initRandSoundID;

// Globals for fedora loop
var mouseX, mouseY;
var fedoras, velocities;
var isRainingFedoras;
var fedoraCreationInterval, fedoraAnimationInterval;

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


// Attempt to load settings from chrome storage
chrome.storage.sync.get(["customSettings", "images", "sounds"], function(items){
    customSettings = items.customSettings;
    images = items.images;
    sounds = items.sounds;

    if(!customSettings || typeof images == "undefined" || typeof sounds == "undefined"){
        console.log("Loading defaults");
        // Settings not in storage, load and save defaults
        $.getJSON(chrome.extension.getURL("settings.json"), function(data){
            // Can't mlg-ify until json is loaded, so call mlg-iifier in getJSON callback
            images = data.images;
            sounds = data.sounds;

            // Save default muh-mays
            var settings = {};
            // Create dictionary to save in chrome settings
            for (var i = 0; i < images.length; i++) {
                settings[images[i]] = chrome.extension.getURL("muh_mays/" + images[i]);
            }
            chrome.storage.sync.set(settings, function(){
                // Only mlg-ify webpage once
                if ($("#xXx_mlg_checker_xXx").length === 0){
                    // add the mlg checker
                    $("body").append("<div id='xXx_mlg_checker_xXx'></div>");
                    mlg_ify();
                }

                doSomethingDank();
            });
        });
    }
    else{
        console.log("Loaded from chrome settings");
        // Only mlg-ify webpage once
        if ($("#xXx_mlg_checker_xXx").length === 0){
            // add the mlg checker
            $("body").append("<div id='xXx_mlg_checker_xXx'></div>");
            mlg_ify();
        }

        doSomethingDank();    
    }
});

// +420% dankness to text, images, event listeners, and window intervals
function mlg_ify(){
    Array.prototype.forEach.call(document.images, function(element, index, array){
        var h = element.height;
        getResource(getRandomElement(images), function(randImg){
            element.setAttribute("src", randImg)
            element.style.height = h;
            element.style.width = "auto";
        });
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

    initRandSoundID = "initSound";
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

    // Initialize fedora tracker
    mouseX = 0;
    mouseY = 0;
    fedoras = [];
    velocities = [];
    isRainingFedoras = false;
}

// MLG-ifier callback for every time fedora is clicked (can be called more than once)
function doSomethingDank(){
    // Audio tag for playing sound
    var randSound = getRandomElement(sounds);
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
    getResource(getRandomElement(images), function(img){
        $("body").css({
            "background-image": img,
            "background-size": "cover",
            "background-position": "center"
        });
    });

    // Release the fedoras m'lady (if they're not already raining)
    if(!isRainingFedoras){
        fedoraStorm();
    }
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
    for(node = node.firstChild; node; node = node.nextSibling){
        if(node.nodeType == 3) // If it is a text node
            all.push(node);
        else{
            if(node.nodeName != "SCRIPT" && node.nodeName != "STYLE"){
                all = all.concat(textNodesUnder(node));
            }
        }
    }
    return all;
}

function fedoraCreationLoop(){
    // Create new fedora at mouse location
    var fedora = document.createElement("img");
    var url = chrome.extension.getURL("images/fedora.png");
    fedora.setAttribute("class", "fedora");
    fedora.setAttribute("src", url);
    fedora.setAttribute("style", "position:absolute");
    document.body.appendChild(fedora);
    fedora.style.zIndex = 99999999; // 3 high 5 u
    fedora.style.left = mouseX - fedora.clientWidth/2 + "px";
    fedora.style.top = mouseY - fedora.clientHeight/2 + "px";
    fedoras.push(fedora);

    // Give it a random direction of travel
    angle = 2*Math.PI*Math.random();
    dx = 20*Math.cos(angle);
    dy = 20*Math.sin(angle);
    velocities.push([dx, dy]);
}

function fedoraAnimationLoop(){
    // Move all fedoras
    for (var i = 0; i < fedoras.length; i++){
        // Remove if outside of window
        var rect = fedoras[i].getBoundingClientRect();
        if(rect.right < 0 || rect.bottom < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight){
            document.body.removeChild(fedoras[i]);
            fedoras.splice(i, 1);
            velocities.splice(i, 1);
            i--;
            continue;
        }
        fedoras[i].style.left = Math.round(parseInt(fedoras[i].style.left) + velocities[i][0]) + "px";
        fedoras[i].style.top = Math.round(parseInt(fedoras[i].style.top) + velocities[i][1]) + "px";
    }
}

// Creates the fedora storm
function fedoraStorm(){
    isRainingFedoras = true;
    // Create listener to track mouse position
    document.onmousemove = function(e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
    }

    // Add fedoras while storm is active
    fedoraCreationInterval = window.setInterval(fedoraCreationLoop, 50);
    fedoraAnimationInterval = window.setInterval(fedoraAnimationLoop, 20);
    
    // Stop fedora storm after 10 seconds
    setTimeout(function() {
        console.log("Timed out");
        window.clearInterval(fedoraCreationInterval);
        window.clearInterval(fedoraAnimationInterval);

        // Clean up any remaining fedoras
        $(".fedora").remove();
        fedoras = [];
        velocities = [];
        isRainingFedoras = false;
    } , 10000);
}

// Get image/sound from chrome storage
function getResource(resourceName, callback){
    chrome.storage.sync.get(resourceName, function(items){
        callback(items[resourceName]);
    });
}