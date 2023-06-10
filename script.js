
import {endorsementArray} from '/messagesArray.js' 
import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import {getDatabase,ref,push,onValue} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'



const appSettings = {
  databaseURL : "https://playground-37649-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementStoredInDB = ref(database,"endorsements")

const publishBtn = document.getElementById("publishbtn")
const endorsementMessage = document.getElementById("endorsementmessage")
const endorsementSender = document.getElementById("sender")
const endorsementRecipient = document.getElementById("recipient")
const endorsementContainer = document.getElementById("endorsementcontainer")
let endorsementObjectToArray = []


//Increase or decrease like count
document.addEventListener("click",function(e){
  if(e.target.dataset.likes){
   likedEndorsement(e.target.dataset.likes)
    }
})



let newEndorsementObject = {}
function addNewMessageToEndorsementArray(){

  newEndorsementObject= {
    sender : `${endorsementSender.value}`,
    message : `${endorsementMessage.value}`,
    recipient : `${endorsementRecipient.value}`,
    likes : 0,
    isLiked : false
}
    
    push(endorsementStoredInDB,newEndorsementObject)
}



 onValue(endorsementStoredInDB, function(snapshot){
   
endorsementContainer.innerHTML=""

endorsementObjectToArray = Object.entries(snapshot.val())

 
for (let eachendorsementArray of endorsementObjectToArray){
  renderEndorsementToEndorsementContainer(eachendorsementArray) 
}
 })




 function renderEndorsementToEndorsementContainer(arr){
  let endorsementId = arr[0]
  let endorsements = []
  endorsements.push(arr[1])

  
  let list=""
  let listGroup=""
    
  for (let endorsement of endorsements){
  
  
 list =  `
   <div class=endorsementenvelope >
           <p> To: ${endorsement.recipient} </p>

           <p>${endorsement.message}</p>
    <div class="salutation">
           <p> From : ${endorsement.sender} </p>
           <i id="${endorsementId}" data-likes="${endorsementId}" class="fa-solid fa-heart" > ${endorsement.likes} </i>
    </div>       

   </div>
   `
   }
      
   listGroup += list
    
   endorsementContainer.innerHTML = listGroup
   
 } 
 

 // toggling like icon when clicked
function likedEndorsement(endorsementId){
      //filter out clicked endorsement
const clickedEndorsementArray = endorsementObjectToArray.filter(endorsement => endorsement[0] === endorsementId)[0]
console.log(clickedEndorsementArray)
const clickedEndorsement = clickedEndorsementArray[1]

if (clickedEndorsement.isLiked){
  clickedEndorsement.likes --
  document.getElementById(`${endorsementId}`).style.color="#8f8f8f"
}else{
  clickedEndorsement.likes ++ 
   document.getElementById(`${endorsementId}`).style.color=`red`
    }
clickedEndorsement.isLiked = !clickedEndorsement.isLiked

document.getElementById(`${endorsementId}`).textContent = `  ${clickedEndorsement.likes}`

 }


//  function persistLikedStyle(sheet){
//   localStorage.setItem("style",sheet)
//    document.getElementById("pagestyle").setAttribute("href",sheet)
//  }

//  function restoreStyling(){
//   const sheet = localStorage.getItem("style") || "style.css"
//   document.getElementById("pagestyle").setAttribute("href",sheet)
//  }

//  restoreStyling()



  




publishBtn.addEventListener("click",function(){
  
    
   switch(true){
    case endorsementSender.value === "":
     case endorsementMessage.value ==="":
     case endorsementRecipient.value === "":
      return
   }

  addNewMessageToEndorsementArray() 

    endorsementSender.value =""
    endorsementMessage.value =""
    endorsementRecipient.value =""

  renderEndorsementToEndorsementContainer(arr)

 
})