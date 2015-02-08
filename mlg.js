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
	"JJ": ["dank", "MLG"],
	"JJR": ["danker", "more MLG"],
	"JJS": ["dankinest", "MLG-inest"],
	"NN": ["dankineer", "pineapple", "Gurl", "m8", "parody", "subreddit", "meme", "scrub", "mountain dew"],
	"NNS": ["dankineers", "pineapples", "Gurlz", "m80s", "m89s", "memes", "scrubs", "doritos"],
	"NNP": ["Sp00nr", "Reddit"],
	"VBD": ["rekt", "upboated", "rekm8ed"],
	"VBP": ["transl8", "feel", "upboat", "upvote", "rip", "rekm8"],
	"VBZ": ["rekts", "upboats"]
};

// Replace text in divs with only text (and no child HTML elements), and ps
$("p,div:not(:has(*)),a:not(:has(*)),span").each(function(){
	var text = $(this).text();
	var words = new Lexer().lex(text);
	var taggedWords = new POSTagger().tag(words);
	for (var i in taggedWords) {
		var taggedWord = taggedWords[i];
		var word = taggedWord[0];
		var tag = taggedWord[1];

		// 50% chance of changing each word
		if (tag in treeBank && Math.random() < 0.5){
			text = text.replace(word, getRandomElement(treeBank[tag]));
		}
	}
	$(this).text(text);
});

// Audia tag for playing sound
$("body").append('<audio id="audiotag1" src="' + chrome.extension.getURL('sounds/airhorn.mp3') + '" preload="auto"></audio>');
playAirhorn();

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