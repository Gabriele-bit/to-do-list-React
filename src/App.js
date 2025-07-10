
import './style/App.css';
import { useContext, useState, useEffect } from 'react';
import { ListaContext } from './Storage/ListaContext';
import Item from './Components/Item';
import { FaFilter } from "react-icons/fa";
import { BiTrash } from 'react-icons/bi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';


/*metti la possibilità di
DENTRO LE OPZIONI
  Assegnare priorità (alta, media, bassa → colore o icona).
  assegna Scadenza (deadline) con input type="date" + evidenziamento se passata.

Filtraggio: mostra Tutti, Completati, Da fare.
Notifiche o reminder (se la data è vicina → alert).
*/

function App() {
  const { lista, aggiungiElemento, counter, rimanenti, tag, deleteAll, deleteExpired } = useContext(ListaContext);
  const [item, setItem] = useState("");
  const [added, setAdded] = useState(false);
  const [filtriBool, setFiltriBool] = useState(false);

  const [filtroTag, setFiltroTag] = useState("");
  const [filtroPriorità, setFiltroPriorita] = useState("");
  const [filtroData, setFiltroData] = useState("");

  let listFiltered = lista;

  if (filtroTag) {
    listFiltered = listFiltered.filter((el) => el.tag === filtroTag);
  }

  if (filtroPriorità) {
    listFiltered = listFiltered.filter((el) => el.priorita === parseInt(filtroPriorità));
  }

  if (filtroData) {
    listFiltered = listFiltered.filter((el) =>
      new Date(el.expire).toLocaleDateString() === new Date(filtroData).toLocaleDateString()
    );
  }

  const [check, setCheck] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAdded(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [added == true]);

  const prendiInput = (item) => {
    setItem(item);
  }
  const eliminaInput = () => {
    setItem("");
  }
  const gestisciInvio = (item) => {
    if (item.trim() === "") return;
    notify();
    setAdded(true);
    aggiungiElemento(item);
    setItem("");
  }
  const clearFilter = () => {
    setFiltroPriorita("");
    setFiltroTag("");
    setFiltroData("");
    setCheck(false);
  }

  const notify = () => toast("Task aggiunta con successo!");

  const svuotaLista = () => {
    Swal.fire({
      title: 'Sei sicuro?',
      text: "Questa azione svuoterà la tua lista!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sì, svuota!',
      cancelButtonText: 'Annulla'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAll();
        Swal.fire('Svuotata!', 'La lista è stata svuotata.', 'success');
      }
    });
  }

  const eliminaScaduti = () => {
    deleteExpired();
  }

  return (
    <div className="App">
      {/*menu*/}
      <div className="header">
        <div className='motivazionali'>
          <div className='motivazionale1'>
            <span>Un passo alla volta.</span>
          </div>
          <div className='motivazionale2'>
            <span>Let's do this!</span>
          </div>
          <div className='motivazionale3'>
            <span>Oggi si spunta tutto!</span>
          </div>
          <div className='motivazionale4'>
            <span>Fatto è meglio di perfetto.</span>
          </div>

        </div>
        <h1>Just To-Do It!</h1>
      </div>
      {/* <h3>{counter} Completati</h3>
      <h3>{rimanenti} Rimanenti</h3> */}


      <div className='inputBarBox'>
        <input type='text' className="inputBar" value={item} placeholder='Ricordami di....' onChange={(e) => prendiInput(e.target.value)}></input>
        <ToastContainer position='bottom-center' />
        <div className='inputButtons'>
          <input type='submit' value={"Aggiungi"} onClick={() => gestisciInvio(item)}></input>
          <input type='submit' value={"Elimina"} onClick={() => eliminaInput()}></input>
        </div>
      </div>

      <ul className='lista scrollable'>

        <div className="filterSection">
          <div className='filtersButton'>
            <span title='Elimina tutto' className="filterButton" onClick={svuotaLista}><BiTrash></BiTrash></span>

            <span title='Elimina scaduti' className='deleteExpired filterButton' onClick={eliminaScaduti}>X</span>

            <span title='Filtra' className='filterButton' onClick={() => {
              setFiltriBool(!filtriBool);
            }}><FaFilter /></span>
          </div>

          {filtriBool &&
            <div className='filters'>
              <div className='filtriTipologia'>
                <select value={filtroTag} onChange={(e) => {
                  setFiltroTag(e.target.value);
                }}>
                  <option value={""}>Tipologia</option>
                  {tag.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className='filtroPriorità'>
                <select value={filtroPriorità} onChange={(e) => {
                  setFiltroPriorita(e.target.value);
                }}>

                  <option value={""}>Priorità</option>
                  <option value={1}>Alta 🚨</option>
                  <option value={2}>Media ⏳</option>
                  <option value={3}>Bassa 💤</option>
                </select>
              </div>

              <div className='filtroScadenza'>
                <span>Scade oggi?</span><input type='checkbox' checked={check} value={""} onChange={(e) => {
                  setCheck(!check);
                  if (e.target.checked) {
                    setFiltroData(new Date().toLocaleDateString());
                  } else setFiltroData("");

                }}></input>
              </div>
                <div className="filterClean" title='Pulisci filtri' onClick={clearFilter}><BiTrash></BiTrash></div>
            </div>
          }
          
        </div>


        {
          listFiltered.length > 0 ? (
            listFiltered.map((elemento, index) => (
              <Item
                key={elemento.id}
                id={elemento.id}
                item={elemento.item}
                tag={elemento.tag}
                expire={elemento.expire}
                priority={elemento.priorita}>
              </Item>
            ))
          ) : (
            <p>Aggiungi nuovi task!</p>
          )
        }
      </ul >
    </div >
  );
}

export default App;
