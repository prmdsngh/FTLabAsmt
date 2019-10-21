import React, {useState, useEffect} from 'react';
import { Slider, InputNumber } from 'antd';
import Axios from 'axios';
import './App.css';

function App() {
  const [amount, setAmount] = useState(500);
  const [duration, setDuration] = useState(6);
  const [result, setResult] = useState(null);

  const onChangeSlider = value => {
    setDuration(value);
  }
  const onInputChange = value => {
    console.log(value)
    if(value>499 && value<5001)
    setAmount(value)
  }

  const getMarks = () => {
    const marks = {};
    for(let i = 6 ; i<=24; i++){
      marks[i] = i;
    }
    return marks;
  }

  const getCombineArg = (a,b) => {
    return `${a}_${b}`;
  }

  useEffect(()=> {
    const getData = async () => {
      const response = await Axios.get('https://ftl-frontend-test.herokuapp.com/interest',{
        params:{
          amount:amount,
          numMonths:duration
        }
      });
      const {interestRate, monthlyPayment} = response.data;
      const dataToStore = {
        interestRate,
        monthlyPayment,
      }
      console.log(dataToStore);
      localStorage.setItem(getCombineArg(amount, duration), JSON.stringify(dataToStore));
      setResult(dataToStore);
    }
    const isDataInStorage = localStorage.getItem(getCombineArg(amount, duration));
    if(!isDataInStorage){
      getData();
    } else {
      setResult(JSON.parse(isDataInStorage));
    }
  }, [amount, duration])

  return (
    <div className='container'>
      <div id="form"> 
        <div className='Amount'>
          <label>Loan Amount</label>
          <InputNumber
              style={{width: '100%'}}
              placeholder="Enter Loan Amount" 
              onChange={onInputChange} 
              min={500} 
              max={5000} 
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              value={amount}
          />
        </div>
        <div>
          <label>Duration (<i>in months</i>)</label>
          <Slider
            style={{marginLeft: '5px', width: '500px'}}
            marks={getMarks()}
            min={6}
            max={24}
            step={1}
            defaultValue={duration}
            onChange={onChangeSlider}
          />
        </div> 
      </div> 
      {(result && result.monthlyPayment) && 
        <div id='result' className='Result'>
          <label>Interest : </label><label className='res'>{`${result.interestRate}%`}</label>
          <label>monthly payment : </label><label className='res'>{`${result.monthlyPayment.amount} ${result.monthlyPayment.currency}`}</label>
        </div>
      }
    </div>
  );
}

export default App;
