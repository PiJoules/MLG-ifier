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
	"http://i.imgur.com/n41tcFI.gif"
];
$("img").each(function(){
	$(this).attr("src", getRandomElement(images));
});


// word replacements
// Penn Treebank POS tags: https://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html
var treeBank = {
	"JJ": ["dank", "MLG", "euphoric", "( ͡° ͜ʖ ͡°)"],
	"JJR": ["danker", "more MLG", "( ͡° ͜ʖ ͡°)"],
	"JJS": ["dankinest", "MLG-inest", "( ͡° ͜ʖ ͡°)"],
	"NN": ["dankineer", "pineapple", "Gurl", "m8", "m9", "m80", "parody", "subreddit", "meme", "scrub", "mountain dew", "weed", "blunt", "ebola", "fedora", "trilby", "9/11", "( ͡° ͜ʖ ͡°)", "johnbob"],
	"NNS": ["dankineers", "pineapples", "Gurlz", "m80s", "m89s", "memes", "scrubs", "doritos", "jimmies", "trilbies", "( ͡° ͜ʖ ͡°)", "johbobs"],
	"NNP": ["Sp00nr", "Reddit", "Le Reddit Armie", "Snipars", "Vagabonds", "M'lady", "Good Sir", "9/11", "( ͡° ͜ʖ ͡°)"],
	"VBD": ["rekt", "upboated", "rekm8ed", "rustled", "( ͡° ͜ʖ ͡°)", "robbled", "flustered"],
	"VBP": ["transl8", "feel", "upboat", "upvote", "rip", "rekm8", "rustle", "( ͡° ͜ʖ ͡°)", "robble", "fluster"],
	"VBZ": ["rekts", "upboats", "rustles", "( ͡° ͜ʖ ͡°)", "robbles", "flusters"]
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
			if (Math.random() < 0.2){
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