const mongoose = require("mongoose");

// const url = "mongodb://0.0.0.0:27017/sparrow"

function connectDB() {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("Database connection successful"))
    .catch((err) => console.error("Database connection error:", err.message));
}

module.exports = connectDB;
// const url = "mongodb+srv://rehanbutt:rehanbutt123@cluster0.kbhz5bx.mongodb.net/?retryWrites=true&w=majority";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Database connection successful");
//   } catch (err) {
//     console.error("Database connection error:", err.message);
//     process.exit(1);
//   }
// };
