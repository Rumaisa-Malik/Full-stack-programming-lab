let skip = 0;
const limit = 5;

const postList = document.getElementById("postList");
const loadBtn = document.getElementById("loadBtn");

loadBtn.addEventListener("click", loadPosts);

function loadPosts(){

fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`)
.then(res => res.json())
.then(data => {

data.posts.forEach(post => {

let div = document.createElement("div");
div.classList.add("post");

div.innerHTML = `
<h3>${post.title}</h3>
<p>${post.body}</p>
<small>👍 ${post.reactions.likes} Likes | 👎 ${post.reactions.dislikes}</small>
`;

postList.appendChild(div);

});

skip += limit;

})
.catch(error => console.log(error));

}