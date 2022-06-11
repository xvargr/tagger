// get files
// read file (word, pdf)
// search for specific tag section in file
// save tags, extract main content
// make new doc and save to db, has main content, author, title, tags from the doc

let volatileStorage = {};

class Story {
  constructor(title, author, commissioner, summary, tags) {
    this.title = title; //string
    this.author = author; //string
    this.commissioner = commissioner; //string
    this.summary = summary; //string
    this.tags = tags; //array of strings
  }
}

const start = document.querySelector("#startButton");
// when start/upload button is clicked, getall recursive
start.addEventListener("click", function () {
  const selected = document.querySelector("#selected");
  // console.log(selected.selected);
  // console.log(typeof selected.files); // obj
  const reader = new FileReader(); // fileReader api async read local content
  // for every file
  for (const item of selected.files) {
    reader.readAsText(item);
    // onloadend needed to wait after fileReader has finished readAsText, else result will be undefined
    reader.onloadend = function () {
      let finalHTMLText = document.querySelector(".result");
      let result = this.result;
      const length = result.length;
      // console.log(length);
      // console.log(typeof result); // string
      // make tag replacements with regexp
      result = result.replaceAll(/\[/g, "<").replaceAll(/\]/g, ">");

      // const tagRegex = /(?<=[\/[])(\w+)(?=\])/g; // regex with look around capturing only strings between literal []
      // let matches = tagRegex.exec(result);
      // result = result.replaceAll(tagRegex, "<>");

      // need checks if some elements are not be able to detected
      // fallback to manual input, serve a form

      // header extraction section
      // const headBegin = result.matchAll(/\<center\>/g);
      // console.log(Array.from(result.matchAll(/\<\/?center\>/g))); // returns array of matches from iterator
      const centerMarkers = Array.from(result.matchAll(/\<\/?center\>/g)); // matchAll returns iterator, make array from it
      // const header = result
      //   .slice(centerMarkers[0].index, centerMarkers[1].index)
      //   .replaceAll("<center>", "")
      //   .split(/\r?\n/); // header is defined as being in between the 1st center element, in /n separated array

      // fallback, detect elements, if not found ask for input
      // how? match? or by line
      // if (header.length === 4) {
      // like this if by line method
      // }

      // this works but maybe hard to scale
      // get values by matching literals and lines, but maybe can match using look around regex
      // let testHead = result
      //   .slice(centerMarkers[0].index, centerMarkers[1].index)
      //   .replaceAll("<center>", "");
      // console.log(testHead);
      // // get title
      // const title = header[0];
      // console.log(`Title is "${title}"`);
      // // get commissioner
      // const commissioner = header[1].replace(/[fF]or\ |[sS]ponsored by\ /, "");
      // console.log(`Commissioner is ${commissioner}`);
      // // get author
      // const author = header[2].replace(/[bB]y\ /, "");
      // console.log(`Author is ${author}`);

      // matching with look around
      const header = result
        .slice(centerMarkers[0].index, centerMarkers[1].index)
        .replaceAll("<center>", "");
      console.log(header);

      const title = header.split(/\r?\n/)[0]; // assume title is always the first line
      // console.log(title);

      // chapter/part detection
      console.log(header.match(/[cC]hapter |[pP]art/));
      // if (header.match()){}

      // get values

      // get summary
      // console.log(result.match(/[tT]he\ [eE]nd/));

      // get tags

      finalHTMLText.innerHTML = result; // need to use html for element insertion, but also the pre tag to keep newlines
      // finalHTMLText.innerText = result; innerText keeps newline but tags are inserted as literals, not elements
    };
  }
});

function notYet() {}
