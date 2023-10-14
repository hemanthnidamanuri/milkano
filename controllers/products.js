const dbConnection = require('../db/connect');

const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes')

const addProducts = async (req,res) => {
  try {
    const productsData = JSON.parse(req.body.productdetails);
    const file = req.file;
    productsData.file_path = file.path;
    const sqlCommand = `INSERT INTO product_sales SET ?`;

   dbConnection.query(sqlCommand, productsData, (err, result) =>  {
    if (err) {
      throw new CustomAPIError(err);
    }
    
    console.log(`products data saved to database ${result}`);

    const filePath = file.path;
    res.status(StatusCodes.OK).json({ message: 'Data saved successfully', file: filePath });
   });
  } catch (error) {
    throw new CustomAPIError(error);
  }
}

const dispatchproducts = async (req,res) => {
  try {
    const dispatchProducts = req.body;
    const sqlCommand = `INSERT INTO dispatch_products SET ?`;

      dbConnection.query(sqlCommand, dispatchProducts, (err, result) =>  {
          if (err) {
            throw new CustomAPIError(err);
          }
          
          console.log(`products data saved to database ${result}`);

          res.status(StatusCodes.OK).json({ message: 'Data saved successfully'});
   });
  } catch (error) {
    console.log(error);
      throw new CustomAPIError(error);
  }
}
module.exports = {
  addProducts,
  dispatchproducts
}