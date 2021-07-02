const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Exercise {
  static async listAllExercises() {
    const result = await db.query(
      `SELECT *
       FROM exercise;
      `
    );
    return result.rows;
  }

  static async avgDuration({user}) {
    const result = await db.query(
      `
      SELECT AVG(duration)
      FROM exercise
      WHERE user_id = $1
    `,
      [user.id]
    );

    return result.rows[0];
  }

  static async totalDuration({user}) {
    const result = await db.query(
      `
      SELECT SUM(duration)
      FROM exercise
      WHERE user_id = $1
    `,
      [user.id]
    );

    return result.rows[0];
  }
  


  static async listUserExercises({ user }) {
    // list all exercises in the DB in descending order. created at not working
    // something about user not being able to be deconstructed. naybe need the security requireAuthenticatedUser
    // console.log('im here', user)
    const result = await db.query(
      `
      SELECT *
      FROM exercise
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
      [user.id]
    );
    return result.rows;
  }


  static async createNewExercise({ exercise, user }) {
    const requiredFields = [
      "exerciseName",
      "category",
      "duration",
      "intensity",
    ];
    requiredFields.forEach((field) => {
      if (!exercise.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field - ${field} - missing from request body.`
        );
      }
    });
    // console.log(user)
    const results = await db.query(
      ` 
      INSERT INTO exercise (exerciseName, category, duration, intensity, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id,
                exerciseName,
                category,
                duration,
                intensity,
                user_id,
                created_at
      `,
      [
        exercise.exerciseName,
        exercise.category,
        exercise.duration,
        exercise.intensity,
        user.id,
      ]
    );
    // console.log(results)
    return results.rows[0];
  }
}

module.exports = Exercise;
