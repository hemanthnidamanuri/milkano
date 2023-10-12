const dbConnection = require('../db/connect');

const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes')

const addProducts = async (req,res) => {
  try {
    const productsData = JSON.stringify(req.body.productdetails);
    const file = req.file;

   const sqlCommand = `INSERT INTO product_sales 
   (sale_date, state_location, city_location, product_name, source_price,
    gross_weight, net_weight, bags
    ) VALUES ('${productsData}')`;

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
    const dispatchProducts = JSON.stringify(req.body);
    const sqlCommand = `INSERT INTO dispatch_products (date, source_location, 
      dispatch_location, vehicle_no, driver_name, driver_mobile, type_of_vehicle) VALUES ('${dispatchProducts}')`;

      dbConnection.query(sqlCommand, dispatchProducts, (err, result) =>  {
          if (err) {
            throw new CustomAPIError(err);
          }
          
          console.log(`products data saved to database ${result}`);

          res.status(StatusCodes.OK).json({ message: 'Data saved successfully'});
   });
  } catch (error) {
      throw new CustomAPIError(error);
  }
}
module.exports = {
  addProducts,
  dispatchproducts
}