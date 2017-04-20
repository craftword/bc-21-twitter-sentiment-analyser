var unirest = require('unirest');
var fs = require('fs');
var ProgressBar = require('progress');
var readline = require('readline')
var colors = require('colors') // npm install colors




// Readline Configuration for the console 
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '#'
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
     console.log("i love you");
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
