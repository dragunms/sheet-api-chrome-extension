function copyTextToClipboard(text) {
  //Create a textbox field where we can insert text to.
  const copyFrom = document.createElement("textarea");

  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;

  //Append the textbox field into the body as a child.
  //"execCommand()" only works when there exists selected text, and the text is inside
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand("copy");

  //(Optional) De-select the text using blur().
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}

document.addEventListener("DOMContentLoaded", function () {
  let exportButton = document.getElementById("export_rclone");

  let runRcloneMoveButton = document.getElementById("run_rclone_move");

  let runRcloneToButton = document.getElementById("run_rclone_to");

  let addGroupButton = document.getElementById("add_group");

  let addEmailButton = document.getElementById("add_email");

  exportButton.onclick = function () {
    exportRclone();
  };
  runRcloneMoveButton.onclick = function () {
    runRcloneToolMove();
  };
  runRcloneToButton.onclick = function () {
    runRcloneToolTo();
  };
  addGroupButton.onclick = function () {
    addGroup();
  };
  addEmailButton.onclick = function () {
    addEmail();
  };
});

function runRcloneToolMove() {
  chrome.runtime.sendMessage(
    {
      action: "runRcloneToolMove",
    },
    function (response) {}
  );
}

function runRcloneToolTo() {
  chrome.runtime.sendMessage(
    {
      action: "runRcloneToolTo",
    },
    function (response) {}
  );
}

function addGroup() {
  chrome.runtime.sendMessage(
    {
      action: "addGroup",
    },
    function (response) {}
  );
}

function addEmail() {
  chrome.runtime.sendMessage(
    {
      action: "addEmail",
    },
    function (response) {}
  );
}

function exportRclone() {
  chrome.runtime.sendMessage(
    {
      action: "exportRclone",
    },
    function (response) {}
  );
}
