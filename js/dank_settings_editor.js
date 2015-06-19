// Settings to save in chrome.storage.sync

// Globals
var images, sounds;
var applyChangesBtn, contentTable;
main();

function main(){
    loadSettings();

    // Add callbacks to buttons
    document.getElementById("add_meme").onclick = addMeme;
    document.getElementById("rm_meme").onclick = rmMeme;

    // Placeholder button for applying changes
    applyChangesBtn = document.createElement("button");
    applyChangesBtn.id = "apply_changes";
    applyChangesBtn.appendChild(document.createTextNode("Apply changes"));

    contentTable = document.getElementById('content_table');
}

function loadSettings(){
    chrome.storage.sync.get(["customSettings", "images", "sounds"], function(items){
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
                    settings[images[i]] = chrome.extension.getURL("muh_mays/" + images[i]);
                }
                chrome.storage.sync.set(settings, function(){});
            };
            oReq.open("get", chrome.extension.getURL("settings.json"), true);
            oReq.send();
        }
    });
}

// Save new lists of images and sounds to chrome settings, add new srcs, remove deleted srcs
function saveSettings(soundsNew, imagesNew, srcsNew, imagesOld){
    chrome.storage.sync.set({"customSettings": true, "sounds": soundsNew, "images": imagesNew}, function(){
        console.log("Dank memes yo");
    });
    for(var i = 0; i < imagesNew.length; i++){
        var imgObj = {};
        imgObj[imagesNew[i]] = srcsNew[i];
        chrome.storage.sync.set(imgObj);
    }
    for(var i = 0; i < imagesOld.length; i++){
        chrome.storage.sync.remove(imagesOld[i]);
    }
}

function loadImages(imgNodes, i, callback){
    var imgNode = document.createElement("img");
    getResource(images[i], function(randImg){
        imgNode.setAttribute("src", randImg);
        imgNode.style.width = "50%";
        imgNodes.push(imgNode);
        if(i< images.length-1){
            loadImages(imgNodes, i + 1, callback);
        }
        else{
            callback(imgNodes);
        }
    });
}

//TODO
function addMeme(){
    // Create dialog to add images

    // For later
    convertImgToBase64URL(images[i], function(base64Img){
        imgNode.setAttribute("src", base64Img);
        imgNode.style.width = "50%";
        imgNodes.push(imgNode);
    });
}

function rmMeme(){
    clearTable();

    var imgNodes = [];
    loadImages(imgNodes, 0, function(){
        // Display saved images
        fillTable(imgNodes);

        // Add button to apply changes
        applyChangesBtn.onclick = applyChangesImages;
        contentTable.appendChild(applyChangesBtn);
    });
}

function applyChangesImages(){
    // Get images to save and delete
    var imagesNew = [];
    var srcsNew = [];
    var imagesOld = [];
    for(var i = 0; i < contentTable.rows.length; i++){
        if(contentTable.rows.item(i).cells[0].firstChild.checked){
            // Checked, therefore it should be deleted
            imagesOld.push(images[i]);
        }
        else{
            // Unchecked, therefore it should be saved
            var meme = contentTable.rows.item(i).cells[1].firstChild;
            imagesNew.push(images[i]);
            srcsNew.push(meme.src);
        }
    }

    clearTable();
    saveSettings(sounds, imagesNew, srcsNew, imagesOld);
}

// Fill table with list of nodes
function fillTable(list_data){
    var tr, td, box;
    for (i = 0; i < list_data.length; i++) {
        tr = document.createElement('tr');
        
        // Add checkbox
        td = document.createElement('td');
        box = document.createElement('input');
        box.type = "checkbox";
        box.name = "table_checkboxes";
        box.value = i.toString();
        td.appendChild(box);
        tr.appendChild(td);

        // Add data
        td = document.createElement('td');
        td.appendChild(list_data[i]);
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

function convertImgToBase64URL(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
}

// Get image/sound from chrome storage
function getResource(resourceName, callback){
    chrome.storage.sync.get(resourceName, function(items){
        callback(items[resourceName]);
    });
}