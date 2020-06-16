
var socket =io();//io.connect("http://localhost:5000"); //io();// || "http://localhost:5000");
var userlist = document.getElementById("userlist1");
var imgsrc = document.getElementById("imgsrc");
var roomlist = document.getElementById("roomlist");
var message = document.getElementById("message");
var sendMessageBtn = document.getElementById("send");
var createRoomBtn = document.getElementById("create-room");
var messages = document.getElementById("msg");
var chatDisplay = document.getElementById("chat-display");
var test = document.getElementById("test");
var count = document.getElementById("count");
var imgadd;
var userName = document.getElementById("username");
var historytotal=document.getElementById("historytotal");
var myPix = new Array("png/007-woman.png","png/008-man.png","png/009-girl.png","png/010-man.png","png/006-nurse.png","png/005-woman.png","png/004-man.png","png/001-man.png","png/002-woman.png","png/003-delivery man.png");
// function choosePic() {
//   test.innerHTML+="function choosePic-";
//   var randomNum = Math.floor(Math.random() * myPix.length);
//   document.getElementById("myPicture").src = myPix[randomNum];
//   imgadd = document.getElementById("myPicture").src;
// }

function setCookie(cname, cvalue, exdays) {
  //test.innerHTML+="function setCookie-";
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  //test.innerHTML+="function getCookie-";
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function checkCookie() {
  //test.innerHTML+="function checkCookie-";
  var ia=getCookie("imageAddress");
  //test.innerHTML+="function checkCookie again-";
  if (ia != "") {
     //new choosePic();
     test.innerHTML="hii";
  }else {
    //test.innerHTML+="function choosePic-";
    var randomNum = Math.floor(Math.random() * myPix.length);
    document.getElementById("myPicture").src = myPix[randomNum];
    imgadd = document.getElementById("myPicture").src;
    //test.innerHTML+="function checkCookie again-";
    ia = imgadd;
    if (ia != "" && ia != null) {
      setCookie("imageAddress", ia, 30);
      //test.innerHTML+="function checkCookie again-";
    }
  }
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
   //test.innerHTML+="function connect-";
   new checkCookie();
   var ia= getCookie("imageAddress");
   socket.emit("createUser", userName.textContent);
   socket.emit("imgadd", ia);
   socket.emit("count", 1);
   var d = new Date();
   var n = d.toUTCString();
   var history = "Name: "+userName.textContent+" Visit time: "+n;
   //test.innerHTML=history;
   socket.emit("history", history);
   document.getElementById("myPicture").src = ia;
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
  for (var user in usernames){
    uv[i]=user;
    userlist.innerHTML += "<li>"+user+"</li>";//+" "+user;//"<img src=\"png/001-man.png\" id=\"myPicture\" width=\"50px\" height=\"50px\">"+user;
    i++;
  }
});
var j=0;
var k =uv.length-1;
socket.on("imgsrc1", function(imgadds) {
  imgsrc.innerHTML = "";
  for (var imsr in imgadds) {
      uname = uv[k];
      imgsrc.innerHTML += "<img src=\""+imsr+"\" id=\"myPicture\" width=\"50px\" height=\"50px\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""+uname+"\">";//+" "+user;//"<img src=\"png/001-man.png\" id=\"myPicture\" width=\"50px\" height=\"50px\">"+user;
    k--;
  }
});

socket.on("historyTotal", function(his) {
  historytotal.innerHTML = "";
  for (var ht in his) {
      historytotal.innerHTML += "<li>"+ht+"</li>";//"<img src=\""+imsr+"\" id=\"myPicture\" width=\"50px\" height=\"50px\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\""+uname+"\">";//+" "+user;//"<img src=\"png/001-man.png\" id=\"myPicture\" width=\"50px\" height=\"50px\">"+user;
  }
});

socket.on("countinc", function(counts) {
  count.innerHTML = counts;
});
// var imgsrc = document.getElementById("myPicture").src;
document.getElementById("logot").addEventListener("click", myFunction);

function myFunction() {
  socket.emit("disconnect");
}

socket.emit("disconnect");

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

function hist() {
  var x = document.getElementById("myDIV");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
