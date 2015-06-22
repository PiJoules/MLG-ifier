// Globals
var images, sounds, customSettings;
var applyChangesBtn, contentTable;
var imgTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp"];
var soundTypes = ["audio/x-m4a", "audio/mp3", "audio/ogg", "audio/mpeg", "audio/wav"];

loadSettings();

// Add callbacks to buttons
document.getElementById("rm_meme").onclick = rmMeme;
document.getElementById("rm_sound").onclick = rmSound;

// Placeholder button for applying changes
applyChangesBtn = document.getElementById("apply_changes");
applyChangesBtn.style.display = "none";

contentTable = document.getElementById('content_table');

// Set up the dnd listeners
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

function loadSettings(){
    chrome.storage.local.get(["customSettings", "images", "sounds"], function(items){
        customSettings = items.customSettings;
        images = items.images;
        sounds = items.sounds;

        if(!customSettings || typeof images == "undefined" || typeof sounds == "undefined"){
            console.log("Loading defaults");
            // Settings not in storage, load and save defaults
            var jsonData;
            var oReq = new XMLHttpRequest();
            oReq.onload = function(){
                jsonData = JSON.parse(this.responseText);
                images = jsonData.images;
                sounds = jsonData.sounds;

                // Save default muh-mays
                var settings = {};
                // Create dictionary to save in chrome settings
                for (var i = 0; i < images.length; i++) {
                    var key = images[i] + "_MLG_" + i.toString(); // create unique-ish key
                    settings[images[i]] = chrome.extension.getURL("muh_mays/" + images[i]);
                }
                for (var i = 0; i < sounds.length; i++) {
                    var key = sounds[i] + "_MLG_" + i.toString(); // create unique-ish key
                    settings[sounds[i]] = chrome.extension.getURL("sounds/" + sounds[i]);
                }
                chrome.storage.local.set(settings);
            };
            oReq.open("get", chrome.extension.getURL("settings.json"), true);
            oReq.send();
        }
    });
}

// Save new lists of images and sounds to chrome settings, add new srcs, remove deleted srcs
function saveSettings(soundsNew, imagesNew, keysNew, valuesNew, keysOld){
    chrome.storage.local.set({"customSettings": true, "sounds": soundsNew, "images": imagesNew}, function(){
        console.log("Dank memes yo");
    });
    if(!(keysNew === undefined || valuesNew === undefined) && keysNew.length > 0 && keysNew.length == valuesNew.length){ // Holy mother of gigantic if statements
        for(var i = 0; i < imagesNew.length; i++){
            var srcObj = {};
            srcObj[keysNew[i]] = valuesNew[i];
            chrome.storage.local.set(srcObj);
        }
    }
    if(!(keysOld === undefined) && keysOld.length > 0){
        for(var i = 0; i < keysOld.length; i++){
            console.log(keysOld[i]);
            chrome.storage.local.remove(keysOld[i]);
        }
    }
}

function loadItems(items, nodeType, itemNodes, i, callback){
    var itemNode = document.createElement(nodeType);
    
    getResource(items[i], function(item){
        itemNode.setAttribute("src", item);
        if(nodeType == "audio")
            itemNode.setAttribute("controls", true);
        itemNodes.push(itemNode);
        if(i< items.length-1){
            loadItems(items, nodeType, itemNodes, i + 1, callback);
        }
        else{
            callback(itemNodes);
        }
    });
}

function rmMeme(){
    clearTable();

    var imgNodes = [];
    loadItems(images, "img", imgNodes, 0, function(){        
        labelData = [];
        for(var i = 0; i < images.length; i++){
            // Label with name after removing trailing number used for chrome storage
            labelData.push(images[i].replace(/\d+$/, ""));
        }
        // Display saved images
        fillTable(imgNodes, labelData);

        // Add button to apply changes
        applyChangesBtn.onclick = function(){applyChanges("images")};
        applyChangesBtn.style.display = "inline";
    });
}

