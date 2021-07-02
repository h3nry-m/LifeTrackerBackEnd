const express = require("express")
const Food = require("../models/food")
const router = express.Router()
const security = require("../middleware/security")

router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
      const { user } = res.locals
      const food = await Food.listUserFood({user})
      return res.status(200).json({ food })
    } catch (err) {
      next(err)
    }
  })



router.get("/activity", security.requireAuthenticatedUser, async (req,res, next) => {
  try {
    const {user} = res.locals
    const avgCalories = await Food.avgCalories({user})
    // console.log('avg duration', avgDuration)
    // const totalDuration = await Exercise.totalDuration({user})
    return res.status(200).json({ avgCalories})
  } catch (err) {
    next(err)
  }
})



router.post('/create', security.requireAuthenticatedUser, async (req,res,next) => {
    try {
        const { user } = res.locals
        const food = await Food.createNewFood({user, food: req.body})
        return res.status(201).json({food})
    } catch (error) {
        next(error)
    }
})


module.exports = router
