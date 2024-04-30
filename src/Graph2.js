import React, { Component } from "react";
import * as d3 from "d3";

class Graph2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    //console.log("componentDidMount (data is): ", this.props.data1);
    this.setState({ x_scale: 10 });
  }

  //formulas for calculating the correlation
  calculateCorrelation(data, variable1, variable2) {
    const values1 = data.map((item) => item[variable1]);
    const values2 = data.map((item) => item[variable2]);

    const mean1 = d3.mean(values1);
    const mean2 = d3.mean(values2);

    let numerator = 0;
    let denominator1 = 0;
    let denominator2 = 0;

    for (let i = 0; i < data.length; i++) {
      const deviation1 = values1[i] - mean1;
      const deviation2 = values2[i] - mean2;
      numerator += deviation1 * deviation2;
      denominator1 += deviation1 * deviation1;
      denominator2 += deviation2 * deviation2;
    }

    const correlation = numerator / Math.sqrt(denominator1 * denominator2);
    return correlation;
  }

  componentDidUpdate() {
    // Set the dimensions and margins of the graph
    var margin = { top: 80, right: 85, bottom: 30, left: 50 },
      w = 520 - margin.left - margin.right,
      h = 450 - margin.top - margin.bottom;

    var data = this.props.data2;

    // Extract specific properties from each object using map
    const temp_data = data.map((item) => ({
      total_bill: item.total_bill,
      tip: item.tip,
      size: item.size,
    }));

    var container = d3
      .select(".child2_svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .select(".g_2")
      .attr("transform", `translate(${margin.left}, 20)`);

    // Define variables (columns)
    const columns = ["tip", "total_bill", "size"];
    const numColumns = columns.length;

    // Calculate correlation coefficients between variables
    const correlationMatrix = [];
    columns.forEach((col1) => {
      const row = [];
      columns.forEach((col2) => {
        const corr = this.calculateCorrelation(temp_data, col1, col2);
        row.push(corr);
      });
      correlationMatrix.push(row);
    });

    // Define color scale for correlation values
    const colorScale = d3.scaleSequential(d3.interpolatePlasma).domain([0, 1]);

    // Build X scales and axis:
    var x = d3.scaleBand().range([0, w]).domain(columns).padding(0.01);
    container
      .append("g")
      .attr("transform", "translate(0," + h + ")")
      .call(d3.axisBottom(x));

    // Build Y scales and axis:
    var y = d3.scaleBand().range([h, 0]).domain(columns).padding(0.01);
    container.append("g").call(d3.axisLeft(y));

    // Cellsize
    const cellSize = w / numColumns;

    const rects = container
      .selectAll()
      .data(correlationMatrix)
      .enter()
      .append("g")
      .selectAll("rect")
      .data((d, i) => d.map((value, j) => ({ value, row: i, column: j })))
      .enter()
      .append("rect")
      .attr("x", (d) => x(columns[d.column]))
      .attr("y", (d) => y(columns[d.row]))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", (d) => colorScale(d.value));

    // Add click event handler to the rectangles
    rects.on("click", (event, d) => {
      console.log(
        `Clicked on value: ${d.value.toFixed(2)} at (${columns[d.column]}, ${
          columns[d.row]
        })`
      );
    });

    // Display text on the rectangles
    container
      .selectAll()
      .data(correlationMatrix)
      .enter()
      .append("g")
      .selectAll("text")
      .data((d, i) => d.map((value, j) => ({ value, row: i, column: j })))
      .enter()
      .append("text")
      .attr("x", (d) => x(columns[d.column]) + x.bandwidth() / 2)
      .attr("y", (d) => y(columns[d.row]) + y.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("fill", "black")
      .text((d) => d.value.toFixed(2)); 

      const legendWidth = 100;
      const legendHeight = h; 
      const legendPadding = 20;

      const legend = d3
        .select(".legend")
        .attr("transform", `translate(450, 20)`);

      const legendColorScale = d3
        .scaleSequential(d3.interpolatePlasma)
        .domain([0, 1]);

      // Create color rectangles for the legend 
      legend
        .selectAll(".legendRect")
        .data(d3.range(0, 1.1, 0.1))
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => (legendHeight / 10) * i)
        .attr("width", legendWidth/2)
        .attr("height", legendHeight / 10)
        .style("fill", (d) => legendColorScale(d));

      // Add text labels next to each color rectangle
      legend
        .selectAll(".legendLabel")
        .data(d3.range(0, 1.1, 0.1))
        .enter()
        .append("text")
        .attr("class", "legendLabel")
        .attr("x", 55) // Position text to the right of the rectangles
        .attr("y", (d, i) => (legendHeight / 10) * i + legendHeight / 20) // Center text vertically
        .text((d) => d.toFixed(1)) // Show the corresponding data value with one decimal place
        .style("text-anchor", "start")
        .style("alignment-baseline", "middle")
        .style("font-size", "10px"); // Adjust font size for the labels

      // Add title for the legend
      legend
        .append("text")
        .attr("x", 0)
        .attr("y", -10)
        .text("Correlation")
        .style("text-anchor", "start")
        .style("font-size", "12px");

  }

  render() {
    return (
      <svg className="child2_svg">
        <g className="g_2"></g>
        <g className="legend"></g>
      </svg>
    );
  }
}
export default Graph2;
