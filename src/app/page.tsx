"use client"

import { getAllLocalities } from '@/utils/ibgeApi';
import ListboxComponent from '@/view/listBox';
import { Autocomplete, Popper, TextField, useTheme } from '@mui/material';
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
import SearchWeb from 'mdi-material-ui/SearchWeb';
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
  },
  {
    name: 'Venda de veículos',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/3420/periodos/200001|200002|200003|200004|200005|200006|200007|200008|200009|200010|200011|200012|200101|200102|200103|200104|200105|200106|200107|200108|200109|200110|200111|200112|200201|200202|200203|200204|200205|200206|200207|200208|200209|200210|200211|200212|200301|200302|200303|200304|200305|200306|200307|200308|200309|200310|200311|200312|200401|200402|200403|200404|200405|200406|200407|200408|200409|200410|200411|200412|200501|200502|200503|200504|200505|200506|200507|200508|200509|200510|200511|200512|200601|200602|200603|200604|200605|200606|200607|200608|200609|200610|200611|200612|200701|200702|200703|200704|200705|200706|200707|200708|200709|200710|200711|200712|200801|200802|200803|200804|200805|200806|200807|200808|200809|200810|200811|200812|200901|200902|200903|200904|200905|200906|200907|200908|200909|200910|200911|200912|201001|201002|201003|201004|201005|201006|201007|201008|201009|201010|201011|201012|201101|201102|201103|201104|201105|201106|201107|201108|201109|201110|201111|201112|201201|201202|201203|201204|201205|201206|201207|201208|201209|201210|201211|201212|201301|201302|201303|201304|201305|201306|201307|201308|201309|201310|201311|201312|201401|201402|201403|201404|201405|201406|201407|201408|201409|201410|201411|201412|201501|201502|201503|201504|201505|201506|201507|201508|201509|201510|201511|201512|201601|201602|201603|201604|201605|201606|201607|201608|201609|201610|201611|201612|201701|201702|201703|201704|201705|201706|201707|201708|201709|201710|201711|201712|201801|201802|201803|201804|201805|201806|201807|201808|201809|201810|201811|201812|201901|201902|201903|201904|201905|201906|201907|201908|201909|201910|201911|201912|202001|202002|202003|202004|202005|202006|202007|202008|202009|202010|202011|202012|202101|202102|202103|202104|202105|202106|202107|202108|202109|202110|202111|202112|202201/variaveis/568?localidades&classificacao=11046[40311]'
  },
  {
    name: 'Preço Máximo ao Consumidor - Materiais de construção',
    url: 'https://servicodados.ibge.gov.br/api/v3/agregados/8184/periodos/200301|200302|200303|200304|200305|200306|200307|200308|200309|200310|200311|200312|200401|200402|200403|200404|200405|200406|200407|200408|200409|200410|200411|200412|200501|200502|200503|200504|200505|200506|200507|200508|200509|200510|200511|200512|200601|200602|200603|200604|200605|200606|200607|200608|200609|200610|200611|200612|200701|200702|200703|200704|200705|200706|200707|200708|200709|200710|200711|200712|200801|200802|200803|200804|200805|200806|200807|200808|200809|200810|200811|200812|200901|200902|200903|200904|200905|200906|200907|200908|200909|200910|200911|200912|201001|201002|201003|201004|201005|201006|201007|201008|201009|201010|201011|201012|201101|201102|201103|201104|201105|201106|201107|201108|201109|201110|201111|201112|201201|201202|201203|201204|201205|201206|201207|201208|201209|201210|201211|201212|201301|201302|201303|201304|201305|201306|201307|201308|201309|201310|201311|201312|201401|201402|201403|201404|201405|201406|201407|201408|201409|201410|201411|201412|201501|201502|201503|201504|201505|201506|201507|201508|201509|201510|201511|201512|201601|201602|201603|201604|201605|201606|201607|201608|201609|201610|201611|201612|201701|201702|201703|201704|201705|201706|201707|201708|201709|201710|201711|201712|201801|201802|201803|201804|201805|201806|201807|201808|201809|201810|201811|201812|201901|201902|201903|201904|201905|201906|201907|201908|201909|201910|201911|201912|202001|202002|202003|202004|202005|202006|202007|202008|202009|202010|202011|202012|202101|202102|202103|202104|202105|202106|202107|202108|202109|202110|202111|202112|202201|202202|202203|202204|202205|202206|202207|202208|202209|202210|202211|202212/variaveis/11706?localidades&classificacao=11046[56731]'
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

  const theme = useTheme()

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
      let months = false;
      const allMonths = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho','Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
      for (const d of dataFormated) {
        for (const key in d) {
          if (key.length === 6 && key.slice(4, 6).includes('12')) {
            months = true
          }
        }
      }
      for (const d of dataFormated) {
        for (const key in d) {
          yDataFormated.push(d[key])
          console.log(allMonths[Number(key.slice(4,6))], key.slice(4,6))
          key.length >= 6 ? months? ydatas.push(key.slice(0, 4) + ' ' + allMonths[Number(key.slice(4,6)) - 1]) : ydatas.push(key.slice(0, 4) + ' ' + key.slice(4, 6) + '° trimestre') : ydatas.push(key)
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
      legend: {
        display: true,
        labels: {
          color: '#fff'
        }
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'white'
        }
      },
      x: {
        ticks: {
          color: 'white'
        }
      }
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
      ticks: {
        color: "white",
      },
    }]
  }

  return (
    <div className='min-h-screen w-screen bg-slate-700 flex flex-col'>
      <div className='flex justify-center mt-10 gap-10 mb-4'>
        <div className='flex flex-col'>
          <h1>Dados IBGE</h1>
          <div className='flex flex-col lg:flex-row gap-5'>
            <div>
              <h2 className='text-lg font-bold'>Localidade: </h2>
              <div className='flex rounded-lg'>
                <Autocomplete
                  PopperComponent={(props) => (
                    <Popper
                      {...props}
                      sx={{
                        '& .MuiAutocomplete-listbox::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '& .MuiAutocomplete-listbox::-webkit-scrollbar-thumb': {
                          backgroundColor: theme.palette.primary.light,
                          borderRadius: '4px',
                        },
                        '& .MuiAutocomplete-listbox::-webkit-scrollbar-track': {
                          backgroundColor: 'rgba(60, 60, 80)',
                        },
                      }}
                    />)}
                  ListboxComponent={ListboxComponent}
                  disableListWrap
                  disableClearable
                  sx={{ width: 300 }}
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
                  PopperComponent={(props) => (
                    <Popper
                      {...props}
                      sx={{
                        '& .MuiAutocomplete-listbox::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '& .MuiAutocomplete-listbox::-webkit-scrollbar-thumb': {
                          backgroundColor: theme.palette.primary.light,
                          borderRadius: '4px',
                        },
                        '& .MuiAutocomplete-listbox::-webkit-scrollbar-track': {
                          backgroundColor: 'rgba(60, 60, 80)',
                        },
                      }}
                    />)}
                  disableListWrap
                  sx={{ width: 300 }}
                  value={variavel}
                  loading={localites.length <= 1}
                  options={urls.map((url) => url.name)}
                  onChange={handleChangeVariavel}
                  renderGroup={(params) => params.children}
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