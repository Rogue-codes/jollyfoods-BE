import Region from '../../models/region/Region.js'
import Location from '../../models/location/LocationModel.js';
// create Location
export const createLocation = async(req,res) =>{
    const {name,region_id,address} = req.body;
    try {
        if(!name || !region_id || !address){
            return res.status(400).json({
                status: "Failed",
                message:"location name and state_id are required"
            })
        }
        // check validity of id
        const validId = await Region.findById(region_id)
        if(!validId){
            return res.status(404).json({
                status: "Failed",
                message:"Id does not exist or is invalid"
            })
        }
        const region = validId.name
        const state = validId.state
        const newLocation = await Location.create({
            name,
            region_id,
            region,
            state,
            address
        })
        res.status(201).json({
            status:"Success",
            messsage:"location created successfully",
            data: newLocation
            
        })
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message
        })
    }
}

// update region
export const updateLocation = async (req, res) => {
    const { id } = req.params;
    // const { name } = req.body;
    try {
      if (!req.body || !id) {
        return res.status(400).json({
          status: "Failed",
          message: "Location ID and a field to be updated is required",
        });
      }
      const location = await Location.findById(id);
      if (!location) {
        return res.status(404).json({
          status: "Failed",
          message: "location not found",
        });
      }
      const updatedLocation = await Location.findByIdAndUpdate(
        id,
        {
          ...req.body
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Validate the update against the schema
        }
      );
      res.status(200).json({
        status: "Success",
        message: "Location updated successfully",
        data: {
          updatedLocation,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  };
  
  // get region
  export const getLocation = async (req, res) => {
    try {
      const location = await Location.find().select("-__v");
      res.status(200).json({
        status: "success",
        message: "Locations retrieved successfully",
        data: location,
      });
    } catch (error) {
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  };
  
  // delete location
  export const deleteLocation = async (req, res) => {
    const { id } = req.params;
    try {
      if(!id){
        return res.status(400).json({
          status:"Failed",
          message: "Id is required",
        })
      }
      const deletedLocation = await Location.findByIdAndDelete(id)
      if(deletedLocation){
        return res.status(200).json({
          status:"Success",
          message:"Location deleted successfully",
          data: deletedLocation
        })
      }else{
        return res.status(404).json({
          status:"Failed",
          message: "Location not found",
        })
      }
    } catch (error) {
      return res.status(500).json({
        status:"Failed",
        message: error.message,
      })
    }
  };
  