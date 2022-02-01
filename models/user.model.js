const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

UserSchema.pre('save', async function (next) {
    try {
      if (this.isNew) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        // if (this.email === process.env.ADMIN_EMAIL.toLowerCase()) {
        //   this.role = roles.admin;
        // }
      }
      next();
    } catch (error) {
      next(error);
    }
  });


const User = mongoose.model('user', UserSchema);
module.exports = User;