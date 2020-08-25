export default {
  Query: {
    users: async (parent, args, { db }) => {
      return await db.user.findAll();
    },
    // parent, args, context, info
    user: async (parent, { id }, { db }) => {
      return await db.user.findById(id);
    },
    me: async (parent, args, { me }) => {
      return await db.user.findById(me.id);
    },
  },
  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id,
        },
      });
    },
  },
};
