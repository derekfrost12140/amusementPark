document.addEventListener('DOMContentLoaded', async () => {
    /*********************************
     * 1. Initialize Firebase
     *********************************/
    const firebaseConfig = {
      apiKey: "AIzaSyBn7xE-jaEuixzyDROnbHrQo6-YtOR5LaU",
      authDomain: "amusement-park-4039d.firebaseapp.com",
      projectId: "amusement-park-4039d",
      storageBucket: "amusement-park-4039d.appspot.com",
      messagingSenderId: "625618396056",
      appId: "1:625618396056:web:ff2907be3a1958ed9041ed",
      measurementId: "G-6QHBHT0PPE"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();