const images = [
{
src:"https://picsum.photos/id/1015/600/400",
caption:"Beautiful Mountain View"
},
{
src:"https://picsum.photos/id/1025/600/400",
caption:"Cute Dog in Nature"
},
{
src:"https://picsum.photos/id/1035/600/400",
caption:"Peaceful River Landscape"
},
{
src:"https://picsum.photos/id/1043/600/400",
caption:"Forest Road Adventure"
}
];

let index = 0;

const img = document.getElementById("galleryImage");
const caption = document.getElementById("caption");

document.getElementById("nextBtn").addEventListener("click", nextImage);
document.getElementById("prevBtn").addEventListener("click", prevImage);

function showImage(){

img.classList.add("fade-out");

setTimeout(() => {

img.src = images[index].src;
caption.textContent = images[index].caption;

img.classList.remove("fade-out");
img.classList.add("fade-in");

}, 400);

}

function nextImage(){

index++;

if(index >= images.length){
index = 0;
}

showImage();
}

function prevImage(){

index--;

if(index < 0){
index = images.length - 1;
}

showImage();
}