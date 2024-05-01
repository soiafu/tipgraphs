import React, { Component } from "react";
import "./App.css";
import Graph1 from "./Graph1";
import Graph2 from "./Graph2";
import Graph3 from "./Graph3";
import * as d3 from "d3";
import tips from "./tips.csv";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [], // Initialize columns array
      selectedTarget: "tip",
      selectedVariables: null, // Initialize selectedVariables
    };
  }

  componentDidMount() {
    const self = this;

    const targetVariables = ["tip", "total_bill", "size"];
    const categoryVariables = ["sex", "smoker", "time", "day"];

    d3.csv(tips, function (d) {
      let item = {};

      targetVariables.forEach((key) => {
        item[key] = parseFloat(d[key]);
      });

      categoryVariables.forEach((key) => {
        item[key] = d[key];
      });

      return item;
    })
      .then(function (csv_data) {
        self.setState({ data: csv_data, columns: targetVariables });
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  handleTargetChange = (event) => {
    const selectedTarget = event.target.value;
    this.setState({ selectedTarget });
  };

  handleCellClick = (selectedVariables) => {
    this.setState({ selectedVariables });
  };
  

  render() {
    return (
      <div className="App">
        <div className="header">
          <div className="header-text">Select Target:</div>
          <select onChange={this.handleTargetChange}>
            {this.state.columns.map((column, index) => (
              <option key={index} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>
        <div className="parent1">
          <div className="graph">
            <Graph1
              data1={this.state.data}
              selectedTarget={this.state.selectedTarget}
            ></Graph1>
          </div>
          <div className="graph">
            <Graph2
              data2={this.state.data}
              selectedTarget={this.state.selectedTarget}
              onCellClick={this.handleCellClick}
            ></Graph2>
         </div>
        </div>
        <div className="graph">
          <Graph3
            data2={this.state.data}
            selectedVariables={this.state.selectedVariables}
          ></Graph3>
        </div>
      </div>
    );
  }
}

export default App;
