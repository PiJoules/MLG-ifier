// Edit the html of the page

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
	"https://raw.githubusercontent.com/PiJoules/John-s-Facebook/master/images/johns%20family.png",
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
    "http://i.imgur.com/3Cn6ug0.png"
];
$("img").each(function(){
	$(this).attr("src", getRandomElement(images)).attr("height","").css("height","auto");
});


// word replacements
// Penn Treebank POS tags: https://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html
var treeBank = {
	/* Adjectives */ "JJ": ["dank", "MLG", "euphoric", "( ͡° ͜ʖ ͡°)", "bestselling"],
	/* Adjective, comparative */ "JJR": ["danker", "more MLG", "( ͡° ͜ʖ ͡°)"],
	/* Adjective, superlative */ "JJS": ["dankinest", "MLG-inest", "( ͡° ͜ʖ ͡°)"],
	/* Noun, singular */ "NN": ["dankineer", "pineapple", "Gurl", "m8", "m9", "m80", "parody", "subreddit", "meme", "scrub", "mountain dew", "weed", "blunt", "ebola", "fedora", "trilby", "9/11", "( ͡° ͜ʖ ͡°)", "johnbob", "9gag", "9gagger"],
	/* Noun, plural */ "NNS": ["dankineers", "pineapples", "Gurlz", "m80s", "m89s", "memes", "scrubs", "doritos", "jimmies", "trilbies", "( ͡° ͜ʖ ͡°)", "johbobs", "9gaggers"],
	/* Proper noun, singular */ "NNP": ["Sp00nr", "Reddit", "Le Reddit Armie", "Snipars", "Vagabonds", "M'lady", "Good Sir", "9/11", "( ͡° ͜ʖ ͡°)", "Milton Dew"],
	/* Verb, past tense */ "VBD": ["rekt", "upboated", "rekm8ed", "rustled", "( ͡° ͜ʖ ͡°)", "robbled", "flustered"],
	/* Verb, non-3rd person singular present */ "VBP": ["transl8", "feel", "upboat", "upvote", "rip", "rekm8", "rustle", "( ͡° ͜ʖ ͡°)", "robble", "fluster"],
	/* Verb, 3rd person singular present */ "VBZ": ["rekts", "upboats", "rustles", "( ͡° ͜ʖ ͡°)", "robbles", "flusters"]
};

// Replace text in divs with only text (and no child HTML elements), and ps
$("span:not(:has(*)),p:not(:has(*)),div:not(:has(*)),a:not(:has(*))").each(function(){
	var text = $(this).text();
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

				// 10% chance of adding xXx_word_xXx to noun
				if (tag === "NN" || tag === "NNS" || tag === "NNP"){
					if (Math.random() < 0.05){
						randWord = "xXx_" + randWord + "_xXx";
					}
				}
				text = text.replace(word, randWord);
			}
		}
	}
	$(this).text(text);
});

// Audia tag for playing sound
$("body").append('<audio id="audiotag1" src="' + chrome.extension.getURL('sounds/airhorn.mp3') + '" preload="auto"></audio>');
playAirhorn();

// Change background image of body
$("body").css({
	"background-image": getRandomElement(images),
	"background-size": "cover",
	"background-position": "center"
});

window.setInterval(function(){
	// 1% chance of playing airhorn every 5 seconds
	if (Math.random() < 0.01){
		playAirhorn();
	}
}, 5000);

function playAirhorn(){
	document.getElementById('audiotag1').play();
};

function getRandomElement(items){
	return items[Math.floor(Math.random()*items.length)];
};