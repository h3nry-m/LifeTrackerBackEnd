const express = require("express")
const Exercise = require("../models/exercise")
const router = express.Router()
const security = require("../middleware/security")

router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
      const { user } = res.locals
      // const exercises = await Exercise.listAllExercises()
      const exercises = await Exercise.listUserExercises({user})
      return res.status(200).json({ exercises })
    } catch (err) {
      next(err)
    }
  })



router.get("/activity", security.requireAuthenticatedUser, async (req,res, next) => {
  try {
    const {user} = res.locals
    const avgDuration = await Exercise.avgDuration({user})
    // console.log('avg duration', avgDuration)
    const totalDuration = await Exercise.totalDuration({user})
    return res.status(200).json({ avgDuration, totalDuration})
  } catch (err) {
    next(err)
  }
})



router.post('/create', security.requireAuthenticatedUser, async (req,res,next) => {
    try {
        const { user } = res.locals
        const exercise = await Exercise.createNewExercise({user, exercise: req.body})
        return res.status(201).json({exercise})
    } catch (error) {
        next(error)
    }
})


module.exports = router
