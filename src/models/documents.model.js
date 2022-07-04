const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: {
      data: Buffer,
      contentType: String,
    },
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'User',
  },
})

// documentSchema.pre('save', async function (next) {
//   const document = this

//   document.name = `${document.name}_${new Date().toJSON().slice(0,10)}.png`;

//   next();
// })

module.exports = mongoose.model('Documents', documentSchema);
