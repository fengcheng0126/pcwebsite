import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient()
  .$extends(withAccelerate());

// A `main` function so that we can use async/await
async function main() {

  const user1Email = `alice${Date.now()}@prisma.io`;
  const user2Email = `bob${Date.now()}@prisma.io`;
  const user1Auth0Id = `auth0|alice${Date.now()}`;
  const user2Auth0Id = `auth0|bob${Date.now()}`;

  // Seed the database with users and posts
  const user1 = await prisma.user.create({
    data: {
      email: user1Email,
      name: 'Alice',
      auth0Id: user1Auth0Id,
      posts: {
        create: {
          title: 'Join the Prisma community on Discord',
          content: 'https://pris.ly/discord',
          published: true,
          date: new Date(),
          price: 0,
        },
      },
    },
    include: {
      posts: true,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: user2Email,
      name: 'Bob',
      auth0Id: user2Auth0Id,
      posts: {
        create: [
          {
            title: 'Check out Prisma on YouTube',
            content: 'https://pris.ly/youtube',
            published: true,
            date: new Date(),
            price: 0,
          },
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma/',
            published: false,
            date: new Date(),
            price: 0,
          },
        ],
      },
    },
    include: {
      posts: true,
    },
  });
  console.log(
    `Created users: ${user1.name} (${user1.posts.length} post) and ${user2.name} (${user2.posts.length} posts) `,
  );

  // Retrieve all published posts
  const allPosts = await prisma.post.findMany({
    where: { published: true },
  });
  console.log(`Retrieved all published posts: ${JSON.stringify(allPosts)}`);

  // Create a new post (written by an already existing user with email alice@prisma.io)
  const newPost = await prisma.post.create({
    data: {
      title: 'Join the Prisma Discord community',
      content: 'https://pris.ly/discord',
      published: false,
      date: new Date(),
      price: 0,
      author: {
        connect: {
          email: user1Email,
        },
      },
    },
  });
  console.log(`Created a new post: ${JSON.stringify(newPost)}`);

  // Publish the new post
  const updatedPost = await prisma.post.update({
    where: {
      id: newPost.id,
    },
    data: {
      published: true,
    },
  });
  console.log(`Published the newly created post: ${JSON.stringify(updatedPost)}`);

  // Retrieve all posts by user with email alice@prisma.io
  const postsByUser = await prisma.post
    .findMany({
      where: {
        author: {
          email: user1Email
        }
      },
    });
  console.log(`Retrieved all posts from a specific user: ${JSON.stringify(postsByUser)}`);

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
