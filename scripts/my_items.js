/**************************************************************************************************
 * Firebase methods to retrieve user items data
 **************************************************************************************************/

var db = firebase.firestore();
//var user = firebase.auth().currentUser.user_id;
//const user_email = firebase.auth().currentUser.user_email
var itemUID = 0;

// retrieve data from Firebase based on user's id
function retrieveItemsFromFirestore() {
    var user_id = firebase.auth().currentUser.uid;
    let path = "users/" + user_id + "/items";
    db.collection(path).get()
    .then(function(docs) {
        docs.forEach(function(doc) {
            if (doc.exists) {
                var recv_data = doc.data();
                //key name comes from the creation in saveItems()
                addItem(recv_data['item']);
            }
            else {
                alert("No items found. Try adding items and saving them.");
            }  
        })


        // removing loading animation
        var element = document.getElementById('preloader');
        element.parentNode.removeChild(element);
    })
    .catch(function(error) {
        alert("Error fetching items list.");
        //alert(error);

        // removing loading animation
        var element = document.getElementById('preloader');
        element.parentNode.removeChild(element)
    });
}

/**************************************************************************************************
 * methods to add/remove/save items
 **************************************************************************************************/

function removeItem(itemId) {
    var element = document.getElementById(itemId);
    element.parentNode.removeChild(element);
}

function addNewItem() {
    var itemId = 'item-' + itemUID;
    itemUID++;

    var item_name = "<td><input type='text' placeholder='Item Name'></td>";
    var item_cost = "<td><input type='number' placeholder='Item Cost'></td>";
    var item_tax = "<td><input type='number' placeholder='Tax'></td>";
    var item_discount = "<td><input type='number' placeholder='Discount'></td>";
    var actions = '<td><a class="btn-floating btn-medium waves-effect waves-light black" onclick="javascript:removeItem(\'' + 
    itemId + '\'); return false;"><i class="material-icons left">delete</i></td>';

    var entry_data = item_name + item_cost + item_tax + item_discount + actions;

    var item_entry = document.createElement("tr");
    item_entry.id = itemId;
    item_entry.innerHTML = entry_data;
    
    document.getElementById('user_items').append(item_entry);
}

function addItem(item) {
    var itemId = 'item-' + itemUID;
    itemUID++;

    var item_name = "<td><input type='text' value='"+ item['Name'] + "'></td>";
    var item_cost = "<td><input type='number' value="+ item['Cost'] + "></td>";
    var item_tax = "<td><input type='number' value="+ item['Tax'] + "></td>";
    var item_discount = "<td><input type='number' value="+ item['Discount'] + "></td>";
    var actions = '<td><a class="btn-floating btn-medium waves-effect waves-light black" onclick="javascript:removeItem(\'' + 
    itemId + '\'); return false;"><i class="material-icons left">delete</i></td>';

    var entry_data = item_name + item_cost + item_tax + item_discount + actions;

    var item_entry = document.createElement("tr");
    item_entry.id = itemId;
    item_entry.innerHTML = entry_data;
    
    document.getElementById('user_items').append(item_entry);
}

function getItemsData() {
    var items_div = document.getElementById('user_items');
    var items = [];

    for (var i = 0; i < items_div.children.length; i++) {
        var item = new Object();

        // items div -> tr -> td -> input element
        item.Name = items_div.children[i].children[0].children[0].value;
        item.Cost = items_div.children[i].children[1].children[0].value;
        item.Tax = items_div.children[i].children[2].children[0].value;
        item.Discount = items_div.children[i].children[3].children[0].value;

        items.push(item);
    }

    //return JSON.stringify(items);
    return items;
}

function saveItems() {
    const user_id = firebase.auth().currentUser.uid;
    var items_data = getItemsData();
    //console.log(items_data)
    let i = 0;
    let last = items_data.length - 1;
    for (const item of items_data){
        //console.log(item)
        const name = item['Name'];
        db.collection('users').doc(user_id).collection('items').doc(name).set({
            item
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
