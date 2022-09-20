/**************************************************************************************************
 * Firebase methods to retrieve user clients data
 **************************************************************************************************/

var db = firebase.firestore();

var clientUID = 0;

// retrieve data from Firebase based on user's mail
function retrieveUsersFromFirestore() {
    var user_id = firebase.auth().currentUser.uid;
    let path = "users/" + user_id + "/clients"
    db.collection(path).get()
    .then(function(docs) {
        docs.forEach(function(doc) {
            if (doc.exists) {
                var recv_data = doc.data();
                addClient(recv_data['client']);
            }
            else {
                alert("You have no clients saved in 'My Clients'");
            }

        })
        // removing loading animation
        var element = document.getElementById('preloader');
        element.parentNode.removeChild(element);
    })
    .catch(function(error) {
        alert("Error fetching clients list.");

        // removing loading animation
        var element = document.getElementById('preloader');
        element.parentNode.removeChild(element)
    });
}

/**************************************************************************************************
 * methods to add/remove/save clients
 **************************************************************************************************/

function removeClient(clientId) {
    var element = document.getElementById(clientId);
    element.parentNode.removeChild(element);
}

function addNewClient() {
    var clientId = 'client-' + clientUID;
    clientUID++;

    var client_name = "<td><input type='text' placeholder='Client Name'></td>";
    var client_number = "<td><input type='text' placeholder='Client Number'></td>";
    var client_email = "<td><input type='text' placeholder='Client Email'></td>";
    var actions = '<td><a class="btn-floating btn-medium waves-effect waves-light black" onclick="javascript:removeClient(\'' + 
    clientId + '\'); return false;"><i class="material-icons left">delete</i></td>';

    var entry_data = client_name + client_number + client_email + actions;

    var client_entry = document.createElement("tr");
    client_entry.id = clientId;
    client_entry.innerHTML = entry_data;
    
    document.getElementById('user_clients').append(client_entry);
}

function addClient(client) {
    var clientId = 'client-' + clientUID;
    clientUID++;

    var client_name = "<td><input type='text' value='" + client['client_name'] + "'></td>";
    var client_number = "<td><input type='text' value='" + client['client_tel'] + "'></td>";
    var client_email = "<td><input type='text' value='" + client['client_email'] + "'></td>";
    var actions = '<td><a class="btn-floating btn-medium waves-effect waves-light black" onclick="javascript:removeClient(\'' + 
    clientId + '\'); return false;"><i class="material-icons left">delete</i></td>';

    var entry_data = client_name + client_number + client_email + actions;

    var client_entry = document.createElement("tr");
    client_entry.id = clientId;
    client_entry.innerHTML = entry_data;
    
    document.getElementById('user_clients').append(client_entry);
}

function getClientsData() {

    var clients_div = document.getElementById('user_clients');
    var clients = [];

    for (var i = 0; i < clients_div.children.length; i++) {
        var client = new Object();

        // clients div -> tr -> td -> input element
        client.client_name = clients_div.children[i].children[0].children[0].value;
        client.client_tel = clients_div.children[i].children[1].children[0].value;
        client.client_email = clients_div.children[i].children[2].children[0].value;

        clients.push(client);
    }
    return clients
    //return JSON.stringify(data);
}

function saveClients() {
    const user_id = firebase.auth().currentUser.uid;
    var clients_data = getClientsData();

    let i = 0;
    let last = clients_data.length - 1;
    for (const client of clients_data){
        console.log(client)
        const name = client['client_name'];
        db.collection('users').doc(user_id).collection('clients').doc(name).set({
            client
        })
        .catch(function(error) {
            alert("Error updating item " + name);
        });
        if (i == last) {
            alert("Successfully updated items list.");
        }
        i++;
    }

}