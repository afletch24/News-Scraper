

$("#scrape").on("click", function(){
    $.get("/scrape", function(data){
		console.log(data);
	});

});

$("#getArticles").on("click", function(){
    $.get("/articles", function(data){
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            $(".well").append("<div><a href=" + data[i].link + ">" + data[i].title + "/a></div>");
        }
	});
});

