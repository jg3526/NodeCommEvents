'use strict';

exports = module.exports = function(app, mongoose) {
  var eventSchema = new mongoose.Schema({
    _id: { type: String },
    name: { type: String, required: true},
    description: { type: String },
    venu: { type: String },
    date: { type: Date },
    starttime: { type: String },
    endtime: { type: String },
    username: { type: String, required: true },
    search: [String]
  });
  eventSchema.plugin(require('./plugins/pagedFind'));
  eventSchema.index({ name: 1 });
  eventSchema.index({ username: 1 });
  eventSchema.index({ date: 1 });
  eventSchema.index({ venu: 1 });
  eventSchema.index({ starttime: 1 });
  eventSchema.index({ endtime: 1 });
  eventSchema.index({ search: 1 });
  eventSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Event', eventSchema);
};
