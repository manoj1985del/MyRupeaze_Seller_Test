'use strict';

//initFirebaseAuth();

saveMessage("hello Manoj");

// Signs-in Friendly Chat.
function signIn() {
 // Sign into Firebase using popup auth & Google as the identity provider.
 var provider = new firebase.auth.GoogleAuthProvider();
 firebase.auth().signInWithPopup(provider);
}

// Signs-out of Friendly Chat.
function signOut() {
  // TODO 2: Sign out of Firebase.
  firebase.auth().signOut();
}

// Initiate firebase auth.
function initFirebaseAuth() {
  // TODO 3: Initialize Firebase.
   // Listen to auth state changes.
   firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's display name.
function getUserName() {
    // TODO 5: Return the user's display name.
    return firebase.auth().currentUser.displayName;
  }

  // Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
    // TODO 4: Return the user's profile pic URL.
    return firebase.auth().currentUser.photoURL;
  }

// Saves a new message on the Firebase DB.
function saveMessage(messageText) {
    // TODO 7: Push a new message to Firebase.
    // Add a new message entry to the database.
    console.log("going to add to firebase");
    return firebase.firestore().collection('messages').add({
      name: "manoj",
      text: messageText,
      profilePicUrl: "normal url",
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function(error) {
      console.error('Error writing new message to database', error);
    });
  }