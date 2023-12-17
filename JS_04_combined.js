// CONSTANTS AND GLOBALS
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.5,
  margin = { top: 50, bottom: 50, left: 50, right: 50 };

/* Container 0 - MOMA photography acquisition over the years*/
d3.csv('./clean_data/20231119_moma_acquired_by_year.csv').then(function(data) {
  data.forEach(function(d) {
    d.year_acquired = new Date(d.year_acquired);
    d.is_photog = +d.is_photog;
  });

  // SCALES
  const xScale0 = d3.scaleTime()
    .domain(d3.extent(data, d => d.year_acquired))
    .range([0, width]);

  const yScale0 = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.is_photog)])
    .range([height, 0]);

  // CREATE SVG ELEMENT
  const svg0 = d3.select("#container0")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create the bars
  svg0.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => xScale0(d.year_acquired))
    .attr("y", d => yScale0(d.is_photog))
    .attr("width", width / data.length) // Adjust width based on data length
    .attr("height", d => height - yScale0(d.is_photog))
    .attr("fill", "pink");

  // Add the x-axis
  svg0.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale0))
    .style("font-size", "8px");

  // Add the y-axis
  svg0.append('g')
    .call(d3.axisLeft(yScale0))
    .style("font-size", "8px");
 

  // Add the y-axis label
  svg0.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text("# photographic artwork acquired");

// Add a callout box for the year 1968
const calloutYear = 1968;
const calloutData = data.find(d => d.year_acquired.getFullYear() === calloutYear);

if (calloutData) {
  const calloutBox = svg0.append('foreignObject')
    .attr("x", xScale0(calloutData.year_acquired) + 40) // Adjust position
    .attr("y", yScale0(calloutData.is_photog) - 250) // Adjust position
    .attr("width", 110) 
    .attr("height", 50) 
    .append('xhtml:div')
    .style('font-size', '8px')
    .style('background-color', 'white')
    .style('border', '1px solid white')
    .html(`In 1968, MoMA acquired close to 5,000 images from the French Photographer Eugene Atgét's archive.`);
    

  // Add an arrow
  const arrowLength = 20;
  svg0.append('line')
    .attr('x1', xScale0(calloutData.year_acquired) +40) // Adjust position
    .attr('y1', yScale0(calloutData.is_photog) - 230) // Adjust position
    .attr('x2', xScale0(calloutData.year_acquired))
    .attr('y2', yScale0(calloutData.is_photog) - 230) // Adjust position
    .attr('stroke', 'grey');

  // Add a triangular arrowhead
  svg0.append('polygon')
  .attr('points', `${xScale0(calloutData.year_acquired) + 5},${yScale0(calloutData.is_photog) - 235} 
                    ${xScale0(calloutData.year_acquired) + 5},${yScale0(calloutData.is_photog) - 225} 
                    ${xScale0(calloutData.year_acquired) + 0},${yScale0(calloutData.is_photog) - 230}`)
  .style('fill', 'grey');


 // Add an image thumbnail
 const thumbnailWidth = 120;
 const thumbnailHeight = 120;
 svg0.append('image')
   .attr('x', xScale0(calloutData.year_acquired) + 150) // Adjust position
   .attr('y', yScale0(calloutData.is_photog) - 300) // Adjust position
   .attr('width', thumbnailWidth)
   .attr('height', thumbnailHeight)
   .attr('xlink:href', 'media/eugene_image.jpeg');

}

});



/* Container 1 -  Unique Artist Acquired */
d3.csv('./clean_data/20231119_unique_artist_acquired.csv').then(function(data1) {
  data1.forEach(function(d) {
    d.year_acquired = new Date(d.year_acquired);
    d.photogrpahy_artist = +d.photogrpahy_artist;
  });

  // SCALES
  const xScale1 = d3.scaleBand() // Use scaleBand for discrete values (years)
    .domain(data1.map(d => d.year_acquired.getFullYear())) // Extract the year part
    .range([0, width])
    .padding(0.1); // Adjust padding as needed

  const yScale1 = d3.scaleLinear()
    .domain([0, d3.max(data1, d => d.photogrpahy_artist)])
    .range([height, 0]);

  // CREATE SVG ELEMENT
  const svg1 = d3.select("#container1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create the bars
  svg1.selectAll("rect")
    .data(data1)
    .enter()
    .append("rect")
    .attr("x", d => xScale1(d.year_acquired.getFullYear()))
    .attr("y", d => yScale1(d.photogrpahy_artist))
    .attr("width", xScale1.bandwidth())
    .attr("height", d => height - yScale1(d.photogrpahy_artist))
    .attr("fill", "pink");

  // Add the x-axis
 // Add the x-axis with custom tick format
  svg1.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale1)
      .tickFormat(d => {
        const year = +d;
        return year % 10 === 0 ? year : ''; // Show only decades
      })
    )
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.8em")
    .style("font-size", "8px"); // Adjust font size as needed

  // Add the y-axis
  svg1.append('g')
    .call(d3.axisLeft(yScale1))
    .style("font-size", "8px");

  // Add the y-axis label
  svg1.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text("# Artists with work acquired");



});



