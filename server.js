const express = require("express");
const { animals } = require("./data/animals.json");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function filterByQuery(query, animalsArray) {
	let filteredResults = animalsArray;
	console.log(query);
	if (query.personalityTraits) {
		let personalityTraitsArr = [];
		if (typeof query.personalityTraits === "string") {
			personalityTraitsArr = [query.personalityTraits];
		} else {
			personalityTraitsArr = query.personalityTraits;
		}

		personalityTraitsArr.forEach((element) => {
			filteredResults = filteredResults.filter((value) => {
				return value.personalityTraits.indexOf(element) > -1;
			});
		});
		console.log(filteredResults);
	}

	if (query.diet) {
		filteredResults = filteredResults.filter(
			(value) => value.diet === query.diet
		);
	}
	if (query.species) {
		filteredResults = filteredResults.filter(
			(animal) => animal.species === query.species
		);
	}
	if (query.name) {
		filteredResults = filteredResults.filter(
			(animal) => animal.name === query.name
		);
	}
	return filteredResults;
}

const findById = (id, animals) => {
	return animals.filter((animal) => animal.id === id)[0];
};

const createNewAnimal = (body, animalsArr) => {
	console.log(body);
	const animal = body;
	animalsArr.push(animal);
	console.log(__dirname);
	fs.writeFileSync(
		path.join(__dirname, "./data/animals.json"),
		JSON.stringify({ animals: animalsArr }, null, 2)
	);
	return animal;
};

app.get("/api/animals", (req, res) => {
	let results = animals;
	if (req.query) {
		results = filterByQuery(req.query, results);
	}

	res.json(results);
});

function validateAnimal(animal) {
	if (!animal.name || typeof animal.name !== "string") {
		return false;
	}
	if (!animal.species || typeof animal.species !== "string") {
		return false;
	}
	if (!animal.diet || typeof animal.diet !== "string") {
		return false;
	}
	if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
		return false;
	}
	return true;
}

app.get("/api/animals/:id", (req, res) => {
	const results = findById(req.params.id, animals);
	if (results) {
		res.json(results);
	} else {
		res.send(404);
	}
});

app.post("/api/animals", (req, res) => {
	console.log(req.body);
	req.body.id = animals.length.toString();
	if (!validateAnimal(req.body)) {
		res.status(400).send("The animal is not properly formatted.");
	} else {
		const animal = createNewAnimal(req.body, animals);
		res.json(animal);
	}
});

app.listen(PORT, () => {
	console.log(`Server is now on port ${PORT}`);
});
