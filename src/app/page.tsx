"use client"

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bar, Line, PolarArea } from 'react-chartjs-2';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Legend,
  Tooltip,
  BarElement,
  RadialLinearScale,
  ArcElement
} from 'chart.js';
import { MenuItem, Select } from '@mui/material';


ChartJS.register(
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Legend,
  Tooltip,
  BarElement,
  RadialLinearScale,
  ArcElement
)

const API_URL = 'https://servicodados.ibge.gov.br/api/v3/agregados';

const urls = [
  {
    name: 'expectativa de vida',
    url: `${API_URL}/7362/periodos/-6/variaveis/2503?localidades=N1[all]|N2[4]&classificacao=1933[all]`,
    urlSc: ''
  },
  {
    name: 'Área dos estabelecimentos agropecuários',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/264/periodos/-6/variaveis/184?localidades=N1[all]',
    urlSc: ''
  },
  {
    name: 'Leite',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/1086/periodos/199701|199702|199703|199704|199801|199802|199803|199804|199901|199902|199903|199904|200001|200002|200003|200004|200101|200102|200103|200104|200201|200202|200203|200204|200301|200302|200303|200304|200401|200402|200403|200404|200501|200502|200503|200504|200601|200602|200603|200604|200701|200702|200703|200704|200801|200802|200803|200804|200901|200902|200903|200904|201001|201002|201003|201004|201101|201102|201103|201104|201201|201202|201203|201204|201301|201302|201303|201304|201401|201402|201403|201404|201501|201502|201503|201504|201601|201602|201603|201604|201701|201702|201703|201704|201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301/variaveis/282?localidades=N1[all]',
    urlSc: '',
  },
  {
    name: 'Couro',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/1088/periodos/199901|199902|199903|199904|200001|200002|200003|200004|200101|200102|200103|200104|200201|200202|200203|200204|200301|200302|200303|200304|200401|200402|200403|200404|200501|200502|200503|200504|200601|200602|200603|200604|200701|200702|200703|200704|200801|200802|200803|200804|200901|200902|200903|200904|201001|201002|201003|201004|201101|201102|201103|201104|201201|201202|201203|201204|201301|201302|201303|201304|201401|201402|201403|201404|201501|201502|201503|201504|201601|201602|201603|201604|201701|201702|201703|201704|201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301/variaveis/622?localidades=N1[all]',
    urlSc: '',
  }
]

const Home = () => {
  const [data, setData] = useState([]);
  const [yData, setYdata] = useState([])
  const [count, setCount] = useState(0);
  const [title, setTitle] = useState('');
  const [unity, setUnity] = useState('');
  const [state, setState] = useState('BR');
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    try {
      let dataFormated;
      let ydatas;
      let url;

      if (state == 'BR') {
        url = urls[count].url
      } else if (state == 'SC') {
        url = urls[count].urlSc
      }

      setLoading(true)

      const response = await axios.get(url as string);
      setLoading(false)
      setTitle(response.data[0].variavel)
      setUnity(response.data[0].unidade)

      if (count === 0) {
        dataFormated = response.data[0].resultados.map((res: any, index: number) => res.series[1].serie['2018']);
        ydatas = response.data[0].resultados.map((res: any) => (res.classificacoes[0].categoria))

        const yDataFormated = []
        for (const d of ydatas) {
          for (const key in d) {
            yDataFormated.push(d[key])
          }
        }

        setData(dataFormated as any);
        setYdata(yDataFormated as any)
      } else {
        dataFormated = response.data[0].resultados.map((res: any, index: number) => res.series[0].serie);
        ydatas = []
        const yDataFormated = []
        for (const d of dataFormated) {
          for (const key in d) {
            yDataFormated.push(d[key])
            key.length >= 6 ? ydatas.push(key.slice(0, 4) + ' ' + key.slice(4, 6) + '° trimestre') : ydatas.push(key)
          }
        }

        setData(yDataFormated as any);
        setYdata(ydatas as any)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [count, state])

  useEffect(() => {
    getData();
  }, [getData, count]);


  const options = {
    plugins: {
      legend: true,
    }
  }

  const options2 = {
    plugins: {
      legend: false,
    }
  }

  const usedData = {
    labels: yData,
    datasets: [{
      label: title,
      data: data,
      backgroundColor: 'rgba(255, 99, 132, 01)',
      borderColor: 'rgba(255, 99, 132, 1)',
      pointBorderColor: 'rgba(255, 99, 132, 1)',
      tension: 0.1,
    }]
  }

  return (
    <div className='min-h-screen bg-slate-700 flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold'>Dashboard {title}</h1>
      <h2 className='text-xl font-bold mt-4'>Unidade: {unity}</h2>
      <div className='flex flex-col justify-center items-center w-max h-1/2 lg:flex-row'>
        {!loading ? (
          <div className='flex flex-col justify-center items-center lg:flex-row'>
            <div className='flex w-[500px] justify-center items-center flex-col'>
              <Line data={usedData} options={options as any} />
            </div>
            <div className='flex w-[500px] justify-center items-center flex-col'>
              <Bar data={usedData} options={options as any} />
            </div>
            <div className='flex w-96 justify-center items-center flex-col'>
              <PolarArea data={usedData} options={options2 as any} />
            </div>
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center h-96 lg:flex-row'>
            <CircularProgress color="inherit" />
          </div>
        )}
      </div>
      <div className='flex bg-slate-300 text-white rounded-lg'>
        <Select color='error' defaultValue={state}>
          <MenuItem value={'BR'} onClick={() => setState('BR')}>Brasil</MenuItem>
          <MenuItem value={'SC'} onClick={() => setState('SC')}>Santa Catarina</MenuItem>
        </Select>
      </div>
      <div className='flex bg-slate-300 text-white rounded-lg'>
        <Select color='error' defaultValue={count}>
          <MenuItem value={0} onClick={() => setCount(0)}>Expectativa de vida</MenuItem>
          <MenuItem value={1} onClick={() => setCount(1)}>Área dos estabelecimentos agropecuários</MenuItem>
          <MenuItem value={2} onClick={() => setCount(2)}>Leite</MenuItem>
          <MenuItem value={3} onClick={() => setCount(3)}>Couro</MenuItem>
        </Select>
      </div>
    </div>
  );
};

export default Home;