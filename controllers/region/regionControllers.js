import Region from '../../models/region/Region.js'
import State from '../../models/state/StateModel.js';
// create region
export const createRegion = async(req,res) =>{
    const {name,state_id} = req.body;
    try {
        if(!name || !state_id){
            return res.status(400).json({
                status: "Failed",
                message:"region name and state_id are required"
            })
        }
        // check validity of id
        const validId = await State.findById(state_id)
        if(!validId){
            return res.status(404).json({
                status: "Failed",
                message:"Id does not exist or is invalid"
            })
        }
        const state = validId.state_name
        const newRegion = await Region.create({
            name,
            state_id,
            state
        })
        res.status(201).json({
            status:"Success",
            messsage:"region created successfully",
            data:{
                newRegion
            }
        })
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message
        })
    }
}

// update region
export const updateRegion = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      if (!name || !id) {
        return res.status(400).json({
          status: "Failed",
          message: "region name and ID are required",
        });
      }
      const region = await Region.findById(id);
      if (!region) {
        return res.status(404).json({
          status: "Failed",
          message: "region not found",
        });
      }
      const updatedRegion = await Region.findByIdAndUpdate(
        id,
        {
          name: name,
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Validate the update against the schema
        }
      );
      res.status(200).json({
        status: "Success",
        message: "Region updated successfully",
        data: {
          updatedRegion,
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
  export const getRegion = async (req, res) => {
    try {
      const region = await Region.find().select("-__v");
      res.status(200).json({
        status: "success",
        message: "Regions retrieved successfully",
        data: region,
      });
    } catch (error) {
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  };
  
  // delete region
  export const deleteRegion = async (req, res) => {
    const { id } = req.params;
    try {
      if(!id){
        return res.status(400).json({
          status:"Failed",
          message: "Id is required",
        })
      }
      const deletedRegion = await Region.findByIdAndDelete(id)
      if(deletedRegion){
        return res.status(200).json({
          status:"Success",
          message:"Region deleted successfully",
          data: deletedRegion
        })
      }else{
        return res.status(404).json({
          status:"Failed",
          message: "Region not found",
        })
      }
    } catch (error) {
      return res.status(500).json({
        status:"Failed",
        message: error.message,
      })
    }
  };
  