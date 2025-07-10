import { useContext, useEffect, useState } from "react";
import "../style/Scadenza.css";
import { ListaContext } from "../Storage/ListaContext";

export function Scadenza({ container, id }) {
    const { nuovaScadenza } = useContext(ListaContext);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
        "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
        "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ];

    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [day, setDay] = useState(today.getDate());
    const years = [today.getFullYear(), today.getFullYear() + 1, today.getFullYear() + 2];
    const [hour, setHour] = useState(today.getHours().toString().padStart(2, "0"));
    const [minutes, setMinutes] = useState(today.getMinutes().toString().padStart(2, "0"));
    const [data, setData] = useState(today);

    const [disable, setDisable] = useState(false);

    useEffect(() => {
        const selectedDate = new Date(year, month, day, parseInt(hour), parseInt(minutes));
        if (today >= selectedDate) {
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, [year, month, day, hour, minutes, today]);


    const handleClick = () => {
        container(false);
    };

    const handleYear = (e) => {
        setYear(Number(e.target.value));
    };

    const handleMonth = (e) => {
        const index = months.indexOf(e.target.value);
        setMonth(index);
    };

    const handleDay = (e) => {
        setDay(Number(e.target.value));
    };

    const handleUPH = () => {
        let newHour = (parseInt(hour) + 1) % 24;
        setHour(newHour.toString().padStart(2, "0"));
    };

    const handleUPM = () => {
        let newMinutes = (parseInt(minutes) + 1) % 60;
        setMinutes(newMinutes.toString().padStart(2, "0"));
    };

    const handleDWNH = () => {
        let newHour = parseInt(hour) - 1;
        if (newHour < 0) setHour("23");
        else setHour(newHour.toString().padStart(2, "0"));
    }

    const handleDWNM = () => {
        let newMinutes = parseInt(minutes) - 1;
        if (newMinutes < 0) setMinutes("59");
        else setMinutes(newMinutes.toString().padStart(2, "0"));
    }

    const handleClick2 = () => {
        const newData = new Date(year,month,day,hour,minutes);
        setData(newData);
        nuovaScadenza(newData, id);
        container(false);
    };

    return (
        <div className="panel">
            <div className="struttura">
            <input className="x" type="button" value="x" onClick={handleClick} />
                <div className="scadenza">
                    <div className="data">
                        <div className="year">
                            <select onChange={handleYear} value={year}>
                                {years.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="month">
                            <select onChange={handleMonth} value={months[month]}>
                                {months.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="day">
                            <select onChange={handleDay} value={day}>
                                {days.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="structureOrario">
                        <div className="strutturaOre">
                            <input type="button" className="pulsantiOrario" value="▲" onClick={handleUPH} />
                            <span className="stileOrario">{hour}</span>
                            <input type="button" className="pulsantiOrario" value="▼" onClick={handleDWNH} />
                        </div>
                        <div className="duePunti"><span className="stileOrario">:</span></div>
                        <div className="strutturaMinuti">
                            <input type="button" className="pulsantiOrario" value="▲" onClick={handleUPM} />
                            <span className="stileOrario">{minutes}</span>
                            <input type="button" className="pulsantiOrario" value="▼" onClick={handleDWNM} />
                        </div>
                    </div>
                </div>
                <hr />
                <input type="button" className="confirmExpire" value="Conferma" disabled={disable} onClick={handleClick2} />
            </div>
        </div>

    );
}
