export default {
  Query: {
    messages: async (parent, args, { db }) => {
      return await db.message.findAll();
    },
    message: async (parent, { id }, { db }) => {
      return await db.message.findById(id);
    },
  },

  Mutation: {
    createMessage: async (parent, { text }, { me, db }) => {
      try {
        return await db.message.create({
          text,
          userId: me.id,
        });
      } catch (error) {
        throw new Error(error);
      }
    },

    deleteMessage: async (parent, { id }, { db }) => {
      return await db.message.destroy({ where: { id } });
    },
  },

  Message: {
    user: async (message, args, { db }) => {
      return await db.user.findById(message.userId);
    },
  },
};
