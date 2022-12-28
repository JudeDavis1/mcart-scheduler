// Convert to title case e.g.
// hello, world => Hello, World
function toTitleCase(string: string) {
    const arr = string.split(' ');
    var newStr = [];

    for (var i = 0; i < arr.length; i++) {
        newStr.push(arr[i][0].toUpperCase() + arr[i].substring(1, arr[i].length));
    }

    return newStr.join(' ');
}

export {
    toTitleCase
}