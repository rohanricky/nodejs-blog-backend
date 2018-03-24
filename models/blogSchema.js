var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var blogSchema = new Schema({
  name: String,
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId : {type: String, required:true},
  location: String,
  meta: {
    website: String,
  },
  created_at: Date,
  updated_at: Date
});

var Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
