import React,{Component} from "react";
import './App.css';
import Graph1 from "./Graph1";
import Graph2 from "./Graph2";
import Graph3 from "./Graph3";
import * as d3 from 'd3';
import tips from "./tips.csv";

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [], // Initialize columns array
      selectedTarget: null
    };
  }
  

  componentDidMount() {
    const self = this;

    d3.csv(tips, function (d) {
      return {
        tip: parseFloat(d.tip),
        total_bill: parseFloat(d.total_bill),
        day: d.day
      };
    }).then(function (csv_data) {
      const columns = csv_data.length > 0 ? Object.keys(csv_data[0]) : [];
      self.setState({ data: csv_data, columns: columns });
    }).catch(function (err) {
      console.log(err);
    });
  }

  handleTargetChange = (event) => {
    const selectedTarget = event.target.value;
    this.setState({ selectedTarget });
  };

  render() {
    return (
      <div className="App">
        <div className="header">
          <div className="header-text">Select Target:</div>
          <select onChange={this.handleTargetChange}>
            {this.state.columns.map((column, index) => (
              <option key={index} value={column}>{column}</option>
            ))}
          </select>
        </div>
        <div className="parent1">
          <div className="graph"><Graph1 data1={this.state.data} selectedTarget={this.state.selectedTarget}></Graph1></div>
          <div className="graph"><Graph2 data2={this.state.data} selectedTarget={this.state.selectedTarget}></Graph2></div>
        </div>
        <div className="graph"><Graph3 data3={this.state.data} selectedTarget={this.state.selectedTarget}></Graph3></div>
      </div>
    );
  }
}

export default App;