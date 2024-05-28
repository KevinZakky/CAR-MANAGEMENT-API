import path from "path";
import fs from "fs";
import { Op } from "sequelize";
import Car from "../models/carModel.js";
import Users from "../models/userModel.js";

export const getCars = async (req, res) => {
  try {
    const cars = await Car.findAll({
      // where: {
      //   is_deleted: {
      //     [Op.ne]: 1,
      //   },
      // },
      include: [
        {
          model: Users,
          as: "CreatedBy",
          attributes: ["uuid", "name", "email", "role"],
        },
        {
          model: Users,
          as: "UpdatedBy",
          attributes: ["uuid", "name", "email", "role"],
        },
        {
          model: Users,
          as: "DeletedBy",
          attributes: ["uuid", "name", "email", "role"],
        },
      ],
    });

    const response = cars.map((car) => {
      const {
        CreatedBy,
        UpdatedBy,
        DeletedBy,
        createdBy,
        updatedBy,
        deletedBy,
        ...carData
      } = car.toJSON();
      return {
        ...carData,
        createdBy: createdBy,
        CreatedBy: CreatedBy,
        updatedBy: updatedBy,
        UpdatedBy: updatedBy ? UpdatedBy : null,
        deletedBy: deletedBy,
        DeletedBy: deletedBy ? DeletedBy : null,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findOne({
      where: {
        id: req.params.id,
        // is_deleted: {
        //   [Op.ne]: 1,
        // },
      },
      include: [
        {
          model: Users,
          as: "CreatedBy",
          attributes: ["uuid", "name", "email", "role"],
        },
        {
          model: Users,
          as: "UpdatedBy",
          attributes: ["uuid", "name", "email", "role"],
        },
        {
          model: Users,
          as: "DeletedBy",
          attributes: ["uuid", "name", "email", "role"],
        },
      ],
    });

    if (!car) return res.status(404).json({ msg: "Car not found" });

    const {
      CreatedBy,
      UpdatedBy,
      DeletedBy,
      createdBy,
      updatedBy,
      deletedBy,
      ...carData
    } = car.toJSON();

    const response = {
      ...carData,
      createdBy: createdBy,
      CreatedBy: CreatedBy,
      updatedBy: updatedBy,
      UpdatedBy: UpdatedBy,
      deletedBy: deletedBy,
      DeletedBy: DeletedBy,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const addCar = (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });

  const { name, rentPerDay } = req.body;
  const file = req.files.image;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 2000000)
    return res.status(422).json({ msg: "Image must be less than 2 MB" });

  file.mv(`./public/uploads/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Car.create({
        name: name,
        rentPerDay: rentPerDay,
        image: fileName,
        url: url,
        userId: req.userId,
        createdBy: req.userId,
      });
      res.status(201).json({ msg: "Car Created Successfully" });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const updateCar = async (req, res) => {
  const car = await Car.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!car) return res.status(404).json({ msg: "No Data Found" });
  let fileName = "";
  if (req.files === null) {
    fileName = car.image;
  } else {
    const file = req.files.image;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    const filePath = `./public/uploads/${car.image}`;
    fs.unlinkSync(filePath);

    file.mv(`./public/uploads/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const { name, rentPerDay } = req.body;
  const url = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
  try {
    await Car.update(
      {
        name: name,
        rentPerDay: rentPerDay,
        image: fileName,
        url: url,
        updatedBy: req.userId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Car updated successfully" });
    // res.redirect("/cars");
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteCar = async (req, res) => {
  const car = await Car.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!car) return res.status(404).json({ msg: "No data found" });
  try {
    const filePath = `./public/uploads/${car.image}`;

    if (fs.existsSync(filePath) && car.image) {
      fs.unlinkSync(filePath);
    }
    await Car.update(
      {
        deletedBy: req.userId,
        is_deleted: 1,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Car deleted successfully" });

    // res.redirect("/cars");
  } catch (error) {
    console.log(error.message);
  }
};
