const DataLoader = require("dataloader");
const url = require("url");

function loadHousehold(http) {
  return http.get("households").then(res => res.data.households);
}

function loadGroups(id, http) {
  return http.get(`households/${id}/groups`).then(res => res.data);
}

function loadGroupVolume(id, http) {
  return http.get(`groups/${id}/groupVolume`).then(res => res.data);
}

function loadGroupPlayback(id, http) {
  return http.get(`groups/${id}/playback`).then(res => res.data);
}

function loadPlayers(id, http) {
  return http.get(`households/${id}/players`).then(res => res.data);
}

function loadPlayerVolume(id, http) {
  return http.get(`players/${id}/playerVolume`).then(res => res.data);
}

function loadHouseholdFavorites(id, http) {
  return http.get(`households/${id}/favorites`).then(res => res.data.items);
}

function loadHouseholdFavorites(id, http) {
  return http.get(`households/${id}/favorites`).then(res => res.data.items);
}

module.exports = function(http) {
  return {
    households: new DataLoader(keys => {
      let requests = keys.map(key => loadHousehold(http));

      return Promise.all(requests);
    }),

    groups: new DataLoader(keys => {
      let requests = keys.map(key => loadGroups(key, http));

      return Promise.all(requests);
    }),

    groupVolume: new DataLoader(keys => {
      let requests = keys.map(key => loadGroupVolume(key, http));

      return Promise.all(requests);
    }),

    groupPlayback: new DataLoader(keys => {
      let requests = keys.map(key => loadGroupPlayback(key, http));

      return Promise.all(requests);
    }),

    players: new DataLoader(keys => {
      let requests = keys.map(key => loadPlayers(key, http));

      return Promise.all(requests);
    }),

    playerVolume: new DataLoader(keys => {
      let requests = keys.map(key => loadPlayerVolume(key, http));

      return Promise.all(requests);
    }),

    favorites: new DataLoader(keys => {
      let requests = keys.map(key => loadHouseholdFavorites(key, http));

      return Promise.all(requests);
    })
  };
};
