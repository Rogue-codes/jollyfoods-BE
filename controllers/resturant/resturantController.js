import Location from "../../models/location/LocationModel.js";
import Restuarant from "../../models/resturant/resturantModel.js";

/*------------------------------------------ create resturant -------------------------------------------*/

export const createResturant = async (req, res) => {
  // destructure req.body objects
  const { resturant_name, location_id, rating, price_per_adult, price_per_child, menu } =
    req.body;
  try {
    // any req.body obj is missing
    if (
      !resturant_name ||
      !location_id ||
      !rating ||
      !price_per_adult ||
      !price_per_child ||
      !menu
    ) {
      return res.status(400).json({
        status: "Failed",
        message:
          "resturant name, location, rating, price_per_adult, price_per_child and menu are required!!",
      });
    }
    // get location details
    const location = await Location.findById(location_id);
    if (!location) {
      return res.status(400).json({
        status: "Failed",
        message: "Location not found",
      });
    }
    const location_meta = {
      address: location.address,
      id: location._id,
      region: {
        id: location.region_id,
        name: location.region,
        state: location.state,
      },
    };
    // check if resturant name already exists
    const existingResturantName = await Restuarant.findOne({ resturant_name });
    if (existingResturantName) {
      return res.status(400).json({
        status: "Failed",
        message: "Resturant name already exists; please use another name",
      });
    }
    const resturant = await Restuarant.create({
      resturant_name,
      location_id,
      rating,
      price_per_adult,
      price_per_child,
      menu,
      location_meta,
      location_name: location.name
    });

    res.status(201).json({
      status: "success",
      message: "Restaurant created successfully",
      data: resturant,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};
/*-------------------------------------------------------------------------------------*/

/*------------------------------------------ edit resturant -------------------------------------------*/
export const editResturant = async (req, res) => {
  const { resturant_name, location_id, price_per_adult, price_per_child, menu, id } = req.body;
  try {
    if ((!resturant_name || !location_id || !price_per_adult || !price_per_child || !menu, !id)) {
      return res.status(400).json({
        status: "Failed",
        message: "resturant name, location, price, menu and id is required",
      });
    }
    const resturantToUpdate = await Restuarant.findById(id);
    if (!resturantToUpdate) {
      return res.status(404).json({
        status: "Failed",
        message: "Resturant not found",
      });
    }
    // get location details
    const location = await Location.findById(location_id);
    if (!location) {
      return res.status(404).json({
        status: "Failed",
        message: "Location not found",
      });
    }
    const location_meta = {
      address: location.address,
      id: location._id,
      region: {
        id: location.region_id,
        name: location.region,
        state: location.state,
      },
    };

    // prevent name duplicate
    const alreadyExistingResturantName = await Restuarant.findOne({
      resturant_name,
    });
    if (alreadyExistingResturantName) {
      return res.status(400).json({
        status: "Failed",
        message:
          "Resturant name already exists, please enter a different name.",
      });
    }

    const updatedResturant = await Restuarant.findByIdAndUpdate(
      id,
      {
        resturant_name,
        location_id,
        price_per_adult,
        price_per_child,
        menu,
        location_meta,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      status: "success",
      message: `${resturantToUpdate.resturant_name} updated Successfully`,
      data: updatedResturant,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

/*------------------------------------------ delete resturant -------------------------------------------*/
export const deleteResturant = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        status: "Failed",
        message: "Resturant ID is required",
      });
    }
    // check if the resturant exists
    const existingResturant = await Restuarant.findById(id);
    if (!existingResturant) {
      return res.status(404).json({
        status: "Failed",
        message: "Resturant does not exist",
      });
    }

    const deletedResturant = await Restuarant.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      message: "Resturant deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

/*-----------------------------------------------------------------------------------------------*/

/*------------------------------------------ getAll resturant -------------------------------------------*/

export const getAllResturant = async (req, res) => {
  try {
    let query = Restuarant.find();
    if (!req.query.sort) {
      query = query.sort("-createdAt");
    }

    // pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const resturantCount = await Restuarant.countDocuments();
    const last_page = resturantCount / limit;
    if (req.query.page) {
      if (page >= last_page) throw new Error("This page does not exist");
    }

    // filter by location
    if (req.query.location) {
      query = query.find({ location_name: req.query.location });
    }

    const allResturants = await query.select("-__v");
    if (!allResturants.length) {
      res.status(200).json({
        status: "success",
        message: "No Resturant available",
      });
    }
    res.status(200).json({
      status: "success",
      message: "All Resturants retrieved successfully",
      data: allResturants,
      meta: {
        per_page: limit,
        current_page: page,
        last_page: Math.ceil(last_page),
        total: resturantCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};
/*-------------------------------------------------------------------------------------*/

/*------------------------------------------ get resturant by ID -------------------------------------------*/
export const getResturantByID = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        status: "Failed",
        message: "id is required",
      });
    }
    const resturant = await Restuarant.findById(id);
    if (!resturant) {
      return res.status(404).json({
        status: "Failed",
        message: "Resturant not found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "resturant retrived successfully",
      data: resturant,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};
/*-------------------------------------------------------------------------------------*/
