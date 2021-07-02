const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Food {
  static async listUserFood({ user }) {
    // list all food in the DB in descending order. created at not working
    const result = await db.query(
      `
      SELECT *
      FROM food
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
      [user.id]
    );
    return result.rows;
  }


  static async avgCalories ({user}) {
    const result = await db.query(
      `
      SELECT AVG(calories)
      FROM food
      WHERE user_id = $1
    `,
      [user.id]
    );

    return result.rows[0];
  }



  static async createNewFood({ food, user }) {
    const requiredFields = [
      "foodName",
      "category",
      "quantity",
      "calories",
    ];
    requiredFields.forEach((field) => {
      if (!food.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field - ${field} - missing from request body.`
        );
      }
    });
    // console.log(user)
    const results = await db.query(
      ` 
      INSERT INTO food (foodName, category, quantity, calories, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id,
                foodName,
                category,
                quantity,
                calories,
                user_id,
                created_at
      `,
      [
        food.foodName,
        food.category,
        food.quantity,
        food.calories,
        user.id,
        // food.imageUrl,
      ]
    );
    return results.rows[0];
  }
}

module.exports = Food;