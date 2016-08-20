var AWS = require("aws-sdk");
var request = require("request");

var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function( event, context, callback ) {
  var friendName = process.env.FRIEND_NAME;
  
  if (event.clickType === "DOUBLE") {
    var message = friendName + ' says "Please buy me more food."'
    request({
        url: process.env.WEBHOOK_URL,
        method: "POST",
        json: true,
        body: { message: message, event: event}
    }, function (error, response, body){
      callback(error, message);
    });
    return;
  }
  
  var updateParams = { TableName: "FeedTheDog",
    Key: { date: new Date().toDateString() },
    UpdateExpression: "ADD meals :incr",
    ExpressionAttributeValues: { ":incr": 1 },
    ReturnValues: "UPDATED_NEW",
  };

  docClient.update(updateParams, function(err, data) {
    if (err) {
      callback(err);
    }
    else {
      var meals = data.Attributes.meals;
      var message = "";
      if (1 == meals) {
        message = "You've fed " + friendName + " once today.";
      }
      else {
        message = "You've fed " + friendName + " " + meals + " times today."
      }
      request({
          url: process.env.WEBHOOK_URL,
          method: "POST",
          json: true,
          body: { message: message, event: event}
      }, function (error, response, body){
        callback(error, message);
      });
    }
  })
}

