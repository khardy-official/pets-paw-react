import './Breeds.scss';
import SearchPanel from '../../Components/SearchPanel/SearchPanel';
import axios from '../../axios';

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const limits = [{ name: 'Limit: 5', search: 'limit=5' }, { name: 'Limit: 10', search: 'limit=10' }, { name: 'Limit: 15', search: 'limit=15' }, { name: 'Limit: 20', search: 'limit=20' }];

const Breeds = ({ fetchBreeds }) => {
    const navigate = useNavigate();

    const [allBreeds, setAllBreeds] = useState([]);
    const [open, setOpen] = useState(false);
    const [openLimit, setOpenLimit] = useState(false);
    const [selected, setSelected] = useState('All breeds');
    const [selectedLimit, setSelectedLimit] = useState({ name: 'Limit: 5', search: 'limit=5' });
    const [order, setOrder] = useState('order=ASC');

    const greedRowCount = selectedLimit.name.replace(/\D/g, '') * 0.6;

    useEffect(() => {
        const fetchData = async () => {
            let { data } = await axios.get(`${fetchBreeds}&${selectedLimit.search}&${order}`);
            if (order === 'order=DESC') data = data.reverse();
            setAllBreeds(data);
            return data;
        }
        fetchData();
    }, [selectedLimit, order, fetchBreeds])

    const selectAndNavigate = (name, id) => {
        setSelected(name);
        setOpen(false);
        navigate(id);
    }

    const selectLimit = (name) => {
        setSelectedLimit(name);
        setOpenLimit(false);
    }

    return (
        <div className="Breeds">
            <SearchPanel />
            <div className='Breeds__choice'>
                <div className='Breeds__settings'>
                    <Link to="/"></Link>
                    <div className='Breeds__settings-lable'>breeds</div>
                    <button name="breeds" className='Breeds__settings-select' onClick={() => setOpen(!open)}>
                        <span>{selected}</span>
                        <img src="./images/breeds/arrow-down.svg" alt="arrow" />
                    </button>
                    {
                        open && (
                            <div id="popup-breeds">
                                <ul>
                                    {allBreeds.map((item) =>
                                        <li onClick={() => selectAndNavigate(item.name, item.id)} key={item.name}>
                                            {item.name}
                                        </li>)}
                                </ul>
                            </div>
                        )
                    }
                    <button className='Breeds__settings-select select-limit' onClick={() => setOpenLimit(!openLimit)}>
                        <span>{selectedLimit.name}</span>
                        <img src="./images/breeds/arrow-down.svg" alt="arrow" />
                    </button>
                    {openLimit && (
                        <div id="popup-limits">
                            <ul>
                                {limits.map((item) => <li onClick={() => selectLimit(item)} key={item.name}>{item.name}</li>)}
                            </ul>
                        </div>
                    )}
                    <button className="Breeds__settings-sort" onClick={() => setOrder('order=DESC')}>
                        <img src="./images/breeds/z-a.svg" alt="z-a" />
                    </button>
                    <button className="Breeds__settings-sort" onClick={() => setOrder('order=ASC')}>
                        <img src="./images/breeds/a-z.svg" alt="a-z" />
                    </button>
                </div>
                <div className="Breeds__grid" style={{ gridTemplateRows: `repeat(${greedRowCount}, 140px )` }}>
                    {allBreeds.map((item, index) =>
                        <div
                            key={item.reference_image_id}
                            style={{ background: `url(${item.image.url}) 0% 0% / cover` }}
                            className={`item grid-${index + 1}`}>
                            <div className='grid-hover'>
                                <div>{item.name}</div>
                            </div>
                        </div>)}
                </div>
            </div>
        </div >
    );
}

export default Breeds;