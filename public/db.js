let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    const db = request.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
        checkAllDatabase();
    }
};

request.onerror = function(event) {
    console.log("There is an error", request.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");

    const store = transaction.objectStore("pending");

    store.add(record);
}