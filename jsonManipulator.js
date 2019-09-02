/**
 1. todo: use a code formatter or keep the format consistent.
 2. todo: add input file and outfile as program arguments.
 3. todo: logger instead of console.out
 **/

var fs = require('fs');

// todo: add this as a run argument: node app.js Players.json
const file = String(fs.readFileSync(__dirname + '/Players.json'));

var start_pos = 0; // = file.indexOf('{');
var notValidForRun = false;

var cnt = 0;
var properJsonObjects = [];

var getCleanChunk = function (start) {
  // 3000 - magic number - add as constant at top + comment explain why 3000
  let dirtyStringChunk = file.substring(start, start + 3000);
  return fixStringForJSON(dirtyStringChunk);
};

var getJsonFromChunk = function () {
  // start_pos is global variable, you use it here not as a function argument - should continue for getCleanChunk.
  // better yet not to use global variable like this.
  let cleanChunk = getCleanChunk(start_pos);

  let chunkStartPos = cleanChunk.indexOf('{');
  let chunkFromStartPoint = cleanChunk.substring(chunkStartPos);
  let chunkEndPos = chunkFromStartPoint.indexOf(',{') + chunkStartPos;
  let jsonString = cleanChunk.substring(chunkStartPos, chunkEndPos);

  try {
    //console.log(JSON.parse(jsonString));
    start_pos += chunkEndPos;
    setValidityForLoop(cleanChunk, start_pos);

  } catch (err) {
    console.log("start: " + start_pos + "\nend: " + chunkEndPos
        + "\nchunk from start point\n" + chunkFromStartPoint + "\nchunk:\n"
        + cleanChunk);
    console.log(err);
  };

  return jsonString;
};

// todo: need to test if good.
var fixStringForJSON = function (originalString) {
  return originalString
  .replace(/\"\r?\n\"/g, '')
  .replace(/\0/g, '')
  .replace(/""/g, '"');
};

var setValidityForLoop = function (chunk, position) {
  // 5 - magic number - add as constant + explain why 5. 
  var finalString = chunk.substring(position, 5);
  if (finalString.indexOf('}]') > 0) {
    notValidForRun = true;
    console.log(finalString);
  }
};

var pushArrayToFile = function () {
  // todo: as output argument
  fs.writeFileSync(__dirname + '/fixedPlayers.json', JSON.stringify(properJsonObjects), 'utf8');
};

// name misleading - try to keep while (something ok)
while (!notValidForRun) {
  //push parsed json to array - no need for comment that says not much.
  properJsonObjects.push(JSON.parse(getJsonFromChunk(start_pos)));
  //move counter - no need for comment that says not much.
  cnt++;
  console.log(cnt);
};

console.log("number of objects found: " + cnt);
console.log("lengh of proper json array: " + properJsonObjects.length);

console.log("-----------------------------------\nwriting to file\n-----------------------------------");
pushArrayToFile();