function rmSound(){
    clearTable();

    var sndNodes = [];
    loadItems(sounds, "audio", sndNodes, 0, function(){
        labelData = [];
        for(var i = 0; i < sounds.length; i++){
            // Label with name after removing trailing number used for chrome storage
            labelData.push(sounds[i].replace(/(_MLG_\d)$/, ""));
        }
        // Display saved images
        fillTable(sndNodes, labelData);

        // Add button to apply changes
        applyChangesBtn.onclick = function(){applyChanges("sounds")};
        applyChangesBtn.style.display = "inline";
    });
}

function applyChanges(type){
    // Get items to save and delete
    var allKeys = type == "images"? images : sounds;
    var keysNew = [];
    var valuesNew = [];
    var keysOld = [];
    for(var i = 0; i < contentTable.rows.length; i++){
        if(contentTable.rows.item(i).cells[0].firstChild.checked){
            // Checked, therefore it should be deleted
            keysOld.push(allKeys[i]);
        }
        else{
            // Unchecked, therefore it should be saved
            var meme = contentTable.rows.item(i).cells[1].firstChild;
            keysNew.push(allKeys[i] + "_MLG_" + i.toString());
            valuesNew.push(meme.src);
        }
    }
    // Remove old keys from list of keys to remember
    for(var i = 0; i < keysOld.length; i++){
        var index = allKeys.indexOf(keysOld[i]);
        allKeys.splice(index, i);
    }

    clearTable();
    applyChangesBtn.style.display = "none";
    if(type == "images")
        saveSettings(sounds, allKeys, keysNew, valuesNew, keysOld);
    else
        saveSettings(allKeys, images, keysNew, valuesNew, keysOld);
}

// Fill table with list of nodes
function fillTable(listData, labelData){
    var tr, td, box;
    for (i = 0; i < listData.length; i++) {
        tr = document.createElement('tr');
        
        // Add checkbox
        td = document.createElement('td');
        box = document.createElement('input');
        box.type = "checkbox";
        box.name = "table_checkboxes";
        box.value = i.toString();
        td.appendChild(box);
        tr.appendChild(td);
        
        // Create label
        lbl = document.createElement('p');
        lbl.innerHTML = labelData[i];

        // Add data
        td = document.createElement('td');
        td.appendChild(lbl);
        td.appendChild(listData[i]);
        tr.appendChild(td);
        contentTable.appendChild(tr);
    }
}

// Shamelessly stolen from stack overflow
function clearTable(){
    while(contentTable.firstChild){
        contentTable.removeChild(contentTable.firstChild);
    }
}

function readFiles(reader, soundsNew, imagesNew, keysNew, valuesNew, files, i, callback){
    console.log(files[i].name);
    console.log(files[i].type);
    reader.onloadend = function(){
        var dataSrc = reader.result;

        // Process images/sounds/other files
        if(imgTypes.indexOf(files[i].type) > -1){
            imagesNew.push(files[i].name + "_MLG_" + i.toString()); // Need a key, but want it to be unique
            keysNew.push(files[i].name + "_MLG_" + i.toString());
            valuesNew.push(dataSrc);
        }
        else if(soundTypes.indexOf(files[i].type) > -1){
            soundsNew.push(files[i].name + "_MLG_" + i.toString()); // Need a key, but want it to be unique
            keysNew.push(files[i].name + "_MLG_" + i.toString());
            valuesNew.push(dataSrc);
        }
        else
            alert("U w0t m8 this isn't a dank meme");

        // Call next iteration or callback
        if(i < files.length-1){
            readFiles(reader, soundsNew, imagesNew, keysNew, valuesNew, files, i + 1, callback);
        }
        else
            callback(soundsNew, imagesNew, keysNew, valuesNew);
    }
    reader.readAsDataURL(files[i]);
}

function getResource(resourceName, callback){
    chrome.storage.local.get(resourceName, function(items){
        callback(items[resourceName]);
    });
}

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;

    var reader = new FileReader();
    readFiles(reader, sounds, images, [], [], files, 0, function(soundsNew, imagesNew, keysNew, valuesNew){
        console.log("ayy lmao");
        saveSettings(soundsNew, imagesNew, keysNew, valuesNew);
    });
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}