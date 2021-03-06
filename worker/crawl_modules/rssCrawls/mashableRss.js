var rssModule = require('./rssModule.js');

var request = require('request');
var cheerio = require('cheerio');

function _parseBody(body){
  var $ = cheerio.load(body);
  return ($("p").text())

}

function _parseContentForImage(body){
  $ = cheerio.load(body)
  var possImgs = $("img");
  if(possImgs.length){
    return possImgs[0].attribs.src ||  possImgs[0].attribs['datasrc'];//hopefully returns an image
  }
  return "http://zetasky.com/wp-content/uploads/2015/01/Blue-radial-gradient-background.png" //fallback
}

function _feedParseAsync(){
  var mashableUrl="http://feeds.mashable.com/Mashable";
  var feedParser = new rssModule(mashableUrl);
  return new Promise(function(resolve,reject){
    feedParser.parse(function(error,responses){
      if(error){
        reject(error);
      }else{
        resolve(responses)
      }
    });
  });
}



function test(collection,position,cb){
  if(position === collection.length){
    return;
  }
  setTimeout(function(){
    var response = collection[position];
    var mongoObj = {};
    mongoObj.source = response.feed.name;
    mongoObj.title = response.title;
    mongoObj.linkURL = response.link;
    mongoObj.date = new Date(response.published).toISOString();
    mongoObj.categories=[];
    mongoObj.summary = _parseBody(response.content);
    mongoObj.summary = _parseBody(response.content).trim();
    mongoObj.imgURL = _parseContentForImage(response.content);
    cb(mongoObj);

    test(collection,position+1,cb)

  },3000)

}




function mashParser(){  //pass init a callback and vroom vroom to the boom boom.
  var self = this;
  this.init = function(cb){
    _feedParseAsync().then(function(responses){
      test(responses,0,cb);
    })
  }
}

module.exports = mashParser;
// var qq = new mashParser();

// qq.init(function(result){
//   console.log(result);
// })










