let accessCode = "";
let accessToken = "";
let refreshToken = "";
let accessTokenExist = false;
let started = false;
let rcloneList = [];

let accountListIndex = 0;
let sheetClientId =
  "876330463341-a542nmr2mgtrv7ov9lli4ujdbovjkcn5.apps.googleusercontent.com";
let sheetId = "1E2pEz4CsddSt_7k1sd2ynCJy4zi9Lesd5ij062c53Qg";

let sheetKey = "AIzaSyDS1B6LuN87FDpjFO86Nq6YckkLMp0i2YQ";
let sheetSecret = "dvvWHO4iScejRxI1awDMrE6K";
let sheetAccessCode = "";
let sheetToken = "";
let finished = false;

let sheetName = "BackupRcloneToVer";

let MoveSheetName = "Spacepool";

let ToSheetName = "Spacepool";

let addSheetName = "BackupRcloneToVer";

let emailSheetName = "BackupRcloneToVer";

let action = "";

let addList = [];

let doneNotePosition = "";

let doneCount = 1;

let driveTab = null;

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function getExportList() {
  let spreadsheetId = sheetId;
  let range = sheetName;
  let Key = sheetKey;
  let init = {
    method: "GET",
    async: true,
    headers: {
      Authorization: "Bearer " + sheetToken,
      "Content-Type": "application/json",
    },
    contentType: "json",
  };

  fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${Key}`,
    init
  )
    .then((response) => response.json())
    .then(function (data) {
      let str = "";
      console.log(data);
      rcloneList = data.values;
      for (let i = 1; i <= rcloneList.length; i++) {
        const index = i - 1;
        if (
          rcloneList[index][8] &&
          rcloneList[index][3] !== "" &&
          rcloneList[index][3] !== "PHONE" &&
          rcloneList[index][3] !== "ERROR" &&
          !rcloneList[index][3].includes("RUNNING")
        ) {
          if (rcloneList[index][9]) {
            str =
              str +
              `[${rcloneList[index][8]}] \ntype = drive \nclient_id = ${
                rcloneList[index][3]
              } \nclient_secret = ${
                rcloneList[index][4]
              } \nscope = drive \ntoken = {"access_token":"${
                rcloneList[index][5]
              }","token_type":"Bearer","refresh_token":"${
                rcloneList[index][6]
              }","expiry":"${moment()
                .subtract(1, "h")
                .format("YYYY-MM-DDTHH:mm:ss.SSSSSSSZ")}"} \nteam_drive = ${
                rcloneList[index][9]
              } \nroot_folder_id = \n \n`;
          } else {
            str =
              str +
              `[${rcloneList[index][8]}] \ntype = drive \nclient_id = ${
                rcloneList[index][3]
              } \nclient_secret = ${
                rcloneList[index][4]
              } \nscope = drive \ntoken = {"access_token":"${
                rcloneList[index][5]
              }","token_type":"Bearer","refresh_token":"${
                rcloneList[index][6]
              }","expiry":"${moment()
                .subtract(1, "h")
                .format("YYYY-MM-DDTHH:mm:ss.SSSSSSSZ")}"} \n \n`;
          }
        }
        if (i === rcloneList.length) {
          download("rclone.txt", str);
        }
      }
    });
}

async function handleMoveList(max) {
  const moveList = await getDataList(MoveSheetName);
  const dataList = await getDataList(sheetName);
  let modifier = 3;
  for (let i = 1; i < moveList.length; i++) {
    const teamDrive = moveList[i][3];
    if (max) {
      for (let k = 1; k < dataList.length; k++) {
        dataList[k][8] = dataList[k][11];
      }
      for (let j = 1; j <= max; j++) {
        dataList[j][10] = "ADD MOVE";
      }
      const end = i * modifier;
      for (let start = (i - 1) * modifier + 1; start <= end; start++) {
        if (start <= max) {
          dataList[start][9] = teamDrive;
        }
      }
    } else {
      for (let j = 1; j < dataList.length; j++) {
        dataList[j][8] = dataList[j][11];
        dataList[j][10] = "ADD MOVE";
      }
      const end = i * modifier;
      for (let start = (i - 1) * modifier + 1; start <= end; start++) {
        dataList[start][9] = teamDrive;
      }
    }
  }
  return dataList;
}

async function handleToList(max) {
  const unfilteredToList = await getDataList(ToSheetName);
  const toList = [];
  const dataList = await getDataList(sheetName);
  let modifier = 6;
  for (let i = 1; i < unfilteredToList.length; i++) {
    if (i === 1) {
      toList.push(unfilteredToList[i]);
    }
    if (unfilteredToList[i][3]) {
      toList.push(unfilteredToList[i]);
    }
  }
  for (let i = 1; i < toList.length; i++) {
    const teamDrive = toList[i][4];
    if (max) {
      for (let k = 1; k < dataList.length; k++) {
        dataList[k][8] = dataList[k][12];
      }
      for (let j = 1; j <= max; j++) {
        dataList[j][10] = "ADD TO";
      }
      const end = i * modifier;
      for (let start = (i - 1) * modifier + 1; start <= end; start++) {
        if (start <= max) {
          dataList[start][9] = teamDrive;
        }
      }
    } else {
      for (let j = 1; j < dataList.length; j++) {
        dataList[j][8] = dataList[j][12];
        dataList[j][10] = "ADD TO";
      }
      const end = i * modifier;
      for (let start = (i - 1) * modifier + 1; start <= end; start++) {
        dataList[start][9] = teamDrive;
      }
    }
  }
  return dataList;
}

