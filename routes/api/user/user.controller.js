const {stripeCharge} = require('../../../utils/stripe')
const User = require('../../../models/user')
const Transaction = require('../../../models/Transaction')

/* 
    GET /api/user/list
*/

exports.list = (req, res) => {
    User.find({}, '-password').exec()
    .then(
        users=> {
            res.json({users})
        }
    )

}


/*
    POST /api/user/stripePay
*/
exports.stripePay = (req, res) => {
    const {source, amount, receipt_email} = req.body;
    stripeCharge(source, amount, receipt_email).then(
        charge => {
            // register transaction history

            res.json({
                success: true
            })
        }
    ).catch(
        (err) => { res.status(404).json({message: err.message})}
    )        
}
