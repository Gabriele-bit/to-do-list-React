import { useContext, useState } from "react"
import "../style/App.css"
import { ListaContext } from "../Storage/ListaContext"
import "../style/tags.css"

export function Tags({ contest, itemId, container }) {
    const { tag, chooseTagFunction, cambiaTag } = useContext(ListaContext);
    const [selectedTag, setSelectedTag] = useState("");

    const handleChange = (value) => {
        setSelectedTag(value);
        if (contest === "App") {
            chooseTagFunction(value);
        } else if (contest === "Item") {
            cambiaTag(itemId, value);
        }
    };

    const handleClick = () => {
        container(false);
    }

    return (
        <div className='tags'>
            <div className="containerTags scrollable">
                {tag.length > 0 && tag.map((item, index) => (
                    <span key={index}>
                        <input
                            type='radio'
                            name={`choose_tag_${itemId || 'global'}`}
                            id={item}
                            value={item}
                            checked={selectedTag === item}
                            onChange={(e) => handleChange(e.target.value)}
                        />
                        <label htmlFor={item}>{item}</label>
                    </span>
                ))}
            </div>

            <hr></hr>
            <input type="button" value={"Ok"} onClick={handleClick}></input>
        </div>
    );
}
