/*
  STEP 1: using axios, send a GET request to the following URL
    (replacing the placeholder with your Github name):
    https://api.github.com/users/<your name>
*/

import axios from "axios";
import { get, post } from "httpie";

let responseForSelf;

axios
   .get("https://api.github.com/users/abc1929")
   .then((res) => {
      responseForSelf = res;
      console.log(responseForSelf);
   })
   .catch((err) => {
      console.log(err);
   });

/*
  STEP 2: Inspect and study the data coming back, this is YOUR
    github info! You will need to understand the structure of this
    data in order to use it to build your component function

    Skip to STEP 3.
*/

const followersArray = [];
var getFollowersFired = false; // global var to ensure followers are only retrieved once.

/*
  STEP 3: Create a function that accepts a single object as its only argument.
    Using DOM methods and properties, create and return the following markup:

    <div class="card">
      <img src={image url of user} />
      <div class="card-info">
        <h3 class="name">{users name}</h3>
        <p class="username">{users user name}</p>
        <p>Location: {users location}</p>
        <p>Profile:
          <a href={address to users github page}>{address to users github page}</a>
        </p>
        <p>Followers: {users followers count}</p>
        <p>Following: {users following count}</p>
        <p>Bio: {users bio}</p>
      </div>
    </div>
*/

function createCard(data) {
   // creating http elements & filling in data
   const card = document.createElement("div");
   card.className = "card";
   const img = document.createElement("img");
   img.src = data.avatar_url;
   const cardinfo = document.createElement("div");
   cardinfo.className = "card-info";
   const name = document.createElement("h3");

   name.className = "name";
   name.append(data.name);
   const username = document.createElement("p");
   username.className = "username";
   username.append(data.login);
   const location = document.createElement("p");
   location.append(`Location: ${data.location}`);
   const profile = document.createElement("p");
   profile.append(`Profile: `);
   const link = document.createElement("a");
   link.href = `https://github.com/${data.login}`;
   link.text = `https://github.com/${data.login}`;
   const followers = document.createElement("p");
   followers.append(`Followers: ${data.followers}`);
   const following = document.createElement("p");
   following.append(`Following: ${data.following}`);

   const bio = document.createElement("p");
   bio.append(`Bio: ${data.bio}`);

   let caldiv = document.createElement("div");
   let cal = document.createElement("img");
   cal.className = "calendar";
   cal.src = `https://ghchart.rshah.org/${data.login}`;
   cal.alt = `contributions for ${data.login}`;
   caldiv.append(cal);

   // constructing hierarchy
   profile.append(link);
   cardinfo.append(
      name,
      username,
      location,
      profile,
      followers,
      following,
      bio,
      caldiv
   );
   card.append(img, cardinfo);

   return card;
}

/*
  STEP 4: Pass the data received from Github into your function,
    and append the returned markup to the DOM as a child of .cards
*/

// addcard function get a response and create a user card to the DOM from the response
// *Not used*
function addcard(usr) {
   axios
      .get("https://api.github.com/users/" + usr)
      .then((res) => {
         // console.log(res.data);
         document.querySelector(".cards").append(createCard(res.data));
      })
      .catch((err) => {
         console.log(err);
      });
}

/*
  STEP 5: Now that you have your own card getting added to the DOM, either
    follow this link in your browser https://api.github.com/users/<Your github name>/followers,
    manually find some other users' github handles, or use the list found at the
    bottom of the page. Get at least 5 different Github usernames and add them as
    Individual strings to the friendsArray below.

    Using that array, iterate over it, requesting data for each user, creating a new card for each
    user, and adding that card to the DOM.
*/

function getFollowersCards(usr) {
   // this function might get triggered multiple times, we use a global var to guarantee this can only be ran once.
   if (getFollowersFired) {
      return;
   }
   getFollowersFired = true;
   axios
      .get(`https://api.github.com/users/${usr}/followers`)
      .then(
         // store followers into the given array
         (res) => {
            followersArray.push(...res.data.map((i) => i.login));
         }
      )
      .catch((e) => {
         console.log(e);
      });
}

/*
  List of LS Instructors Github username's:
    tetondan
    dustinmyers
    justsml
    luishrd
    bigknell
*/

const instructors = [
   "tetondan",
   "dustinmyers",
   "justsml",
   "luishrd",
   "bigknell",
];

// This function guarantees the cards gets rendered in the order of {instructors}, {me}, {my followers}
// Each recursion we append a newly created card to the dom
function sequentiallyAddAllCards(list) {
   if (list[0] === "0") {
      // true end of process
      // adds contributions before exiting
      document.querySelectorAll(".calendar").forEach((i) => {
         i.style.width = "130%";
         i.style["margin-left"] = "-175px";
         i.style["margin-top"] = "30px";
         // i.style.height = "95%";
         // console.log(i);
      });

      return;
   }
   if (list.length === 0) {
      // handle case after  non-followers cases are all handled
      // hack a '0' into the array to indicate end of all entries.
      sequentiallyAddAllCards(followersArray.concat("0"));
      return;
   }
   axios
      .get("https://api.github.com/users/" + list[0])
      .then((res) => {
         // console.log(res.data);
         if (followersArray.length === 0) {
            getFollowersCards("abc1929");
         }
         document.querySelector(".cards").append(createCard(res.data));
         sequentiallyAddAllCards(list.slice(1));
      })
      .catch((err) => {
         console.log(err);
      });
}

sequentiallyAddAllCards(instructors.concat("abc1929"));

console.log("test");
