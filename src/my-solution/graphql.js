import { loadPets, ownersByPetNames } from './lib/db.js'
import mercurius from 'mercurius'

const { ErrorWithProps } = mercurius

const usersLocale = [
  { name: 'Alice', locale: 'en' },
  { name: 'Bob', locale: 'fr' }
]

const users = {
  1: {
    id: '1',
    name: 'John'
  },
  2: {
    id: '2',
    name: 'Jane'
  }
}

const schema = `
  type Person {
    name: String
  }
  type Pet {
    name: String
    owner: Person
  }
  type UserLocale {
    name: String
    locale: String
  }
  type User {
    id: ID!
    name: String
  }
  type Query {
    pets: [Pet]
    add(x: Int, y: Int): Int
    getUserByLocale(locale: String): UserLocale
    findUser(id: Int): User
  }
`

const resolvers = {
  Query: {
    add: (_, { x, y }) => x + y,
    pets: (_, __, context) => loadPets(context.app.pg),
    getUserByLocale: (_, __, { locale }) =>
      usersLocale.find(user => user.locale === locale),
    findUser: (_, { id }) => {
      const user = users[id]
      if (user) return users[id]
      else
        throw new ErrorWithProps('Invalid User ID', {
          id,
          code: 'USER_ID_INVALID'
        })
    }
  }
}

const loaders = {
  Pet: {
    async owner(queries, context) {
      const petNames = queries.map(({ obj }) => obj.name)
      return ownersByPetNames(context.app.pg, petNames)
    }
  }
}

export { schema, resolvers, loaders }
