const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const env = require("dotenv");
const path=require('path');
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const addressRoutes = require("./routes/address");
const app = express();
app.use(express.json());
app.use(cors());
env.config();


mongoose
  .connect(
    `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.jtznj.mongodb.net/mydb?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Database is connected"));
app.use('/public', express.static(path.join(__dirname + '/uploads')));
const PORT = process.env.PORT || 8000;
app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", addressRoutes);
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
