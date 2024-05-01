import React, { Component } from "react";
import * as d3 from "d3";

class Graph1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: 'sex'
    };
  }
  calculateAverages(data1, selectedCategory, selectedTarget) {
    console.log('first item in data1:', data1[0]);
    console.log('selectedCategory:', selectedCategory);
    console.log('selectedTarget:', selectedTarget);
  
    var output = [];
    var categories = [...new Set(data1.map(item => item[selectedCategory]))];
    console.log('categories:', categories);

    categories.forEach(cat => {
      var filteredData = data1.filter(item => item[selectedCategory] === cat);
      var sum = filteredData.reduce((acc, item) => acc + item[selectedTarget], 0);
      var average = sum / filteredData.length;
      output.push([cat, average]);
      console.log('output:', output);
    });
    return output;
  }

  handleRadioChange = (event) => {
    this.setState({ selectedCategory: event.target.value });
  };
  componentDidUpdate() {
    var margin = { top: 5, right: 30, bottom: 60, left: 50 },
      w = 500 - margin.left - margin.right,
      h = 300 - margin.top - margin.bottom;

      var svg = d3.select(".child1_svg");
      svg.selectAll("*").remove();
    

    var data = this.props.data1;
    var selectedTarget = this.props.selectedTarget;
    var selectedCategory = this.state.selectedCategory;

  if (!data || !selectedTarget || !selectedCategory) {
    return; 
  }

    var temp_data = this.calculateAverages(data, this.state.selectedCategory, this.props.selectedTarget);
    console.log('temp_data:', temp_data); 


if (!Array.isArray(temp_data)) {
  console.error('temp_data is not an array:', temp_data);
  return;
}
    // X axis
    var x_data = temp_data.map((item) => item[0]);
    var x_scale = d3
      .scaleBand()
      .domain(x_data)
      .range([0, w]) 
      .padding(0.03);
    
    svg = d3.select(".child1_svg");
    
    svg.attr("width", w + margin.left + margin.right)
       .attr("height", h + margin.top + margin.bottom);

    var container = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    container
      .append("g") 
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(x_scale));

var y_data = temp_data.map((item) => item[1]);
var y_scale = d3
  .scaleLinear()
  .domain([0, d3.max(y_data)])
  .range([h, 0]);

container
  .append("g") 
  .call(d3.axisLeft(y_scale));
    
var rectGroup = container.append("g");

rectGroup
  .selectAll("rect")
  .data(temp_data)
  .join("rect")
  .attr("x", function (d) {
    return x_scale(d[0]);
  })
  .attr("y", function (d) {
    return y_scale(d[1]);
  })
  .attr("width", x_scale.bandwidth())
  .attr("height", function (d) {
    return h - y_scale(d[1]);
  })
  .attr("fill", "#b0b0b0");

  rectGroup
  .selectAll("text")
  .data(temp_data)
  .join("text")
  .attr("x", function (d) {
    return x_scale(d[0]) + x_scale.bandwidth() / 2; 
  })
  .attr("y", function (d) {
    return y_scale(d[1]) + 20; 
  })
  .text(function (d) {
    return parseFloat(d[1]).toFixed(5); 
  })
  .attr("text-anchor", "middle") 
  .attr("dominant-baseline", "ideographic") 
  .attr("fill", "black");


  }
  render() {
    const categories = ['sex', 'smoker', 'day', 'time'];

    return (

      <div>
        <div>
          {categories.map((category, index) => (
            <label key={index}>
              <input 
                type="radio" 
                value={category} 
                checked={this.state.selectedCategory === category}
                onChange={this.handleRadioChange} 
              /> 
              {category}
            </label>
          ))}
        </div>
        <svg className="child1_svg">
          <g className="g_1"></g>
        </svg>
      </div>
    );
  }
}
export default Graph1;
