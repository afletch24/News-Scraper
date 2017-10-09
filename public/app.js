

$("#scrape").on("click", function(){
    $.get("/scrape", function(data){
        console.log("scrape complete");
	});

});

$("#getArticles").on("click", function(){
  console.log("clicked articles");
    $.get("/articles", function(data){
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            var Link = "http://www.theonion.com" + data[i].link;
            $("#well").append("<div class= 'aPanel' data-id=" + data[i]._id + "><a href=" + Link + ">" + data[i].title + "</div>");
        
        }
	});
});


// Whenever someone clicks aPanal
$(document).on("click","div.aPanel",function() {
    // Empty the notes from the note section
    $("#notesWell").empty();
    $("#commentsWell").empty();
    // Save the id from the div tag
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    
    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId,
        data: {
          body: $("#bodyinput").val()
        }
    })
  
    // With that done, add the note information to the page
    .done(function(data) {
        console.log(".done");
        // console.log(data);
        // The title of the article
        $("#notesWell").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        // $("#notesWell").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notesWell").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notesWell").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
       
        // If there's a note in the article
        var notesToRender = [];
        var currentNote;
        if (!data.notes) {
          currentNote = [
            "<li class='list-group-item'>",
            "No Note for this article yet.",
            "</li>"
          ]
          
        }
        else {
          for(var i = 0; i < data.notes.length; i++){
            currentNote = $([
              "<li class='list-group-item note'>",
              data.notes[i].body,
              "</li>"
            ].join(""));
            currentNote.children("button").data("_id", data.notes[i]._id); 
            notesToRender.push(currentNote);
          }
          $("#commentsWell").append("Last Comment made: " + data.notes.body);
        }



            // console.log("data.note:");
            // console.log(data.thisId.body);
            // // Place the title of the note in the title input
            // $("#titleinput").val(data.notes.body);
            // // Place the body of the note in the body textarea
            // $("#bodyinput").val(data.notes.text);
        
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
    console.log("saved clicked");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
    
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
    //   console.log(data);
      console.log("title:" + data.title);
      console.log(data.notes);
      console.log(data.notes.body);
      
      // Empty the notes section
      $("#notesWell").empty();
      $("#commentsWell").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
  $("#bodyinput").val("");
});
