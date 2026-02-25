// change to false to test rejection
let dataSuccess = true;

/* function returning a Promise */
function fetchUsers(){

return new Promise(function(resolve, reject){

    document.getElementById("status").textContent =
        "Loading users... please wait 3 seconds.";

    setTimeout(function(){

        if(dataSuccess){

            // array of user objects
            const users = [
                {id:1, name:"Ali Khan", age:22},
                {id:2, name:"Sara Ahmed", age:21},
                {id:3, name:"Usman Tariq", age:23},
                {id:4, name:"Hina Malik", age:20}
            ];

            resolve(users);

        }else{
            reject("Server Error: Failed to load users.");
        }

    },3000);

});

}

/* button event */
document.getElementById("loadBtn").addEventListener("click", function(){
const list = document.getElementById("userList");
list.innerHTML = "";

fetchUsers()
.then(function(users){

    document.getElementById("status").textContent =
        "Users Loaded Successfully!";

    users.forEach(function(user){
        const li = document.createElement("li");
        li.textContent =
            "ID: " + user.id + " | Name: " + user.name + " | Age: " + user.age;
        list.appendChild(li);
    });

})
.catch(function(error){
    document.getElementById("status").textContent = error;
});

});
