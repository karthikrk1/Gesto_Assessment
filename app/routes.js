var Food = require('./models/food');

function getFoods(res) {
  Food.find(function(err, foods) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) {
      res.send(err);
    }

    res.json(foods); // return all foods in JSON format
  });
};

function getTotal(res) {
  Food.find(function(err, foods) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) {
      res.send(err);
    }

    var total = 0;
    foods.forEach(function(food) {
      total += food.price;
    });

    total = total * 1.075;

    res.json(total);
  });
};

module.exports = function(app) {

  // api ---------------------------------------------------------------------
  // get all foods
  app.get('/api/food', function(req, res) {
    // use mongoose to get all foods in the database
    getFoods(res);
  });

  app.get('/api/total', function(req, res) {
    getTotal(res);
  });

  // create food and send back all foods after creation
  app.post('/api/food', function(req, res) {

    // create a food, information comes from AJAX request from Angular
    Food.create({
      name: req.body.name,
      price: req.body.price,
      done: false
    }, function(err, food) {
      if (err)
        res.send(err);

      // get and return all the foods after you create another
      getFoods(res);
    });

  });

  // delete a food
  app.delete('/api/food/:food_id', function(req, res) {
    Food.remove({
      _id: req.params.food_id
    }, function(err, food) {
      if (err)
        res.send(err);

      getFoods(res);
    });
  });

  // application -------------------------------------------------------------
  app.get('*', function(req, res) {
    res.redirect('/');
  });
};