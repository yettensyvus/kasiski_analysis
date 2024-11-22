const alphabetUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alphabetLower = alphabetUpper.toLowerCase();
const alphabetPercentage = [8.17, 1.49, 2.78, 4.25, 12.70, 2.23, 2.02, 6.09, 6.97, 0.15, 0.77, 4.03, 2.41, 6.75, 7.51, 1.93, 0.095, 5.99, 6.33, 9.06, 2.76, 0.98, 2.36, 0.15, 1.97, 0.074];
let numSequences = 25;

function belongsTo(character, checkstring) {
    return checkstring.includes(character);
}

function remove(stringUsed, alphabetUppersed) {
    return [...stringUsed].filter(char => alphabetUppersed.includes(char)).join('');
}


function graphCount(toCheck, length) {
    const mainMap = new Map();
    const secondArray = [];
    const spacingArray = [];

    for (let i = 0; i < toCheck.length - (length - 1) && secondArray.length < 50; i++) {
        const sequence = toCheck.substr(i, length);

        if (mainMap.has(sequence)) {
            secondArray.push(sequence);
            spacingArray.push(i - mainMap.get(sequence));
        } else {
            mainMap.set(sequence, i);
        }
    }

    return [secondArray, spacingArray];
}


function letterCount(letter, toCheck) {
    return (toCheck.match(new RegExp(letter, 'g')) || []).length;
}

function subsMod(palphabet, calphabet, ptext1, ptext2, k, s) {
    const pMap = new Map();
    for (let j = 0; j < palphabet.length; j++) {
        pMap.set(palphabet[j], calphabet[j]);
    }

    let ctext = "";
    for (let i = 0; i < ptext1.length; i++) {
        const a = ptext1[i];
        const a1 = ptext2[i];

        if (i % k === s) {
            if (pMap.has(a)) {
                ctext += pMap.get(a);
                continue;
            } else if (pMap.has(a1)) {
                ctext += pMap.get(a1);
                continue;
            }
        }
        ctext += a;
    }

    return ctext;
}

function shift(palphabet, key) {
    key %= palphabet.length; // Handle cases where key > palphabet.length
    return palphabet.slice(key) + palphabet.slice(0, key);
}

function shiftArray(palphabet1, key1) {
    const length = palphabet1.length;
    const key = key1 % length; // Ensure key is within bounds
    return [...palphabet1.slice(key), ...palphabet1.slice(0, key)];
}


function keyChange() {
    const x = document.getElementById("keywordList");
    const keyLength = parseInt(document.getElementById("keyLength").value, 10);

    // Clear the existing options
    x.innerHTML = "";

    // Add the required number of options
    for (let i = 1; i <= keyLength; i++) {
        const option = document.createElement("option");
        option.text = `L${i}`;
        x.add(option);
    }

    // Clear the content of frequenciesGraph and frequenciesGraph1
    document.getElementById("frequenciesGraph").innerHTML = "";
    document.getElementById("frequenciesGraph1").innerHTML = "";
}

function changeShift() {

    const shiftValue = document.getElementById("shift").value;
    const alphabetS = shift(alphabetUpper, shiftValue);
    const countsS = shiftArray(countRecord, shiftValue);

    const rangePercentages = countsS.map(count => (100 * parseInt(count) / parseInt(stringRecord.length)));

    const multiplier2 = 100 / Math.max(...rangePercentages);

    for (i = 0; i < alphabetLower.length; i++) {
        var c = document.getElementById("freqGraph1Bar" + i);
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, 20, 100);
        ctx.beginPath();
        ctx.rect(2, 100 - rangePercentages[i] * multiplier2, 16, rangePercentages[i] * multiplier2);
        ctx.fillStyle = "#402455";
        ctx.fill();

        document.getElementById("shiftLetter_" + i).value = alphabetS[i];
    }

    document.getElementById("keywordList").options[selectLetter].innerHTML = alphabetS.substr(0, 1);

    dm1 = subsMod(alphabetS, alphabetLower, document.getElementById("decryptedText").value, document.getElementById("intercept").value, document.getElementById("keyLength").value, selectLetter);
    document.getElementById("decryptedText").value = dm1;
}

