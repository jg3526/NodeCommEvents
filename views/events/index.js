'use strict';

exports.find = function(req, res){
  req.query.name = req.query.name ? req.query.name : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';

  var filters = {};
  if (req.query.username) {
    filters.username = new RegExp('^.*?'+ req.query.username +'.*$', 'i');
  }

  req.app.db.models.Event.pagedFind({
    filters: filters,
    keys: 'name username description',
    limit: req.query.limit,
    page: req.query.page,
    sort: req.query.sort
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      results.filters = req.query;
      res.send(results);
    }
    else {
      results.filters = req.query;
      res.render('events/index', { data: results.data });
    }
  });
};

exports.read = function(req, res, next){
  req.app.db.models.Event.findById(req.params.id).exec(function(err, event) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.send(event);
    }
    else {
      res.render('events/details', { event: event });
    }
  });
};

exports.add = function(req, res, next){
  if (!req.isAuthenticated()) {
    req.flash('error', "You are not logged in.");
    res.location("/events");
    res.redirect("/events");
  }
  res.render("events/add");
};

exports.create = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.name) {
      req.flash('alert alert-danger', 'Event Name required.');
      res.location('/events/add');
      res.redirect('/events/add');
    }
    if (!req.body.description) {
      req.flash('alert alert-danger', 'Event Description required.');
      res.location('/events/add');
      res.redirect('/events/add');
    }
    if (!req.body.venu) {
      req.flash('alert alert-danger', 'Event Venu required.');
      res.location('/events/add');
      res.redirect('/events/add');
    }
    if (!req.body.date) {
      req.flash('alert alert-danger', 'Event Date required.');
      res.location('/events/add');
      res.redirect('/events/add');
    }
    if (!req.body.starttime) {
      req.flash('alert alert-danger', 'Event Start Time required.');
      res.location('/events/add');
      res.redirect('/events/add');
    }
    if (!req.body.endtime) {
      req.flash('alert alert-danger', 'Event End Time required.');
      res.location('/events/add');
      res.redirect('/events/add');
    }
    workflow.emit('createEvent');
  });

  workflow.on('createEvent', function() {
    var fieldsToSet = {
      name: req.body.name,
      description: req.body.description,
      venu: req.body.venu,
      date: req.body.date,
      starttime: req.body.starttime,
      endtime: req.body.endtime,
      username: req.user.username,
      search: [
        req.body.name
      ]
    };
    req.app.db.models.Event.create(fieldsToSet, function(err, event) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.record = event;
      req.flash('alert alert-success', 'Event Added');
      res.location('/events');
      res.redirect('/events');
    });
  });
  workflow.emit('validate');
};

exports.edit = function(req, res, next){
  req.app.db.models.Event.findById(req.params.id).exec(function(err, event) {
    console.log(event);
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.send(event);
    }
    else {
      res.render('events/edit', { event: event });
    }
  });
};
exports.update = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.name) {
      req.flash('alert alert-danger', 'Event Name required.');
      res.location('/events/add');
      res.redirect('/events/add');
    }
    if (!req.body.description) {
      req.flash('alert alert-danger', 'Event Description required.');
      res.location('/events/add');
      res.redirect('/events/add');
    }
    if (!req.body.venu) {
      req.flash('alert alert-danger', 'Event Venu required.');
      res.location('/events/add');
      res.redirect('/events/add');
    }
    if (!req.body.date) {
      req.flash('alert alert-danger', 'Event Date required.');
      res.location('/events/add');
      res.redirect('/events/add');
    }
    if (!req.body.starttime) {
      req.flash('alert alert-danger', 'Event Start Time required.');
      res.location('/events/add');
      res.redirect('/events/add');
    }
    if (!req.body.endtime) {
      req.flash('alert alert-danger', 'Event End Time required.');
      res.location('/events/add');
      res.redirect('/events/add');
    }
    workflow.emit('updateEvent');
  });

  workflow.on('updateEvent', function() {
    var fieldsToSet = {
      name: req.body.name,
      description: req.body.description,
      venu: req.body.venu,
      date: req.body.date,
      starttime: req.body.starttime,
      endtime: req.body.endtime,
      username: req.user.username,
      search: [
        req.body.name
      ]
    };
    req.app.db.models.Event.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, event) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.record = event;
      req.flash('alert alert-success', 'Event Updated');
      res.location('/events/show/' + req.params.id);
      res.redirect('/events/show/' + req.params.id);
    });
  });
  workflow.emit('validate');
};

exports.delete = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);
  // console.log(req.params.id);
  workflow.on('validate', function() {
    workflow.emit('deleteEvent');
  });

  workflow.on('deleteEvent', function(err) {
    req.app.db.models.Event.findByIdAndRemove(req.params.id, function(err, event) {
      if (err) {
        return workflow.emit('exception', err);
      }
      req.flash('success', "Event Deleted.");
      res.location('/myevents');
      res.redirect('/myevents');
    });
  });
  workflow.emit('validate');
};