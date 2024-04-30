import React,{Component} from "react";
import './App.css';
import * as d3 from 'd3';
import tips from "./tips.csv";

class App extends Component{
  constructor(props){
    super(props)
    this.state={data:[]}
  }
  componentDidMount(){
    var self=this
    d3.csv(tips,function(d){
      return {
        tip:parseFloat(d.tip),
        total_bill:parseFloat(d.total_bill),
        day:d.day
      }
    }).then(function(csv_data){
      self.setState({data:csv_data})
      //console.log(csv_data)
    })
    .catch(function(err){
      console.log(err)
    })

  }
  render(){
    return (
      <div className="App">
        <div className="header">
          <div className="header-text">Select Target:</div>
          <select>
            [replace options with actual input from csv]
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>
        <div className="parent1"> 
          <div className="graph"></div>
          <div className="graph"></div>
        </div>
        <div className="graph"></div>
      </div>
    );
  }
}

export default App;