function sequences() {
    const sequencesBtn = document.getElementById("sequencesBtn");
    const interceptElement = document.getElementById("intercept");
    const decryptedTextElement = document.getElementById("decryptedText");
    const frequenciesTableElement = document.getElementById("frequenciesTable");

    if (sequencesBtn.value === "Find Repeated Sequences") {
        sequencesBtn.value = "Find More Repeated Sequences";
    } else {
        numSequences += 25;
    }

    let interceptedMessage = interceptElement.value.toUpperCase();

    // Remove unwanted characters
    const nospaces = remove(interceptedMessage, alphabetUpper);
    interceptElement.value = nospaces;
    decryptedTextElement.value = nospaces;


    const trigraphs = graphCount(nospaces, 3); // Use 3 for trigraphs
    const fourgraphs = graphCount(nospaces, 4); // Use 4 for fourgraphs

    const repeatsLetters = [];
    const repeatsCounts = [];
    let q = 0;

    // Fill repeats with fourgraphs
    while (repeatsLetters.length < numSequences && q < fourgraphs[0].length) {
        repeatsLetters.push(fourgraphs[0][q]);
        repeatsCounts.push(fourgraphs[1][q]);
        q++;
    }

    // Fill repeats with trigraphs
    let p = 0;
    while (repeatsLetters.length < numSequences && p < trigraphs[0].length) {
        repeatsLetters.push(trigraphs[0][p]);
        repeatsCounts.push(trigraphs[1][p]);
        p++;
    }

    // Build the frequencies table
    const headerRow = Array.from({ length: 25 }, (_, i) =>
        i > 1
            ? `<td><input type="text" value="${i}" readonly></td>`
            : `<td><input type="text" readonly></td>`
    ).join("");

    const dataRows = repeatsLetters.map((letter, j) => {
        return `
            <tr>
                ${Array.from({ length: 25 }, (_, i) => {
            if (i === 0) {
                return `<td><input type="text" value="${letter}" readonly></td>`;
            } else if (i === 1) {
                return `<td><input type="text" value="${repeatsCounts[j]}" readonly></td>`;
            } else if (repeatsCounts[j] % i === 0) {
                return `<td style="background-color:#56ba5a;"><input type="text" readonly></td>`;
            } else {
                return `<td><input type="text" readonly></td>`;
            }
        }).join("")}
            </tr>`;
    }).join("");

    const frequenciesTable = `
        <p>The repeated sequences found in the intercept are:</p>
        <table id="freqTable">
            <colgroup>
                <col span="2" style="width:60px">
                <col span="23" style="width:30px">
            </colgroup>
            <tr>${headerRow}</tr>
            ${dataRows}
        </table>`;

    frequenciesTableElement.innerHTML = frequenciesTable;

    // Make relevant sections visible
    document.getElementById("keyLengthDiv").style.visibility = "visible";
    document.getElementById("keyLettersDiv").style.visibility = "visible";
    document.getElementById("shiftDiv").style.visibility = "visible";
}


