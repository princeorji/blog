const moogoose = require('mongoose')
const bcrypt = require('bcryptjs')

const schema = new moogoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    post_count: { type: Number, default: 0 }
})

schema.virtual('posts', {
    ref: 'Posts',
    localField: '_id',
    foreignField: 'author'
})

schema.pre('save', async function (next) {
    const user = this
    const hash = await bcrypt.hash(this.password, 10)

    this.password = hash
    next()
})

schema.methods.isValidPassword = async function (password) {
    const user = this
    const compare = await bcrypt.compare(password, user.password)

    return compare
}

module.exports = moogoose.model('Users', schema)