function question1() {
  const recipeScores = [3, 7];
  const puzzleInput = 990941;

  let previousElfScore1 = {value: 3, index: 0};
  let previousElfScore2 = {value: 7, index: 1};

  while(recipeScores.length <= puzzleInput + 10) {
    const newScore = previousElfScore1["value"] + previousElfScore2["value"];
    const sNewScore = newScore.toString();
    for (let i = 0; i < sNewScore.length; ++i) {
      recipeScores.push(parseInt(sNewScore.charAt(i)));
    }

    const nextElfScore1Index = (previousElfScore1["index"] + previousElfScore1["value"] + 1) % recipeScores.length;
    const nextElfScore2Index = (previousElfScore2["index"] + previousElfScore2["value"] + 1) % recipeScores.length;

    previousElfScore1 = {value: recipeScores[nextElfScore1Index], index: nextElfScore1Index};
    previousElfScore2 = {value: recipeScores[nextElfScore2Index], index: nextElfScore2Index};
  }

  console.log("Question1:", recipeScores.slice(puzzleInput, puzzleInput + 10).join(""));
}

function question2() {
    const recipeScores = [3, 7];
    const puzzleInput = "990941";

    let previousElfScore1 = {value: 3, index: 0};
    let previousElfScore2 = {value: 7, index: 1};

    let bValueFound = false;
    let result = 0;

    while(!bValueFound) {
      const newScore = previousElfScore1["value"] + previousElfScore2["value"];
      const sNewScore = newScore.toString();
      for (let i = 0; i < sNewScore.length; ++i) {
        recipeScores.push(parseInt(sNewScore.charAt(i)));
      }

      const nextElfScore1Index = (previousElfScore1["index"] + previousElfScore1["value"] + 1) % recipeScores.length;
      const nextElfScore2Index = (previousElfScore2["index"] + previousElfScore2["value"] + 1) % recipeScores.length;

      previousElfScore1 = {value: recipeScores[nextElfScore1Index], index: nextElfScore1Index};
      previousElfScore2 = {value: recipeScores[nextElfScore2Index], index: nextElfScore2Index};

      for (let i = 0; i < sNewScore.length; ++i) {
        const compareSegment = recipeScores.slice(recipeScores.length - puzzleInput.length - 1 - i, recipeScores.length - 1 - i);
        const number = compareSegment.join("");

        if (puzzleInput === number) {
          result = recipeScores.length - puzzleInput.length - 1 - i;
          bValueFound = true;
        }
      }
    }
    console.log("Question2:", result);
}

question1();
question2();
