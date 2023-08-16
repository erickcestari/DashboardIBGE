"use client"

import { getAllLocalities } from '@/utils/ibgeApi';
import ListboxComponent from '@/view/listBox';
import { Autocomplete, TextField } from '@mui/material';
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
import { SearchWeb } from 'mdi-material-ui';
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
  },
  {
    name: 'Ovos de galinha',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/915/periodos/201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301/variaveis/29?localidades'
  },
  {
    name: 'Numero médio de moradores',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/6578/periodos/2016|2017|2018|2019|2022/variaveis/10163?localidades'
  },
  {
    name: 'Número de animais abatidos',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/1092/periodos/199701|199702|199703|199704|199801|199802|199803|199804|199901|199902|199903|199904|200001|200002|200003|200004|200101|200102|200103|200104|200201|200202|200203|200204|200301|200302|200303|200304|200401|200402|200403|200404|200501|200502|200503|200504|200601|200602|200603|200604|200701|200702|200703|200704|200801|200802|200803|200804|200901|200902|200903|200904|201001|201002|201003|201004|201101|201102|201103|201104|201201|201202|201203|201204|201301|201302|201303|201304|201401|201402|201403|201404|201501|201502|201503|201504|201601|201602|201603|201604|201701|201702|201703|201704|201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301/variaveis/284?localidades'
  },
  {
    name: 'PIB',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/2072/periodos/200001|200002|200003|200004|200101|200102|200103|200104|200201|200202|200203|200204|200301|200302|200303|200304|200401|200402|200403|200404|200501|200502|200503|200504|200601|200602|200603|200604|200701|200702|200703|200704|200801|200802|200803|200804|200901|200902|200903|200904|201001|201002|201003|201004|201101|201102|201103|201104|201201|201202|201203|201204|201301|201302|201303|201304|201401|201402|201403|201404|201501|201502|201503|201504|201601|201602|201603|201604|201701|201702|201703|201704|201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301/variaveis/933?localidades'
  },
  {
    name: 'Taxa de investimento',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/6727/periodos/199601|199602|199603|199604|199701|199702|199703|199704|199801|199802|199803|199804|199901|199902|199903|199904|200001|200002|200003|200004|200101|200102|200103|200104|200201|200202|200203|200204|200301|200302|200303|200304|200401|200402|200403|200404|200501|200502|200503|200504|200601|200602|200603|200604|200701|200702|200703|200704|200801|200802|200803|200804|200901|200902|200903|200904|201001|201002|201003|201004|201101|201102|201103|201104|201201|201202|201203|201204|201301|201302|201303|201304|201401|201402|201403|201404|201501|201502|201503|201504|201601|201602|201603|201604|201701|201702|201703|201704|201801|201802|201803|201804|201901|201902|201903|201904|202001|202002|202003|202004|202101|202102|202103|202104|202201|202202|202203|202204|202301/variaveis/2517?localidades'
  },
  {
    name: 'Índice de gini',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/155/periodos/1991|2000/variaveis/95?localidades'
  }
]

const Home = () => {
  const [data, setData] = useState([]);
  const [yData, setYdata] = useState([])
  const [title, setTitle] = useState('');
  const [unity, setUnity] = useState('');
  const [localites, setLocalites] = useState([]);
  const [localite, setLocalite] = useState('Brasil');
  const [loading, setLoading] = useState(false);
  const [variavel, setVariavel] = useState('Leite');

  const handleChangeLocalite = (event: SyntheticEvent<Element, Event>, newValue: string | null) => {
    setLocalite(newValue || '');
  }

  const handleChangeVariavel = (event: SyntheticEvent<Element, Event>, newValue: string | null) => {
    setVariavel(newValue || '');
  }

  const getData = useCallback(async () => {
    try {
      let dataFormated;
      let ydatas;
      let url;

      setLoading(true)
      const count = urls.findIndex((url) => url.name === variavel)
      url = urls[count].url.replace('localidades', `localidades=${localites[localite as any] || 'N1[all]'}`)

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

    } catch (error) {
      setLoading(false)
      setTitle('')
      setUnity('')
      console.error('Error fetching data:', error);
    }
  }, [localite, localites, variavel])

  useEffect(() => {
    const fetchData = async () => {
      const loc = await getAllLocalities()

      setLocalites(loc as any)
    }
    fetchData()
  }, [])

  useEffect(() => {
    getData();
  }, [getData, localites]);


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
    <div className='min-h-screen w-screen bg-slate-700 flex flex-col'>
      <div className='flex justify-center mt-10 gap-10 mb-4'>
        <div className='flex flex-col'>
          <h1>Dados IBGE</h1>
          <div className='flex flex-col lg:flex-row'>
            <div>
              <h2 className='text-lg font-bold'>Localidade: </h2>
              <div className='flex rounded-lg'>
                <Autocomplete
                  ListboxComponent={ListboxComponent}
                  disableListWrap
                  sx={{ width: 300}}
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
                <Autocomplete
                  ListboxComponent={ListboxComponent}
                  disableListWrap
                  sx={{ width:300 }}
                  value={variavel}
                  loading={Object.keys(localites).length === 0}
                  options={urls.map((url) => url.name).sort((a, b) => a.localeCompare(b))}
                  onChange={handleChangeVariavel}
                  renderGroup={(params) => params.children}
                  renderOption={(props, option, state) =>
                    [props, option, state.index] as React.ReactNode
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center flex-col text-slate-300'>
        <h1 className='text-2xl text-center font-bold text-slate-300'>Dashboard {title}</h1>
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
                <div className='flex justify-center items-center flex-col w-full lg:w-[30%]'>
                  <PolarArea data={usedData} options={options2 as any} />
                </div>
              </div>
            ) : (
              <>
                <div className='flex flex-col justify-center items-center h-[500px] lg:flex-row gap-2'>
                  <h1 className='text-2xl text-center font-bold'>Não há dados {variavel} para serem exibidos em {localite}</h1>
                  <SearchWeb />
                </div>
              </>
            )
          ) : (
            <div className='flex flex-col justify-center items-center h-[500px] lg:flex-row'>
              <CircularProgress color="inherit" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;