import { useContext, useEffect, useState } from "react";
import { ListaContext } from "../Storage/ListaContext";
import "../style/Item.css";
import { Tags } from "./Tags";
import { Scadenza } from "./Scadenza";
import Swal from 'sweetalert2';


function Item(props) {
    const { eliminaItem, modificaItem, completato, optionOpenId, setOptionOpenId, lista, setPriority } = useContext(ListaContext);
    const [newItem, setNewItem] = useState(props.item);
    const [edit, setEdit] = useState(false);
    const [tagBool, setTagBool] = useState(false);
    const isOptionOpen = optionOpenId === props.id;
    const [scadenza, setScadenza] = useState(false);
    const expireDate = props.expire !== "" ? new Date(props.expire) : null;
    const today = new Date();
    const [expiredID, setExpiredID] = useState();
    const [almostExpireID, setAlmostExpiredID] = useState();
    const [prioritaBool, setPrioritaBool] = useState(false);
    const priorityMap = {
        1: "alta🚨",
        2: "media ⏳",
        3: "bassa 💤"
    };

    useEffect(() => {
        if (optionOpenId !== props.id) {
            setTagBool(false);
            setScadenza(false);
            setPrioritaBool(false);
            setEdit(false);
        }
    }, [optionOpenId]);

    const gestisciOpzioni = () => {
        if (isOptionOpen) {
            setOptionOpenId(null);
        } else {
            setOptionOpenId(props.id);
        }
    }

    //se manca da 1 giorno fino alla scadenza te lo notifica. Dopodichè segna come scaduto
    useEffect(() => {
        if (lista.length > 0) {
            lista.forEach((elemento) => {
                if (elemento.id === props.id) {
                    const dataScadenza = new Date(elemento.expire);
                    if (dataScadenza.getTime() <= today.getTime()) {
                        elemento.scaduto = true;
                        setExpiredID(elemento.id);
                    } else if (dataScadenza.getTime() - today.getTime() <= 1000 * 60 * 60 * 24) {
                        setAlmostExpiredID(elemento.id);
                    }
                }
            });
        }
    }, [])

    const handlePriority = (id, prio) => {
        setPriority(id, prio);
        setPrioritaBool(false);
    }



    return (
        <div className={props.id === almostExpireID ? "almostExpired ItemContainer" : props.id === optionOpenId ? "itemActive ItemContainer" : props.id === expiredID ? "expired ItemContainer" : "ItemContainer"}>
            <div className="itemHeader">
                <input type="button" className="elimina" value={"X"} onClick={() => {
                    Swal.fire({
                        title: 'Sei sicuro?',
                        text: "Eliminare la task?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sì, elimina!',
                        cancelButtonText: 'Annulla'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            eliminaItem(props.id);
                            Swal.fire('Eliminato!', 'Task rimosso.', 'success');
                        }
                    });
                }}></input>
                <div className="otherInfo">
                    {props.tag ? <span>{props.tag}</span> : <span>Altro</span>}
                    <span>Priorità {priorityMap[props.priority]}</span>
                </div>
            </div>


            <li className={"Item"}>
                <textarea readOnly={true} value={newItem}></textarea>
                {scadenza ?
                    (<Scadenza
                        container={setScadenza}
                        id={props.id}
                        closeOption={setOptionOpenId}></Scadenza>) : null}

                <div className="itemButton">
                    <input type="button" value={"✔"} onClick={() => completato(props.id)}></input>
                    <input type="button" value={"⋮"} onClick={gestisciOpzioni}></input>
                </div>
            </li >

            <div className="scadenza otherInfo">
                {expireDate !== null ? (
                    props.id === expiredID ? (
                        <span className="scaduto">Scaduto il  {expireDate.toLocaleDateString()} alle{" "}
                            {expireDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} </span>
                    ) : (
                        <span>
                            Scade il {expireDate.toLocaleDateString()} alle{" "}
                            {expireDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                    )
                ) : (
                    <span></span>
                )}
            </div>


            {isOptionOpen && (expiredID != props.id) ? (
                <div className="itemOption">
                    <input type="button" value={"Edit"} onClick={() => {
                        setEdit(!edit);
                        setOptionOpenId(props.id);
                        setTagBool(false);
                        setScadenza(false);
                        setPrioritaBool(false);
                    }}></input>
                    <input type="button" value={"Tag"} onClick={() => {
                        setEdit(false);
                        setTagBool(!tagBool);
                        setScadenza(false);
                        setPrioritaBool(false);
                    }}></input>
                    {tagBool ?
                        (<Tags contest={"Item"}
                            itemId={props.id}
                            container={setTagBool}
                            ></Tags>
                        ) : null}
                    <input type="button" value={"Imposta scadenza"} onClick={() => {
                        setScadenza(!scadenza)
                        setTagBool(false);
                        setEdit(false);
                        setPrioritaBool(false);
                    }}></input>
                    <input type="button" value={"Priorità"} onClick={() => {
                        setPrioritaBool(!prioritaBool);
                        setTagBool(false);
                        setEdit(false);
                        setScadenza(false);
                    }}></input>
                    {prioritaBool ?
                        (
                            <div className="priority">
                                <input type="button" value={"Alta 🚨"} onClick={() => handlePriority(props.id, 1)}></input>
                                <input type="button" value={"Media ⏳"} onClick={() => handlePriority(props.id, 2)}></input>
                                <input type="button" value={"Bassa 💤"} onClick={() => handlePriority(props.id, 3)}></input>
                            </div>
                        ) : null}
                </div>
            ) : null
            }


            { isOptionOpen && edit ? (
                <div className="areaEdit">
                    <div className="editStructure">
                        <h3>Modifica il tuo task!</h3>
                    <textarea onChange={(e) => setNewItem(e.target.value)}>{props.item}</textarea>
                    <input type="button" className="confirmEdit" value={"Ok"} onClick={() => {
                        console.log("testo modificato ", newItem);
                        setEdit(!edit);
                        // setOptionOpenId(null);
                        modificaItem(props.id, newItem);
                    }}></input>
                </div>
                </div>
            ) : null}

        </div >
    )
}

export default Item;