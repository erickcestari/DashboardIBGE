import axios from "axios";


export const getAllLocalities = async () => {
  try {
    const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    const states = response.data;

    const allLocalities: any = { "Brasil": "N1[1]" };

    for (const state of states) {
      allLocalities[state.nome] = `N3[${state.id}]`;
    }

    for (const state of states) {
      const municipalitiesResponse = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.sigla}/municipios`);
      const municipalities = municipalitiesResponse.data;

      for (const municipality of municipalities) {
        if (!allLocalities.hasOwnProperty(municipality.nome)) {
          allLocalities[municipality.nome] = `N6[${municipality.id}]`;
        }
      }
    }

    return allLocalities

  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
