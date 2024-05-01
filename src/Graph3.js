import React, { Component } from "react";
import * as d3 from "d3";

class Graph3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedVariables: null,
    };
  }

  componentDidMount() {
    // console.log("componentDidMount (data is): ", this.props.data1);
    this.setState({ x_scale: 10 });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedVariables !== this.props.selectedVariables) {
      this.createScatterPlot();
    }
  }

  createScatterPlot() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 30, left: 20 },
      w = 900 - margin.left - margin.right,
      h = 200 - margin.top - margin.bottom;

    const data = this.props.data2.map((d) => ({
      x: d[this.props.selectedVariables[0]],
      y: d[this.props.selectedVariables[1]],
    }));

    var container = d3
      .select(".child3_svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .select(".g_3")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    if (container.empty()) {
      container = d3
        .select(".child3_svg")
        .append("g")
        .attr("class", "g_3")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    } else {
      container.attr("transform", `translate(${margin.left}, ${margin.top})`);
    }

    // X axis
    var x_data = data.map((item) => item.x);
    var x_scale = d3
      .scaleBand()
      .domain(x_data)
      .range([margin.left, w])
      .padding(0.2);

    container
      .selectAll(".x_axis_g")
      .data([0])
      .join("g")
      .attr("class", "x_axis_g")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(x_scale));

    // Add Y axis
    var y_data = data.map((item) => item.y);
    var y_scale = d3
      .scaleLinear()
      .domain([0, d3.max(y_data)])
      .range([h, 0]);

    container
      .selectAll(".y_axis_g")
      .data([0])
      .join("g")
      .attr("class", "y_axis_g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y_scale));

    container
      .selectAll("circle") // Use circles instead of rectangles
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x_scale(d.x) + x_scale.bandwidth() / 2; // Center the circle on the x-axis
      })
      .attr("cy", function (d) {
        return y_scale(d.y);
      })
      .attr("r", 3) // Set the radius of the circle
      .style("fill", "#69b3a2"); // Set the color of the circle
  }

  render() {
    return (
      <svg className="child3_svg">
        <g className="g_3"></g>
      </svg>
    );
  }
}

export default Graph3;
