// get files
// read file (word, pdf)
// search for specific tag section in file
// save tags, extract main content
// make new doc and save to db, has main content, author, title, tags from the doc

// let volatileStorage = {};

// class Story {
//   constructor(title, subtitle, author, commissioner, summary, tags) {
//     this.title = title; //string
//     this.subtitle = subtitle; //string
//     this.chapter = chapter; //number
//     this.author = author; //string
//     this.commissioner = commissioner; //string
//     this.summary = summary; //string
//     this.tags = tags; //array of strings
//   }
// }

const stories = [];

const start = document.querySelector("#startButton");
// when start/upload button is clicked, getall recursive
// start.addEventListener("Chan")
start.addEventListener("click", async function () {
  const storiesContainer = document.querySelector(".storiesContainer");
  while (storiesContainer.lastElementChild) {
    storiesContainer.removeChild(storiesContainer.lastElementChild);
  }

  const selected = document.querySelector("#selected");
  // console.log(typeof selected.files); // obj

  function asyncFileReader(file) {
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsText(file);
    });
  }

  const reader = new FileReader(); // fileReader api async read local content
  // for every file
  for (const file of selected.files) {
    // reader.readAsText(file);
    let result = await asyncFileReader(file);
    // onloadend needed to wait after fileReader has finished readAsText, else result will be undefined
    let finalHTMLText = document.querySelector(".result");
    // let result = processedFile; // is the actual text content
    // console.log(result);
    // make tag replacements with regexp
    result = result.replaceAll(/\[/g, "<").replaceAll(/\]/g, ">");

    function extractHeader(input) {
      // header extraction section
      const centerMarkers = Array.from(input.matchAll(/\<\/?center\>/g)); // matchAll returns iterator, make array from it
      // header detection
      const header = result
        .slice(centerMarkers[0].index, centerMarkers[1].index)
        .replaceAll("<center>", "");
      // console.log(header);

      // title detection
      let title = header.split(/\r?\n/)[0]; // assume title is always the first line
      let reducedHeader = header.replace(
        new RegExp("\n?^" + title + "$\r?\n", "m"),
        ""
      ); // remove the title line from header string block // don't forget the flags 🤦🏻‍♂️
      // console.log(`The title is ${title}`);

      //  author detection
      let author;
      if (/(?<=^by ).+(?=\n|$)/im.test(reducedHeader)) {
        author = reducedHeader.match(/(?<=^by ).+(?=\n|$)/im)[0]; // for some reason is null // ^ newline meta escape causing problems // no, it was caused by the missing multiline m tag
        reducedHeader = reducedHeader.replace(/\n?^by .+(\n|$)/im, ""); // removes author line
      } else {
        author = null;
      }
      // console.log(`The author is ${author}`);

      // commissioner detection
      // TODO: differentiate sponsors and commissioners
      let commissioner;
      if (/(?<=^for \b|^sponsored by \b).+(?=\n|$)/im.test(reducedHeader)) {
        if (/^for \b/im.test(reducedHeader)) {
          commissioner = reducedHeader.match(
            /(?<=^for \b|^sponsored by \b).+(?=\n|$)/im
          )[0];
        } else if (/^sponsored by \b/im.test(reducedHeader)) {
          commissioner = reducedHeader.match(
            /(?<=^for \b|^sponsored by \b).+(?=\n|$)/im
          )[0];
        }
        reducedHeader = reducedHeader.replace(
          /\n?^(for |sponsored by )\b.+(\n|$)/im,
          ""
        );
      } else {
        commissioner = null;
      }
      // console.log(`The commissioner is ${commissioner}`);

      // chapter / part detection
      let part;
      if (/part|chapter/gi.test(reducedHeader)) {
        part = reducedHeader.match(
          /(?<=part |chapter )(\d+)(?=\n|$|:| )/gim
        )[0];
        reducedHeader = reducedHeader.replace(
          /\n?[\W]*(part |chapter )\d+[\W]*/im,
          ""
        );
      } else if (/epilogue|prologue/gi.test(reducedHeader)) {
        part = reducedHeader.match(/(epilogue|prologue)/gi)[0];
        reducedHeader = reducedHeader.replace(
          /\n?\.*(epilogue|prologue).*\n?/gim,
          ""
        );
      } else if (/\b\d+\b/g.test(title)) {
        part = title.match(/\b\d+\b/g)[0];
        title = title.replace(/\b\d+\b/g, "");
      } else {
        part = null;
      }
      // console.log(`part/chapter ${part}`);

      // chapter name if any detection
      let subtitle;
      if (/(?<=\b).*(?=\n|$)/m.test(reducedHeader)) {
        subtitle = reducedHeader.trim().match(/(?<=\b).*(?=\n|$)/m)[0];
        reducedHeader = reducedHeader.replace(
          new RegExp("\n?" + subtitle + "\n?"),
          ""
        );
      } else {
        subtitle = null;
      }
      // console.log(`subtitle is ${subtitle}`);

      // if (reducedHeader.match(/\w/gm)) {
      //   console.log(reducedHeader);
      // } else {
      //   console.log("reducedHeader is now empty");
      // }

      return {
        title: title,
        author: author,
        commissioner: commissioner,
        part: part,
        subtitle: subtitle,
      };
    }

    function extractFooter(input) {
      // const footer = this
      let tags = [];
      let summary;
      if (/summary:/gi.test(input)) {
        summary = input.match(/(?<=summary:) ?[\w\d "'‘’“”,.\/]*/gi)[0].trim();
      } else {
        summary = null;
      }
      if (/tags:/gi.test(input)) {
        let csvTags = input
          .match(/(?<=tags:)([\w\d "'‘’“”,.\/]*)/gi)[0]
          .trim()
          .replaceAll(/\s*,\s*/g, ","); // still sometimes gets empty string value, need to consider words with spaces in them
        csvTags = csvTags.split(","); // by the by, add sponsored boolean if story is sponsored?
        for (let tag of csvTags) {
          if (tag.length > 0) {
            tags.push(tag);
          }
        }
      }
      return {
        summary: summary,
        tags: tags,
      };
    }

    // function extractContent() {
    //   // detect when there are lots of consecutive words?
    //   // or multiple newlines
    //   // or from leftovers after header and footer are subtracted.
    // }
    // console.log(result.match(/[tT]he\ [eE]nd/));
    // get tags, summary

    // let story = {};
    // console.log(extractHeader(result));
    // console.log(extractFooter(result));
    // console.log({ ...extractHeader(result), ...extractFooter(result) });
    const story = {
      ...extractHeader(result),
      ...extractFooter(result),
      result,
    };
    stories.push(story);

    // finalHTMLText.innerHTML = result; // need to use html for element insertion, but also the pre tag to keep newlines
    // finalHTMLText.innerText = result; innerText keeps newline but tags are inserted as literals, not elements
    const storyBlock = document.createElement("div");
    storyBlock.classList.add("storyBlock");

    const infoBlock = document.createElement("div");
    infoBlock.classList.add("infoBlock");

    function appendThisTo(appendTo, type, className = null, text = null) {
      const newElement = document.createElement(type);
      if (className) newElement.classList.add(className);
      if (type === "pre") {
        newElement.innerHTML = text;
      } else {
        if (text) newElement.innerText = text;
        else {
          newElement.innerText = `no ${className} detected`;
          newElement.classList.add("missing");
        }
      }
      // else newElement.innerText = "not found";
      appendTo.append(newElement);
    }

    for (const data in story) {
      // console.log(data, typeof story[data]);
      const simples = [
        "title",
        "author",
        "commissioner",
        "part",
        "subtitle",
        "summary",
      ];

      if (simples.includes(data)) {
        appendThisTo(infoBlock, "div", data, story[data]);
      } else if (data === "tags") {
        const newEl = document.createElement("div");
        newEl.classList.add("tags");
        if (story[data].length > 0) {
          story[data].forEach((tag) => {
            appendThisTo(newEl, "span", "tag", tag);
          });
        } else {
          newEl.innerText = "no tags detected";
          newEl.classList.add("missing");
        }
        infoBlock.append(newEl);
      } else if (data === "result") {
        appendThisTo(storyBlock, "pre", data, story[data]);
      }
    }

    // const tag = document.createElement("div");
    // pre.append(result)
    // console.log(preview);
    // storyBlock.append(preview);
    storyBlock.append(infoBlock);
    storiesContainer.append(storyBlock);
    // console.log(storyBlock);
  }
  console.log(stories);
});
