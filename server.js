const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const { animals } = require("./data/animals.json");

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
		filteredResults = animalsArray.filter((value) => value.diet === query.diet);
	}
	if (query.species) {
		filteredResults = animalsArray.filter(
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

app.get("/api/animals", (req, res) => {
	let results = animals;
	if (req.query) {
		results = filterByQuery(req.query, results);
	}

	res.json(results);
});

app.get("/api/animals/:id", (req, res) => {
	const results = findById(req.params.id, animals);
	if (results) {
		res.json(results);
	} else {
		res.send(404);
	}
});

app.listen(PORT, () => {
	console.log(`Server is now on port ${PORT}`);
});
