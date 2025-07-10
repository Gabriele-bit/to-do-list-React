import { createContext, useEffect, useState } from "react";

export const ListaContext = createContext();
export const ListaProvider = ({ children }) => {
    const [lista, setLista] = useState(() => {
        const salvati = localStorage.getItem("Lista");
        return salvati ? JSON.parse(salvati) : [];
    });
    const [counter, setCounter] = useState(() => {
        const contatore = localStorage.getItem("counter");
        return contatore ? JSON.parse(contatore) : 0;
    });
    const [rimanenti, setRimanenti] = useState(() => {
        const rimangono = localStorage.getItem("rimanenti");
        return rimangono ? JSON.parse(rimangono) : lista.length;
    })
    const [optionOpenId, setOptionOpenId] = useState(false);
    const [tag, setTag] = useState([
        "Lavoro 💼",
        "Studio 📚",
        "Svago 🎮",
        "Spesa 🛒",
        "Incarichi 📝",
        "Allenamento 🏋️‍♂️",
        "Regali 🎁",
        "Evento 📅",
        "Chiamata 📞",
        "Email ✉️",
        "Medicine 💊",
        "Film 🎬",
        "Serie TV 📺",
        "Cucina 🍳",
        "Riunione 🤝",
        "Pagamenti 💳",
        "Altro 📌"
    ]);

    const [chooseTag, setChooseTag] = useState("Altro 📌");


    useEffect(() => {
        localStorage.setItem("Lista", JSON.stringify(lista));
        setTag(tag.sort());
    }, [lista]);

    useEffect(() => {
        localStorage.setItem("counter", counter);
    }, [counter]);

    const aggiungiElemento = (elemento) => {
        const newItem = {
            id: Date.now(),
            item: elemento,
            tag: chooseTag,
            expire: "",
            priorita: 3,
            scaduto: false
        }
        setLista([...lista, newItem]);
        setRimanenti(rimanenti + 1);
    }

    const eliminaItem = (key) => {
        setRimanenti(rimanenti - 1);
        setLista(lista.filter(item => item.id !== key));
    }

    const modificaItem = (key, newItem) => {
        const elemento = lista.map(ele =>
            ele.id === key ? { ...ele, item: newItem } : ele
        );
        console.log("modificato");
        setLista(elemento);
    }

    const completato = (key) => {
        setCounter(counter + 1)
        setRimanenti(rimanenti - 1);
        setLista(lista.filter(item => item.id !== key));
    }

    const cambiaTag = (id, tag) => {
        const elemento = lista.map(item => item.id === id ? { ...item, tag: tag } : item);
        setLista(elemento);
    }

    const chooseTagFunction = (tagString) => {
        setChooseTag(tagString)
    }

    const nuovaScadenza = (scad, id) => {
        const updatedLista = lista.map(item =>
            item.id === id ? { ...item, expire: scad } : item
        );
        setLista(updatedLista);
    }

    const setPriority = (id, newP) => {
        const orderedList=(lista.map(item => item.id === id ? { ...item, priorita: newP } : item));
        const sortedTasks = orderedList.sort((a, b) => a.priorita - b.priorita);
        setLista(sortedTasks);
    }

    const deleteAll = () => {
        localStorage.removeItem("Lista");
        setLista("");
    }

    const deleteExpired = () => {
        setLista(lista.filter(item => item.scaduto !== true))
    }

    return (<ListaContext.Provider value={{ deleteExpired, deleteAll, setPriority, nuovaScadenza, chooseTagFunction, cambiaTag, tag, optionOpenId, setOptionOpenId, rimanenti, counter, completato, modificaItem, lista, eliminaItem, aggiungiElemento }}>{children}</ListaContext.Provider>)
}