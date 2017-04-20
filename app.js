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
            obj.push({"text":b, "createdTime":tweets[i].created_at});

        } 
     // console.log(obj);
      fs.writeFileSync("tweets.json", JSON.stringify(obj)) 

     
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
