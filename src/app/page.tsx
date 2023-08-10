"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';

const API_URL = 'https://servicodados.ibge.gov.br/api/v3';
const teste = 'https://servicodados.ibge.gov.br/api/v3/agregados/7362/periodos/-6/variaveis/2503?localidades=N1[all]|N2[4]&classificacao=1933[all]';

const Home = () => {
  const [data, setData] = useState([]);
  const [yData, setYdata] = useState([])

  const getData = async () => {
    try {
      const response = await axios.get(`${teste}`);
      const dataFormated = response.data[0].resultados.map(res => res.series[1].serie['2018']);
      setData(dataFormated);
      console.log()
      const ydatas = response.data[0].resultados.map(res => (res.classificacoes[0].categoria))
      const yDataFormated = []
      for (const d of ydatas) {
        for (const key in d) {
          console.log(key)
          console.log(d[key])
          yDataFormated.push(d[key])
        }
      }
      setYdata(yDataFormated)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);
  const chartData: any = []

  yData.map((y, index) => chartData.push({ y: data[index], x: y }))

  console.log(chartData)

  return (
    <div>
    <h1>Dashboard de Expectativa de Vida</h1>
    <div style={{ maxWidth: '80%', margin: '0 auto' }}>
      <ResponsiveContainer >
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" height={40} label={{ value: 'Anos', position: 'insideBottom', offset: 5 }} />
          <YAxis tickFormatter={value => value.toLocaleString()} label={{ value: 'População', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line dataKey="y" stroke="#FF5722" strokeWidth={1} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer >
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={value => value.toLocaleString()} />
          <YAxis dataKey="x" type="category" />
          <Tooltip />
          <Bar dataKey="y" fill="#FF5722" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
  );
};

export default Home;