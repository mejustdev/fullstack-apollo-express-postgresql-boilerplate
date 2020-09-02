import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user;
  return await jwt.sign({ id, email, username }, secret, {
    expiresIn,
  });
};

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
  Mutation: {
    signUp: async (parent, { username, email, password }, { db, secret }) => {
      const user = await db.user.create({
        username,
        email,
        password,
      });
      return { token: createToken(user, secret, '30m') };
    },
    signIn: async (parent, { login, password }, { db, secret }) => {
      const user = await db.user.findByLogin(login);
      if (!user) {
        throw new UserInputError('No user found with this login credentials.');
      }
      const isValid = await user.validatePassword(password);
      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }
      return { token: createToken(user, secret, '30m') };
    },
  },
  User: {
    messages: async (user, args, { db }) => {
      return await db.message.findAll({
        where: {
          userId: user.id,
        },
      });
    },
  },
};
