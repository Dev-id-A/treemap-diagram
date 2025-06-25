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
//Treemap creation
            const root = d3.hierarchy(gamesData).sum(d => d.value);

            d3.treemap()
                .size([width,height])
                .padding(1)(root);

            svg.selectAll("rect")
                .data(root.leaves())
                .join("rect")
                .attr("y", d => d.y0)
                .attr("x", d => d.x0)
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0)
                .style("fill", "red");

        })