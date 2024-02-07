/*Some parts of the code are used from the Variable Manager.*/
import applyTranslation from "./TranslateBlocks.js";
//highlight.js
import hljs from "./highlight/es/highlight.js";
import javascript from './highlight/es/languages/javascript.js';
export default async function ({ addon, console, msg }) {
  const vm = addon.tab.traps.vm;
  const debug = console.log;
  const warn = console.warn;
  const error = console.error;
  const OnlyEditingTarget = addon.settings.get("target");
  const EnableTranslation = addon.settings.get("translate");
  const EnableHighlight = addon.settings.get("highlight")
  if (EnableHighlight) {
    hljs.registerLanguage('javascript', javascript);
  }
  const inputsOPs = ['math_number', 'math_positive_number', "math_whole_number", 'motion_goto_menu', "text", "argument_reporter_string_number"]
  const ignoreBlocks = ["procedures_prototype"]
  const Cblocks = ["control_forever", "control_if", "control_repeat", "control_if_else", "control_repeat_until", "control_while"]
  const fieldsMenu = ["VARIABLE", "EFFECT", "FORWARD_BACKWARD", "FRONT_BACK", "BROADCAST_OPTION", "KEY_OPTION", "BACKDROP", "STOP_OPTION", "DRAG_MODE", "LIST", "NUMBER_NAME", "STYLE", "WHENGREATERTHANMENU", "CURRENTMENU"]

  let TranslateMap = applyTranslation()

  let preventUpdate = false;
  let myTabID = 4;
  const manager = document.createElement("div");
  manager.classList.add(addon.tab.scratchClass("asset-panel_wrapper"), "sa-block-to-text");

  const CodeTable = document.createElement("table");//<table>
  const CodeTableHeading = document.createElement("span");//<span>
  CodeTableHeading.className = "sa-blocks-to-text-heading";//css
  CodeTable.appendChild(CodeTableHeading);//</span>
  manager.appendChild(CodeTable);//</table>

  const textTab = document.createElement("li");
  addon.tab.displayNoneWhileDisabled(textTab, { display: "flex" });
  textTab.classList.add(addon.tab.scratchClass("react-tabs_react-tabs__tab"), addon.tab.scratchClass("gui_tab"));
  // Cannot use number due to conflict after leaving and re-entering editor
  textTab.id = "react-tabs-sa-block-to-text";

  const textTabIcon = document.createElement("img");
  textTabIcon.draggable = false;
  textTabIcon.src = addon.self.getResource("/icon.svg") /* rewritten by pull.js */;
  textTab.appendChild(textTabIcon);

  const textTabText = document.createElement("span");
  textTabText.innerText = msg("code");
  textTab.appendChild(textTabText);
  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[{]}|;:,<.>/?';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}
  function translateBlocksToText(opcode) {
    if (TranslateMap.has(opcode) && EnableTranslation) {
      return TranslateMap.get(opcode)
    } else {
      console.warn("Translation missing: " + opcode + " Please report it in isues https://github.com/matej2005/blocks2text/issues")
      return opcode
    }
  }
  function convertInput(input, value) {
    if (input === 'math_number' || input === 'math_positive_number' || input === "text") return "(" + value + ")"
  }
  function findTopLevel(sprite) {
    let TopBlocks = new Array()
    let blocks = sprite.blocks._blocks
    //debug("top ids<")
    for (let bl in blocks) {
      if (blocks[bl].topLevel) {
        //debug(bl)
        TopBlocks[bl] = bl;
        //return bl
      }
    }
    //debug(">")
    //debug(TopBlocks)
    //return tpbl
    return TopBlocks
  }
  function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) return false
    }
    return true;
  }
  function getInputOfBlock(input /*only ID of input*/, block, sprite) {
    let blocks = sprite.blocks._blocks;//blocks in sprite

    let Block = new Object()
    Block.nextInput = null



    function getInputValue(block, _opcode, _Ins) {//get values of complex input
      if (block == undefined) return

      let out = ""
      if (inputsOPs.includes(block.opcode)) {//virtual block, has value
        let fieldValue = block.fields
        for (let fl in fieldValue) {
          if (!_Ins) {
            out = fieldValue[fl].value
          } else {
            out = convertInput(block.opcode, fieldValue[fl].value)
          }
        }
        Block.nextInput = null
      } else { //inner block, more complex
        if (!isEmpty(block.fields)) {//variables menu
          for (let i in block.fields) {
            debug(block.fields[i].name)
          }
        }
        let inputs = block.inputs//id
        for (let IN in inputs) {
          Block.nextInput = inputs[IN].block
          out += getOneInputCell(Block.nextInput, block.opcode)
        }
      }
      if (!_Ins) {
        out = translateBlocksToText(_opcode) + "(" + out + ")"
      }
      return out
    }
    function getOneInputCell(_nextInput, _opcode, _Ins) {
      Block.nextInput = _nextInput
      let closeN = 0
      let InCouter = 5 //max inputs
      let out = ""
      while (1) {
        if (Block.nextInput != null) {
          closeN++
          out += "" + getInputValue(blocks[Block.nextInput], _opcode, _Ins)
        } else {
          //out += "".repeat(closeN-_Ins)
          return out
        }
        if (InCouter == 0) {
          return out
        }
        InCouter--
      }
    }
    let out = ""
    let inputs = blocks[input].inputs//get inputs of input
    let opcode = blocks[input].opcode//get opcode of input
    let Ins = 0
    if (isEmpty(inputs)) {//direct input
      for (let fl in blocks[input].fields) {
        //return convertInput(blocks[input].opcode, blocks[input].fields[fl].value)
        return blocks[input].fields[fl].value
      }
    } else {//complex input
      for (let IN in inputs) {
        Block.nextInput = inputs[IN].block
        out += getOneInputCell(Block.nextInput, opcode, Ins)
        Ins++
      }
      //return "("+out+")"
      return out
    }
    return null
  }
  function handleBlockDefinition(_block, _sprite) {
    let mutation = _sprite.blocks._blocks[_block.inputs.custom_block.block].mutation
    let out = mutation.proccode.replace(/%s/g, function (match) {
      return "(" + JSON.parse(mutation.argumentnames).shift() + ")"
    });
    out = out.replace(/%b/g, function (match) {
      return "<" + JSON.parse(mutation.argumentnames)[1] + ">";//bolean
    });
    return "function " + out + "{"
  }
  function handleSubstack(_block, _sprite, inDefinition) {
    let Substack = new Object();
    Substack.blocks = _sprite.blocks._blocks;
    Substack.text = ""
    Substack.block = _block
    Substack.start = 0
    Substack.safeCounter = 10

    let block = _block
    let substacks = new Array()
    if (inDefinition) {
      Substack.start = 1
    }
    let substack = Substack.start
    while (1) {
      //debug(block)
      let opcode = block.opcode
      let inputs = block.inputs
      //var id = block.id
      let next = block.next
      let afterC
      if (Cblocks.includes(opcode)) {//C block
        if ("SUBSTACK" in block.inputs) {
          Substack.text += "\r\n" + "\tab".repeat(substack) + translateBlocksToText(opcode) + "{\r\n"
          substack++//increase counter
          substacks[substack] = new Object //create new object for each substack
          substacks[substack].inside = block.inputs["SUBSTACK"].block//get some values in object
          substacks[substack].next = block.next
          afterC = block.next
          next = block.inputs["SUBSTACK"].block//get next block.id  !!!
        }
      } else {//normal block
        let inputText = ""
        for (var IN in inputs) {
          if (inputs[IN].name != "SUBSTACK") {//!!!
            inputText += "(" + getInputOfBlock(inputs[IN].block, block, _sprite) + ")"//inputs
          }
        }//each input
        Substack.text += "\tab".repeat(substack) + translateBlocksToText(opcode) + inputText + "\r\n"
        //text += "\t".repeat(substack) + opcode + "\r\n"
        //debug(opcode)
        //debug(substacks)
        //debug(substack)
        /*if (substacks[substack].next == id) {
          text += "\r\n"+"\t".repeat(substack)+"}"
          next = substacks[substack].next
          substack --
        }else{*/
        if (next != undefined) {//next block
          next = block.next
        } else {//return after C
          if (!isEmpty(substacks[substack])) {
            if (substacks[substack].next == null) {
              debug(substacks[substack])
              Substack.text += "\tab".repeat(substack) + "}\r\n"
              substack--
            } else {
              next = substacks[substack].next
            }
          }
          //debug("next: "+block.next)
          //text += "" + "\t".repeat(substack) + "}\r\n"
          substack--
          if (substack <= Substack.start) {
            substack = Substack.start
          }
          Substack.text += "" + "\tab".repeat(substack) + "}\r\n"
          if (substack === Substack.start) {
            break;
          }
        }
      }
      if (!Substack.safeCounter) {
        break
      }
      if (next != undefined) {
        block = Substack.blocks[next]                 //get block[id]
      }
      Substack.safeCounter--
    }
    debug(Substack.text)
    return Substack.text
  }
  function printText() {
    const editingTarget = vm.runtime.getEditingTarget()
    //debug(vm)
    //let sprite = new Set(vm.runtime.targets.map((i) => i.sprite))
    let sprites = new Set(vm.runtime.targets)
    //debug(vm.runtime.targets)
    //const editingTarget = vm.runtime.getEditingTarget();
    //debug(editingTarget);
    //debug(sprite)
    if (OnlyEditingTarget) {
      sprites = [editingTarget]
    }
    sprites.forEach((_sprite, i) => {//sprites
      debug(_sprite)
      const row = document.createElement("tr")//<tr>
      const SpriteCell = document.createElement("td") //nazev postavy <td>
      SpriteCell.className = "sa-block-to-text-sprite"
      SpriteCell.textContent = _sprite.sprite.name //print sprite name
      row.appendChild(SpriteCell)//</td>
      const CodeCell = document.createElement("td")  //bunka pro kod <td>
      CodeCell.className = "sa-block-to-text-code"
      //CodeCell.textContent = ""
      row.appendChild(CodeCell)//</td>
      CodeTable.appendChild(row)//</tr>
      let Sprite = new Object()
      Sprite.text = ""
      Sprite.comments = ""
      Sprite.blocks = _sprite.blocks._blocks
      Sprite._scripts = _sprite.blocks._scripts
      //debug(_sprite.comments)
      for (let comm in _sprite.comments) {
        if (_sprite.comments[comm].blockId == null) { //exclude comments attached to block, it will be procesed later
          Sprite.comments += "//" + _sprite.comments[comm].text + "\r\n" //ADD SUPORT FOR MULTILINE COMMENTS!!!
        }
      }
      //debug(_scripts)
      if (isEmpty(Sprite._scripts) && isEmpty(_sprite.comments)) {
        Sprite.text += "empty"
        debug("empty")
      }
      //debug(_scripts)
      for (let script in Sprite._scripts) {
        let Script = new Object()
        Script.inside = false
        Script.id = Sprite._scripts[script]
        Script.text =""
        //Script.fallback = null
        for (let bl in Sprite.blocks) {//blocks
          function handleBlock(_ID, _sprite) {
            let Block = _sprite.blocks._blocks[_ID]
            Block.input = ""
            Block.text = ""
            Block.inside = Script.inside
            //Block.fallback = fallback
            //Block.input = getInputOfBlock
            //Block.Cblock = false
            Block.script = Sprite._scripts[script]
            Block.sprite = _sprite.id
            debug(Block)
            if (Block.opcode === "procedures_definition") {//handle procedures = custom blocks
              Block.text += handleBlockDefinition(Block, _sprite)
              Block.inside = true
              Block.procedure = true
            } else {
              Block.procedure = false
              Block.text += "\r\n";
              if (Block.inside) {
                Block.tabs++
                Block.text += "\tab";
              }

              Block.text += translateBlocksToText(Block.opcode)
              /*if (Cblocks.includes(blockOpcode)) {
                handleSubstack(block, _sprite)
                text += "{"
                if (!"SUBSTACK" in block.inputs) {
                  text += "\r\n}"
                  inside = false
                } else {
                  if ("SUBSTACK" in block.inputs) {
                    fallback = ID
                    nextID = block.inputs.SUBSTACK.block
                    inside = true
                  }
                }
              }*/

              if (!isEmpty(Block.fields)) {//static menu
                for (let mn in Block.fieldss) {
                  var sMenu = Block.fields[mn]
                  if (fieldsMenu.includes(sMenu.name)) {
                    Block.menu = "[" + sMenu.value + "]"
                  } else {
                    console.warn("Unknow value: " + sMenu.name + " Please report it in isues https://github.com/matej2005/blocks2text/issues")
                  }
                }
                Block.text += Block.menu
              }
              for (let IN in Block.inputs) {
                if (Block.inputs[IN].name != "SUBSTACK") {
                  Block.input += "(" + getInputOfBlock(Block.inputs[IN].block, Block, _sprite) + ")"
                }
              }//each input
              Block.text += Block.input//inputs

            }
            //add comment atached to block
            if (Block.comment != undefined) {
              Block.text += "\tab" + "//" + _sprite.comments[Block.comment].text;
            }
            debug("opcode: " + Block.opcode + ", id: " + Block.id + ", next: " + Block.next + ", top: " + Sprite.blocks[Script.id].topLevel + ", inside: " + Block.inside)
            //return Block
            return Block
          }
          let nextID = Sprite.blocks[Script.id].next
          let block = Sprite.blocks[Script.id]
          if (!inputsOPs.includes(block.opcode) || !ignoreBlocks.includes(block.opcode)) {
            if (Cblocks.includes(block.opcode)) {
              Script.text += handleSubstack(block, _sprite, block.inside)
            } else {
              Script.text += handleBlock(Script.id, _sprite).text
            }
            //CodeCell.textContent += handleBlock(ID, _sprite)
            if (nextID == undefined) {
              if (block.inside) {
                Script.text += "\r\n}"
                if (fallback != undefined) {
                  Script.id = Sprite.blocks[fallback].next
                }
                block.inside = false
                break
              } else {
                break
              }
            } else {
              Script.id = nextID
            }
          }

        }//each block
        //if (!--levelCounter) { 
        Script.text += "\r\n";
        //CodeCell.textContent += "\r\n";
        //}

        Sprite.text += Script.text
      }//each top block
      Sprite.text += "\r\n" + Sprite.comments;
      //text += "text \n text"
      /*
      new Blocks
      let block=new Object()
      block.id = generateRandomString(20)
      block.opcode = "motion_ifonedgebounce"
      block.shadow="false"
      block.topLevel="true"
      block.x="160"
      block.y="298"
      block.parent="null"
      block.fields=new Object()
      block.inputs=new Object()
      //for (let tg in vm.runtime.targets){
      //  debug(vm.runtime.targets[tg])
      //  vm.runtime.targets[tg].blocks.createBlock(block)
      //}
      //vm.Blocks.createBlock(block)*/
      //debug(text)
      debug(Sprite.text)
      CodeCell.textContent = Sprite.text
      if (EnableHighlight) {
        CodeCell.innerHTML = hljs.highlight(CodeCell.innerHTML, { language: 'javascript' }).value
      }
      //debug(CodeCell.innerHTML)
      //CodeCell.textContent = text
      //CodeCell.textContent += "\r\n"+comments;
      CodeCell.innerHTML = CodeCell.innerHTML.replace(/\r\n?/g, '<br />')//hack for inserting line break
      CodeCell.innerHTML = CodeCell.innerHTML.replace(/\tab?/g, '&emsp;')//hack for inserting tab space

      debug("done")

    });//each sprite
  }
  function fullReload() {
    if (addon.tab.redux.state?.scratchGui?.editorTab?.activeTabIndex !== myTabID) return;
    while (CodeTable.firstChild) {
      CodeTable.removeChild(CodeTable.firstChild);
    }
    printText();

  }
  function quickReload() {
    if (addon.tab.redux.state?.scratchGui?.editorTab?.activeTabIndex !== myTabID || preventUpdate) return;
    //translateBlocksToText();
    printText();
  }
  function cleanup() {
    //clean all text code
  }
  textTab.addEventListener("click", (e) => {
    addon.tab.redux.dispatch({ type: "scratch-gui/navigation/ACTIVATE_TAB", activeTabIndex: myTabID });
  });
  function setVisible(visible) {
    if (visible) {
      textTab.classList.add(
        addon.tab.scratchClass("react-tabs_react-tabs__tab--selected"),
        addon.tab.scratchClass("gui_is-selected")
      );
      const contentArea = document.querySelector("[class^=gui_tabs]");
      contentArea.insertAdjacentElement("beforeend", manager);
      fullReload();
    } else {
      textTab.classList.remove(
        addon.tab.scratchClass("react-tabs_react-tabs__tab--selected"),
        addon.tab.scratchClass("gui_is-selected")
      );
      manager.remove();
      cleanup();
    }
  }

  addon.tab.redux.initialize();
  addon.tab.redux.addEventListener("statechanged", ({ detail }) => {
    if (detail.action.type === "scratch-gui/navigation/ACTIVATE_TAB") {
      setVisible(detail.action.activeTabIndex === myTabID);
    } else if (detail.action.type === "scratch-gui/mode/SET_PLAYER") {
      if (!detail.action.isPlayerOnly && addon.tab.redux.state.scratchGui.editorTab.activeTabIndex == myTabID) {
        // DOM doesn't actually exist yet
        queueMicrotask(() => setVisible(true));
      }
    }
  });
  vm.runtime.on("PROJECT_LOADED", () => {
    try {
      fullReload();
    } catch (e) {
      console.error(e);
    }
  });
  vm.runtime.on("TOOLBOX_EXTENSIONS_NEED_UPDATE", () => {
    try {
      fullReload();
    } catch (e) {
      console.error(e);
    }
  });

  const oldStep = vm.runtime._step;
  vm.runtime._step = function (...args) {
    const ret = oldStep.call(this, ...args);
    try {
      //quickReload();
    } catch (e) {
      console.error(e);
    }
    return ret;
  };

  addon.self.addEventListener("disabled", () => {
    if (addon.tab.redux.state.scratchGui.editorTab.activeTabIndex === myTabID) {
      addon.tab.redux.dispatch({ type: "scratch-gui/navigation/ACTIVATE_TAB", activeTabIndex: myTabID });
    }
  });

  while (true) {
    await addon.tab.waitForElement("[class^='react-tabs_react-tabs__tab-list']", {
      markAsSeen: true,
      reduxEvents: ["scratch-gui/mode/SET_PLAYER", "fontsLoaded/SET_FONTS_LOADED", "scratch-gui/locales/SELECT_LOCALE"],
      reduxCondition: (state) => !state.scratchGui.mode.isPlayerOnly,
    });
    addon.tab.appendToSharedSpace({ space: "afterSoundTab", element: textTab, order: myTabID });
  }
}
