function triggerMouseEvent(node, eventType) {
  const clickEvent = document.createEvent("MouseEvents");
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
}

function triggerMouseClick(targetNode) {
  if (targetNode) {
    triggerMouseEvent(targetNode, "mouseover");
    triggerMouseEvent(targetNode, "mousedown");
    triggerMouseEvent(targetNode, "mouseup");
    targetNode.click();
    targetNode.focus();
    targetNode.blur();
    return false;
  }
  return true;
}

function getElementIncludesAttribute(elements, attribute = "", value = "") {
  for (let i = 0; i < elements.length; i++) {
    if (
      elements[i].hasAttribute(attribute) &&
      elements[i].attributes.getNamedItem(attribute)?.value.includes(value)
    ) {
      return elements[i];
    }
  }
  return null;
}

function getElementByAttributes(elements, attribute = "", value = "") {
  for (let i = 0; i < elements.length; i++) {
    if (
      elements[i].hasAttribute(attribute) &&
      elements[i].attributes.getNamedItem(attribute)?.value === value
    ) {
      return elements[i];
    }
  }
  return null;
}

function addGroupToDrive(sender, message) {
  console.log("trigger");
  const elementList = document.getElementsByTagName("div");
  const buttonList = [];
  for (let i = 0; i < elementList.length; i++) {
    if (
      elementList[i].hasAttribute("role") &&
      elementList[i].attributes.getNamedItem("role")?.value === "button"
    ) {
      buttonList.push(elementList[i]);
    }
  }
  for (let i = 0; i < buttonList.length; i++) {
    if (buttonList[i].className === "h-sb-Ic h-R-d a-c-d a-r-d") {
      triggerMouseClick(buttonList[i]);
      setTimeout(() => {
        if (!document.getElementsByClassName("ea-Rc-x-Vc")[0]) {
          chrome.runtime.sendMessage(
            {
              action: "reloadPage",
              tab_id: message?.tab?.id,
            },
            function (response) {}
          );
        }
        const iframeDocument = document.getElementsByClassName("ea-Rc-x-Vc")[0]
          .contentDocument;
        setTimeout(() => {
          const inputGroupEmail = iframeDocument.getElementsByTagName(
            "input"
          )[3];
          inputGroupEmail.value = message.email;
          inputGroupEmail.setAttribute("value", message.email);
          inputGroupEmail.dispatchEvent(new Event("change", { bubbles: true }));
          inputGroupEmail.dispatchEvent(new Event("blur", { bubbles: true }));
          inputGroupEmail.dispatchEvent(new Event("input", { bubbles: true }));
          triggerMouseClick(inputGroupEmail);
          setTimeout(() => {
            const emailItem = getElementByAttributes(
              iframeDocument.getElementsByTagName("li"),
              "data-hovercard-id",
              message.email
            );
            if (!emailItem) {
              if (!inputGroupEmail) {
                chrome.runtime.sendMessage(
                  {
                    action: "reloadPage",
                    tab_id: message?.tab?.id,
                  },
                  function (response) {}
                );
              }
            }
            triggerMouseClick(emailItem);
            setTimeout(() => {
              const label = iframeDocument.getElementsByClassName(
                "mdc-label"
              )[3];
              triggerMouseClick(label);
              const button = getElementByAttributes(
                iframeDocument.getElementsByTagName("button"),
                "aria-haspopup",
                "menu"
              );
              triggerMouseClick(button);
              setTimeout(() => {
                const manageItem = iframeDocument.getElementsByClassName(
                  "boqDrivesharedialogCommonMenuWithPadding boqDrivesharedialogCommonRoleselectorMenuItem"
                );
                triggerMouseClick(manageItem[4]);
                setTimeout(() => {
                  const saveButton = iframeDocument.getElementsByClassName(
                    "mdc-button__ripple"
                  );
                  triggerMouseClick(saveButton[saveButton.length - 2]);
                  setTimeout(() => {
                    const saveAnywayButton = iframeDocument.getElementsByClassName(
                      "appsMaterialWizButtonPaperbuttonLabel quantumWizButtonPaperbuttonLabel exportLabel"
                    );
                    triggerMouseClick(
                      saveAnywayButton[saveAnywayButton.length - 1]
                    );
                    setTimeout(() => {
                      chrome.runtime.sendMessage(
                        sender.id,
                        {
                          action: "markDone",
                        },
                        function (response) {}
                      );
                    }, 8000);
                  }, 8000);
                }, 6000);
              }, 6000);
            }, 6000);
          }, 6000);
        }, 4000);
      }, 4000);
    }
  }
}

const messagesFromReactAppListener = (message, sender) => {
  if (
    // eslint-disable-next-line no-undef
    sender.id === chrome.runtime.id &&
    message.action === "addgroup"
  ) {
    setTimeout(() => {
      addGroupToDrive(sender, message);
    }, 8000);
  }
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  messagesFromReactAppListener(request, sender);
  sendResponse(true);
});

console.log("foreground loaded");
