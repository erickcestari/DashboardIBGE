"use client"

import { getAllLocalities } from '@/utils/ibgeApi';
import ListboxComponent from '@/view/listBox';
import { Autocomplete, MenuItem, Select, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Tooltip
} from 'chart.js';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Bar, Line, PolarArea } from 'react-chartjs-2';


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
    name: 'Área dos estabelecimentos agropecuários',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/264/periodos/-6/variaveis/184?localidades',
  },
  {
    name: 'Leite',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/1086/periodos/199701|199702|199703|199704|199801|199802|199803|199804|199901|199902|199903|199904|200001|200002|200003|200004|200101|200102|200103|200104|200201|200202|200203|200204|200301|200302|200303|200304|200401|200402|200403|200404|200501|200502|200503|200504|200601|200602|200603|200604|200701|200702|200703|200704|200801|200802|200803|200804|200901|200902|200903|200904|201001|201002|201003|201004|201101|201102|201103|201104|201201|201202|201203|201204|201301|201302|201303|201304|201401|201402|201403|201404|201501|201502|201503|201504|201601|201602|201603|201604|201701|201702|201703|201704|201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301/variaveis/282?localidades',
  },
  {
    name: 'Couro',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/1088/periodos/199901|199902|199903|199904|200001|200002|200003|200004|200101|200102|200103|200104|200201|200202|200203|200204|200301|200302|200303|200304|200401|200402|200403|200404|200501|200502|200503|200504|200601|200602|200603|200604|200701|200702|200703|200704|200801|200802|200803|200804|200901|200902|200903|200904|201001|201002|201003|201004|201101|201102|201103|201104|201201|201202|201203|201204|201301|201302|201303|201304|201401|201402|201403|201404|201501|201502|201503|201504|201601|201602|201603|201604|201701|201702|201703|201704|201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301/variaveis/622?localidades',
  }
]

const Home = () => {
  const [data, setData] = useState([]);
  const [yData, setYdata] = useState([])
  const [count, setCount] = useState(0);
  const [title, setTitle] = useState('');
  const [unity, setUnity] = useState('');
  const [localites, setLocalites] = useState([]);
  const [localite, setLocalite] = useState('Brasil');
  const [loading, setLoading] = useState(false);

  const handleChangeLocalite = (event: SyntheticEvent<Element, Event>, newValue : string | null) => {
    setLocalite(newValue || '');
  }

  const getData = useCallback(async () => {
    try {
      let dataFormated;
      let ydatas;
      let url;

      setLoading(true)
      url = urls[count].url.replace('localidades', `localidades=${localites[localite as any] || ''}`)
      console.log(url)

      const response = await axios.get(url);
      
      dataFormated = response.data[0].resultados.map((res: any, index: number) => res.series[0].serie);
      ydatas = []
      const yDataFormated = []
      for (const d of dataFormated) {
        for (const key in d) {
          yDataFormated.push(d[key])
          key.length >= 6 ? ydatas.push(key.slice(0, 4) + ' ' + key.slice(4, 6) + '° trimestre') : ydatas.push(key)
        }
      }
      
      setLoading(false)
      setTitle(response.data[0].variavel)
      setUnity(response.data[0].unidade)
      setData(yDataFormated as any);
      setYdata(ydatas as any)
      console.log(ydatas, yDataFormated)

    } catch (error) {
      console.log(title)
      setTitle('')
      setLoading(false)
      console.error('Error fetching data:', error);
    }
  }, [count, localite, localites, title])

  useEffect(() => {
    const fetchData = async () => {
      const loc = await getAllLocalities()
      setLocalites(loc)
    }
    fetchData()
  }, [])

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
    <div className='min-h-screen bg-slate-700 flex flex-col align-middle justify-center'>
      <div className='flex justify-center gap-10 mb-4'>
        <div>
          <h2 className='text-lg font-bold'>Localidade: </h2>
          <div className='flex rounded-lg'>
            <Autocomplete
              ListboxComponent={ListboxComponent}
              disableListWrap
              sx={{ width: '15rem' }}
              value={localite}
              options={Object.keys(localites)}
              onChange={handleChangeLocalite}
              renderOption={(props, option, state) =>
                [props, option, state.index] as React.ReactNode
              }
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
        </div>
        <div>
          <h2 className='text-lg font-bold'>Variável: </h2>
          <div className='flex rounded-lg'>
            <Select color='info' defaultValue={count} sx={{ width: '15rem' }}>
              <MenuItem value={0} onClick={() => setCount(0)}>Área dos estabelecimentos agropecuários</MenuItem>
              <MenuItem value={1} onClick={() => setCount(1)}>Leite</MenuItem>
              <MenuItem value={2} onClick={() => setCount(2)}>Couro</MenuItem>
            </Select>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center flex-col'>
        <h1 className='text-xl text-center font-bold'>Dashboard {title}</h1>
        <h2 className='text-lg text-center font-bold mt-4'>Unidade: {unity}</h2>
        <div className='flex flex-col justify-center items-center w-max h-1/2 lg:flex-row'>
          {!loading ? (
            title !== '' ? (
              <div className='flex px-4 lg:px-14 w-screen flex-col justify-center items-center gap-12 lg:flex-row'>
                <div className='flex justify-center items-center flex-col w-full lg:w-[33%]'>
                  <Line data={usedData} options={options as any} />
                </div>
                <div className='flex justify-center items-center flex-col w-full lg:w-[33%]'>
                  <Bar data={usedData} options={options as any} />
                </div>
                <div className='flex justify-center items-center flex-col w-full lg:w-[33%]'>
                  <PolarArea data={usedData} options={options2 as any} />
                </div>
              </div>
            ) : (
              <>
                <div className='flex flex-col justify-center items-center h-[429px] lg:flex-row'>
                  <h1 className='text-2xl text-center font-bold'>Não há dados para serem exibidos para {localite}</h1>
                </div>
              </>
            )
          ) : (
            <div className='flex flex-col justify-center items-center h-96 lg:flex-row'>
              <CircularProgress color="inherit" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;