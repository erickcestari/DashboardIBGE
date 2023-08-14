"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Legend,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Legend,
  Tooltip,
)


const API_URL = 'https://servicodados.ibge.gov.br/api/v3';
const teste = 'https://servicodados.ibge.gov.br/api/v3/agregados/7362/periodos/-6/variaveis/2503?localidades=N1[all]|N2[4]&classificacao=1933[all]';

const Home = () => {
  const [data, setData] = useState([]);
  const [yData, setYdata] = useState([])

  const getData = async () => {
    try {
      const response = await axios.get(`${teste}`);
      const dataFormated = response.data[0].resultados.map((res: any) => res.series[1].serie['2018']);
      setData(dataFormated);
      console.log()
      const ydatas = response.data[0].resultados.map((res: any) => (res.classificacoes[0].categoria))
      const yDataFormated = []
      for (const d of ydatas) {
        for (const key in d) {
          console.log(key)
          console.log(d[key])
          yDataFormated.push(d[key])
        }
      }
      setYdata(yDataFormated as any)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);
  const chartData: any = []

  const options = {
    plugins: {
      legend: true,
    }
  }
  console.log(chartData)

  const usedData = {
    labels: yData,
    datasets: [{
      label: 'Expectativa de Vida',
      data: data,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      pointBorderColor: 'rgba(255, 99, 132, 1)',
      tension: 0.1,
    }]
  }

  return (
    <div className='h-screen bg-slate-700'>
      <h1>Dashboard de Expectativa de Vida</h1>
      <div className='flex justify-center'>
        <div className='w-[90%]'>
          <Line
            data={usedData}
            options={options as any}
          >
          </Line>
        </div>
      </div>
    </div>
  );
};

export default Home;