Feed The Dog
============

The problem? How to keep track of how many times you've fed the dog today. Too many
and she gets fat. Too few and she eats all the toilet paper in the house. The solution?
A whiteboard and a dry erase marker? Obviously not, when we can use a wifi connected button
that triggers a notification that Zapier can then distribute via email, sms, Slack or whatever.

The Button
----------
There are very few programmable wifi buttons out there. Most buttons are bluetooth and
need to pair with your phone. As my teenage daughter pointed out, the fact that this
approach only works if you live at home by yourself probably tells us more about the
designers of those buttons than we need to know. For those of us who can't guarantee that
someone else won't want to push the button even when we're not home, we need a true wifi
button. Right now, the best option by far is Amazon's IoT button, https://aws.amazon.com/iot/button/.
This button can trigger an AWS Lambda function and it only takes a few lines of code to convert
the button push into a Zapier trigger and from there you can notify pretty much anything you want.

Instructions
------------
Pretty high level, but feel free to get in touch for more details.

1. Create an AWS Developer account if necessary.
2. Create a DynamoDb table named *FeedTheDog*. The hash key for the table should be named *date* 
of type *string*. We'll create one item in the table for each day and store a count.
3. Create a role that gives lamba permissions on dynamodb udpate for your table.
4. Create an account on Zapier, if necessary and create a new Zap using a web hook as the trigger.
This will generate a URL that you can POST to to trigger your zap.
4. Clone this repo.
5. Rename the .env-sample file to .env and fill in the required details, mainly your AWS credentials.
This file is used by the build scripts to deploy your function to AWS.
6. Rename the deploy.env-sample file to deploy.env and fill in the required fields. The contents of this
file will be injected into your script during the build process.
7. To peek at the lambda function that will be created, run `npm run package -- -f deploy.env`. This
will generate a build directory containing the zipped lambda function.
8. To deploy the lambda function, run `npm run deploy -- -f deploy.env`. This will repeat the build
and upload the lambda function to AWS.
9. Find your lambda function in the AWS console and set the trigger to be your IoT button. This
should walk you through the steps to enable the button and hook it up to your AWS account.
10. Finally, return to Zapier. If all is working, pushing the button should verify the web hook and
you can complete the process by setting an action for the zap. The lambda function posts a simple
json object to the webhook with a single property named *message*.