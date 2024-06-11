const Joi = require("joi");

function regValidation(data) {
  const schema = Joi.object({
    secretId: Joi.string().min(3).max(30),
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    role: Joi.valid("Student", "Teacher", "Admin").required(),
  });

  const valid = schema.validate(data);
  return valid;
}

function loginValidation(data) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const valid = schema.validate(data);
  return valid;
}

function courseValidation(data) {
  const schema = Joi.object({
    courseCode: Joi.string().required(),
    title: Joi.string().required(),
    instructor: Joi.string().required(),
    topics: Joi.required(),
    description: Joi.string().required(),
    imagePath: Joi.string(),
    pdfPath: Joi.string(),
    videoPath: Joi.string(),
  });

  const valid = schema.validate(data);
  return valid;
}

const quizValidation = (data) => {
  const schema = Joi.object({
    question: Joi.string().required(),
    options: Joi.array().items(Joi.string()).min(2).required(),
    correctAnswer: Joi.string().required(),
  });

  const valid = schema.validate(data);
  return valid;
};

module.exports.loginValidation = loginValidation;
module.exports.regValidation = regValidation;
module.exports.courseValidation = courseValidation;
module.exports.quizValidation = quizValidation;