/* Container 3 - % photo acquisition */
d3.csv('./clean_data/20231119_moma_acquired_by_year.csv').then(function(data3) {
  data3.forEach(function(d) {
    d.year_acquired = new Date(d.year_acquired);
    d.percent_photog = +d.percent_photog;
  });

  // SCALES
  const xScale3 = d3.scaleTime()
    .domain(d3.extent(data3, d => d.year_acquired))
    .range([0, width]);

  const yScale3 = d3.scaleLinear()
    .domain([0, d3.max(data3, d => d.percent_photog)])
    .range([height, 0]);

  // CREATE SVG ELEMENT
  const svg3 = d3.select("#container3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add light grey background
  svg3.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', '#f0f0f0'); 


  // Calculate the rolling 5-year average for percent_photog
  const rollingAverageData = data3.map((d, i, arr) => {
    const values = arr.slice(Math.max(0, i - 2), Math.min(arr.length, i + 3));
    const sum = values.reduce((acc, cur) => acc + cur.percent_photog, 0);
    return sum / values.length;
  });

  // Create an area generator
  const areaGenerator = d3.area()
    .x(d => xScale3(d.year_acquired))
    .y0(height)
    .y1((d, i) => yScale3(i < 2 ? d.percent_photog : rollingAverageData[i - 2])); // Adjust index for rolling average

  // Append the area to the SVG
  svg3.append('path')
    .datum(data3)
    .attr('fill', 'lightgray') // Fill color for the rest
    .attr('d', areaGenerator);

  // Create a second area for the "is_photog" percentage
  const areaPhotog = d3.area()
    .x(d => xScale3(d.year_acquired))
    .y0(height)
    .y1((d, i) => yScale3(i < 2 ? d.percent_photog : rollingAverageData[i - 2])); // Adjust index for rolling average

  // Append the area for "is_photog" percentage
  svg3.append('path')
    .datum(data3)
    .attr('fill', 'pink')
    .attr('d', areaPhotog);

  // Add the x-axis
  svg3.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale3));

  // Add the y-axis
  svg3.append('g')
    .call(d3.axisLeft(yScale3).tickFormat(d3.format('.0%')));

  // Add the y-axis label
  svg3.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text("% MoMA acquisition photography  (5-yr avg)");


  const labelNonPhotography = svg3.append('text')
    .attr('x', xScale3(data3[data3.length - 1].year_acquired.getFullYear()))
    .attr('y', yScale3(data3[data3.length - 1].percent_photog))
    .attr('dy', -50)
    .attr('text-anchor', 'start') 
    .style('font-size', '8px')
    .style('fill', 'darkgrey')
    .text('Non-photography acquisitions');  
 
  const labelPhotography = svg3.append('text')
    .attr('x', xScale3(data3[data3.length - 1].year_acquired.getFullYear()))
    .attr('y', yScale3(data3[data3.length - 1].percent_photog))
    .attr('dy', 100)
    .attr('text-anchor', 'start') 
    .style('font-size', '8px')
    .style('fill', 'coral')
    .text('Photography Acquisition');


});





/* Container 4 - Unique Artist Acquired (photog vs. non-photog) */
d3.csv('./clean_data/20231119_unique_artist_acquired.csv').then(function(data4) {
  data4.forEach(function(d) {
    d.year_acquired = new Date(d.year_acquired);
    d.photogrpahy_artist = +d.photogrpahy_artist;
    d.non_photography_artist = +d.non_photography_artist;
  });

  // SCALES
  const xScale4 = d3.scaleBand() // Use scaleBand for discrete values (years)
    .domain(data4.map(d => d.year_acquired.getFullYear())) // Extract the year part
    .range([0, width])
    .padding(0.1); // Adjust padding as needed

  const yScale4 = d3.scaleLinear()
    .domain([0, d3.max(data4, d => Math.max(d.photogrpahy_artist, d.non_photography_artist))])
    .range([height, 0]);

  // CREATE SVG ELEMENT
  const svg4 = d3.select("#container4")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create the lines
  const linePhotography = d3.line()
    .x(d => xScale4(d.year_acquired.getFullYear()))
    .y(d => yScale4(d.photogrpahy_artist));

  const lineNonPhotography = d3.line()
    .x(d => xScale4(d.year_acquired.getFullYear()))
    .y(d => yScale4(d.non_photography_artist));

  // Append the photography line to the SVG
  svg4.append('path')
    .data([data4])
    .attr('fill', 'none')
    .attr("stroke", "pink")
    .attr('stroke-width', 3)
    .attr('d', linePhotography);

  // Append the non-photography line to the SVG
  svg4.append('path')
    .data([data4])
    .attr('fill', 'none')
    .attr("stroke", "lightgrey")
    .attr('stroke-width', 1)
    .attr('d', lineNonPhotography);

  // Add labels at the end of each line
  const labelPhotography = svg4.append('text')
    .attr('x', xScale4(data4[data4.length - 1].year_acquired.getFullYear()))
    .attr('y', yScale4(data4[data4.length - 1].photogrpahy_artist))
    .attr('dy', -5)
    .attr('text-anchor', 'start') 
    .style('font-size', '8px')
    .style('fill', 'coral')
    .text('Photog Artist');

  const labelNonPhotography = svg4.append('text')
    .attr('x', xScale4(data4[data4.length - 1].year_acquired.getFullYear()))
    .attr('y', yScale4(data4[data4.length - 1].non_photography_artist))
    .attr('dy', -5)
    .attr('text-anchor', 'start') 
    .style('font-size', '7px')
    .style('fill', 'darkgrey')
    .text('Non-photog Artist');

  // Add the x-axis
  svg4.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale4)
      .tickFormat(d => {
        const year = +d;
        return year % 10 === 0 ? year : ''; // Show only decades
      })
    )
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.8em")
    .style("font-size", "7px"); // Adjust font size as needed

  // Add the y-axis
  svg4.append('g')
    .call(d3.axisLeft(yScale4))
    .style("font-size", "8px");

  // Add the y-axis label
  svg4.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text("# Unique Artists with work acquired");
});