function checkLetter() {
    var x = document.getElementById("keywordList");
    if (x.value.length == 1) {
        currentLetter = x.options[x.selectedIndex].innerHTML;
        document.getElementById("shift").value = currentLetter.charCodeAt(0) - 65;
    }
    else {
        document.getElementById("shift").value = 0;
    }

    frequenciesGraph =
        `
        <p>The letter frequencies in English are:</p>
        <table id="freqGraph">
            <colgroup>
                <col span="26" class="freq-col">
            </colgroup>
            <tr>
        `;

    // Create header with canvas elements for each letter
    for (i = 0; i < alphabetLower.length; i++) {
        frequenciesGraph += `<td>`;
        frequenciesGraph += `<div id="canvas-container"><canvas id="freqGraphBar${i}" width="20" height="100"></canvas></div>`;
        frequenciesGraph += `</td>`;
    }

    frequenciesGraph += "</tr><tr>";

    // Add letter labels (A, B, C, etc.)
    for (i = 0; i < alphabetLower.length; i++) {
        frequenciesGraph += `<td>`;
        frequenciesGraph += `<input type="text" id="origLetter_${i}" value="${alphabetLower.substr(i, 1)}" readonly>`;
        frequenciesGraph += `</td>`;
        
    }
    frequenciesGraph += `</tr><tr>`;


    // Add number labels
    for (i = 0; i < alphabetLower.length; i++) {
        frequenciesGraph += `<td>`;
        frequenciesGraph += `<input type="text" id="origNumber_${i}" value="${i}" readonly>`;
        frequenciesGraph += `</td>`;
        
    }
    frequenciesGraph += `</tr></table>`;

    // Insert the frequency graph into the page
    document.getElementById("frequenciesGraph").innerHTML = frequenciesGraph;

    selectLetter = x.selectedIndex;
    x.options[selectLetter].innerHTML = "A";

    toTest = "";
    for (k = 0; k < document.getElementById("intercept").value.length; k++) {
        if (k % document.getElementById("keyLength").value == selectLetter) {
            toTest = toTest + document.getElementById("intercept").value.substr(k, 1);
        }
    }

    counts = Array();
    for (k = 0; k < alphabetUpper.length; k++) {
        counts[k] = letterCount(alphabetUpper.substr(k, 1), toTest);
    }

    countRecord = counts.slice(0);
    stringRecord = toTest;

    frequenciesGraph1 =
        `
        <p>The frequencies of the letters that would be encrypted using the chosen letter of the keyword:</p>
        <table id="freqGraph1" class="frequency-table">
            <colgroup>
                <col span="26" class="col-width">
            </colgroup>
            <tr>
        `;

    // Create header with canvas elements for each letter (encrypted frequencies)
    for (i = 0; i < alphabetLower.length; i++) {
        frequenciesGraph1 += `<td>`;
        frequenciesGraph1 +=
            `
                <div class="canvas-container">
                    <canvas id="freqGraph1Bar${i}" width="20" height="100"></canvas>
                </div>
            `;
        frequenciesGraph1 += `</td>`;
    }

    frequenciesGraph1 += `</tr><tr>`;

    // Add encrypted letter labels (A, B, C, etc.)
    for (i = 0; i < alphabetLower.length; i++) {
        frequenciesGraph1 += `<td>`;
        frequenciesGraph1 += ` <input type="text" id="shiftLetter_${i}" value="${alphabetUpper.substr(i, 1)}" readonly> `;
        frequenciesGraph1 += `</td>`;
    }
    frequenciesGraph1 += `</tr></table>`;

    // Insert the second frequency graph into the page
    document.getElementById("frequenciesGraph1").innerHTML = frequenciesGraph1;

    multiplier1 = 100 / Math.max.apply(null, alphabetPercentage);  // Max element of array

    // Draw the original frequency bar graphs for the letter frequencies
    for (i = 0; i < alphabetLower.length; i++) {
        var c = document.getElementById("freqGraphBar" + i);
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.rect(2, 100 - alphabetPercentage[i] * multiplier1, 16, alphabetPercentage[i] * multiplier1);
        ctx.fillStyle = "#745b81";
        ctx.fill();
    }

    // Draw the encrypted frequency bar graphs
    for (i = 0; i < alphabetLower.length; i++) {
        var c = document.getElementById("freqGraph1Bar" + i);
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.rect(2, 100 - counts[i] * multiplier1, 16, counts[i] * multiplier1);
        ctx.fillStyle = "#56ba5a"; // You can change the color here for encrypted frequencies
        ctx.fill();
    }

    changeShift();
    document.getElementById("shift").disabled = false;
}


function resetFunction() {
    // Clear text values
    document.getElementById("decryptedText").value = "";
    document.getElementById("intercept").value = "";

    // Reset button and visibility settings
    document.getElementById("sequencesBtn").value = "Find Repeated Sequences";
    ["keyLengthDiv", "keyLettersDiv", "shiftDiv"].forEach(id => document.getElementById(id).style.visibility = "hidden");

    // Reset form elements
    document.getElementById("keyLength").value = 2;
    document.getElementById("keywordList").value = 2;
    document.getElementById("shift").disabled = true;
    document.getElementById("shift").value = 0;

    // Clear frequencies-related content
    document.getElementById("frequenciesGraph").innerHTML = "";
    document.getElementById("frequenciesGraph1").innerHTML = "";
    document.getElementById("frequenciesTable").innerHTML = "";

    // Call keyChange to reset keyword-related functionality
    keyChange();
}
