const axios = require("axios");
const Location = require("./location.model");

exports.getCountryState = async (req, res) => {
  try {
    await axios
      .get(`https://countriesnow.space/api/v0.1/countries/states`)
      .then(async (res) => {
        await res.data.data.map(async (country) => {
          const location = new Location();
          location.countryName = country.name;

          const state = await country.states.map((state) => ({
            name: state.name,
            city: [],
          }));
          console.log(state);
          location.states = state;

          await location.save();
        });
      })
      .catch((error) => console.log(error));

    return res.status(200).json({ status: true, message: "Success!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.getCities = async (req, res) => {
  try {
    const locations = await Location.find();
    let count = 0;
    for (let i = 0; i < locations.length; i++) {
      const country = locations[i];
      if (country.states.length > 0) {
        for (let j = 0; j < country.states.length; j++) {
          const state = country.states[j];

          const query = {
            country: country.countryName,
            state: state.name,
          };
          await axios
            .post(
              `https://countriesnow.space/api/v0.1/countries/state/cities`,
              body
            )
            .then(async (response) => {
              console.log(response.data.error, count);
              count++;
              if (!response.data.error) {
                if (response.data.data.length > 0) {
                  console.log(state.name);
                  await Location.updateOne(
                    { _id: country._id, "states.name": state.name },
                    {
                      $set: {
                        "states.$.city": response.data.data,
                      },
                    }
                  );
                }
              }
            })
            .catch((error) => console.log("error"));
        }
      }
    }

    return res.status(200).json({ status: true, message: "Success!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.getCitiesOfUK = async (req, res) => {
  try {
    const location = await Location.findOne({ countryName: "United Kingdom" });

    const country = location;
    let count = 0;
    if (country.states.length > 0) {
      console.log(country.states.length);

      for (let j = 0; j < country.states.length; j++) {
        const state = country.states[j];

        const body = {
          country: country.countryName,
          state: state.name,
        };
        await axios
          .post(
            `https://countriesnow.space/api/v0.1/countries/state/cities`,
            body
          )
          .then(async (response) => {
            console.log(response.data.error, count);
            count++;
            if (!response.data.error) {
              if (response.data.data.length > 0) {
                console.log(state.name, response.data.data);
                await Location.updateOne(
                  { _id: country._id, "states.name": state.name },
                  {
                    $set: {
                      "states.$.city": response.data.data,
                    },
                  }
                );
              }
            }
          })
          .catch((error) => console.log("error"));
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.search = async (req, res) => {
  try {
    const response = await Location.aggregate([
      {
        $match: {
          $or: [
            { countryName: { $regex: req.query.value, $options: "i" } },
            { "states.name": { $regex: req.query.value, $options: "i" } },
            { "states.city": { $regex: req.query.value, $options: "i" } },
          ],
        },
      },
      {
        $unwind: {
          path: "$states",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: "$states.city",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          $or: [
            { countryName: { $regex: req.query.value, $options: "i" } },
            { "states.name": { $regex: req.query.value, $options: "i" } },
            { "states.city": { $regex: req.query.value, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          countryName: 1,
          state: "$states.name",
          city: "$states.city",
        },
      },
      {
        $facet: {
          location: [
            { $skip: req.query.start ? parseInt(req.query.start) : 0 }, // how many records you want to skip
            { $limit: req.query.limit ? parseInt(req.query.limit) : 20 },
          ],
          // pageInfo: [
          //   { $group: { _id: null, count: { $sum: 1 } } }, // get total records count
          // ],
        },
      },
    ]);

    return res
      .status(200)
      .json({ status: true, message: "Success!!", response: response[0].location });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
