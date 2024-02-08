function someNumberBetween(array) {

    let randomNumber = Math.ceil(Math.random() * Math.max(array[0], array[1]));
    let minNumber = Math.min(array[0], array[1]);
    
    while (randomNumber < minNumber) {
        randomNumber = parseInt(Math.random() * Math.max(array[0], array[1]));
    }

    return randomNumber;
}

function pushArray(array) {
    array.unshift('');
    return array;
}