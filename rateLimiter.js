const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redis = require('./redis');

const make_store = (prefix) =>{
    new RedisStore({
        prefix,
        sendCommand: (...args) => redis.call(...args)
    })
}

const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    store: makeStore('rl:api:'),
    message: { success: false, message: 'Too many requests, slow down.' },
})

const paymentLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    store: makeStore('rl:pay:'),
    keyGenerator: (req) => req.body?.email || ipKeyGenerator(req.ip),
    message: { success: false, message: 'Too many payment attempts. Try again in a minute.' },
})

module.exports = { limiter, paymentLimiter };