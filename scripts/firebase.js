/**************************************************************************************************
 * Firebase methods
 **************************************************************************************************/

var db = firebase.firestore();

// store the json as string and reconstruct pdf when user wants to download
function sendToFirestore(data) {
    var user_email = document.getElementById('user_email').innerText;
    var user_id = firebase.auth().currentUser.uid;
    db.collection('users').doc(user_id).collection('invoices').add({
        mail: user_email,
        data: data,
        time: firebase.firestore.Timestamp.fromDate(new Date())
    })
    .then(function(docRef) {
        alert("Successfully added document to cloud. You can access all your generated invoices from the history page.");
    })
    .catch(function(error) {
        alert("Error adding document to cloud.");
    });
}

function retrieveUserItemsData() {
    var user_id = firebase.auth().currentUser.uid;
    let path = "users/" + user_id + "/items"
    db.collection(path).get()
    .then(function(docs) {
        docs.forEach(function(doc) {
            if (doc.exists) {
                var recv_data = doc.data();
                var item = recv_data['item']
                var key = item['Name'];
                itemData[key] = item;
                itemTerms.push(key);
            }
            else {

            }
        })
    })
    .catch(function(error) {
        // alert("Error fetching your items data.");
    });
}

function retrieveUserClientsData() {
    var user_id = firebase.auth().currentUser.uid;
    let path = "users/" + user_id + "/clients"
    db.collection(path).get()
    .then(function(docs) {
        docs.forEach(function(doc) {
            if (doc.exists) {
                var recv_data = doc.data();
                var client = recv_data['client']
                var key = client['client_name'];
                clientData[key] = client;
                clientTerms.push(key);
            }
            else {

            }
        })
    })
    .catch(function(error) {
        // alert("Error fetching your clients data.");
    });
}
