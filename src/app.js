const body = document.querySelector('.body');
const sortMethod = document.querySelector('.algo')
const sortButton = document.getElementById('sort')
const speed = document.getElementById('speed')
const speed_value = document.getElementById('speed_value')

const Nblock = document.getElementById('n-block');
const loading = document.querySelector('.loading')

let list =  Array(parseInt(Nblock.value)).fill().map(()=> Math.floor((Math.random() * (body.clientHeight - 150)) + 150));
let brickWidth = 0;

// Helpers 
const sleep = (time) => {
    return new Promise( resolve => setTimeout(resolve,time))
}
const swap = (a,b) =>{
    let elx = document.getElementById(a);
    let ely = document.getElementById(b);
    let x = list[b];
    list[b] = list[a];
    list[a] = x;
    elx.setAttribute('id',b)
    elx.style.left = (b * brickWidth) + 'px';
    ely.setAttribute('id',a)
    ely.style.left = (a * brickWidth) + 'px';
}
const randomColor=  function() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`; 
}

// Sort Algorithms
const selection = async function() {
    for (let i = 0;i < list.length;i++) {
        let min = i;
        for(let j=i+1;j<list.length;j++) {
            if(list[j] < list[min]) {
                min = j
            }
        }
        swap(min,i)
        await sleep(speed.value)

    }
    resetState();
}
const selection_reverse = async function() {
    for (let i = 0;i < list.length;i++) {
        let max = i;
        for(let j=i+1;j<list.length;j++) {
            if(list[j] > list[max]) {
                max = j
            }
        }
        swap(max,i)
        await sleep(speed.value)
    }
    resetState();
}
let bubble = async function(){
    let len = list.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (list[j] > list[j + 1]) {
                swap(j, j + 1)
                await sleep(speed.value)
            }
        }
    }
    resetState();
};
let bubble_reverse = async function(){
    let len = list.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (list[j] < list[j + 1]) {
                swap(j, j + 1)
                await sleep(speed.value)
            }
        }
    }
    resetState();
};

let quick = async function (left,right) {
    let pivot = list[Math.floor((right + left) / 2)],
    i = left,
    j = right;
    while (i <= j) {
        while (list[i] < pivot) {
            i++;
        }
        while (list[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(i, j);
            await sleep(speed.value)
            i++;
            j--;
        }
    }
    return i;
}

async function quickSort(left,right) {
    let index;
    if (list.length > 1) {
        index = await quick(left, right);
        if (left < index - 1) { 
            await quickSort(left, index - 1);
        }
        if (index < right) {
            await quickSort(index, right);
        }
    }
    resetState();
}

// Render Functions 
const renderBrick = function (width,height,position){
    const brick = document.createElement('div');
    brick.setAttribute('class', 'brick');
    brick.setAttribute('id',position);
    brick.style.height = height + 'px';
    brick.style.width = width  + 'px';
    brick.style.position = "absolute";
    brick.style.transition = 'all '+ speed.value +'ms ease-in-out';
    brick.style.backgroundColor = randomColor();
    brick.style.left = (position * width)+'px';
    return brick;
}

const renderBody = function() {
    brickWidth = Number.parseFloat(body.clientWidth / list.length).toFixed(2)
    for(let i=0;i<list.length;i++) {
        const brick = renderBrick(brickWidth,list[i],i);
        body.append(brick);
    }
}

renderBody()

// Event listeners 
sortButton.addEventListener('click', function(e) {
    loading.style.display = 'block';
    e.target.disabled = true
    switch(sortMethod.value) {
        case 'selection' : selection();
            break;
        case 'selection_reverse' : selection_reverse();
            break;
        case 'bubble' : bubble();
            break;
        case 'bubble_reverse' : bubble_reverse();
            break;
        case 'quick' : quickSort(0, list.length - 1)
            break;
        default: selection();
    }
})

const resetState = () => {
    loading.style.display = 'none';
    sortButton.disabled = false;
}

speed.addEventListener('change', function(e) {
    speed_value.textContent = e.target.value;
    let blocks = document.querySelectorAll('.brick')
    for(let i=0; i< blocks.length;i++) {
        blocks[i].style.transition = 'all '+ e.target.value +'ms ease-in-out'
    }
})

Nblock.addEventListener('change', function(e) {
    list = [];
    list = Array(parseInt(e.target.value)).fill().map(()=> Math.floor(Math.random() * (body.clientHeight - 150)) + 150);
    body.innerHTML = '';
    renderBody();
});