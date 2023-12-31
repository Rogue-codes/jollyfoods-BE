import State from "../../models/state/StateModel.js";

export const createState = async (req, res) => {
  const { state_name } = req.body;
  try {
    if (!state_name) {
      return res.status(400).json({
        status: "Failed",
        message: "State name is required",
      });
    }

    const state = await State.create({
      state_name,
    });

    res.status(200).json({
      status: "Sucess",
      message: "State created successfully",
      data: {
        state,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

// update state
export const updateState = async (req, res) => {
  const { id } = req.params;
  const { state_name } = req.body;
  try {
    if (!state_name || !id) {
      return res.status(400).json({
        status: "Failed",
        message: "State name and ID are required",
      });
    }
    const state = await State.findById(id);
    if (!state) {
      return res.status(404).json({
        status: "Failed",
        message: "State not found",
      });
    }
    const updatedState = await State.findByIdAndUpdate(
      id,
      {
        state_name: state_name,
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the update against the schema
      }
    );
    res.status(200).json({
      status: "Success",
      message: "State updated successfully",
      data: {
        updatedState,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

// get state
export const getState = async (req, res) => {
  try {
    const state = await State.find().select("-__v");
    res.status(200).json({
      status: "success",
      message: "States retrieved successfully",
      data: state,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

// delete state
export const deleteState = async (req, res) => {
  const { id } = req.params;
  try {
    if(!id){
      return res.status(400).json({
        status:"Failed",
        message: "Id is required",
      })
    }
    const deletedState = await State.findByIdAndDelete(id)
    if(deletedState){
      return res.status(200).json({
        status:"Success",
        message:"State deleted successfully",
        data: deletedState
      })
    }else{
      return res.status(404).json({
        status:"Failed",
        message: "State not found",
      })
    }
  } catch (error) {
    return res.status(500).json({
      status:"Failed",
      message: error.message,
    })
  }
};
