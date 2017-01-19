var express = require('express');
var router = express.Router();

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('yWP9CgbClBIrMWP2hCzYMw');

router.get('/', function (req, res, next) {
    res.render('mailchimp', {success: req.query.success, error: req.query.error});
});

router.post('/', function (req, res, next) {
    var merge_vars = [
        {"name": "USER_NAME", "content": req.body.username},
        {"name": "MESSAGE", "content": req.body.message}
    ];
    sendTemplate('test_template', merge_vars, res);
});

module.exports = router;


function sendTemplate(template_name, merge_vars, res) {
    var template_content = [];
    var message = {
        "subject": "Message Subject",
        "from_email": "sergey.mell@agilie.com",
        "from_name": "Sirogka",
        "to": [{
            "email": "seroga_m84@mail.ru",
            "name": "Sergunio",
            "type": "to"
        }],
        "headers": {
            "Reply-To": "sergey.mell+volumatik@agilie.com"
        },
        "global_merge_vars": merge_vars
    };
    mandrill_client.messages.sendTemplate(
        {
            "template_name": template_name,
            "template_content": template_content,
            "message": message
        },
        function (result) {
            console.log(result);
            res.redirect('/mailchimp?success=true');
        }, function (e) {
            var error = 'A mandrill error occurred: ' + e.name + ' - ' + e.message;
            res.redirect('/mailchimp?error=' + error);
        });
}