async function handleAddGroup() {
  doneNotePosition = "L";
  doneCount = 3;
  addList = [];
  const toList = await getDataList(addSheetName);
  for (let i = 1; i < toList.length; i++) {
    const teamDrive = toList[i][4];
    const groupEmail = toList[i][10];
    const doneCheck = toList[i][11];
    const prevTeamDrive = toList[i - 1][4];
    if (prevTeamDrive !== teamDrive) {
      addList.push({
        id: teamDrive,
        email: groupEmail,
        is_done: doneCheck === "DONE",
      });
    }
  }
  return addList;
}

async function handleAddEmail() {
  doneNotePosition = "N";
  doneCount = 18;
  addList = [];
  const emailList = await getDataList(emailSheetName);
  let groupEmail = [];

  for (let i = 1; i < emailList.length; i++) {
    const teamDrive = emailList[i][9];
    const doneCheck = emailList[i][13];
    const prevTeamDrive = emailList[i - 1][9];
    if (prevTeamDrive !== teamDrive && prevTeamDrive !== undefined) {
      addList.push({
        id: teamDrive,
        email: groupEmail.join(" "),
        is_done: doneCheck === "DONE",
      });
      groupEmail = [];
    }
    groupEmail.push(emailList[i][0]);
  }
  return addList;
}

function getCellValue() {
  const index = accountListIndex - 1;

  console.log(`id: ${index} - drive_id: ${addList[index].id}`);
  if (
    accountListIndex <= addList.length &&
    !addList[index].is_done &&
    addList[index].email
  ) {
    chrome.windows.create({
      url: `https://drive.google.com/drive/folders/u/3/${addList[index].id}`,
      incognito: false,
      state: "maximized",
    });
  } else {
    newAccount();
  }
}

function newAccount() {
  accountListIndex = accountListIndex + 1;
  setTimeout(() => {
    getCellValue();
  }, 30);
}

function markDone(msg = "DONE") {
  let spreadsheetId = sheetId;
  let range = `${emailSheetName}!${doneNotePosition}${
    accountListIndex * doneCount + 2
  }:${doneNotePosition}${accountListIndex * doneCount + 19}`;
  let Key = sheetKey;
  let message = [];
  for (let i = 0; i < doneCount; i++) {
    message.push(msg);
  }

  const body = {
    range: `${emailSheetName}!${doneNotePosition}${
      accountListIndex * doneCount + 2
    }:${doneNotePosition}${accountListIndex * doneCount + 19}`,
    majorDimension: "COLUMNS",
    values: [message],
  };

  let init = {
    method: "PUT",
    async: true,
    headers: {
      Authorization: "Bearer " + sheetToken,
      "Content-Type": "application/json",
    },
    contentType: "json",
    body: JSON.stringify(body),
  };

  fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED&key=${Key}`,
    init
  )
    .then((response) => response.json())
    .then(function (data) {
      newAccount();
    });
}

function getToken(data) {
  let spreadsheetId = sheetId;
  let range = `${sheetName}`;
  let Key = sheetKey;
  const body = {
    range: `${sheetName}`,
    majorDimension: "ROWS",
    values: [...data],
  };
  console.log(data);
  let init = {
    method: "PUT",
    async: true,
    headers: {
      Authorization: "Bearer " + sheetToken,
      "Content-Type": "application/json",
    },
    contentType: "json",
    body: JSON.stringify(body),
  };

  fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED&key=${Key}`,
    init
  )
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
    });
}

