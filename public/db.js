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
};

function checkAllDatabase() {

    const transaction = db.transaction(["pending"], "readwrite");

    const store = transaction.objectStore("pending");

    const getAll = store.getAll();

    if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                // if successful, open a transaction on your pending db
                const transaction = db.transaction(["pending"], "readwrite");

                // access your pending object store
                const store = transaction.objectStore("pending");

                // clear all items in your store
                store.clear();
            });
    }
};