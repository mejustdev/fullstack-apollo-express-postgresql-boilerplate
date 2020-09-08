import { ForbiddenError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';

export default {
  Query: {
    messages: async (parent, args, { db }) => {
      return await db.message.findAll();
    },
    message: async (parent, { id }, { db }) => {
      return await db.message.findByPk(id);
    },
  },

  Mutation: {
    createMessage: combineResolvers(isAuthenticated, async (parent, { text }, { me, db }) => {
      if (!me) {
        throw new ForbiddenError('Not authenticated as user.');
      }
      return await db.message.create({
        text,
        userId: me.id,
      });
    }),
    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { db }) => {
        return await db.message.destroy({ where: { id } });
      },
    ),
  },
  Message: {
    user: async (message, args, { db }) => {
      return await db.user.findByPk(message.userId);
    },
  },
};
