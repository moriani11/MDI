function saveCollection(collection) {
  localStorage.setItem("gameCollection", JSON.stringify(collection));
}

function getCollection() {
  return JSON.parse(localStorage.getItem("gameCollection") || "[]");
}

function addToCollection(gameId) {
  const collection = getCollection();

  if (!collection.includes(gameId)) {
    collection.push(gameId);
    saveCollection(collection);
    alert("Game added to collection!");
  } else {
    alert("Game already in collection!");
  }
}

function removeFromCollection(gameId) {
  let collection = getCollection();
  collection = collection.filter((id) => id !== gameId);

  saveCollection(collection); 
  collectionGames = collection;
  displayCollection();
  updateStats();

  alert("Game removed from collection!");
}
