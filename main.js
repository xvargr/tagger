// get files
// read file (word, pdf)
// search for specific tag section in file
// save tags, extract main content
// make new doc and save to db, has main content, author, title, tags from the doc

const start = document.querySelector("#startButton");
start.addEventListener("click", function () {
  const selected = document.querySelector("#selected");
  // console.log(selected.selected);
  console.log(selected.files);

  // const reader = new FileReader();
  // reader.addEventListener("load", function () {
  //   document.querySelector(".result").innerText = this.result;
  // });
  // reader.readAsText(selected.files[0]);

  const reader = new FileReader();
  reader.readAsText(selected.files[0]); // select first file in array
  //  function will trigger when readAsText has loaded
  // when loaded, do replacement of tags, extract info ..
  reader.onloadend = function () {
    let finalHTMLText = document.querySelector(".result").innerText;
    let result = this.result;
    // make regex
    let regex = /great/;
    result = result.replaceAll("[b]", "<b>");
    result = result.replaceAll("[/b]", "</b>");
    result = result.replaceAll("[i]", "<i>");
    result = result.replaceAll("[/i]", "</i>");
    result = result.replaceAll("[/i]", "</i>");
    console.log(this);
    document.querySelector(".result").innerText = result;
  };
});
