// implement your API here
const express = require('express');

const Users = require('./data/db.js');

const server = express();

server.use(express.json());

// GET ALL USERS
server.get('/users', (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: 'The users information could not be retrieved.' });
    });
});

// GET A SINGLE USER
//NOT FOUND VS NOT ACCESABLE
server.get('/users/:id', (req, res) => {
  const { id } = req.params;
  Users.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: 'The user information could not be retrieved.' });
    });
});

// POST A NEW USER
server.post('/users', (req, res) => {
  const userInfo = req.body;
  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  }
  Users.insert(userInfo)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      res.status(500).json({
        error: 'There was an error while saving the user to the database',
      });
    });
});

// DELETE A USER
server.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  Users.remove(id)
    .then(deletedUser => {
      if (deletedUser) {
        /* res.status(204).send();   */
        res.status(204).end();
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'The user could not be removed' });
    });
});

// UPDATE A USER
server.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  }

  Users.update(id, changes)
    .then(updatedUser => {
      if (updatedUser) {
        /* res.status(204).send();   */
        res.status(200).json(updatedUser);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'The user could not be modified' });
    });
});

const port = 6000;
server.listen(port, () =>
  console.log(`\n*** running on https://localhost:${port} ***\n`),
);
