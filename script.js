//Variables
    const width = 960;
    const height = 960;
    const svgHeight = 600
    
//Svg creation

    const svg = d3.select("body")
                    .append("svg")
                    .attr("viewBox", `0 0 ${width} ${height}`)
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .style("width", width)
                    .style("height", height);


//Data fetch

    d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
        .then(gamesData => {
//Treemap creation
            const gamesRoot = d3.hierarchy(gamesData).sum(d => d.value);

            d3.treemap()
                .size([width,svgHeight])
                .padding(0.2)(gamesRoot);

//Colour by console
            const colourScale = d3.scaleOrdinal()
                                    .domain(gamesData.children.map(d => d.name))
                                    .range(d3.schemeTableau10);

            const game = svg.selectAll("rect")
                .data(gamesRoot.leaves())
                .join("rect")
                .attr("class", "tile")
                .attr("data-name", d => d.data.name)
                .attr("data-category", d => d.data.category)
                .attr("data-value", d => d.data.value)
                .attr("y", d => d.y0)
                .attr("x", d => d.x0)
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0)
                .style("fill", d => colourScale(d.parent.data.name));

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

//Legend
        const legend = svg.append("g")
                            .attr("id", "legend")
                            .attr("transform", `translate(0 , ${svgHeight + 30})`)

//Legend items displayed their styling
        legend.selectAll("rect")
                                    .data(gamesData.children)
                                    .join("rect")
                                    .attr("class", "legend-item")
                                    .attr("fill", d => colourScale(d.name))
                                    .attr("height", 20)
                                    .attr("width", 100)
                                    .attr("x", (d, i) => i < 6 ? width - 800:
                                                         i < 12 ? width - 500:
                                                         width-200)//Divide i in three columns
                                    .attr("y", (d, i) =>  i % 6 * 50)
                                    .text(d => d.name);

//Legend text
        legend.selectAll("text")
                    .data(gamesData.children)
                    .join("text")
                    .attr("x", (d, i) => (i < 6 ? width - 800:
                                        i < 12 ? width - 500:
                                        width-200) + 35)
                    .attr("y", (d, i) =>  (i % 6 * 50) + 15)
                    .text(d => d.name);             
                    
//Tooltip creation
        const tooltip = d3.select("body")
                            .append("div")
                            .attr("id", "tooltip")

//Tooltip styling
                            .style("position", "absolute")
                            .style("opacity", 0)
                            .style("padding", "1%")
                            .style("font-size", "12px")
                            .style("border", "1px solid black")
                            .style("text-align", "center");

//Tooltip on the treemap
        game.attr("data-value", d => d.data.value)
                .on("mouseover", (e, d) =>
                    tooltip.style("opacity", 1)
                            .style("display", "block")
                            .style("background-color", colourScale(d.data.category))
                            .attr("data-value", d.data.value)
                            .html(`${d.data.name}<br>
                                    Console: ${d.data.category}<br>
                                    Value: ${d.data.value}`)
)
                .on("mousemove", e =>
                    tooltip.style("left", (e.pageX + 20) + "px")
                            .style("top", (e.pageY - 10) + "px")
                )
                .on("mouseout", e =>
                    tooltip.style("opacity", 0)
                            .style("display", "block")
                )
                
        });