function getDataList(sheetRange) {
  let spreadsheetId = sheetId;
  let range = sheetRange || sheetName;
  let Key = sheetKey;
  let init = {
    method: "GET",
    async: true,
    headers: {
      Authorization: "Bearer " + sheetToken,
      "Content-Type": "application/json",
    },
    contentType: "json",
  };
  return fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${Key}`,
    init
  )
    .then((response) => response.json())
    .then(function (data) {
      return data.values;
    });
}

function getSheetRcloneDataAccess(tab, tabId) {
  sheetAccessCode = tab.url.split("&")[1].replace("code=", "");
  const req = new XMLHttpRequest();
  const baseUrl = "https://oauth2.googleapis.com/token";
  const urlParams = `code=${sheetAccessCode}&client_id=${sheetClientId}&client_secret=${sheetSecret}&redirect_uri=https://wikipedia.org&grant_type=authorization_code`;

  req.open("POST", baseUrl, true);
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.send(urlParams);

  req.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const response = JSON.stringify(this.response);
      setTimeout(() => {
        if (response) {
          console.log(response);
          const tempAccessToken = response.split(",")[0].split(":")[1].slice(1);
          sheetToken = tempAccessToken.slice(2, tempAccessToken.length - 2);
          const tempRefreshToken = response.split(",")[2].split(":")[1];
          refreshToken = tempRefreshToken.slice(3, tempRefreshToken.length - 2);
          console.log(refreshToken);

          if (action === "export") {
            getExportList();
          }
          if (action === "move") {
            handleMoveList(6000).then((response) => getToken(response));
          }
          if (action === "to") {
            handleToList(6000).then((response) => getToken(response));
          }
          if (action === "addGroup") {
            handleAddGroup().then((response) => {
              console.log(response);
              newAccount(response);
            });
          }
          if (action === "addEmail") {
            handleAddEmail().then((response) => {
              console.log(response);
              newAccount(response);
            });
          }
          setTimeout(() => {
            chrome.tabs.remove(tabId);
          }, 6000);
        }
      }, 2000);
    }
  };
}

function refreshSheetDataAccess() {
  const req = new XMLHttpRequest();
  const baseUrl = "https://oauth2.googleapis.com/token";
  const urlParams = `client_id=${sheetClientId}&client_secret=${sheetSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`;

  req.open("POST", baseUrl, true);
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.send(urlParams);

  req.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const response = JSON.stringify(this.response);
      setTimeout(() => {
        if (response) {
          console.log(response);
          const tempAccessToken = response.split(",")[0].split(":")[1].slice(1);
          sheetToken = tempAccessToken.slice(2, tempAccessToken.length - 2);
        }
      }, 2000);
    }
  };
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("wikipedia.org/?state=1&code=") &&
    !finished
  ) {
    getSheetRcloneDataAccess(tab, tabId);
  }
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("drive.google.com/drive/folders/") &&
    !finished
  ) {
    driveTab = tab;

    chrome.tabs.sendMessage(
      tabId,
      {
        action: "addgroup",
        tab,
        email: addList[accountListIndex].email,
        id: addList[accountListIndex].id,
      },
      function () {}
    );
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "exportRclone") {
    action = "export";
    chrome.tabs.create({
      url: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/spreadsheets&include_granted_scopes=true&prompt=consent&access_type=offline&response_type=code&state=1&flowName=GeneralOAuthFlow&redirect_uri=https://wikipedia.org&client_id=${sheetClientId}`,
    });
    alert("Access Export List");
  }
  if (request.action === "runRcloneToolMove") {
    action = "move";
    chrome.tabs.create({
      url: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/spreadsheets&include_granted_scopes=true&prompt=consent&access_type=offline&response_type=code&state=1&flowName=GeneralOAuthFlow&redirect_uri=https://wikipedia.org&client_id=${sheetClientId}`,
    });
    alert("Access Move List");
  }
  if (request.action === "runRcloneToolTo") {
    action = "to";
    chrome.tabs.create({
      url: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/spreadsheets&include_granted_scopes=true&prompt=consent&access_type=offline&response_type=code&state=1&flowName=GeneralOAuthFlow&redirect_uri=https://wikipedia.org&client_id=${sheetClientId}`,
    });
    alert("Access To List");
  }
  if (request.action === "addGroup") {
    action = "addGroup";
    chrome.tabs.create({
      url: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/spreadsheets&include_granted_scopes=true&prompt=consent&access_type=offline&response_type=code&state=1&flowName=GeneralOAuthFlow&redirect_uri=https://wikipedia.org&client_id=${sheetClientId}`,
    });
    alert("Access To List");
    setTimeout(() => {
      handleAddGroup().then((response) => {});
    }, 300000);
    setTimeout(() => {
      refreshSheetDataAccess();
    }, 2700000);
  }

  if (request.action === "addEmail") {
    action = "addEmail";
    chrome.tabs.create({
      url: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/spreadsheets&include_granted_scopes=true&prompt=consent&access_type=offline&response_type=code&state=1&flowName=GeneralOAuthFlow&redirect_uri=https://wikipedia.org&client_id=${sheetClientId}`,
    });
    alert("Access To List");
    setTimeout(() => {
      handleAddEmail().then((response) => {});
    }, 300000);
    setTimeout(() => {
      refreshSheetDataAccess();
    }, 2700000);
  }

  if (sender.id === chrome.runtime.id && request.action === "markDone") {
    setTimeout(() => {
      chrome.tabs.remove(driveTab.id);
      markDone();
    }, 3000);
  }
  if (
    // eslint-disable-next-line no-undef
    request.action === "reloadPage"
  ) {
    let code = "window.location.reload();";
    chrome.tabs.executeScript(request.tab_id, { code: code });
  }
});

console.log("background loaded");
