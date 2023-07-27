const {constants} = require('../constants');

// This is a custom middleware that will accept the request & response & in b/w 
// will transform the response into json;

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case constants.NOT_FOUND:
            res.json({ title: "Not Found", message: err.message, stackTrace: err.stack}); // don't show stackTrace on prod environment
            break;
        case constants.UNAUTHORIZED:
            res.json({ title: "Unauthorized", message: err.message, stackTrace: err.stack}); 
            break;
        case constants.FORBIDDEN:
            res.json({ title: "Forbidden", message: err.message, stackTrace: err.stack});
            break;
        case constants.VALIDATION_ERROR:
            res.json({ title: "Validation Failed", message: err.message, stackTrace: err.stack});
            break;
        case constants.SERVER_ERROR:
            res.json({ title: "Server Error", message: err.message, stackTrace: err.stack});
            break;
        default:
            console.log("No Error, all good !");
            res.json({ title: "No Error, all good", message: err.message, stackTrace: err.stack});
            break;
    }
};

module.exports = errorHandler;