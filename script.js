let array = [];
let delay = 100;

function generateArray() {
  const container = document.getElementById("array-container");
  container.innerHTML = "";
  let size = document.getElementById("size").value;
  array = [];
  for (let i = 0; i < size; i++) {
    array[i] = Math.floor(Math.random() * 400) + 20;
    let bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = array[i] + "px";
    container.appendChild(bar);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
  let bars = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      bars[j].style.backgroundColor = "red";
      bars[j + 1].style.backgroundColor = "red";
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = array[j] + "px";
        bars[j + 1].style.height = array[j + 1] + "px";
      }
      await sleep(delay);
      bars[j].style.backgroundColor = "#3498db";
      bars[j + 1].style.backgroundColor = "#3498db";
    }
    bars[array.length - i - 1].style.backgroundColor = "green";
  }
  bars[0].style.backgroundColor = "green";
}

async function insertionSort() {
  let bars = document.getElementsByClassName("bar");
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      bars[j + 1].style.height = bars[j].style.height;
      array[j + 1] = array[j];
      j--;
      await sleep(delay);
    }
    array[j + 1] = key;
    bars[j + 1].style.height = key + "px";
    bars[i].style.backgroundColor = "green";
  }
}

async function mergeSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  let bars = document.getElementsByClassName("bar");
  let left = array.slice(start, mid + 1);
  let right = array.slice(mid + 1, end + 1);

  let i = 0, j = 0, k = start;

  while (i < left.length && j < right.length) {
    bars[k].style.backgroundColor = "orange";
    if (left[i] <= right[j]) {
      array[k] = left[i];
      bars[k].style.height = left[i] + "px";
      i++;
    } else {
      array[k] = right[j];
      bars[k].style.height = right[j] + "px";
      j++;
    }
    k++;
    await sleep(delay);
  }

  while (i < left.length) {
    bars[k].style.backgroundColor = "orange";
    array[k] = left[i];
    bars[k].style.height = left[i] + "px";
    i++;
    k++;
    await sleep(delay);
  }

  while (j < right.length) {
    bars[k].style.backgroundColor = "orange";
    array[k] = right[j];
    bars[k].style.height = right[j] + "px";
    j++;
    k++;
    await sleep(delay);
  }

  for (let x = start; x <= end; x++) {
    bars[x].style.backgroundColor = "green";
  }
}

async function quickSort(start = 0, end = array.length - 1) {
  if (start < end) {
    let pivotIndex = await partition(start, end);
    await quickSort(start, pivotIndex - 1);
    await quickSort(pivotIndex + 1, end);
  }
}

async function partition(start, end) {
  let bars = document.getElementsByClassName("bar");
  let pivot = array[end];
  let pivotIndex = start;

  bars[end].style.backgroundColor = "yellow";

  for (let i = start; i < end; i++) {
    bars[i].style.backgroundColor = "red";
    if (array[i] < pivot) {
      [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
      bars[i].style.height = array[i] + "px";
      bars[pivotIndex].style.height = array[pivotIndex] + "px";
      pivotIndex++;
    }
    await sleep(delay);
    bars[i].style.backgroundColor = "#3498db";
  }

  [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
  bars[pivotIndex].style.height = array[pivotIndex] + "px";
  bars[end].style.height = array[end] + "px";

  await sleep(delay);
  bars[pivotIndex].style.backgroundColor = "green";

  return pivotIndex;
}

function startSort() {
  delay = 150 - document.getElementById("speed").value;
  let algo = document.getElementById("algorithm").value;
  switch (algo) {
    case "bubble":
      bubbleSort();
      break;
    case "insertion":
      insertionSort();
      break;
    case "merge":
      mergeSort();
      break;
    case "quick":
      quickSort();
      break;
  }
}
