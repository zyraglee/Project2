const schemas = require("./mean_schema.js");
const mongoose = require("mongoose");
mongoose.connect(
    'mongodb://localhost:27017/mean',
    { useNewUrlParser: true });
/*
Below line of code eliminates the Deprecation Warning:

(node:10420) DeprecationWarning: collection.ensureIndex is deprecated.
Use createIndexes instead.
 */
mongoose.set('useCreateIndex', true);
/*
Compiling the model for the Schema object

When you use mongoose.model(), your model will use the default mongoose connection.
 */
var Mean = mongoose.model("Mean", schemas.meanSchema);

console.log(Mean);
console.log("---------------------------------");
console.log(Mean.modelName);
console.log("---------------------------------");
console.log(Mean.collection);
console.log("---------------------------------");

setTimeout(function(){
    mongoose.disconnect();
}, 3000);

mongoose.connection.once('open', function(){
    console.log("Connection open!");
});
