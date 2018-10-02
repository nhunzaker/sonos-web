const Url = require("url");

const Resolvers = {
  Query: {
    households(root, args, { loaders }, info) {
      return loaders.households.load(true);
    },
    groups(root, { household }, context, info) {
      return Resolvers.Household.groups({ id: household }, {}, context, info);
    },
    favorites(root, { household }, context, info) {
      return Resolvers.Household.favorites(
        { id: household },
        {},
        context,
        info
      );
    }
  },
  Mutation: {
    async play(root, { group }, { sonos }) {
      await sonos.post(`groups/${group}/playback/play`);
      return true;
    },
    async pause(root, { group }, { sonos }) {
      await sonos.post(`groups/${group}/playback/pause`);
      return true;
    },
    async next(root, { group }, { sonos }) {
      await sonos.post(`groups/${group}/playback/skipToNextTrack`);
      return true;
    },
    async previous(root, { group }, { sonos }) {
      await sonos.post(`groups/${group}/playback/skipToPreviousTrack`);
      return true;
    }
  },
  Household: {
    async groups(house, args, { loaders }, info) {
      let { players, groups } = await loaders.groups.load(house.id);

      return groups.map(group => {
        return {
          ...group,
          players: players.filter(player => group.playerIds.includes(player.id))
        };
      });
    },

    async players(house, args, { loaders }, info) {
      let { players } = await loaders.players.load(house.id);
      return players;
    },

    favorites(house, args, { loaders }, info) {
      return loaders.favorites.load(house.id);
    }
  },
  Group: {
    volume(group, args, { loaders }, info) {
      return loaders.groupVolume.load(group.id);
    },

    coordinator(group, args, context, info) {
      return group.players.find(player => player.id === group.coordinatorId);
    },

    playback(group, args, { loaders }, info) {
      return loaders.groupPlayback.load(group.id);
    }
  },
  Player: {
    volume(player, args, { loaders }, info) {
      return loaders.playerVolume.load(player.id);
    }
  }
};

module.exports = Resolvers;
