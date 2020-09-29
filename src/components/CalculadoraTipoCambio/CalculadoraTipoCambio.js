import React, { Component } from 'react'
import styled from 'styled-components';
import {generateMedia} from 'styled-media-query';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Fab from '@material-ui/core/Fab';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {format} from 'date-fns';
import { Alert, AlertTitle } from '@material-ui/lab';

import { getCurrentExchangeRate,
         getExchangeRateByDate } from '../../actions/ExchangeRateActions';
import CalendarButton from '../Home/CalendarButton';

class CalculadoraTipoCambio extends Component {

    constructor(props)
    {   super();
        this.state = 
        {
            date : new Date(),
            nuevosSoles : '',
            dolares : '',
            calculo : 'S',
            errorAlertOpen : false
        };

        this.onChangeDate           = this.onChangeDate.bind(this);
        this.onChange               = this.onChange.bind(this);
        this.onCalculate            = this.onCalculate.bind(this);        
        this.onChangeCalculateType  = this.onChangeCalculateType.bind(this);        
        this.clearState             = this.clearState.bind(this);                
    }

    componentDidMount()
    {        
        this.props.getCurrentExchangeRate();
    }

    onChange(e)
    {
        this.setState({[e.target.name] : e.target.value})
    }

    onChangeDate(d)
    {
        let fecha = format(d,'dd/MM/yyyy');
        this.setState({date:d});
        this.setState({titulo : 'Dolar al '+fecha});
        // console.log(d);
        this.props.getExchangeRateByDate(d.getDate(), d.getMonth()+1, d.getFullYear());        
    }

    onChangeCalculateType()
    {
        let changeType = this.state.calculo == 'S' ? 'D' : 'S';
        this.setState({calculo : changeType});
        this.clearState();
    }

    onCalculate(){
        let calculateType = this.state.calculo;                
        let {precioVenta} = this.props.exchangeRate.exchange_rate;
        let resultado = 0;
        switch(calculateType)
        {            
            case "D" :  
                let nuevosSoles = this.state.nuevosSoles;                
                resultado = nuevosSoles / precioVenta;
                this.setState({dolares : resultado});              
                break;
            default :
                let dolares = this.state.dolares;                
                resultado = dolares * precioVenta;
                this.setState({nuevosSoles : resultado});
        }
    }

    clearState(){
        this.setState({dolares : '', nuevosSoles : ''});         
    }

    render() {
        const {exchange_rate} = this.props.exchangeRate
        let fecha = format(this.state.date,'dd/MM/yyyy');        

        return (
            <CalculadoraTipoCambioContainer>
                <div className="currency">
                    <div className="title">
                        <h1><strong>Tipo Cambio</strong></h1> 
                    </div>
                    <div className="currency-exchange">
                        <p>Fecha : {fecha}</p>
                        <br/>
                        <p>S/ : {exchange_rate.precioVenta}</p>                                                
                    </div>
                    <div className="button-section">
                        <CalendarButton 
                         className="btnCalendar"
                         date={this.state.date}
                         onChangeDate={this.onChangeDate}
                        />
                    </div>
                </div>
                <div className="calculate-section">  
                    <div className="title">
                        <h1><strong>Calcular</strong></h1> 
                    </div>                  
                    <FormControl fullWidth variant="outlined" className="item-calc">
                    <InputLabel htmlFor="outlined-adornment-amount">Dólares</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"                            
                            // onChange={handleChange('amount')}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            labelWidth={60}
                            name="dolares"
                            placeholder="0.00"
                            onChange={this.onChange}
                            type="number"
                            value={this.state.dolares}
                            disabled={this.state.calculo == 'D' ? true : false}
                        />                        
                    </FormControl>
                    
                    <Fab 
                        color="primary" 
                        className="btnCenter"
                        onClick={this.onChangeCalculateType}
                        style={this.state.calculo == 'S' ? {transform: "scaleY(1)"} : {transform: "scaleY(-1)"}}
                    >
                        <ArrowDownwardIcon />
                    </Fab>
                    
                    <FormControl fullWidth variant="outlined" className="item-calc">
                        <InputLabel htmlFor="outlined-adornment-amount">Nuevos Soles</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"                                                        
                            name="nuevosSoles"
                            placeholder="0.00"
                            onChange={this.onChange}
                            startAdornment={<InputAdornment position="start">S/.</InputAdornment>}
                            labelWidth={60}
                            type="number"
                            value={this.state.nuevosSoles}
                            disabled={this.state.calculo == 'S' ? true : false}
                        />
                    </FormControl>
                </div>                      
                                       
                <div className="btnCalculate" onClick={this.onCalculate}>
                    <DragHandleIcon style={{fill: "white"}}/>
                </div>  
            </CalculadoraTipoCambioContainer>
        )
    }
}

CalculadoraTipoCambio.propTypes = {
    getCurrentExchangeRate : PropTypes.func.isRequired,
    getExchangeRateByDate : PropTypes.func.isRequired,    
    exchangeRate : PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    exchangeRate : state.exchangeRate
})

export default connect(mapStateToProps, {getCurrentExchangeRate,getExchangeRateByDate}) (CalculadoraTipoCambio);

const CalculadoraTipoCambioContainer = styled.div`
    width : 100%;
    height : 100%;
    background-color : var(--main-background);    
    padding-top: 5%;    
    display: flex;
    flex-direction: column;
    //padding-bottom: 10%;  
    .currency{
        box-sizing: border-box; 
        width : 90%;
        height : 350px;
        border-radius: 9px; 
        background-color : var(--secondary-background); 
        -webkit-box-shadow: 1px 20px 26px -1px rgba(0,0,0,0.51);
        -moz-box-shadow: 1px 20px 26px -1px rgba(0,0,0,0.51);
        box-shadow: 1px 20px 26px -1px rgba(0,0,0,0.51); 
        margin: 0 auto;    
    }

    .title{
        width : 100%;
        height : 40%;
        //background-color : pink;
        padding: 25px;
        box-sizing: border-box;        
    }
    .title h1{
        font-size: 2.5rem;
        color: #fff;
        border-bottom: 2px solid #fff;        
        padding-bottom: 10px;
        width: 80px;
    }

    .currency-exchange{
        width: 100%;
        height: 35%;
        padding: 25px;
        box-sizing: border-box;
        //background-color : red;   
    }
    .currency-exchange p{
        color: #fff;
        font-size: 1.2rem;
    }

    .button-section{
        box-sizing: border-box;
        width: 100%;
        height: 20%;
        //background-color : green;
        display: flex;    
        justify-content: flex-end;
        padding-right: 5%;   
    }

    .calculate-section{
        box-sizing: border-box; 
        width : 90%;
        height : auto;
        border-radius: 9px; 
        background-color : var(--secondary-background); 
        -webkit-box-shadow: 1px 20px 26px -1px rgba(0,0,0,0.51);
        -moz-box-shadow: 1px 20px 26px -1px rgba(0,0,0,0.51);
        box-shadow: 1px 20px 26px -1px rgba(0,0,0,0.51); 
        margin: 0 auto;
        margin-top: 10%;        
        display: flex;
        flex-direction: column;      
        padding-bottom: 15%;  
    }

    .item-calc{     
        align-self: center;
        margin-top: 2rem;
        width: 90%;
    }
    
    .btnCenter{
        margin-top: 1rem;
        align-self: center;
    }

    .btnCalculate{
        width: 100%;
        height: 70px;
        background-color: #f50057;
        display: flex;
        align-items: center;
        justify-content: center;   
        margin-top:10%;
    }
`;