const express = require("express");
const router = new express.Router();
const Movie = require("../models/Movie");
const auth = require("../middleware/auth");
const authRole = require("../middleware/auth");

//create movie
router.post("/movies", auth, authRole, async (req, res) => {
  const movie = new Movie(req.body);
  try {
    await movie.save();
    res.send(movie);
  } catch {
    res.status(500).send();
  }
});
//update movie
router.patch("/movies/:id", auth, async (req, res) => {
  const allowedUpdates = [
    "title",
    "desc",
    "img",
    "imgTitle",
    "imgSm",
    "trailer",
    "video",
    "year",
    "limit",
    "genre",
    "isSeries",
  ];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Update is invalid" });
  }
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    await movie.save();
    res.send(movie);
  } catch {
    res.status(400).send(error);
  }
});
//Delete movie
router.delete("/movies/:id", auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    res.status(200).send({ Confirmation: "Movie deleted", movie: movie });
  } catch (error) {
    res.status(500).send(error);
  }
});
//GET
router.get("/movies/:id", auth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404).send("Movie not found");
    }
    res.status(200).send(movie);
  } catch (error) {
    res.status(500).send(error);
  }
});
//GET random movie
router.get("/movies/random", auth, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      const movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      const movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).send(movie);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
