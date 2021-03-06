import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Alert } from 'react-native';

import ButtonRow from './ButtonRow';
import CustomButton from './CustomButton';

import email from 'react-native-email'

export default class App extends React.Component {


  constructor(props) {
    super(props);

    this.getRandomInt = this.getRandomInt.bind(this);
    this.pressedButton = this.pressedButton.bind(this);
    this.doneWithButton = this.doneWithTest.bind(this);
    this.setRandomButton = this.setRandomButton.bind(this);
    this.resetResultArray = this.resetResultArray.bind(this)

    this.state = { 
      testingRow: -1,
      testingCol: -1,
      numberOfCols: 2,
      numberOfRows: 2,
      resultArray: -1,
      doneWithTest: false,
      highestResult: 0,
      lowestResult: Math.pow(10, 1000)
      };

  }

  resetResultArray(){
    let newResultArr = []
    for (let row = 0; row < this.state.numberOfRows; row++) {
      let colArr = []
      for (let col = 0; col < this.state.numberOfCols; col++) {
        colArr.push({ value: -1 }.value)
      }
      newResultArr.push(colArr)
    }

    this.setState({
      resultArray: newResultArr
    })
  }

  // Creating result array - Setting to -1 when not defined
  componentWillMount(){
    
    this.resetResultArray()

    Alert.alert(
      'Söderlind zone test',
      'Click start when you are ready',
      [
        { text: 'Start', onPress: () => this.setRandomButton() }],
      { cancelable: false }
    )

  }

  setRandomButton(){
   
    let randomedRow = -1
    let randomedCol = -1

    let tries = 0
    let didFindUnpressedButton = true

    do {
      tries++

      // Get random button
      randomedRow = this.getRandomInt(this.state.numberOfRows);
      randomedCol = this.getRandomInt(this.state.numberOfCols);

      if (tries > 30*(this.state.numberOfCols * this.state.numberOfRows)) {
        //console.log("All buttons have been pressed! (tries:" + tries + ")")
        this.doneWithTest();
        didFindUnpressedButton = false
        break
      }

    } while (this.state.resultArray[randomedRow][randomedCol] != '-1')

    if (didFindUnpressedButton) {
      this.setState({
        testingRow: randomedRow,
        testingCol: randomedCol,
      })
    }
    
  }

  startTest(){
    
    this.setRandomButton();

  }

  // Callback function when button pressed
  pressedButton(row,col,time){
    //console.log("pressedButton(r:"+ row + ",c" + col + ",t" + time);
    this.state.resultArray[row][col] = time;

    // Sleep?
    this.setState({
      testingRow: -1,
      testingCol: -1,
    })

    var that = this;
    if (that) {
      setTimeout(function () { that.setRandomButton() }, 1000);
    } 
  }

  doneWithTest(){
    //console.log("doneWithButton()")
    
    this.setState({
      testingRow: -1,
      testingCol: -1,
      doneWithTest: true
    })

    // Normalize
    
    let highestNumberFound = 0
    let lowestNumberFound = Math.pow(10, 1000);

    for (let row = 0; row < this.state.numberOfRows; row++) {
      for (let col = 0; col < this.state.numberOfCols; col++) {
        if(this.state.resultArray[col][row] > highestNumberFound){
          highestNumberFound = this.state.resultArray[col][row]
        }
        if (this.state.resultArray[col][row] < lowestNumberFound) {
          lowestNumberFound = this.state.resultArray[col][row]
        }
      }
    }


    this.setState({
      highestResult: highestNumberFound,
      lowestResult: lowestNumberFound
    })
  
    // Exporting result
    console.log(JSON.stringify(this.state.resultArray))
    this.sendEmail(JSON.stringify(this.state.resultArray))
  }

  sendEmail = (JSON) => {
    const to = ['soderlindemil@gmail.com'] // string or array of email addresses
    email(to, {
      subject: "ThumbZoneTester result[" + this.state.numberOfCols + "][" + this.state.numberOfRows +"] ID: " + Date.now(),
      body: JSON
    }).catch(console.error)
  }

  
  createRows = () => {

    let nrOfCols = this.state.numberOfCols;
    let nrOfRows = this.state.numberOfRows;

    let testRow = this.state.testingRow;
    let testCol = this.state.testingCol;
    let rows = []

    for (let i = 0; i < nrOfRows; i++) {
      if(i == testRow){
        rows.push(<ButtonRow nrOfCols={nrOfCols} rowNumber={i} columnNumber={testCol} callbackFunc={this.pressedButton} doneWithTest={this.state.doneWithTest} highestResult={this.state.highestResult} lowestResult={this.state.lowestResult} key={i} />)
      }else{
        rows.push(<ButtonRow nrOfCols={nrOfCols} rowNumber={i} columnNumber='-1' callbackFunc={this.pressedButton} doneWithTest={this.state.doneWithTest} highestResult={this.state.highestResult} lowestResult={this.state.lowestResult} key={i} />)
      }
    }
    return rows;
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: 'black', height:30 }} />
        {this.createRows()}
        <View style={{ backgroundColor: 'black', height: 30 }} />
      </View>        
    )
  }


  getRandomInt(max) {
    let random = Math.floor(Math.random() * Math.floor(max));
    return random;
  }

}



function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(0,0,0)',
  },
});
