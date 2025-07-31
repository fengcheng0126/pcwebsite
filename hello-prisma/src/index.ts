import express from 'express';
import cors from 'cors';
import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

import { PrismaClient } from '@prisma/client';

import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

const app = express();
const PORT = 4000;
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

console.log("index.ts is running");
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://dev-ki6byr6pa5z8641l.us.auth0.com/.well-known/jwks.json` // <-- Replace with your Auth0 domain
  }),
  audience: 'uuozl24nsttxyVjNuYLHDqSnaqEJdVZ6', // <-- Replace with your Auth0 API identifier
  issuer: `https://dev-ki6byr6pa5z8641l.us.auth0.com/`, // <-- Replace with your Auth0 domain
  algorithms: ['RS256']
});

function withAuth(
  handler: (req: AuthedRequest, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req as AuthedRequest, res, next).catch(next);
  };
}


interface AuthedRequest extends Request {
  auth: JwtPayload & { [key: string]: any };
}


/** CREATE: Add new user (protected, uses Auth0 ID) */
app.post('/api/users', checkJwt, withAuth(async (req, res) => {

  const auth0Id = req.auth.sub;
  const { email, name } = req.body;
  try {
    const user = await prisma.user.create({ data: { email, name, auth0Id } });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'User creation failed' });
  }
}));


/** CREATE: Add new post for user by email */
app.post('/api/posts', async (req, res) => {
  const { title, content, email, date, price } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        date: date ? new Date(date) : new Date(),
        price,
        author: {
          connect: { email }
        }
      }
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Post creation failed' });
  }
});

/** ADDED: Get all Users. */
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      auth0Id: true,
      posts: {
        select: {
          id: true,
          title: true,
          content: true,
          date: true,
          price: true,
          status: true,
          published: true,
        }
      }
    }
  });
  res.json(users);
});

/** READ: Get all posts */
app.get('/api/posts', async (req, res) => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      date: true,
      price: true,
      status: true,
      published: true,
      author: {
        select: {
          id: true,
          email: true,
          name: true,
          auth0Id: true,
        }
      }
    }
  });
  res.json(posts);
});

/** READ: Get single post by ID */
app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { author: true }
  });
  post ? res.json(post) : res.status(404).json({ error: 'Post not found' });
});

/** GET single user by id */
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { posts: true } // optional: include related data
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/** UPDATE: Update post by ID */
app.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, published } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content, published }
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

/** DELETE: Delete post by ID */
app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({ where: { id: Number(id) } });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

/** DELETE: Delete user by ID */
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});


app.get('/api/userID', checkJwt, withAuth(async (req, res) => {
  console.log("api/userID is running!");

  const auth0Id = req.auth.sub;
  const email = req.auth.email;
  const name = req.auth.name;

  console.log("AUTH PAYLOAD:", req.auth);
  console.log("Extracted email:", email);
  console.log("Extracted name:", name);

  let user = await prisma.user.findUnique({ where: { auth0Id } });

  if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          auth0Id: auth0Id,
        },
      });
    }

  res.status(200).json(user);
}));
// app.get('/api/userID', async (req, res) => {
  
//   console.log("api/me is running");

//   res.status(200).json();
// });

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
