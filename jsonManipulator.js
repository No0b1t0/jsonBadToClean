var fs = require('fs');
 
const file = String(fs.readFileSync(__dirname + '/Players.json'));

//var f2 = '';

var start_pos = 0; // = file.indexOf('{');
var eof = file.indexOf('}]"') + 1;
var notValidForRun = false;

var cnt = 0;
var properJsonObjects=[];

var getCleanChunk = function(start){

		let dirtyStringChunk = file.substring(start,start+3000);
		return fixStringForJSON(dirtyStringChunk);

	};

var getJsonFromChunk = function(){

		let cleanChunk = getCleanChunk(start_pos);

		let chunkStartPos = cleanChunk.indexOf('{');
		let chunkFromStartPoint = cleanChunk.substring(chunkStartPos);
		let chunkEndPos = chunkFromStartPoint.indexOf(',{') + chunkStartPos;
		let jsonString = cleanChunk.substring(chunkStartPos,chunkEndPos);

		try{
			//console.log(JSON.parse(jsonString));
			start_pos += chunkEndPos;
			setValidityForLoop(cleanChunk,start_pos);

		}catch(err){
			console.log("start: " +start_pos + "\nend: " + chunkEndPos + "\nchunk from start point\n" + chunkFromStartPoint + "\nchunk:\n" + cleanChunk);
			console.log(err);
		};

	return jsonString;

};

var fixStringForJSON = function(originalString){
		let manipulatedString = originalString.replace(/\"\r?\n\"/g, '');
		manipulatedString = manipulatedString.replace(/\0/g,'');
		manipulatedString = manipulatedString.replace(/""/g,'"');
	return manipulatedString;
};

var setValidityForLoop = function(chunk,position){
	var finalString = chunk.substring(position,5);
	if(finalString.indexOf('}]') > 0){
		notValidForRun = true;
		console.log(finalString);
	}
	
};

var pushArrayToFile = function(){
	var resultPath = __dirname + '/fixedPlayers.json';
	fs.writeFileSync(resultPath, JSON.stringify(properJsonObjects),'utf8');
};

while (!notValidForRun) {

	//push parsed json to array
	properJsonObjects.push(JSON.parse(getJsonFromChunk(start_pos)));
	//move counter
	cnt++;
	console.log(cnt);
};

console.log("number of objects found: " + cnt);
console.log("lengh of proper json array: " + properJsonObjects.length);

console.log("-----------------------------------\nwriting to file\n-----------------------------------");
pushArrayToFile();