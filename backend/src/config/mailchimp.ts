const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MAILCHIMP_TRANSACTIONAL_API_KEY);


export default mailchimp;