//Variables
    const width = 960;
    const height = 600;
    
//Svg creation

    const svg = d3.select("body")
                    .append("svg")
                    .attr("viewBox", `0 0 ${width} ${height}`)
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .style("width", width)
                    .style("height", height);

    svg.style("background-color", "black")

//Data fetch

    d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
        .then(gamesData => {
            console.log(gamesData)
        })