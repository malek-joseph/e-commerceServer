exports.userSignupValidator = (req, res, next) => {
  // thanks to express validator we can  use the check method to validate 
  // req.check('the key you want to check', 'the message to display if the check failed')
  // .notEmpty is used to make sure that the field was not left empty  
  req.check('name', 'Name is required').notEmpty()
  req.check('email', 'Invalid email, please try again')
    .matches(/.+\@.+\..+/) // This regular expression makes sure that the email contains the @ sign.
  .withMessage('The email must contain the @ sign') // this is the message displayed if the check failed
    .isLength({
    min: 4, max: 32
    })
  req.check('password', 'The password is required').notEmpty()
  req.check('password')
    .isLength({
    min:  6
    })
  .withMessage('The password must be at least 6 characters') // message for the length
    .matches(/\d/)
  .withMessage('The password must contain a number')
  const errors = req.validationErrors() // validationErrors is a method offered by express-validator
  if (errors) {
    const firstError = errors.map(error => error.msg)[0]
    return res.status(400).json({error:firstError })
  }
  next() // we should always call the next callback to move to the next middleware, whatever there were errors or not
}