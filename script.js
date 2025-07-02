let array = [];
let delay = 100;
let isSorting = false;

// DOM Elements
const container = document.getElementById("array-container");
const sizeSlider = document.getElementById("size");
const speedSlider = document.getElementById("speed");
const sizeLabel = document.getElementById("size-label");
const speedLabel = document.getElementById("speed-label");
const status = document.querySelector(".status");

// Update labels on change
sizeSlider.oninput = () => {
  sizeLabel.textContent = sizeSlider.value;
  if (!isSorting) generateArray();
};

speedSlider.oninput = () => {
  const speedValue = speedSlider.value;
  speedLabel.textContent = `${speedValue}%`;
  delay = 150 - speedValue;
};

// Generate new array
function generateArray() {
  array = [];
  container.innerHTML = "";
  for (let i = 0; i < sizeSlider.value; i++) {
    const value = Math.floor(Math.random() * 300) + 20;
    array.push(value);
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    container.appendChild(bar);
  }
  status.textContent = "Ready to start visualization";
}

// Utility function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getBars() {
  return document.getElementsByClassName("bar");
}

// Color helpers
function setColor(index, color) {
  const bar = getBars()[index];
  if (bar) bar.style.backgroundColor = color;
}

function resetColors() {
  for (let bar of getBars()) {
    bar.style.backgroundColor = "#3b82f6";
  }
}

// --- Sorting Algorithms ---

async function bubbleSort() {
  const bars = getBars();
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      setColor(j, "#facc15"); // comparing
      setColor(j + 1, "#facc15");
      if (array[j] > array[j + 1]) {
        setColor(j, "#ef4444"); // swapping
        setColor(j + 1, "#ef4444");
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = `${array[j]}px`;
        bars[j + 1].style.height = `${array[j + 1]}px`;
      }
      await sleep(delay);
      resetColors();
    }
    setColor(array.length - i - 1, "#22c55e"); // sorted
  }
  setColor(0, "#22c55e");
}

async function insertionSort() {
  const bars = getBars();
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    setColor(i, "#a855f7"); // current
    await sleep(delay);

    while (j >= 0 && array[j] > key) {
      setColor(j, "#facc15"); // comparing
      array[j + 1] = array[j];
      bars[j + 1].style.height = `${array[j]}px`;
      j--;
      await sleep(delay);
      resetColors();
    }

    array[j + 1] = key;
    bars[j + 1].style.height = `${key}px`;
    setColor(j + 1, "#22c55e"); // placed
  }
}

async function merge(start, mid, end) {
  let bars = getBars();
  let left = array.slice(start, mid + 1);
  let right = array.slice(mid + 1, end + 1);

  let i = 0, j = 0, k = start;

  while (i < left.length && j < right.length) {
    setColor(k, "#facc15"); // comparing
    await sleep(delay);

    if (left[i] <= right[j]) {
      array[k] = left[i];
      bars[k].style.height = `${left[i]}px`;
      i++;
    } else {
      array[k] = right[j];
      bars[k].style.height = `${right[j]}px`;
      j++;
    }
    setColor(k, "#22c55e"); // placed
    k++;
  }

  while (i < left.length) {
    array[k] = left[i];
    bars[k].style.height = `${left[i]}px`;
    setColor(k, "#22c55e");
    i++;
    k++;
    await sleep(delay);
  }

  while (j < right.length) {
    array[k] = right[j];
    bars[k].style.height = `${right[j]}px`;
    setColor(k, "#22c55e");
    j++;
    k++;
    await sleep(delay);
  }
}

async function mergeSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function partition(start, end) {
  let bars = getBars();
  let pivot = array[end];
  let pivotIndex = start;
  setColor(end, "#a855f7"); // pivot

  for (let i = start; i < end; i++) {
    setColor(i, "#facc15"); // comparing
    await sleep(delay);

    if (array[i] < pivot) {
      setColor(i, "#ef4444");
      setColor(pivotIndex, "#ef4444");

      [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
      bars[i].style.height = `${array[i]}px`;
      bars[pivotIndex].style.height = `${array[pivotIndex]}px`;

      await sleep(delay);
      resetColors();
      pivotIndex++;
    }
    resetColors();
  }

  [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
  bars[pivotIndex].style.height = `${array[pivotIndex]}px`;
  bars[end].style.height = `${array[end]}px`;

  setColor(pivotIndex, "#22c55e");
  return pivotIndex;
}

async function quickSort(start = 0, end = array.length - 1) {
  if (start < end) {
    let pi = await partition(start, end);
    await quickSort(start, pi - 1);
    await quickSort(pi + 1, end);
  }
}

// Start Sorting
document.getElementById("play").onclick = async () => {
  if (isSorting) return;
  isSorting = true;
  status.textContent = "Sorting in progress...";

  const algorithm = document.getElementById("algorithm").value;
  switch (algorithm) {
    case "bubble": await bubbleSort(); break;
    case "insertion": await insertionSort(); break;
    case "merge": await mergeSort(); break;
    case "quick": await quickSort(); break;
  }

  status.textContent = "Sorting complete!";
  isSorting = false;
};

// Reset array
document.getElementById("reset").onclick = () => {
  if (isSorting) return;
  generateArray();
  resetColors();
};

// Generate random array
document.getElementById("random").onclick = () => {
  if (isSorting) return;
  generateArray();
};

// Initial setup
generateArray();
