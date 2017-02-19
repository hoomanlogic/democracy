/******************************************
 * METHODS
 *****************************************/
export function listenForArrayData (key, ref) {
    ref.on('value', (snap) => {
        // Get children as an array
        var items = [];
        snap.forEach((child) => {
            var childObj = child.val();
            childObj.id = child.key;
            items.push(childObj);
        });

        // Update state
        var newState = {};
        newState[key] = items;
        this.setState(newState);
    });
}

export function listenForObjectMapData (key, ref) {
    ref.on('value', (snap) => {
        // Get value as an object
        var obj = snap.val();

        // Update state
        var newState = {};
        newState[key] = obj;
        this.setState(newState);
    });
}
