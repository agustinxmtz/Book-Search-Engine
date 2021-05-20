const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return await User.findOne({ _id: context.user._id})
                    .select('-__v -password');
            }
            else throw new AuthenticationError('You are not logged in.');
        }
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) throw new AuthenticationError('Incorrect credentials');

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) throw new AuthenticationError('Incorrect credentials');

            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, { input }, { user }) => {
            if (user) {
                return await User.findOneAndUpdate(
                    { _id: user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true }
                );
            }

            throw new AuthenticationError('You are not logged in.');
        },

        removeBook: async (parent, { bookId }, { user }) => {
            if (user) {
                return await User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
            }

            throw new AuthenticationError('You are not logged in.');
        }
    }
};

module.exports = resolvers;