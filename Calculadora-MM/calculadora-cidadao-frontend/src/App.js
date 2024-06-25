import React, { useState } from 'react';
import supabase from './supabaseClient';
import './App.css';

function App() {
  const [resultados, setResultados] = useState([]);
  const [valorInicial, setValorInicial] = useState(0);
  const [dataInicio, setDataInicio] = useState('');
  const [dataTermino, setDataTermino] = useState('');
  const [indice, setIndice] = useState('');
  const [incluirFerias, setIncluirFerias] = useState(false);
  const [error, setError] = useState(null);
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  const fetchIndexData = async (indice) => {
    const { data, error } = await supabase
      .from(indice)
      .select("ano, mes, valor");

    if (error) {
      console.error(`Erro ao buscar dados do índice ${indice}:`, error);
      setError(`Erro ao buscar os dados do índice ${indice}.`);
      return {};
    }

    const formattedData = {};
    data.forEach(item => {
      formattedData[item.ano] = formattedData[item.ano] || {};
      formattedData[item.ano][item.mes] = item.valor;
    });
    return formattedData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Input validation
      if (!dataInicio || !dataTermino || !indice) {
        setError("Por favor, preencha todos os campos.");
        return;
      }
      
      if (new Date(dataInicio) >= new Date(dataTermino)) {
        setError("A data de início deve ser anterior à data de término.");
        return;
      }

      const indexData = await fetchIndexData(indice);
      let saldo = parseFloat(valorInicial);
      let dataAtual = new Date(dataInicio);
      const dataFim = new Date(dataTermino);
      const resultadosTemp = [];
      let contFerias = 0;

      while (dataAtual <= dataFim) {
        const ano = dataAtual.getFullYear();
        const mes = meses[dataAtual.getMonth()]; 
        const acrescimoPercentual = indexData[ano]?.[mes] || 0; 
        

        const acrescimo = saldo * (acrescimoPercentual / 100);
        saldo += acrescimo;
        const ferias = incluirFerias && contFerias > 12  ? saldo / 3 : 0;
        saldo += ferias;
        contFerias += 1;
        if (contFerias > 13) {
          contFerias = 0;
        }

        resultadosTemp.push({
          mes: `${mes}/${ano}`,
          saldoInicial: parseFloat(saldo.toFixed(2)),
          acrescimoPercentual,
          acrescimoValor: parseFloat(acrescimo.toFixed(2)),
          saldoFinal: parseFloat((saldo).toFixed(2)),
          ferias: parseFloat(ferias.toFixed(2)),
        });

        dataAtual.setMonth(dataAtual.getMonth() + 1);
      }
      setResultados(resultadosTemp);
    } catch (error) {
      console.error("Erro ao calcular valores:", error);
      setError("Ocorreu um erro ao calcular os valores.");
    }
  };

  return (
    <div className="App">
      <h1>Calculadora do Cidadão</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Valor Inicial (R$):
          <input type="number" name="valorInicial" value={valorInicial} onChange={(e) => setValorInicial(parseFloat(e.target.value))} required />
        </label>
        <label>
          Data de Início:
          <input type="date" name="dataInicio" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
        </label>
        <label>
          Data de Término:
          <input type="date" name="dataTermino" value={dataTermino} onChange={(e) => setDataTermino(e.target.value)} required />
        </label>
        <label>
          Índice:
          <select name="indice" value={indice} onChange={(e) => setIndice(e.target.value)}>
            <option value="">Selecione</option>
            <option value="ipca">IPCA</option> 
            <option value="poupanca">Poupança</option> 
          </select>
        </label>
        <label>
          Incluir Férias:
          <select name="incluirFerias" value={incluirFerias ? "Sim" : "Não"} onChange={(e) => setIncluirFerias(e.target.value === "Sim")}>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
        </label>
        <button type="submit">Calcular</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <h2>Resultados</h2>
      {resultados.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Mês/Ano</th>
              <th>Saldo Inicial</th>
              <th>Acréscimo (%)</th>
              <th>Acréscimo (R$)</th>
              <th>Saldo Final</th>
              <th>Férias (R$)</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((resultado, index) => (
              <tr key={index}>
                <td>{resultado.mes}</td>
                <td>{resultado.saldoInicial}</td>
                <td>{resultado.acrescimoPercentual}</td>
                <td>{resultado.acrescimoValor}</td>
                <td>{resultado.saldoFinal}</td>
                <td>{resultado.ferias}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
