var socket = io.connect("http://localhost:5000");
var userlist = document.getElementById("userlist1");
var imgsrc = document.getElementById("imgsrc");
var roomlist = document.getElementById("roomlist");
var message = document.getElementById("message");
var sendMessageBtn = document.getElementById("send");
var createRoomBtn = document.getElementById("create-room");
var messages = document.getElementById("msg");
var chatDisplay = document.getElementById("chat-display");
var imgadd;
var userName = document.getElementById("username");
window.onload = choosePic;
var myPix = new Array("png/007-woman.png","png/008-man.png","png/009-girl.png","png/010-man.png","png/006-nurse.png","png/005-woman.png","png/004-man.png","png/001-man.png","png/002-woman.png","png/003-delivery man.png","png/11.png","png/12.png","png/13.png","png/14.png","png/15.png","png/16.png","png/17.png","png/18.png","png/19.png","png/20.png","png/21.png","png/22.png","png/23.png","png/24.png","png/25.png","png/26.png","png/27.png","png/28.png","png/29.png","png/30.png");
function choosePic() {
  var randomNum = Math.floor(Math.random() * myPix.length);
  document.getElementById("myPicture").src = myPix[randomNum];
  imgadd = document.getElementById("myPicture").src;
  document.getElementById("myPicture1").src = document.getElementById("myPicture").src;
}

var currentRoom = "global";

// Send message on button click
sendMessageBtn.addEventListener("click", function () {
  socket.emit("sendMessage", message.value);
  message.value = "";
});

// Send message on enter key press
message.addEventListener("keyup", function (event) {
  if (event.keyCode == 13) {
    sendMessageBtn.click();
  }
});

// Create new room on button click
createRoomBtn.addEventListener("click", function () {
  socket.emit("createRoom", prompt("Enter new room: "));
  //socket.emit("createRoom", name.value));
});

socket.on("connect", function() {
  //socket.emit("createUser", prompt("Enter name: "));
  socket.emit("createUser", userName.textContent);
  socket.emit("imgadd", imgadd);
});


socket.on("updateChat", function(username, data) {
  if (username == "INFO") {
    messages.innerHTML +=
      "<p class='alert alert-warning w-100'>" + data + "</p>";
  } else {
    messages.innerHTML +=
      "<p><span><strong>" + username + ": </strong></span>" + data + "</p>";
  }

  chatDisplay.scrollTop = chatDisplay.scrollHeight;
});



// Tooltips Initialization
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
var uv = [], i=0;
socket.on("updateUsers", function(usernames) {
  userlist.innerHTML = "";
  for (var user in usernames) {
    if(i<6){
      uv[i]=user;

    }
    userlist.innerHTML += " "+user+" ";//+" "+user;//"<img src=\"png/001-man.png\" id=\"myPicture\" width=\"50px\" height=\"50px\">"+user;
    i++;
  }
});
var j=0;
socket.on("imgsrc1", function(imgadds) {
  imgsrc.innerHTML = "";
  for (var imsr in imgadds) {
    
      uname = uv[j];
      imgsrc.innerHTML += "<img src=\""+imsr+"\" width=\"50px\" height=\"50px\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""+uname+"\">";//+" "+user;//"<img src=\"png/001-man.png\" id=\"myPicture\" width=\"50px\" height=\"50px\">"+user;
    
    j++;
  }
});
// var imgsrc = document.getElementById("myPicture").src;


socket.on("updateRooms", function(rooms, newRoom) {
  roomlist.innerHTML = "";

  for (var index in rooms) {
    roomlist.innerHTML +=
      '<li class="rooms" id="' +
      rooms[index] +
      '" onclick="changeRoom(\'' +
      rooms[index] +
      "')\"># " +
      rooms[index] +
      "</li>";
  }

  if (newRoom != null) {
    document.getElementById(newRoom).classList.add("text-warning");
  } else {
    document.getElementById(currentRoom).classList.add("text-warning");
  }

});


function changeRoom(room) {

  if (room != currentRoom) {
    socket.emit("updateRooms", room);
    document.getElementById(currentRoom).classList.remove("text-warning");
    currentRoom = room;
    document.getElementById(currentRoom).classList.add("text-warning");
  }

}
