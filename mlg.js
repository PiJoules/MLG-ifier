// Edit the html of the page

$("img").attr("src", "http://i.imgur.com/spEe2uf.jpg");

var html = $("body").html();

html = html.replace(/Chrome/gi, "Mozilla");

$("body").html(html);