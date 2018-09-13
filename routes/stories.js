const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');


//Stories INDEX
router.get('/', (req, res) => {
  Story.find({
    status: 'public'
  })
    .sort({ date: 'desc' })
    .populate('user')  //populates user from database
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    });
});

//Show single story
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
      if (story.status == 'public') {
/*         console.log(story.user._id);
        console.log(req.user.id); */

        res.render('stories/show', {
          story: story
        });
      } else {
        /* console.log(story.user._id);
        console.log(req.user.id); */
        if ((req.user) && (req.user.id == story.user._id))  {
          res.render('stories/show', {
            story: story
          });
        } else {
          res.redirect('/stories');
        }
      }
    });
});


//List stories from a specific user
router.get('/user/:userId', (req, res) => {
  Story.find({
    user: req.params.userId,
    status: 'public'
  })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      })
    })
})

// logged in user stories - mystories

router.get('/my', ensureAuthenticated, (req, res) => {
  Story.find({
    user: req.user.id,
  })
    .sort({ date: 'desc' })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      })
    })
})


//Add stories form

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

//Edit stories form

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .then(story => {
      if (story.user != req.user.id) {
        res.redirect('/stories');
      } else {
        res.render('stories/edit', {
          story: story
        });
      }
    });
});


//Process Add Story (does not work)
router.post('/', (req, res) => {

  let allowComments;
  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }
  console.log(allowComments);

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  }
  // Create a story
/*   new Story(newStory)
    .save()
    .then(story => {
      res.redirect(`/stories/show/${story.id}`);
    }); */



    //NEW
    new Story(newStory)
    .save()
    .then(story => {
      User.findByIdAndUpdate(req.user.id, {$push:{story:story}},(err,user)=>{if(err){next(err);
        res.redirect(`/stories/show/${story.id}`); 
      
      }});

      
    });
})

//Edit form process

router.put('/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .then(story => {
      let allowComments;
      if (req.body.allowComments) {
        allowComments = true;
      } else {
        allowComments = false;
      }
      //New Values coming from the form
      story.title = req.body.title;
      story.body = req.body.body;
      story.status = req.body.status;
      story.allowComments = allowComments;
      story.save()
        .then(story => {
          res.redirect('/dashboard');
        })
    });
});

//Delete Story
router.delete('/:id', (req, res) => {
  Story.deleteOne({
    _id: req.params.id
  })
    .then(() => {
      res.redirect('/dashboard');
    })
});

//Add comment
router.post('/comment/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .then(story => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      }
      //Push to comments array
      story.comments.unshift(newComment);
      story.save()
        .then(story => {
          res.redirect(`/stories/show/${story.id}`);
        });
    });
});

module.exports = router;