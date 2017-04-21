var unirest = require('unirest');
var fs = require('fs');
var ProgressBar = require('progress');
var readline = require('readline')
var colors = require('colors') // npm install colors




// Readline Configuration for the console 
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
  
});


// Twitter Requests Configuration 
var Request = unirest.get('https://api.twitter.com/1.1/statuses/home_timeline.json');
var obj = [];
    Request.oauth({
      consumer_key: 'sAHDFRjtCiRbsdc7ZlOTUx2o8',
      consumer_secret: 'aedZLJl2kHN83Mq82RtdSyfABQfTTeR6kQzoGNB2Pt8sWyoqy9',
      token: '220218633-Hyv4Ju8nWKu5CKUyW92G8FK5sX7zily8h37bkrF2',
      token_secret: '2OR2kjp4MIs3qBbuZjfveP6okYXeQkgylkv0sSCjlFQKS'
    });


var  help = [ 'help' + 'display this message.'.green
           , 'error' + 'display an example error'.red
           , 'quit ' + 'exit console.'.yellow
           ].join('\n')
  ;


//rl.prompt();


// Welcome function as your enter the app
function welcome() {
  console.log([">>>> To Twitter Sentiment Analysis App"
            , ">>>>> Welcome, enter .help if you're lost."
            , ">>>>>>   To Begin using this app, Please type in your twitter handle eg @bola20".green
            ].join('\n').grey);
  prompt();
}

function prompt() {
  var arrow    = '#'.red
    , length = arrow.length
    ;

  rl.setPrompt(arrow.grey, length);
  rl.prompt();
}


rl.on('line', (line) => {
  if(line[0].trim() === '@') {
     
      Request.query({
      screen_name: line.slice(1),
      include_entities: false, 
      count:40
    }).end(function (response) {
       var tweets = response.body;
              
       for(i=0; i < tweets.length; i++) {
            string = tweets[i].text;
            b = string.replace(/(?:https?|ftp):\/\/[\n\S]+/g, ''); // remove the Url addresss in the message. 
      //console.log( b + "----" + tweets[i].created_at);
            obj.push(removeStopWords(b));
           
        } 
     // console.log(obj);
      fs.writeFileSync("tweets.json", JSON.stringify(obj)) 


     // read to count words 
       
       var content = JSON.parse(fs.readFileSync("tweets.json", "utf8"));
       var cleanString = content.toString().replace(/,|\W|\s/g, ' ')
       var analyseTweet = sortObject(wordFreq(cleanString));
       for (i=0; i<= 10; i++) {
            console.log(analyseTweet[i]);
               
        }    
     prompt();
     
    });
      

  }
  else if(line.trim() === 'help') {
     console.log(help.yellow);
   }
  else if (line.trim() === 'error') {
    console.log("Here's what an error might look like");
        JSON.parse('{ a: "bad JSON" }');
  }   
  else if (line.trim() === 'quit') {  
        process.exit(0);
    }
  else {
       console.log("Please you need to type in your twitter handle");
      
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});

process.on('uncaughtException', function(e) {
  console.log(e.stack.red);
  rl.prompt();
});

welcome();


/////////////////// MORE FUNCTIONS /////////////////////////////////////////////////////////////////

// REMOVE STOP WORDS /////////////////


function removeStopWords(string) {
    var x;
    var y;
    var word;
    var stop_word;
    var regex_str;
    var regex;
    var cleansed_string = string.valueOf();
    var stopWords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"];
         
    // Split out all the individual words in the phrase
    words = cleansed_string.match(/[^\s]+|\s+[^\s+]$/g)
 
    // Review all the words
    for(x=0; x < words.length; x++) {
        // For each word, check all the stop words
        for(y=0; y < stopWords.length; y++) {
            // Get the current word
            word = words[x].replace(/\s+|[^a-z]+/ig, "");   // Trim the word and remove non-alpha
             
            // Get the stop word
            stop_word = stopWords[y];
             
            // If the word matches the stop word, remove it from the keywords
            if(word.toLowerCase() == stop_word) {
                // Build the regex
                regex_str = "^\\s*"+stop_word+"\\s*$";      // Only word
                regex_str += "|^\\s*"+stop_word+"\\s+";     // First word
                regex_str += "|\\s+"+stop_word+"\\s*$";     // Last word
                regex_str += "|\\s+"+stop_word+"\\s+";      // Word somewhere in the middle
                regex = new RegExp(regex_str, "ig");
             
                // Remove the word from the keywords
                cleansed_string = cleansed_string.replace(regex, " ");
            }
        }
    }
    return cleansed_string.replace(/^\s+|\s+$/g, "");
}


function wordFreq(string) {
    var words = string.replace(/[.]/g, '').split(/\s/);
    var freqMap = {};
    words.forEach(function(w) {
        if (!freqMap[w]) {
            freqMap[w] = 0;
        }
        freqMap[w] += 1;
    });



    return freqMap;
}

function sortObject(obj) {
  var sortable = [];
for (var word in obj) {
    sortable.push([word, obj[word]]);
}

sortable.sort(function(a, b) {
    return a[1] - b[1];
});
  return sortable.reverse(); // returns a reverce sorted array
}
