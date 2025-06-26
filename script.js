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
            const gamesRoot = d3.hierarchy(gamesData).sum(d => d.value);

            d3.treemap()
                .size([width,height])
                .padding(1)(gamesRoot);


//Colour by genre
            const genreScale = d3.scaleOrdinal()
                                    .domain(gamesData.children.map(d => d.name))
                                    .range(d3.schemeCategory10);

            svg.selectAll("rect")
                .data(gamesRoot.leaves())
                .join("rect")
                .attr("class", "tile")
                .attr("y", d => d.y0)
                .attr("x", d => d.x0)
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0)
                .style("fill", d => genreScale(d.parent.data.name));

//Text addition
svg.selectAll("text")
    .data(gamesRoot.leaves())
    .join("text")
    .attr("y", d => d.y0 + 10)
    .style("font-size", "9px")
    .each(function(d){
        const word = d.data.name.split(" ");

        const displayedWords = word.length >= 3 ? word.slice(0,3).concat("..."): word

        d3.select(this)
            .selectAll("tspan")
            .data(displayedWords)
            .join("tspan")
            .attr("x",d.x0 + 1)
            .attr("dy", (d, i) => i === 0 ? 0: "1.2em")
            .text(d => d);
    });
        })